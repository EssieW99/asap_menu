-- prepares a postgreSQL
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_extension
		WHERE extname = 'dblink'
	} THEN
	        CREATE EXTENSION dblink;
	END IF;
END
$$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT
		FROM pg_catalog.pg_database
		WHERE datname = 'asap_menu_db') THEN
		PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE asap_menu_db');
	END IF;
END
$$;

-- create user (without IF NOT EXISTS)
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT
		FROM pg_catalog.pg_user
		WHERE usename = 'asapmenu_dev') THEN
		EXECUTE 'CREATE USER asapmenu_dev WITH PASSWORD ''asapmenu_pwd''';
	END IF;
END
$$

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE asap_menu_db TO asapmenu_dev;
GRANT ALL PRIVILEGES ON SCHEMA public TO asapmenu_dev;
