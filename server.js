require('dotenv').config();
const express = require('express');
// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require('path');
const { error, table } = require('console');
const { resolve } = require('dns');
const { rejects } = require('assert');
const qrcode = require('qrcode');
const fs = require('fs');

const port = 5672;

const app = express();
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));
// Parse JSON bodies
app.use(bodyParser.json());
app.use(flash());

let dnthCounter = 0;
let tttCounter = 0;
let ntsCounter = 0;

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
})

const connection = mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,  
});



// connection.connect((error) => {
//     if (error) {
//       console.error('Error connecting to the database:', error);
//       // Handle the error
//     } else {
//       console.log('Connected to the database!');
//       // Perform database operations
//     }
//   });

const sessionMiddleware = session({
    secret: 'SessionSecretKey',
    resave: false,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
const isAuthenticated = (req, res, next) => {
    if (req.cookies.isAuthenticated) {
        next();
    }
    else {
        res.redirect('/');
    }
};

// Login Page
app.get('/', async (req, res) => {
    try {
        // const connection = await pool.getConnection();

        // Level => 0 = admin / 1 = SDM / 2 = supplier
        // await connection.query(`
        //     CREATE TABLE IF NOT EXISTS tb_user_e_supp (id INT PRIMARY KEY AUTO_INCREMENT,
        //     username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, 
        //     status INT DEFAULT 1, level INT DEFAULT 1)
        // `);
        // await connection.query('DROP TABLE tb_user_e_supp');
        // await connection.query(`INSERT INTO tb_user_e_supp (username, password, email, level)
        // VALUES ('admin', 'admin', 'uthai.khantamongkhon.a7p@ap.denso.com', 0)`);
        // connection.release();
        // await connection.query(`
        //     CREATE TABLE IF NOT EXISTS tb_master_packing (id INT,
        //     qr_packingList VARCHAR(255), partNumber VARCHAR(255), partName VARCHAR(1080), 
        //     qr_box VARCHAR(255) PRIMARY KEY, qty INT, boxCount INT, is_fac1_receive BIT(1), suppStartDate DATE, suppStartTime TIME, suppEndDate DATE, suppEndTime TIME, 
        //     suppLeader VARCHAR(255))
        // `);
        // connection.release();
        // await connection.query(`ALTER TABLE tb_master_packing MODIFY id INT NOT NULL AUTO_INCREMENT, DROP PRIMARY KEY, ADD PRIMARY KEY (qr_box)`);
        // connection.release();
        // await connection.query(`
        //     CREATE TABLE IF NOT EXISTS tb_actual_packing (id INT PRIMARY KEY AUTO_INCREMENT,
        //     qr_packingList VARCHAR(255), partNumber VARCHAR(255), partName VARCHAR(1080), 
        //     qr_box VARCHAR(255), qty INT, boxCount INT)
        // `);
        // // connection.release();
        // await connection.query(`
        // CREATE TABLE IF NOT EXISTS tb_dnth (
        //     qr_pack_in VARCHAR(255),
        //     qr_kanban_in VARCHAR(255) PRIMARY KEY,
        //     kanban_date_in DATE,
        //     kanban_time_in TIME,
        //     qty_kanban_in INT,
        //     partNumber VARCHAR(255),
        //     qr_prod VARCHAR(255),
        //     date_in_prod DATE,
        //     time_in_prod TIME,
        //     date_out_prod DATE,
        //     time_out_prod TIME,
        //     total_ok_prod INT,
        //     total_ng_prod INT,
        //     operator VARCHAR(255),
        //     qr_kanban_out VARCHAR(255),
        //     kanban_out_date DATE,
        //     kanban_out_time TIME,
        //     total_qty_out INT,
        //     qr_pack_out VARCHAR(255)
        //   )
        // `);
        // await connection.query(`
        // CREATE TABLE IF NOT EXISTS tb_tsk (
        //     qr_pack_in VARCHAR(255),
        //     qr_kanban_in VARCHAR(255) PRIMARY KEY,
        //     kanban_date_in DATE,
        //     kanban_time_in TIME,
        //     qty_kanban_in INT,
        //     partNumber VARCHAR(255),
        //     qr_prod VARCHAR(255),
        //     date_in_prod DATE,
        //     time_in_prod TIME,
        //     date_out_prod DATE,
        //     time_out_prod TIME,
        //     total_ok_prod INT,
        //     total_ng_prod INT,
        //     operator VARCHAR(255),
        //     qr_kanban_out VARCHAR(255),
        //     kanban_out_date DATE,
        //     kanban_out_time TIME,
        //     total_qty_out INT,
        //     qr_pack_out VARCHAR(255)
        //   )
        // `);
        await connection.query(`
        CREATE TABLE IF NOT EXISTS tb_partNumber (
            tsk_pn VARCHAR(15),
            dnth_pn VARCHAR(15),
            ttt_pn VARCHAR(15),
            nts_pn VARCHAR(15),
            sdm_pn VARCHAR(15)
          )
        `, (err, results) => {
            if(err) {
                console.log(err);
            } else {
                console.log("CREATE tb_partNumber completed");
            }
        });
        // await connection.query(`
        //     ALTER TABLE tb_dnth ADD time_out_pl TIME
        // `, (err, results) => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("Add column dnth_partNumber completed");
        //     }
        // })
        // const col_names = await new Promise((resolve, reject) => {
        //     connection.query(`SHOW COLUMNS FROM tb_dnth;`, (err, results) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(results);
        //         }
        //     })
        // });
        // console.log(col_names);
        // await connection.query(`
        //     ALTER TABLE tb_partNumber ADD id INT PRIMARY KEY AUTO_INCREMENT
        // `, (err, results) => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("Add column in tb_partNumber completed");
        //     }
        // });
        // await connection.query(`
        //     ALTER TABLE tb_dnth ADD machine_line INT 
        // `);
        // connection.release();
        // await connection.query('ALTER TABLE tb_master_packing ADD COLUMN fac1_receive BOOLEAN DEFAULT FALSE');
        // connection.release();
        // await connection.query(`
        //     INSERT INTO tb_master_packing (qr_packingList, partNumber, partName, qr_box, qty, boxCount)
        //     VALUES ('A54321', 'SM299159-0080', 'CYLINDER SUPPLY PUMP(HP5S)', 'A4321', 1000, 1);
        // `);
        // connection.release();
        // await connection.query(`DROP TABLE tb_dnth`);
        // connection.release();
        // await connection.query(`DELETE FROM tb_dnth`);
        // connection.release();
        // await connection.query(`
        //     INSERT INTO tb_master_packing (qr_packingList) VALUES ('A54321')
        // `);
        // connection.release();
        
        // For debug user
        // const [user_datas] = connection.query('SELECT * FROM tb_user_e_supp');
        // let user_datas;
        // const await connection.query("SELECT * FROM tb_user_e_supp", (err, results) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     } else {
        //         results.forEach((user_data) => {
        //             console.log(user_data.username + " " + user_data.password + " " + user_data.email);
        //         });
        //     }
        // })
        // console.log(user_datas);
        // // connection.release();
        // user_datas.forEach((user_data) => {
        //     console.log(user_data.username + " " + user_data.password + " " + user_data.email);
        // });

        res.render('login');
    }
    catch (error) {
        console.error("Error : ", error);
        res.status(500);
    }
});
// Login end point
app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_user_e_supp WHERE username = ?
                AND password = ?
            `, [username, password], (err, results) => {
                if (err) {
                    reject(err);
                    console.log(err);
                    return;
                } else {
                    resolve(results);
                    console.log(results)
                }
            });
        });

        if (user_datas.length > 0) {
            req.session.isAuthenticated = true;
            res.cookie('isAuthenticated', true);
            console.log("User level : ", user_datas[0].level);
            if (user_datas[0].level === 0) {
                console.log(`Welcome ${user_datas[0].username}`);

                req.session.username = user_datas[0].username;
                res.redirect('/admin_page');
            }
            else {
                req.session.username = user_datas[0].username;
                console.log(`Welcome ${user_datas[0].username}`);
                res.redirect('/admin_page');
            }
        }
    }
    catch (error) {
        console.error("Error : ", error);
        res.status(500);
        res.send("Error");
    }
});


//------------------------------------MASTER (TSK) SHOW FUNCTION-------------------------------------------------
// Master setting shoow main QR
app.get('/admin_page/master_main', isAuthenticated, async (req, res) => {
    try{
        const current_user = req.session.username;
        console.log(current_user);
        await connection.query('SELECT DISTINCT qr_packingList FROM tb_master_packing', 
        (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                // const qr_packingList = Array.isArray(results) ? results.map(row => row.qr_PackingList) : [];
                console.log('QR packing list : ', results);

                res.render('master_main', {qr_packingList: results});
            }
        })
    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})
// Master setting page
app.get('/admin_page/master_setting', isAuthenticated, async (req, res) => {
    try {
        // connection = await pool.getConnection();
        // const [master_datas] = await connection.query(`
        //     SELECT qr_packingList, partNumber, partName, qr_box, qty, boxCount, is_fac1_receive
        //     FROM tb_master_packing
        // `);
        await connection.query(`
            SELECT qr_packingList, partNumber, partName, qr_box, qty, boxCount, is_fac1_receive
            FROM tb_master_packing
        `, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                const is_fac1_receive = results.map(data => data.is_fac1_receive.toString('hex'));

                res.render('master_setting', {master_datas: results, is_fac1_receive: is_fac1_receive});
            }
        })
        // await connection.release();

        // const is_fac1_receive = master_datas.map(data => data.is_fac1_receive.toString('hex'));
        // console.log('Master datas : ', master_datas);
        // console.log("Is Fac1 Receive : ", is_fac1_receive);

        // If is_fac1_receive change to '01' let insert that data to tb_dnth
        // Check if the entry already exists in tb_dnth

        // await res.render('master_setting', {master_datas: master_datas, is_fac1_receive: is_fac1_receive});

    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
});

