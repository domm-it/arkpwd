function check_db(){  
    var list_table = {};
    var str = "";
    /*=======================================================
     LISTA DELLE TABELLE
    =======================================================*/
    /*
    str = 'CREATE TABLE IF NOT EXISTS NOME_TABLE (';
    str += 'id INTEGER PRIMARY KEY AUTOINCREMENT,';    
    str += 'nome VARCHAR,';    
    str += 'text VARCHAR,';
    str += 'eliminato INTEGER DEFAULT 0';
    str += ')';
    list_table['NOME_TABLE'] = str;
    */

    str = 'CREATE TABLE IF NOT EXISTS log (';
    str += 'id_log INTEGER PRIMARY KEY AUTOINCREMENT,';    
    str += 'id_password INTEGER,';    
    str += 'action VARCHAR,';
    str += 'data_creazione DATETIME,';    
    str += 'eliminato INTEGER DEFAULT 0';
    str += ')';
    list_table['log'] = str;

    str = 'CREATE TABLE IF NOT EXISTS password (';
    str += 'id_password INTEGER PRIMARY KEY AUTOINCREMENT,';    
    str += 'nome VARCHAR,';
    str += 'url VARCHAR,';
    str += 'username VARCHAR,';
    str += 'password VARCHAR,';
    str += 'hash_pwd VARCHAR,';
    str += 'dettagli VARCHAR,';
    str += 'data_creazione DATETIME,';    
    str += 'data_modifica DATETIME,';    
    str += 'eliminato INTEGER DEFAULT 0';
    str += ')';
    list_table['password'] = str;


    /*=======================================================
     CREAZIONE DELLA TABELLA SE NON ESISTE
    =======================================================*/
    $.each(list_table, function(index, value){
        query(value);
    });

    /*=======================================================
     CARICAMENTO E CREAZIONE SETTING INIZIALI
    =======================================================*/
    default_setting();

    avviso("DB Aggiornato","success");
}

var connection = false;
function connect_db(){
    const Database = require('better-sqlite3');
    connection = new Database(config['DB_URL']);
    return connection;
}

function info_db(){
    if(connection){
        return connection;
    }else{
        return connect_db();
    }
}

function disconnect_db(){
    connection = false;
    db().close();
    return;
}

function query(q,type=""){
    //console.log(q);
    var db = info_db();
    var str = "";
    try {
        
        if(type=="multi"){
            const x = db.prepare(q);
            str = x.all();
        }else if(type=="single"){
            const x = db.prepare(q);
            str = x.get();
        }else{
            const x = db.prepare(q);
            str = x.run()['lastInsertRowid'];
        }

        return str;

    } catch (err) {
        console.log(err);
        return 0;
    }
}