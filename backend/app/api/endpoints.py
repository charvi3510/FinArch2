from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import get_db, Goal
from app.schemas.financial import (
    FinancialProfileSchema, FinancialMetrics, FinancialHealthScoreBreakdown,
    DecisionEngineResult, OptimizationRequest, WhatIfRequest, WhatIfResult,
    MonteCarloRequest, MonteCarloResult, RiskAssessment, ChatRequest,
    ChatResponse, GoalBase
)
from app.services.profile_service import ProfileService
from app.financial_engine.calculator import FinancialCalculator
from app.financial_engine.health_score import FinancialHealthEngine
from app.optimization.decision_engine import DecisionEngine
from app.optimization.portfolio_optimizer import OpportunityOptimizer
from app.simulation.what_if import WhatIfSimulator
from app.simulation.monte_carlo import MonteCarloSimulator
from app.risk.risk_engine import RiskEngine
from app.knowledge.market_layer import MarketKnowledgeLayer
from app.ai.reasoning_engine import AIReasoningEngine
from app.agents.market_intelligence import run_market_agents

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "online", "service": "FINARCH AI Autonomous Financial Decision Engine", "version": "1.1.0"}

@router.get("/profile", response_model=FinancialProfileSchema)
def get_profile(db: Session = Depends(get_db)):
    return ProfileService.get_profile(db)

@router.put("/profile", response_model=FinancialProfileSchema)
def update_profile(profile_data: FinancialProfileSchema, db: Session = Depends(get_db)):
    return ProfileService.update_profile(db, profile_data)

@router.post("/profile/reset-demo", response_model=FinancialProfileSchema)
def reset_demo_profile(db: Session = Depends(get_db)):
    return ProfileService.reset_to_demo(db)

@router.get("/financial-twin")
def get_financial_twin(db: Session = Depends(get_db)):
    profile = ProfileService.get_profile(db)
    metrics = FinancialCalculator.calculate_metrics(profile)
    health = FinancialHealthEngine.calculate_health_score(profile)
    risk = RiskEngine.assess_risk(profile)
    portfolio = OpportunityOptimizer.analyze_portfolio_risk(profile)
    return {"profile": profile, "metrics": metrics, "health_score": health, "risk_assessment": risk, "portfolio": portfolio}

@router.get("/health-score", response_model=FinancialHealthScoreBreakdown)
def get_health_score(db: Session = Depends(get_db)):
    return FinancialHealthEngine.calculate_health_score(ProfileService.get_profile(db))

@router.post("/analyze", response_model=DecisionEngineResult)
def analyze_decision(amount: float = 10000.0, db: Session = Depends(get_db)):
    return DecisionEngine.evaluate_next_rupee_action(ProfileService.get_profile(db), amount)

@router.post("/optimize")
def optimize_opportunities(req: OptimizationRequest, db: Session = Depends(get_db)):
    return OpportunityOptimizer.optimize_opportunity(ProfileService.get_profile(db), req)

@router.post("/simulate", response_model=WhatIfResult)
def simulate_what_if(req: WhatIfRequest, db: Session = Depends(get_db)):
    return WhatIfSimulator.simulate_scenarios(ProfileService.get_profile(db), req)

@router.post("/simulate/monte-carlo", response_model=MonteCarloResult)
def run_monte_carlo(req: MonteCarloRequest):
    return MonteCarloSimulator.run_simulation(req)

@router.post("/portfolio/analyze")
def analyze_portfolio(db: Session = Depends(get_db)):
    return OpportunityOptimizer.analyze_portfolio_risk(ProfileService.get_profile(db))

@router.get("/risk", response_model=RiskAssessment)
def get_risk_assessment(db: Session = Depends(get_db)):
    return RiskEngine.assess_risk(ProfileService.get_profile(db))

@router.get("/goals", response_model=List[GoalBase])
def get_goals(db: Session = Depends(get_db)):
    return ProfileService.get_profile(db).goals

@router.post("/goals", response_model=GoalBase)
def create_goal(goal_in: GoalBase, db: Session = Depends(get_db)):
    user = ProfileService.get_or_create_demo_user(db)
    from app.models.database import FinancialProfile
    prof = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    new_goal = Goal(profile_id=prof.id, name=goal_in.name, category=goal_in.category, target_amount=goal_in.target_amount,
                    current_amount=goal_in.current_amount, target_year=goal_in.target_year,
                    monthly_contribution=goal_in.monthly_contribution, priority=goal_in.priority,
                    is_essential=goal_in.is_essential)
    db.add(new_goal); db.commit(); db.refresh(new_goal)
    completion = (new_goal.current_amount / new_goal.target_amount * 100) if new_goal.target_amount > 0 else 0
    months_left = max((new_goal.target_year - 2026) * 12, 1)
    req_monthly = max(new_goal.target_amount - new_goal.current_amount, 0) / months_left
    return GoalBase(id=new_goal.id, name=new_goal.name, category=new_goal.category, target_amount=new_goal.target_amount,
                    current_amount=new_goal.current_amount, target_year=new_goal.target_year,
                    monthly_contribution=new_goal.monthly_contribution, priority=new_goal.priority,
                    is_essential=new_goal.is_essential, completion_percentage=round(completion, 1),
                    required_monthly=round(req_monthly, 2), is_on_track=new_goal.monthly_contribution >= req_monthly)

@router.delete("/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal: raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal); db.commit()
    return {"message": "Goal deleted successfully", "id": goal_id}

@router.post("/ai/chat", response_model=ChatResponse)
async def chat_with_advisor(req: ChatRequest, db: Session = Depends(get_db)):
    return await AIReasoningEngine.generate_response(ProfileService.get_profile(db), req)

@router.get("/market/demo")
def get_market_knowledge():
    return MarketKnowledgeLayer.get_market_benchmarks()

@router.post("/intelligence/run")
def run_intelligence(snapshot: Dict[str, Any], db: Session = Depends(get_db)):
    """PS Sprint 1 end-to-end: same market input -> 3 specialists -> RAG -> synthesis."""
    profile = ProfileService.get_profile(db)
    profile_dict = {"risk_tolerance": profile.risk_tolerance, "investment_horizon_years": profile.investment_horizon_years}
    return run_market_agents(snapshot, profile_dict)
