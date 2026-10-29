#!/bin/bash
set -e

DB_NAME="smartdb"
DB_USER="drhazem"
DB_PASS="HealthF26"

echo "Resetting database and user roles..."

# 1. Drop and recreate the database using sudo -u postgres
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

# 2. Create user if not exists, otherwise update password
sudo -u postgres psql -c "
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
   ELSE
      ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';
   END IF;
END
\$\$;
"

# 3. Grant privileges and superuser status
sudo -u postgres psql -c "ALTER ROLE $DB_USER WITH SUPERUSER LOGIN;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 4. Connect to the new database and create extensions
sudo -u postgres psql -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

echo "Database '$DB_NAME' successfully recreated and configured for '$DB_USER'."
