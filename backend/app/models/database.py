import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./finarch.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Aditya Sharma")
    email = Column(String, default="aditya@finarch.ai")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("FinancialProfile", back_populates="user", uselist=False)

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Incomes
    salary_income = Column(Float, default=110000.0)
    other_income = Column(Float, default=10000.0)
    
    # Expenses Breakdown
    rent_expense = Column(Float, default=25000.0)
    food_expense = Column(Float, default=15000.0)
    transport_expense = Column(Float, default=6000.0)
    utilities_expense = Column(Float, default=5000.0)
    subscriptions_expense = Column(Float, default=3000.0)
    other_expenses = Column(Float, default=11000.0)
    
    # Assets & Reserves
    cash_balance = Column(Float, default=35000.0)
    bank_savings = Column(Float, default=115000.0)
    emergency_fund = Column(Float, default=150000.0)
    fixed_deposits = Column(Float, default=50000.0)
    gold_assets = Column(Float, default=70000.0)
    mutual_funds = Column(Float, default=180000.0)
    stocks_equity = Column(Float, default=350000.0)
    other_assets = Column(Float, default=0.0)
    
    # Liabilities & Debts
    credit_card_debt = Column(Float, default=40000.0)
    credit_card_rate = Column(Float, default=38.0) # APR %
    personal_loan = Column(Float, default=180000.0)
    personal_loan_rate = Column(Float, default=14.5) # %
    education_loan = Column(Float, default=0.0)
    education_loan_rate = Column(Float, default=9.0)
    home_loan = Column(Float, default=0.0)
    home_loan_rate = Column(Float, default=8.5)
    vehicle_loan = Column(Float, default=80000.0)
    vehicle_loan_rate = Column(Float, default=9.5)
    other_liabilities = Column(Float, default=0.0)
    
    # Systematic Monthly Investments
    monthly_sip = Column(Float, default=22000.0)
    
    # Risk Profile
    risk_tolerance = Column(String, default="moderate") # conservative, moderate, aggressive
    investment_horizon_years = Column(Integer, default=7)
    
    # Target Emergency Fund Months
    emergency_target_months = Column(Integer, default=6)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")
    goals = relationship("Goal", back_populates="profile", cascade="all, delete-orphan")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("financial_profiles.id"))
    
    name = Column(String, nullable=False)
    category = Column(String, default="general") # emergency, vehicle, home, retirement, education, wealth, custom
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_year = Column(Integer, default=2028)
    monthly_contribution = Column(Float, default=5000.0)
    priority = Column(String, default="HIGH") # HIGH, MEDIUM, LOW
    is_essential = Column(Boolean, default=False)
    
    profile = relationship("FinancialProfile", back_populates="goals")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
