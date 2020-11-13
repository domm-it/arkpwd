function default_setting(list_setting=""){
    if(!list_setting) list_setting = {};

    /*=======================================================
     LISTA DEI SETTAGGI DI DEFAULT (list_setting["NOME_VALORE"] = "VALORE";)
    =======================================================*/
    //list_setting["NOME_VALORE"] = "VALORE";
    list_setting["pagination_limit"] = 10;
    list_setting["pwd_tot_caratteri"] = 15;
    list_setting["pwd_tot_numeri"] = 3;
    list_setting["pwd_tot_speciali"] = 3;
    list_setting["password_warning"] = 180;
    list_setting["pwd_global"] = "";
    list_setting["shortcut"] = 1;

    /*=======================================================
     CREAZIONE DELLA TABELLA SE NON ESISTE
    =======================================================*/
    var str = 'CREATE TABLE IF NOT EXISTS setting (';
    str += 'id_setting INTEGER PRIMARY KEY AUTOINCREMENT,';
    str += 'name VARCHAR,';
    str += 'value VARCHAR';
    str += ')';
    query(str);
    
    /*=======================================================
     CREAZIONE DEI CAMBI SE NON ESISTONO
    =======================================================*/
    $.each(list_setting, function(name, value){        
        var exist = query("select id_setting from setting where name = '"+name+"' limit 1","single");
        if(!exist) query("insert into setting (name,value) values ('"+name+"', '"+value+"')");
    });
}

function existDB(){
    if(query("SELECT count(name) num FROM sqlite_master WHERE type='table' AND name='setting';","single").num == 0){
        return false;
    }else{
        return true;
    }
}

function setting(name,value=""){    
    if(!existDB()) check_db();

    value = escapeHtml(value);
    var val = query("select value from setting where name = '"+name+"'","single");
    if(value){
        if(val){
            query("update setting set value = '"+value+"' where name = '"+name+"' limit 1");
        }else{
            query("insert into setting (name,value) values ('"+name+"','"+value+"')");
        }
    }else{
        var value = query("select value from setting where name = '"+name+"'","single");
        if(value==undefined){
            return "";
        }else{
            return value.value;
        }
    }
}

function load_setting(scheda=""){
    /*=======================================================
     ELENCO DEI SETTING NEL DATABASE
    =======================================================*/
    var rows = query("select * from setting","multi");
    if(rows){
        rows.forEach(function (row) {
            if($("[name='"+row.name+"']").is(':checkbox')){
                row.value==1?$("[name='"+row.name+"']").prop('checked', true):$("[name='"+row.name+"']").prop('checked', false);
            }else{
                $("[name='"+row.name+"']").val(escapeHtml(row.value,1));
            }
        });
    }

    /*=======================================================
     APERTURA SCHEDA IN CUI SI E' SALVATO
    =======================================================*/
    if(scheda) $("#"+scheda+"-tab").trigger("click");
}

function save_setting(scheda_attuale=""){
    var form = $("#form_setting").serialize();
    form = decodeURIComponent(form);
    var query_new = "";
    var query_up = "";

    if(form.length){
        var info = form.split("&");
        for(var i=0; i<info.length; i++){
            var set = info[i].split("=");
            setting(set[0],set[1]);
        }
    }

    avviso("Impostazioni salvate","success");
    load_setting(scheda_attuale);
}