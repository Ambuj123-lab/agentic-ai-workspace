from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)

class MongoDBClient:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        settings = get_settings()
        if not settings.MONGODB_URI:
            logger.warning("MONGODB_URI not set. Using fallback in-memory DB if needed.")
            return

        logger.info("Connecting to MongoDB Atlas...")
        cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
        cls.db = cls.client[settings.MONGODB_DB_NAME]
        
        # Create a TTL index on created_at field for 30 days (2592000 seconds)
        import pymongo
        await cls.db["conversations"].create_index(
            [("created_at_dt", pymongo.ASCENDING)],
            expireAfterSeconds=2592000
        )
        
        logger.info(f"Connected to MongoDB database: {settings.MONGODB_DB_NAME}")

    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")

def get_db():
    return MongoDBClient.db