//------------------------------------MASTER (TSK) SETTING FUNCTION-------------------------------------------------
// Master adding endpoint
app.post('/admin_page/master_setting/adding', async (req, res) => {
    try {
        // connection = await pool.getConnection();
        const { qr_packingList, part_number, part_name, box_no, qty, count_box, is_fac1_receive } = req.body;
        const is_fac1_receive_bit = is_fac1_receive === 'on' ? 1 : 0;
        console.log("Fac1 receive: ", is_fac1_receive_bit);

        // Check if the qr_box value already exists in the table
        // const [existingRow] = await connection.execute('SELECT qr_box FROM tb_master_packing WHERE qr_box = ?', [box_no]);
        await connection.query(`
            SELECT qr_box FROM tb_master_packing WHERE qr_box = ?
        `, [box_no], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                if (results.length > 0) {
                    // Handle the case where the qr_box value already exists
                    console.log('Duplicate entry for qr_box:', box_no);
                    res.redirect('/admin_page/master_setting');
                    return;
                } else {
                    // Insert the new row into the table
                    connection.query('INSERT INTO tb_master_packing (qr_packingList, partNumber, partName, qr_box, qty, is_fac1_receive) VALUES (?, ?, ?, ?, ?, ?)',
                      [qr_packingList, part_number, part_name, box_no, qty, is_fac1_receive_bit], (err) => {
                        if (err) {
                          console.log(err);
                          res.status(500).send('Error occurred');
                        } else {
                          res.redirect('/admin_page/master_setting');
                        }
                      });
                }
            }
        });
    } catch (error) {
        console.error('Error: ', error);
        res.redirect('/admin_page/master_setting');
    }
});
// Master setting edit page
app.get('/admin_page/master_setting/edit', isAuthenticated, async (req, res) => {
    try {
        const {qr_box, qr_packingList} = req.query;

        await connection.query(`
            SELECT qr_packingList, partNumber, partName, qr_box, qty, boxCount, is_fac1_receive
            FROM tb_master_packing WHERE qr_packingList = ? AND qr_box = ?
        `, [qr_packingList, qr_box], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.render('master_edit', {master_datas: results});
            }
        })
    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
});
app.post('/admin_page/master_setting/editing', async (req, res) => {
    try {
        const {qr_packingList, partNumber, partName, qr_box, qty, is_fac1_receive} = req.body;
        // connection = await pool.getConnection();
        let is_fac1_receive_bit = 0;
        if (is_fac1_receive === '00') {
            // If you change DNTH receive to 0 , go to delete DNTH_data where qr_kanban_in = qr_box
            await connection.query('DELETE FROM tb_dnth WHERE qr_kanban_in = ?', 
            [qr_box], (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    is_fac1_receive_bit = 0;
                }
            })
        }
        else if (is_fac1_receive === '01') {
            is_fac1_receive_bit = 1;
        }
        console.log(qr_packingList, partNumber, partName, qr_box, qty, is_fac1_receive, is_fac1_receive_bit);

        await connection.query(`
            UPDATE tb_master_packing SET qr_packingList = ?, partNumber = ?,
            partName = ?, qty = ?, is_fac1_receive = ? WHERE qr_box = ?
        `, [qr_packingList, partNumber, partName, qty, is_fac1_receive_bit, qr_box], (err, updateResults) => {
            if (err) {
                return;
            } else {
                res.redirect(`/admin_page/master_setting`);
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
    
})
// Master setting delete end point 
app.get('/admin_page/master_setting/delete', async (req, res) => {
    try {
        const {qr_box, qr_packingList} = req.query;

        await connection.query('DELETE FROM tb_master_packing WHERE qr_box = ? AND qr_packingList = ?',
        [qr_box, qr_packingList], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('/admin_page/master_setting');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
});
app.get('/admin_page/master_setting/reset_dnth_receive', async (req, res) => {
    try {
        // await connection.query('UPDATE tb_master_packing SET is_fac1_receive = 0');
        await connection.query('UPDATE tb_master_packing SET is_fac1_receive = 0', (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('/admin_page/master_setting');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})


//------------------------------------DNTH SCAN RECEIVEING FUNCTION-------------------------------------------------
// Fac1 receive scan page
app.get('/admin_page/receive_scan_master', isAuthenticated, (req, res) => {
    try {
        const errorMessage = req.flash('error');
        res.render('receive_scan_master', {errorMessage});
    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
});
// Fac1 receive scan endpoint
app.post('/admin_page/receive_scan_master/master_receiving', async (req, res) => {
    try {
        const {qr_packingList} = req.body;
        await connection.query(`SELECT * FROM tb_master_packing WHERE qr_packingList = '${qr_packingList}'`, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                if (results.length > 0) {
                    res.redirect(`/admin_page/receive_scan_box?qr_packingList=${qr_packingList}`)
                } else {
                    req.flash('error', `No ${qr_packingList} Packing list`);
        
                    res.redirect(`/admin_page/receive_scan_master`);
                }
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})
// Fac1 receive scan box page
app.get('/admin_page/receive_scan_box', isAuthenticated, async (req, res) => {
    try {
        const qr_packingList = req.query.qr_packingList;

        // For error message 
        const errorMessage = req.flash('error');

        await connection.query(`
            SELECT qr_packingList, partNumber, partName, qr_box, qty, boxCount, is_fac1_receive
            FROM tb_master_packing WHERE qr_packingList = ?
        `, [qr_packingList], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                connection.query(`
                    SELECT qr_packingList, partNumber, 
                    SUM(CASE WHEN is_fac1_receive != 0 THEN qty ELSE 0 END) AS totalActQty, 
                    SUM(qty) AS totalQty, 
                    COUNT(CASE WHEN is_fac1_receive != 0 THEN 1 END) AS totalActBox, 
                    COUNT(qty) AS totalBox
                    FROM tb_master_packing 
                    WHERE qr_packingList = ?
                    GROUP BY partNumber
                `, [qr_packingList], (err, master_sum_by_partNumber) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.render('receive_scan_sub', {master_datas: results, qr_packingList: qr_packingList, master_sum_by_partNumber: master_sum_by_partNumber, errorMessage});
                    }
                })
            }
        })
    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
});
// Fac1 receive scan box endpoint
app.post('/admin_page/receive_scan_master/receive_box_complete', async (req, res) => {
    try {
        const {qr_packingList, qr_box, kanban_date_in, kanban_time_in} = req.body;
        // const qr_packingList_link = req.query.qr_packingList;
        console.log(qr_packingList, qr_box, kanban_date_in, kanban_time_in);

        await connection.query(`
            UPDATE tb_master_packing SET is_fac1_receive = 1 WHERE qr_box = ? AND qr_packingList = ?
        `, [qr_box, qr_packingList], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                // Check if the entry already exists in tb_dnth
                connection.query('SELECT qr_kanban_in FROM tb_dnth WHERE qr_kanban_in = ? AND qr_pack_in = ?',[qr_box, qr_packingList], (err, existingData) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        if (existingData.length === 0) {
                            connection.query('SELECT partNumber, qty FROM tb_master_packing WHERE qr_box = ?  AND qr_packingList = ?', [qr_box, qr_packingList], (err, get_datas) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                } else {
                                    if (get_datas.length > 0) {
                                        connection.query(`
                                            INSERT INTO tb_dnth (qr_pack_in, qr_kanban_in, kanban_date_in, kanban_time_in, qty_kanban_in, partNumber)
                                            VALUES (?, ?, ?, ?, ?, ?)
                                        `, [qr_packingList, qr_box, kanban_date_in, kanban_time_in, get_datas[0].qty, get_datas[0].partNumber], (err, insertResults) => {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            } else {
                                                res.redirect(`/admin_page/receive_scan_box?qr_packingList=${qr_packingList}`);
                                            }
                                        });
                                    } else {
                                        req.flash('error', `No ${qr_box} in ${qr_packingList} Packing list`);
                                        res.redirect(`/admin_page/receive_scan_box?qr_packingList=${qr_packingList}`);
                                    }
                                }
                            });
                        } else {
                            req.flash('error', `Already scan ${qr_box} in ${qr_packingList} Packing list`);
                
                            res.redirect(`/admin_page/receive_scan_box?qr_packingList=${qr_packingList}`);
                        }
                    }
                })
            }
        })
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
    
});

//------------------------------------DNTH SCAN RECEIVEING FUNCTION-------------------------------------------------
// DNTH Internal data
app.get('/dnth_data', isAuthenticated, async (req, res) => {
    try {
        await connection.query('SELECT qr_box FROM tb_master_packing WHERE is_fac1_receive = 1', (err, get_qr_box) => {
            if (err) {
                console.log(err);
                return;
            } else {
                if (get_qr_box.length > 0) {
                    connection.query('SELECT partNumber, qty FROM tb_master_packing WHERE qr_box = ?',[get_qr_box[0].qr_box], (err, receive_datas) => {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log(receive_datas[0].partNumber, receive_datas[0].qty);
                            // Create DNTH Work order relative from part number
                            const lastDigitPartNumber = receive_datas[0].partNumber.slice(-4);
                            const dnthWorkOrderNumber = 'DNTHPD'.concat(lastDigitPartNumber);
                            console.log(dnthWorkOrderNumber);

                            connection.query('SELECT * FROM tb_dnth', (err, dnth_datas) => {
                                if (err) {
                                    return;
                                } else {
                                    console.log("DNTH Datas : ", dnth_datas);

                                    res.render('dnth_data', {dnth_datas: dnth_datas});
                                }
                            });
                        }
                    });
                } else {
                    connection.query('SELECT * FROM tb_dnth', (err, dnth_datas) => {
                        if (err) {
                            return;
                        } else {
                            console.log("DNTH Datas : ", dnth_datas);

                            res.render('dnth_data', {dnth_datas: dnth_datas});
                        }
                    });
                }
            }
        }); 
    }
    catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})
app.get('/dnth_data/reset_qr_prod', async (req, res) => {
    try {
        dnthCounter = 0;
        tttCounter = 0;
        ntsCounter = 0;

        await connection.query(`
            UPDATE tb_dnth SET qr_prod = NULL;
        `);
        await connection.query('UPDATE tb_dnth SET qr_prod = NULL', (err, results) => {
            if (err) {
                return;
            } else {
                console.log('Reset DNTH QR PROD successfully');
                res.redirect('/dnth_data');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})
app.get('/dnth_data/delete_dnth_data', async (req, res) => {
    try {
        dnthCounter = 0;
        tttCounter = 0;
        ntsCounter = 0;

        await connection.query(`
            DELETE FROM tb_dnth;
        `, (err, results) => {
            if (err) {
                return;
            } else {
                console.log('DELETE DNTH DATA successfully');
                res.redirect('/dnth_data');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500);
    }
})



// PC page
app.get('/pc_page', isAuthenticated, async (req, res) => {
    try {
        await addColumnIfNotExists(connection, 'tb_dnth', 'totalQtyIn', 'INT');

        const getDnthDatas = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_dnth', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const getDnthGroupDatas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT qr_pack_in, qr_kanban_in, SUM(qty_kanban_in) AS totalQty, partNumber, qr_prod
                FROM tb_dnth GROUP BY partNumber;
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const partNumberTotals = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT partNumber, SUM(qty_kanban_in) AS totalQty
                FROM tb_dnth 
                GROUP BY partNumber
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        for (const { partNumber, totalQty } of partNumberTotals) {
            await new Promise((resolve, reject) => {
                connection.query(`
                    UPDATE tb_dnth SET totalQtyIn = ? WHERE partNumber = ?
                `, [totalQty, partNumber], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Total qty for each part number updated successfully');
                        resolve();
                    }
                });
            });
        }

        res.render('pc_page', { dnth_group_datas: getDnthGroupDatas, dnth_datas: getDnthDatas });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Internal Server Error');
    }
});
// PC shop by part number
app.post('/pc_page/update_qr_prod_by_pn', async (req, res) => {
    try {
        // connection = await pool.getConnection();
        const formData = req.body;
        const length = formData.qr_pack_in.length;
        console.log(formData);

        // Create an array to store all the promises
        const updatePromises = [];

        // Iterate over each index
        for (let i = 0; i < length; i++) {
            const qrPackingList = formData.qr_pack_in[i];
            const partNumber = formData.partNumber[i];
            const qrProd = formData.qr_prod[i];
            
            // Create a promise for each update query and store it in the array
            const updatePromise = await new Promise((resolve, reject) => {
                connection.query(`
                    UPDATE tb_dnth 
                    SET qr_prod = '${qrProd}' 
                    WHERE qr_pack_in = '${qrPackingList}' AND partNumber = '${partNumber}'
                `, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('QR Prod updated successfully');
                        resolve(results);
                    }
                });
            });

            updatePromises.push(updatePromise);
        }
        // Redirect after all updates are completed
        res.redirect('/dnth_data');

    } catch (error) { // Fixing the error variable name here
        console.error('Error : ', error); // Correcting the variable name here
        res.status(500).send('Internal Server Error');
    }
})
// PC shop by qty
// Initialize the counters from localStorage or default to 

app.post('/pc_page/update_qr_prod_by_qty', async (req, res) => {
    try {
        const qr_pack_ins = req.body.qr_pack_in;
        const qr_kanban_ins = req.body.qr_kanban_in;
        const partNumbers = req.body.partNumber;
        const qr_prods = req.body.qr_prod;
        const selecteds = req.body.select;
        const dnth_submit = req.body.dnth_submit;

        console.log("DNTH SUBMIT BTN : ", dnth_submit);
        // Receive submit button for generate QR PD
        let uniqueCode = '';

        if (req.body.dnth_submit) {
            dnthCounter++;
            uniqueCode = 'DNTHPD' + dnthCounter.toString().padStart(4, '0');
            console.log("DNTH CODE: ", uniqueCode);
            // localStorage.setItem('dnthCounter', dnthCounter);
        } else if (req.body.ttt_submit) {
            tttCounter++;
            uniqueCode = 'TTTPD' + tttCounter.toString().padStart(4, '0');
            // localStorage.setItem('tttCounter', tttCounter);
        } else if (req.body.nts_submit) {
            ntsCounter++;
            uniqueCode = 'NTSPD' + ntsCounter.toString().padStart(4, '0');
            // localStorage.setItem('ntsCounter', ntsCounter);
        }

        console.log('Generate PD QR : ', uniqueCode);

        const updatePromises = [];
        for (let i = 0; i < selecteds.length; i++) {
            const rowIndex = selecteds[i];
            const qr_pack_in = qr_pack_ins[rowIndex];
            const qr_kanban_in = qr_kanban_ins[rowIndex];
            const partNumber = partNumbers[rowIndex];
            const qr_prod = qr_prods[rowIndex];

            console.log('qr_kanban_in_SELECTED : ', qr_kanban_in);

            const updatePromise = await new Promise((resolve, reject) => {
                connection.query(`
                    UPDATE tb_dnth SET qr_prod = ?
                    WHERE qr_pack_in = ? AND qr_kanban_in = ?;
                `, [uniqueCode, qr_pack_in, qr_kanban_in], (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log("UPDATE QR PROD BY QTY SUCCESSFULLY");
                        resolve(results);
                    }
                })
            });

            updatePromises.push(updatePromise);
        }

        console.log("Update QR_PROD by QTY successfully");

        res.redirect('/dnth_data');

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});

// ____________________________PD PAGE_______________________________________
app.get('/prod_page', isAuthenticated, async (req, res) => {
    try {
        const get_prod_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT qr_pack_in, qr_kanban_in, qr_prod, date_in_prod, time_in_prod, date_out_prod, time_out_prod, total_ok_prod, operator, qty_kanban_in
                FROM tb_dnth
            `, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    console.log(results);
                    resolve(results);
                }
            })
        });

        console.log(get_prod_datas.length);

        res.render('prod_page', {get_prod_datas: get_prod_datas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
// Production inputing endpoint
app.post('/prod_page/inputing', async (req, res) => {
    try {
        const date_in_prod = req.body.date_in_prod;
        const time_in_prod = req.body.time_in_prod;
        const qr_prod = req.body.qr_prod;
        // Update date/time in production 
        await connection.query(`
            UPDATE tb_dnth SET date_in_prod = ?, time_in_prod = ?
            WHERE qr_prod = ?
        `, [date_in_prod, time_in_prod, qr_prod], (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("Insert date/time in production completed");
                res.redirect('/prod_page');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/prod_page/reset_in_out', isAuthenticated, async (req, res) => {
    try {
        const reset_code = req.query.reset_code;
        const qr_pack_in = req.query.qr_pack_in;
        if (reset_code === '177765278830') {
            console.log("Correct reset code");
            console.log(qr_pack_in);

            tskKoCounter = 0;
            dnthKoCounter = 0;
            tttKoCounter = 0;
            ntsKoCounter = 0;

            await connection.query(`
                UPDATE tb_dnth SET date_in_prod = NULL, time_in_prod = NULL, date_out_prod = NULL, 
                time_out_prod = NULL, operator = NULL, total_ok_prod = NULL
            `, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.redirect('/prod_page');
                }
            });
        } else {
            console.log("Wrong reset code !");
            res.status(500).send('Wrong URL reset code');
        }

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/prod_page/prod_scan_output', isAuthenticated, async (req, res) => {
    try {
        res.render('prod_scan_output');

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})
app.post('/prod_page/prod_scan_output/prod_output', isAuthenticated, async (req, res, next) => {
    try {
        const errMsg = req.flash('error');
        const qr_prod = req.body.qr_prod;
        const date_out_prod = req.body.date_out_prod;
        const time_out_prod = req.body.time_out_prod;

        const dnth_datas = await new Promise((resolove, reject) => {
            connection.query(`
                    SELECT qr_kanban_in, qr_prod, qty_kanban_in, total_ok_prod, partNumber FROM tb_dnth WHERE qr_prod = ? AND date_in_prod IS NOT NULL
                `, [qr_prod], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolove(results);
                }
            })
        });
        const date_out_prods = await new Promise((resolove, reject) => {
            connection.query(`
                    SELECT date_out_prod FROM tb_dnth WHERE qr_prod = ?
                `, [qr_prod], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolove(results);
                }
            })
        });
        const allNull = date_out_prods.every((data) => data.date_out_prod === null);
        if (!allNull) {
            console.log("Already OUTPUT process");
            req.flash('error', "Already OUTPUT process");
            res.redirect('/prod_page');
        } else {
            console.log(dnth_datas.length);

            if (dnth_datas.length > 0) {
                await connection.query(`
                    UPDATE tb_dnth SET date_out_prod = ?, time_out_prod = ? WHERE qr_prod = ?
                `, [date_out_prod, time_out_prod, qr_prod], (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log("Update date/time output success");
                    }
                });
    
                res.render('prod_output', {errMsg, dnth_datas});
            } else {
                console.log('Not input process yet');
                res.redirect('/prod_page');
            }
        }
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/prod_page/prod_output/finished', async (req, res) => {
    try {
        const qr_prods = req.body.qr_prod;
        const qr_kanban_ins = req.body.qr_kanban_in;
        const totalOkProds = req.body.total_ok_prod;
        const operators = req.body.operator;

        console.log(totalOkProds, operators);
            
        const updatePromises = [];
        for (let data_count = 0; data_count < totalOkProds.length; data_count++) {
            const totalOkProd = totalOkProds[data_count];
            const operator = operators[data_count];
            const qr_prod = qr_prods[data_count];
            const qr_kanban_in = qr_kanban_ins[data_count];

            const updatePromise = await new Promise((resolve, reject) => {
                connection.query(
                  'UPDATE tb_dnth SET total_ok_prod = ?, operator = ? WHERE qr_prod = ? AND qr_kanban_in = ?',
                  [totalOkProd, operator, qr_prod, qr_kanban_in],
                  (err, results) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(results);
                    }
                  }
                );
            });

            updatePromises.push(updatePromise);
            console.log(totalOkProd);
            console.log('UPDATE OUTPUT DETAILS SUCCESSFULLY');        
        }

        res.redirect('/prod_page');

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})
// ____________________________PD IN PAGE________________________________________________
app.get('/prod_in_new', isAuthenticated, async (req, res) => {
    try {
        let response = req.query.response;

        const datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_dnth WHERE date_in_prod IS NOT NULL AND machine_line IS NOT NULL
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });

        console.log("Response : ", response);

        res.render('prod_in_new', {response, datas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
// Handle the POST request for updating the MySQL database
app.post("/prod_in_new/update", async (req, res) => {
    try {
        const qr_kanban_in = req.body.qr_kanban_in;
        const machine_line = parseInt(req.body.machine_line);
        const date_in_prod = req.body.date_in_prod;
        const time_in_prod = req.body.time_in_prod;
        let response = "";

        console.log("Machine Line : ", machine_line);
        console.log("Date In Prod : ", date_in_prod);
        console.log("Time In Prod : ", time_in_prod);

        const isKanbanIn = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_dnth WHERE qr_kanban_in = ? AND date_out_prod IS NULL AND date_in_prod IS NULL', [qr_kanban_in],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            })
        });
        console.log(isKanbanIn);

        if (!isKanbanIn) {
            console.log(`No ${qr_kanban_in} data`);
            response = "0";
            res.redirect(`/prod_in_new?response=${response}`);
        } else {
            await connection.query(`
                UPDATE tb_dnth SET machine_line = ?, date_in_prod = ?, time_in_prod = ?
                WHERE qr_kanban_in = ? AND date_out_prod IS NULL
            `, [machine_line, date_in_prod, time_in_prod, qr_kanban_in], (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    console.log("Update Production IN details successfully");
                    response = "1";
                    res.redirect(`/prod_in_new?response=${response}`)
                    }
                })
        }

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});


// ____________________________PD OUT PAGE________________________________________________
app.get('/prod_out_new', isAuthenticated, async (req, res) => {
    try {
        const qr_kanban_in = req.query.qr_kanban_in;
        let response = req.query.response;

        // Get all data tb_dnth
        const pd_dnth_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_dnth WHERE date_out_prod IS NOT NULL AND date_in_prod IS NOT NULL
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });

        console.log("Response : ", response);
        res.render('prod_out_new', {response, pd_dnth_datas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/prod_out_new/reset_in_out', isAuthenticated, async (req, res) => {
    try {
        await connection.query(`
            UPDATE tb_dnth SET machine_line = NULL, date_in_prod = NULL,
            time_in_prod = NULL, date_out_prod = NULL, time_out_prod = NULL,
            operator = NULL, total_ok_prod = NULL, total_ng_prod = NULL
            WHERE date_in_prod IS NOT NULL
        `, (err, results) => {
            if (err) {
                console.log(err);
                res.redirect('/prod_out_new');
            } else {
                console.log("Reset IN/OUT successfully");
                res.redirect('/prod_out_new');
            }
        });

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})
app.post('/prod_out_new/update', async (req, res) => {
    try {
        const operator = req.body.operator;
        const total_ok_prod = parseInt(req.body.total_ok_prod);
        const qr_kanban_in = req.body.qr_kanban_in;
        const date_out_prod = req.body.date_out_prod;
        const time_out_prod = req.body.time_out_prod;
        let response = "";
 
        console.log(operator, total_ok_prod, qr_kanban_in, date_out_prod, time_out_prod);
        // CHeck qr_kanban_in and already have date/time in prod correctly ?
        const isExist = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_dnth WHERE qr_kanban_in = ? AND date_in_prod IS NOT NULL AND date_out_prod IS NULL
            `, [qr_kanban_in], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });
        console.log(isExist);
        // Check Ok qty that more than qty_kanban_in ?
        const qtyKanbanIn = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_dnth WHERE qr_kanban_in = ? AND date_in_prod IS NOT NULL
            `, [qr_kanban_in], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        console.log(qtyKanbanIn);
        
        let qty_kanban_in = 0;
        // If can query the qty_kanban_in value
        if (qtyKanbanIn.length > 0 && isExist) {
            if (total_ok_prod > qtyKanbanIn[0].qty_kanban_in) {
                response = "0";
                console.log("OK qty invalid value");
                res.redirect(`/prod_out_new?response=${response}`);
            } else {
                // If all condition is CORRECTLY
                console.log("OK qty value is correctly");
                qty_kanban_in = parseInt(qtyKanbanIn[0].qty_kanban_in);
                response = "1";

                // Update data into table 
                await connection.query(`
                    UPDATE tb_dnth SET operator = ?, total_ok_prod = ?,
                    total_ng_prod = ?, date_out_prod = ?, time_out_prod = ? 
                    WHERE qr_kanban_in = ? AND date_in_prod IS NOT NULL
                `, [operator, total_ok_prod, qty_kanban_in - total_ok_prod, date_out_prod, time_out_prod, qr_kanban_in],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log("Update prod output data successfully");
                    }
                })

                res.redirect(`/prod_out_new?response=${response}`);
            }
        } else {
            console.log("Can't query qty_kanban_in value or already output");
            response = "0";
            res.redirect(`/prod_out_new?response=${response}`);
        }

        console.log(isExist);
        console.log("Response : ", response);

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})



// ____________________________CREATE KANBAN OUT PAGE_______________________________________
app.get('/create_kanban_out', isAuthenticated, async (req, res) => {
    try {
        const get_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT qr_kanban_in, qr_prod, qr_kanban_out, kanban_out_date, kanban_out_time, total_ok_prod FROM tb_dnth
                WHERE date_out_prod IS NOT NULL AND qr_kanban_out IS NOT NULL
            `, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    resolve(results);
                }
            })
        });
        console.log("Get datas : ", get_datas);
        
        res.render('create_kanban_out', {get_datas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
let tskKoCounter = 0;
let dnthKoCounter = 0;
let tttKoCounter = 0;
let ntsKoCounter = 0;
app.post('/create_kanban_out/submit', async (req, res) => {
    try {
        const selectedFactory = req.body.factory;
        const qr_prod = req.body.qr_prod;
        const kanban_out_date = req.body.kanban_out_date;
        const kanban_out_time = req.body.kanban_out_time;
        console.log(selectedFactory, qr_prod, kanban_out_date, kanban_out_time);

        const qr_kanban_in_results = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT qr_kanban_in, qr_prod FROM tb_dnth WHERE qr_prod = ?
                AND date_out_prod IS NOT NULL AND time_out_prod IS NOT NULL
            `, [qr_prod], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });

        console.log(qr_kanban_in_results.length);
            
        const updatePromises = [];
        if (qr_kanban_in_results.length > 0) {
            for (let i = 0; i < qr_kanban_in_results.length; i++) {
                console.log(qr_kanban_in_results[i].qr_kanban_in);

                let uniqueText = '';

                if (selectedFactory === 'TSK') {
                    tskKoCounter++;
                    uniqueText = `KO${selectedFactory}${tskKoCounter.toString().padStart(4, '0')}`;
                } else if (selectedFactory === 'DNTH') {
                    dnthKoCounter++;
                    uniqueText = `KO${selectedFactory}${dnthKoCounter.toString().padStart(4, '0')}`;
                } else if (selectedFactory === 'TTT') {
                    tttKoCounter++;
                    uniqueText = `KO${selectedFactory}${tttKoCounter.toString().padStart(4, '0')}`;
                } else if (selectedFactory === 'NTS') {
                    ntsKoCounter++;
                    uniqueText = `KO${selectedFactory}${ntsKoCounter.toString().padStart(4, '0')}`;
                }

                console.log(uniqueText);

                // Update each row
                const updatePromise = await new Promise((resolve, reject) => {
                    connection.query(`
                        UPDATE tb_dnth SET qr_kanban_out = ?, kanban_out_date = ?, kanban_out_time = ?
                        WHERE qr_prod = ? AND qr_kanban_in = ?
                    `, [uniqueText, kanban_out_date, kanban_out_time, qr_prod, qr_kanban_in_results[i].qr_kanban_in], (err, updateResult) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(updateResult);
                        }
                    });
                });
                updatePromises.push(updatePromise);
            }
            res.redirect('/create_kanban_out');
        } else {
            res.redirect('/prod_page');
        }
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})



//____________________________CREATE PACKING LIST PAGE NEW_______________________________________
app.get('/create_pl_new', isAuthenticated, async (req, res) => {
    try {
        const response = req.query.response;
        let dnth_pl = req.query.dnth_pl;

        // if (dnth_pl === undefined) {
        //     dnth_pl = '';
        // }

        console.log('Response : ', response);
        console.log('dnth_pl : ', dnth_pl);

        const shop_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT partNumber, SUM(total_ok_prod) AS total_ok, qty_kanban_in, COUNT(partNumber) as box_qty
                FROM tb_dnth
                WHERE date_out_prod IS NOT NULL AND dnth_pl IS NULL
                GROUP BY partNumber
                ORDER BY partNumber;
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("shop_datas:");
                    if (!results.length) {
                        results = "";
                        resolve(results);
                        // console.log(results);
                    } else {
                        resolve(results);
                        // console.log(results);
                    }
                }
            });
        });

        const all_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_dnth
                WHERE date_out_prod IS NOT NULL AND dnth_pl = ?
                ORDER BY date_out_prod, time_out_prod;
            `,[dnth_pl], (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("all_datas:");
                    if (!results.length) {
                        results = "";
                        resolve(results);
                        // console.log(results);
                    }
                    resolve(results);
                }
            });
        });

        const pl_histories = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT DISTINCT dnth_pl FROM tb_dnth
                WHERE date_out_prod IS NOT NULL AND dnth_pl IS NOT NULL
                ORDER BY date_out_pl, time_out_pl;
            `,[dnth_pl], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length) {
                        results = "";
                        resolve(results);
                        // console.log(results);
                    }
                    resolve(results);
                }
            });
        }); 

        let qrcode_path = `static/picture/qrcode${dnth_pl}.png`

        if (dnth_pl !== null && dnth_pl !== undefined && dnth_pl !== "") {
            qrcode.toFile(qrcode_path, dnth_pl, {
                errorCorrectionLevel: 'H', // Optional: Specify the error correction level (H: High, L: Low, M: Medium, Q: Quartile)
                type: 'png', // Optional: Specify the image type (png, jpeg, svg)
                quality: 0.92 // Optional: Specify the image quality (0.0 - 1.0)
              }, (err) => {
                if (err) throw err;
                console.log('QR code saved!');
              });
        }

        res.render('create_pl_new', {shop_datas, all_datas, qrcode_path, dnth_pl, pl_histories, response});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
let tskPlCounter = 0;
let dnthPlCounter = 0;
let tttPlCounter = 0;
let ntsPlCounter = 0;
app.post('/create_pl_new/update', async (req, res) => {
    try {

        const dnth_partNumbers = req.body.dnth_partNumber;
        const shop_boxs = req.body.shop_box;
        const shop_qtys = req.body.shop_qty;
        const dnth_submit = req.body.dnth_submit;
        const date_out_pl = req.body.date_out_pl;
        const time_out_pl = req.body.time_out_pl;

        let uniqueCode = '';
        let response = '';

        console.log("Shop box: ", shop_boxs);
        console.log("DNTH submit: ", !dnth_submit);
        console.log("Date out PL : ", date_out_pl);
        console.log("Time out PL : ", time_out_pl);

        // Generate PL code
        if (!dnth_submit) {
            dnthPlCounter++;
            uniqueCode = 'DNTHPL' + dnthPlCounter.toString().padStart(1, '0');
            console.log("DNTH CODE: ", uniqueCode);
            // console.log("DNTH PartNumber Length: ", shop_boxs.length);
            // localStorage.setItem('dnthCounter', dnthCounter);

            if (shop_boxs !== undefined) {
                console.log("DNTH PartNumber Length: ", shop_boxs.length);
                const updatePromises = [];
                for (let i = 0; i < dnth_partNumbers.length; i++) {
                    const rowIndex = i;
                    const dnth_partNumber = dnth_partNumbers[rowIndex];
                    const shop_box = parseInt(shop_boxs[rowIndex]);
                    const shop_qty = shop_qtys[rowIndex];

                    const updatePromise = await new Promise((resolve, reject) => {
                        connection.query(`
                            UPDATE tb_dnth SET dnth_pl = ?, date_out_pl = ?, time_out_pl = ?
                            WHERE qr_kanban_in IN (
                                    SELECT qr_kanban_in 
                                    FROM (
                                        SELECT qr_kanban_in
                                        FROM tb_dnth
                                        WHERE dnth_pl IS NULL AND partNumber = ?
                                        ORDER BY date_out_prod, time_out_prod
                                        LIMIT ?
                                    ) AS subquery
                                )
                        `, [uniqueCode, date_out_pl, time_out_pl, dnth_partNumber, shop_box], (err, results) => {
                            if (err) {
                                reject(err);
                                response = '0';
                            } else {
                                resolve(results);
                                console.log("Update DNTH PL successfully");
                                response = '1';
                                // console.log('shop_box length : ', shop_box.length)
                            }
                        })
                    });

                    updatePromises.push(updatePromise);
                    console.log("Shop QTY : ", shop_qty);
                }
            } else {
                // shop_boxs = "";
                response = "0";
                uniqueCode = '';
                res.redirect(`/create_pl_new?response=${response}&dnth_pl=${uniqueCode}`);
            }
        } else {
            dnthPlCounter = dnthPlCounter;
        }
        console.log("DNTH uniquecode Send : ", uniqueCode);
        res.redirect(`/create_pl_new?response=${response}&dnth_pl=${uniqueCode}`);

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/create_pl_new/show_pl', async (req, res) => {
    try {
        const dnth_pl_selected = req.body.dnth_pl_selected;

        console.log(dnth_pl_selected);

        res.redirect(`/create_pl_new?dnth_pl=${dnth_pl_selected}`);

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/create_pl_new/reset_pl', isAuthenticated, async (req, res) => {
    try {
        dnthPlCounter = 0;

        await connection.query(`
            UPDATE tb_dnth SET dnth_pl = NULL, date_out_pl = NULL, time_out_pl = NULL
        `, (err, results) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log("Reset successfully");
                res.redirect('/create_pl_new');
            }
        });
        
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})


// ____________________________CREATE PACKING LIST PAGE_______________________________________
app.get('/create_pl', isAuthenticated, async (req,res) => {
    try {
        const get_tskDatas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT qr_packingList, qr_box, partNumber, qty FROM tb_master_packing
            `, (err, results) => {
                if (err) {
                    reject(err);
                    console.log(err);
                    return;
                } else {
                    resolve(results);
                }
            })
        })

        console.log(get_tskDatas);

        res.render('create_pl', {get_tskDatas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/create_pl/update_qr_pl', async (req,res) => {
    try {
        const qr_boxes = req.body.qr_box;
        const qtys = req.body.qty;
        const partNumbers = req.body.partNumber;
        const selecteds = req.body.select;
        const dnth_submit = req.body.dnth_submit;

        console.log("DNTH SUBMIT BTN : ", dnth_submit);
        // Receive submit button for generate QR PD
        let uniqueCode = '';

        if (req.body.dnth_submit) {
            dnthPlCounter++;
            uniqueCode = 'DNTHPL' + dnthPlCounter.toString().padStart(1, '0');
            console.log("DNTH CODE: ", uniqueCode);
            // localStorage.setItem('dnthCounter', dnthCounter);
        } else if (req.body.ttt_submit) {
            tttPlCounter++;
            uniqueCode = 'TTTPL' + tttPlCounter.toString().padStart(1, '0');
            // localStorage.setItem('tttCounter', tttCounter);
        } else if (req.body.nts_submit) {
            ntsPlCounter++;
            uniqueCode = 'NTSPL' + ntsPlCounter.toString().padStart(1, '0');
            // localStorage.setItem('ntsCounter', ntsCounter);
        } else if (req.body.tsk_submit) {
            tskPlCounter++;
            uniqueCode = 'TSKPL' + tskPlCounter.toString().padStart(1, '0');
        }

        console.log('Generate QR Packing List : ', uniqueCode);
            
        const updatePromises = [];
        for (let i = 0; i < selecteds.length; i++) {
            const rowIndex = selecteds[i];
            const qr_box = qr_boxes[rowIndex];
            const qty = qtys[rowIndex];
            const partNumber = partNumbers[rowIndex];

            console.log('QR Box SELECTED : ', qr_box);

            const updatePromise = await new Promise((resolve, reject) => {
                connection.query(`
                    UPDATE tb_master_packing SET qr_packingList = ?
                    WHERE qr_box = ?
                `, [uniqueCode, qr_box], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        // console.log("UPDATE QR PL SUCCESSFULLY");
                        resolve(results);
                    }
                })
            });

            // console.log("UPDATE QR PL SUCCESSFULLY");
            updatePromises.push(updatePromise);
        }
        console.log("Update QR Packing List successfully");
        res.redirect('/admin_page/master_setting');
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/create_pl/delete_pl', async (req,res) => {
    tskPlCounter = 0;
    dnthPlCounter = 0;
    tttPlCounter = 0;
    ntsPlCounter = 0;
    try {
        await connection.query(`
            UPDATE tb_master_packing SET qr_packingList = NULL
        `, (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('Delete QR Packing List successfully');

                res.redirect('/admin_page/master_setting');
            }
        });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
})






