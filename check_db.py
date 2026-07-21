import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['agentic_mcp_db']
conv = db.conversations.find().sort('created_at_dt', -1).limit(1)[0]
for m in conv['messages'][-5:]:
    print(f"ROLE: {m['role']}")
    print(f"CONTENT: {m['content']}")
    print("-" * 40)
