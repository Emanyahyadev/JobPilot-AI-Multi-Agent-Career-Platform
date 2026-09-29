from db.database import Base, engine
from models.career_profile import User, CareerProfile, ProfileFact

Base.metadata.create_all(bind=engine)
print("Tables created")