// ______________________________________________TEST_____________________________________________
app.get('/test', (req, res) => {
    res.render('test');
});
app.post('/submit', (req, res) => {
    const selectedRows = req.body.select;
    const column1Values = req.body.column1;
    const column2Values = req.body.column2;
    // Retrieve values for other columns as needed

    // Process the selected rows and their values
    for (let i = 0; i < selectedRows.length; i++) {
        const rowIndex = selectedRows[i];
        const column1Value = column1Values[rowIndex];
        const column2Value = column2Values[rowIndex];
        // Process values for other columns as needed
        
        // Do something with the selected row and its values
        console.log(`Row ${rowIndex}: Column 1 - ${column1Value}, Column 2 - ${column2Value}`);
    }

    // Redirect or send response as needed
});




//_____________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________
async function checkDataExists(tableName, conditions) {
    try {
        const queryConditions = Object.entries(conditions).map(([colName, colValue]) => `${colName} = ?`).join(' AND ');
        const queryValues = Object.values(conditions);

        const isExist = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM ${tableName} WHERE ${colName} = ?
            `, [colValue], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });

        return isExist;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
// Function to check if a column exists in a table 
async function doesColumnExist(connection, tableName, columnName) {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT * FROM information_schema.columns
            WHERE table_name = ? AND column_name = ?
        `, [tableName, columnName], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.length > 0);
            }
        });
    });
}

