CREATE TABLE IF NOT EXISTS requests (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    guild_id TEXT NOT NULL,

    user_id TEXT NOT NULL,

    role_id TEXT NOT NULL,

    executor_id TEXT,

    approved_by TEXT,

    denied_by TEXT,

    status TEXT DEFAULT 'PENDING',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS protected_roles (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    guild_id TEXT NOT NULL,

    role_id TEXT NOT NULL

);



CREATE TABLE IF NOT EXISTS guild_config (

    guild_id TEXT PRIMARY KEY,

    approver_role TEXT,

    approval_channel TEXT,

    log_channel TEXT

);