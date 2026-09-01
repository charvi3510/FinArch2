from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.database import User, FinancialProfile, Goal
from app.schemas.financial import FinancialProfileSchema, GoalBase

DEFAULT_DEMO_PROFILE = {
    # Income
    "salary_income": 110000.0,
    "other_income": 10000.0,
    # Expenses
    "rent_expense": 25000.0,
    "food_expense": 15000.0,
    "transport_expense": 6000.0,
    "utilities_expense": 5000.0,
    "subscriptions_expense": 3000.0,
    "other_expenses": 11000.0,
    # Assets
    "cash_balance": 35000.0,
    "bank_savings": 115000.0,
    "emergency_fund": 150000.0,
    "fixed_deposits": 50000.0,
    "gold_assets": 70000.0,
    "mutual_funds": 180000.0,
    "stocks_equity": 350000.0,
    "other_assets": 0.0,
    # Liabilities
    "credit_card_debt": 40000.0,
    "credit_card_rate": 38.0,
    "personal_loan": 180000.0,
    "personal_loan_rate": 14.5,
    "education_loan": 0.0,
    "education_loan_rate": 9.0,
    "home_loan": 0.0,
    "home_loan_rate": 8.5,
    "vehicle_loan": 80000.0,
    "vehicle_loan_rate": 9.5,
    "other_liabilities": 0.0,
    # SIP
    "monthly_sip": 22000.0,
    # Risk
    "risk_tolerance": "moderate",
    "investment_horizon_years": 7,
    "emergency_target_months": 6
}

DEFAULT_DEMO_GOALS = [
    {
        "name": "6-Month Emergency Cushion",
        "category": "emergency",
        "target_amount": 390000.0,
        "current_amount": 150000.0,
        "target_year": 2027,
        "monthly_contribution": 10000.0,
        "priority": "HIGH",
        "is_essential": True
    },
    {
        "name": "Electric SUV Downpayment",
        "category": "vehicle",
        "target_amount": 800000.0,
        "current_amount": 250000.0,
        "target_year": 2028,
        "monthly_contribution": 12000.0,
        "priority": "MEDIUM",
        "is_essential": False
    },
    {
        "name": "Dream Apartment Downpayment",
        "category": "home",
        "target_amount": 2500000.0,
        "current_amount": 420000.0,
        "target_year": 2031,
        "monthly_contribution": 15000.0,
        "priority": "HIGH",
        "is_essential": False
    },
    {
        "name": "Retirement Corpus (NPS + Equity)",
        "category": "retirement",
        "target_amount": 20000000.0,
        "current_amount": 650000.0,
        "target_year": 2050,
        "monthly_contribution": 10000.0,
        "priority": "HIGH",
        "is_essential": True
    }
]

class ProfileService:
    @staticmethod
    def get_or_create_demo_user(db: Session) -> User:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            user = User(id=1, name="Aditya Sharma", email="aditya@finarch.ai")
            db.add(user)
            db.commit()
            db.refresh(user)
            
            profile = FinancialProfile(user_id=user.id, **DEFAULT_DEMO_PROFILE)
            db.add(profile)
            db.commit()
            db.refresh(profile)
            
            for g_data in DEFAULT_DEMO_GOALS:
                goal = Goal(profile_id=profile.id, **g_data)
                db.add(goal)
            db.commit()
        return user

    @staticmethod
    def get_profile(db: Session) -> FinancialProfileSchema:
        user = ProfileService.get_or_create_demo_user(db)
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
        if not profile:
            profile = FinancialProfile(user_id=user.id, **DEFAULT_DEMO_PROFILE)
            db.add(profile)
            db.commit()
            db.refresh(profile)
            
        goals_db = db.query(Goal).filter(Goal.profile_id == profile.id).all()
        goals_schema = []
        for g in goals_db:
            completion = (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
            # calculate required monthly contribution
            months_left = max((g.target_year - 2026) * 12, 1)
            remaining_amt = max(g.target_amount - g.current_amount, 0)
            req_monthly = remaining_amt / months_left
            is_on_track = g.monthly_contribution >= req_monthly
            
            goals_schema.append(
                GoalBase(
                    id=g.id,
                    name=g.name,
                    category=g.category,
                    target_amount=g.target_amount,
                    current_amount=g.current_amount,
                    target_year=g.target_year,
                    monthly_contribution=g.monthly_contribution,
                    priority=g.priority,
                    is_essential=g.is_essential,
                    completion_percentage=round(completion, 1),
                    required_monthly=round(req_monthly, 2),
                    is_on_track=is_on_track
                )
            )
            
        return FinancialProfileSchema(
            salary_income=profile.salary_income,
            other_income=profile.other_income,
            rent_expense=profile.rent_expense,
            food_expense=profile.food_expense,
            transport_expense=profile.transport_expense,
            utilities_expense=profile.utilities_expense,
            subscriptions_expense=profile.subscriptions_expense,
            other_expenses=profile.other_expenses,
            cash_balance=profile.cash_balance,
            bank_savings=profile.bank_savings,
            emergency_fund=profile.emergency_fund,
            fixed_deposits=profile.fixed_deposits,
            gold_assets=profile.gold_assets,
            mutual_funds=profile.mutual_funds,
            stocks_equity=profile.stocks_equity,
            other_assets=profile.other_assets,
            credit_card_debt=profile.credit_card_debt,
            credit_card_rate=profile.credit_card_rate,
            personal_loan=profile.personal_loan,
            personal_loan_rate=profile.personal_loan_rate,
            education_loan=profile.education_loan,
            education_loan_rate=profile.education_loan_rate,
            home_loan=profile.home_loan,
            home_loan_rate=profile.home_loan_rate,
            vehicle_loan=profile.vehicle_loan,
            vehicle_loan_rate=profile.vehicle_loan_rate,
            other_liabilities=profile.other_liabilities,
            monthly_sip=profile.monthly_sip,
            risk_tolerance=profile.risk_tolerance,
            investment_horizon_years=profile.investment_horizon_years,
            emergency_target_months=profile.emergency_target_months,
            goals=goals_schema
        )

    @staticmethod
    def update_profile(db: Session, update_data: FinancialProfileSchema) -> FinancialProfileSchema:
        user = ProfileService.get_or_create_demo_user(db)
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
        if not profile:
            profile = FinancialProfile(user_id=user.id)
            db.add(profile)
            
        for key, value in update_data.model_dump(exclude={"goals"}).items():
            setattr(profile, key, value)
            
        db.commit()
        db.refresh(profile)
        return ProfileService.get_profile(db)

    @staticmethod
    def reset_to_demo(db: Session) -> FinancialProfileSchema:
        user = ProfileService.get_or_create_demo_user(db)
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
        if profile:
            for key, val in DEFAULT_DEMO_PROFILE.items():
                setattr(profile, key, val)
            
            # Reset goals
            db.query(Goal).filter(Goal.profile_id == profile.id).delete()
            for g_data in DEFAULT_DEMO_GOALS:
                goal = Goal(profile_id=profile.id, **g_data)
                db.add(goal)
            db.commit()
            
        return ProfileService.get_profile(db)