// Function to add a column to a table if it does not exist
async function addColumnIfNotExists(connection, tableName, columnName, columnType) {
    const columnExists = await doesColumnExist(connection, tableName, columnName);

    if (!columnExists) {
        await new Promise((resolve, reject) => {
            connection.query(`
                ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Column '${columnName}' added to table '${tableName}'`);
                    resolve();
                }
            });
        });
    } else {
        console.log(`Column '${columnName}' already exists in table '${tableName}'`);
    }
}



function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  

app.get('/master_setting/pn_setting', isAuthenticated, async (req, res) => {
    try {

        const pn_datas = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM tb_partNumber;
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        })
        
        console.log(pn_datas.length);

        res.render('master_setting/set_pn', {pn_datas});

    } catch (error) {
        console.error('Error : ', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/master_setting/pn_setting/add', async (req, res) => {
    const tsk_pn = req.body.tsk_pn;
    const dnth_pn = req.body.dnth_pn;
    const ttt_pn = req.body.ttt_pn;
    const nts_pn = req.body.nts_pn;
    const sdm_pn = req.body.sdm_pn;

    console.log(tsk_pn, dnth_pn, ttt_pn, nts_pn, sdm_pn);

    await connection.query(`
        INSERT INTO tb_partNumber (tsk_pn, dnth_pn, ttt_pn, nts_pn, sdm_pn) 
        VALUES (?, ?, ?, ?, ?)
    `, [tsk_pn, dnth_pn, ttt_pn, nts_pn, sdm_pn], (err, results) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Insert success');
            res.redirect('/master_setting/pn_setting');
        }
    });
});
app.get('/master_setting/pn_setting/edit', isAuthenticated, async (req, res) => {
    const id = req.query.id;

    console.log("ID ", id);

    const datas = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM tb_partNumber WHERE id = ?',
        [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    
    res.render('master_setting/edit_pn', {datas});
});
app.post('/master_setting/pn_setting/editing', async (req, res) => {
    const id = req.body.id;
    const tsk_pn = req.body.tsk_pn;
    const dnth_pn = req.body.dnth_pn;
    const ttt_pn = req.body.ttt_pn;
    const nts_pn = req.body.nts_pn;
    const sdm_pn = req.body.sdm_pn;

    await connection.query(`
        UPDATE tb_partNumber SET tsk_pn = ?, dnth_pn = ?, ttt_pn = ?,
        nts_pn = ?, sdm_pn = ? WHERE id = ?
    `, [tsk_pn, dnth_pn, ttt_pn, nts_pn, sdm_pn, id], (err, results) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("UPdate Successfully");
            res.redirect('/master_setting/pn_setting');
        }
    })
});
app.get('/master_setting/pn_setting/deleting', isAuthenticated, async (req, res) => {
    const id = req.query.id;
    await connection.query(`
        DELETE FROM tb_partNumber WHERE id = ?
    `, [id], (err, results) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("Delete successfully");
            res.redirect('/master_setting/pn_setting');
        }
    });
})


