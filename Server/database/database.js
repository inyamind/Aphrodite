//File to setup and handle our database needs
const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.db";
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    deconstructor() {
        this.close();
    }

    init() {
        this.db = new sqlite3.Database(DBSOURCE, (err) => {
            if (err) {
                console.error(err.message);
                throw err;
            } else {
                console.log('Connected to the SQLite database.');
                this.createTables();
            }
        });
    }

    // Just found out unique is a thing, lol ive always been manually checking for duplicates : (
    createTables() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USERNAME TEXT NOT NULL UNIQUE,
                PASSWORD TEXT NOT NULL,
                DISCORD_USER_ID TEXT NOT NULL UNIQUE,
                HWID TEXT NULL UNIQUE,
                LAST_RESET DATETIME
            );
    `;

        this.db.exec(sql, (err) => {
            if (err) {
                console.error(err.message);
                throw err;
            } else {
                console.log('Tables created.');
            }
        });
    }

    userExists(discordUserId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT DISCORD_USER_ID FROM users WHERE DISCORD_USER_ID = ?;`;
            const params = [discordUserId];
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log('User exists.');
                        resolve(true);
                    } else {
                        console.log('User does not exist.');
                        resolve(false);
                    }
                }
            });
        });
    }

    async validateUserCredentials(username, password, hwid) {
        // Check if user exists and get the user's details
        const user = await this.getUser(username);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }
    
        // Check password
        const validPassword = bcrypt.compareSync(password, user.PASSWORD);
        if (!validPassword) {
            return { status: 403, message: 'Invalid password' };
        }

        // Check if HWID is set and matches
        if (user.HWID) {
            if (user.HWID === hwid) {
                return { status: 200, message: 'Login successful' };
            } else {
                return { status: 403, message: 'HWID does not match this account.' };
            }
        } else {
            // Update HWID if it wasn't set
            try {

                // check to make sure a user doesnt have this hwid already
                const hwidUser = await this.getUserByHwid(hwid);
                if (hwidUser) {
                    return { status: 403, message: 'HWID already registered to another user.' };
                }
                
                await this.updateHwid(username, hwid);
                return { status: 200, message: 'HWID has been updated and login is successful' };
            } catch (err) {
                console.error(err);
                return { status: 500, message: 'An error occurred' };
            }
        }
    }
    

    getUserByID(discordUserId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE DISCORD_USER_ID = ?;`;
            const params = [discordUserId];
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log('User exists.');
                        resolve(row);
                    } else {
                        console.log('User does not exist.');
                        resolve(false);
                    }
                }
            });
        });
    }

    getUser(username) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE USERNAME = ?;`;
            const params = [username];
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log('User exists.');
                        resolve(row);
                    } else {
                        console.log('User does not exist.');
                        resolve(false);
                    }
                }
            });
        });
    }

    getUserByHwid(hwid) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE HWID = ?;`;
            const params = [hwid];
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log('User exists.');
                        resolve(row);
                    } else {
                        console.log('HWID does not exist.');
                        resolve(false);
                    }
                }
            });
        });
    }

    updateHwidByID(discordUserId, hwid) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET HWID = ? WHERE DISCORD_USER_ID = ?;`;
            const params = [hwid, discordUserId];
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`HWID updated for user with Discord ID: ${discordUserId}`);
                    resolve({ status: 'success', message: 'HWID updated successfully', changes: this.changes });
                }
            });
        });
    }

    
    async resetHWID(discordUserId) {
        return new Promise((resolve, reject) => {
            this.getUserByID(discordUserId)
                .then(user => this.validateReset(user))
                .then(user => this.performReset(user, discordUserId))
                .then(user => this.updateLastReset(user, discordUserId))
                .then(user => {
                    console.log(`HWID reset for user: ${user.USERNAME}`);
                    resolve({ status: 'success', message: 'HWID reset successfully' });
                })
                .catch(err => {
                    console.error(`Failed to reset HWID: ${err.message}`);
                    reject(err);
                });
        });
    }
    
    validateReset(user) {
        const currentDate = new Date();
        const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        let timeDifference;
    
        if (user.LAST_RESET !== null) {
            const lastResetDate = new Date(user.LAST_RESET);
            timeDifference = currentDate - lastResetDate;
        } else {
            // If LAST_RESET is NULL, we can consider it as more than a month ago
            timeDifference = oneMonthInMilliseconds + 1;
        }
    
        if (timeDifference < oneMonthInMilliseconds) {
            throw new Error('You can only reset your HWID once a month.');
        } else if (user.HWID === null) {
            throw new Error('Your HWID is already reset.');
        }
    
        return user;
    }
    
    performReset(user, discordUserId) {
        const sql = `UPDATE users SET HWID = NULL WHERE DISCORD_USER_ID = ?;`;
        const params = [discordUserId];
    
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, error => {
                if (error) {
                    console.error(error.message);
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });
    }
    
    updateLastReset(user, discordUserId) {
        const sql = `UPDATE users SET LAST_RESET = CURRENT_TIMESTAMP WHERE DISCORD_USER_ID = ?;`;
        const params = [discordUserId];
    
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, error => {
                if (error) {
                    console.error(error.message);
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });
    }
    
    
    updateHwid(username, hwid) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET HWID = ? WHERE USERNAME = ?;`;
            const params = [hwid, username];
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`HWID updated for user: ${username}`);
                    resolve({ status: 'success', message: 'HWID updated successfully', changes: this.changes });
                }
            });
        });
    }
    
    usernameTaken(username) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT USERNAME FROM users WHERE USERNAME = ?;`;
            const params = [username];
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        console.log('Username taken.');
                        resolve(true);
                    } else {
                        console.log('Username not taken.');
                        resolve(false);
                    }
                }
            });
        });
    }

    insertUser(username, password, discordUserId, hwid) {    
        const sql = `
            INSERT INTO users (USERNAME, PASSWORD, DISCORD_USER_ID)
            VALUES (?, ?, ?);
        `;
        
        // Hash the password before inserting it into the database
        const hashedPassword = bcrypt.hashSync(password, 10);
        const params = [username, hashedPassword, discordUserId, hwid];
        
        this.db.run(sql, params, (err) => {
            if (err) {
                console.error(err.message);
                throw err;
            } else {
                console.log('User inserted, username: ' + username + ' password: ' + password + ' discordUserId: ' + discordUserId);
            }
        });
    }

   close() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
                throw err;
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}

module.exports = Database;