// Admin page
app.get('/admin_page', isAuthenticated, async (req, res) => {
    try {
        // const connection = await pool.getConnection();

        // const [user_datas] = await connection.query('SELECT id, username, email, level FROM tb_user_e_supp');
        await connection.query('SELECT id, username, email, level FROM tb_user_e_supp', 
        (err, results) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.render('admin_page', {user_datas: results});
            }
        });
        // connection.release();

        // res.render('admin_page', {user_datas: user_datas});
    }
    catch (error) {
        console.error("Error : ", error);
        res.status(500);
        res.send("Error");
    }
});

// Edit page
app.get('/admin_page/edit', isAuthenticated, (req, res) => {
    try {
        const userId = req.query.id;
        const username = req.query.name;
        const email = req.query.email;
        console.log(username + " " + email);

        res.render('edit_user', { userId: userId, username: username, email: email });
    }
    catch (error) {
        console.error("Error : ", error);
    }
});
// Edit end point
app.post('/admin_page/editing', async (req, res) => {
    try {
        // const {username, password, email} 
        const connection = await pool.getConnection();

        const [user_datas] = await connection.query('SELECT id, username, email, level FROM tb_user_e_supp');
        connection.release();
    }
    catch (error) {

    }
})

// Register Page
app.get('/register', (req, res) => {
    res.render('register');
})
// Registing end point
app.post('/registing', async (req, res) => {
    const {username, password, email} = req.body;

    try {
        // const connection = await pool.getConnection();
        await connection.query(`
            INSERT INTO tb_user_e_supp (username, password, email) VALUES(?, ?, ?)
        `, [username, password, email]);

        // connection.release();
        
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('isAuthenticated'); // Clear the isAuthenticated cookie

    
    res.redirect('/');
});

