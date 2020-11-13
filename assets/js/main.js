/*=======================================================
 MENU
=======================================================*/
var list_menu = [
  //["TITOLO","VIEW"],
  ["Crea nuova password","edit_password"],
  ["Elenco delle password","elenco_password"],
  ["Elenco dei log","log"],
  ["Impostazioni","setting"],
];

/*=======================================================
 FUNZIONI DELL'APPLICAZIONE
=======================================================*/
function pwdCreate(text){
    return md5(md5(text)+"exe"+md5(text));
}

function pwdHash(pwd){
    return md5("arkpwd"+pwd);
}

function logout(){
    session_destroy();
    secure_access();
}

function login(){
    var password_o = $("[name='password']").val();
    var password = pwdCreate(password_o);
    
    if(!setting("pwd_global")){
          setting("pwd_global",password);
          global_pwd(password_o);
          secure_access();
          page("index","Dashboard");
          crealog("Password creata");
    }else{
      if(password != setting("pwd_global")){
          $("[name='password']").val("");
          avviso("Password errata");

      }else{
          global_pwd(password_o);
          secure_access();
          page("index","Dashboard");
          crealog("Accesso effettuato");
      }

    }
}

function sec(){
    return pwdCreate(global_pwd()) != setting("pwd_global")?false:true;
}

function global_pwd(pwd=""){
    if(pwd){
        SESSION("tok",md5(md5(rand(10000,99999))));
        SESSION("pwd",cripto(pwd,0,SESSION("tok")));
    }else{
        return cripto(SESSION("pwd"),1,SESSION("tok"));
    }
}

function secure_access(){
    
    //CONTROLLA SE ACCESSO EFFETTUATO
    if(!sec()){        
        $("header").hide();
        $("footer").hide();
        $("main").load("views/login.html");        
    }else{
        $("header").show();
        $("footer").show();
    }

}

function elenco_password(reset=false){
    if(reset && $("[name='riga_pwd']").data("ui-autocomplete")){
        $("[name='riga_pwd']").autocomplete("destroy");
        $("[name='riga_pwd']").removeData('ui-autocomplete');
    
    }else{
        var res = query("select id_password,nome from password where eliminato = 0","multi");
        var elenco_pwd = [];

        res.forEach(function(e){
            var val = {label:e.nome, value: e.id_password};

            elenco_pwd.push(val);
        });

        $("[name='riga_pwd']").autocomplete({
          source: elenco_pwd,
          select: function( event, ui ) {
              var id = ui.item.value;
              view_password(id);
          }
        });    
    }
}

function view_password(id){
    $("main").attr("data-pwd-id",id);
    page('view_password','Visualizza password');
}

function edit_password(id=""){

    if(id){
        $("main").attr("data-pwd-id",id);
        page('edit_password','Modifica password');
    }else{
        $("main").removeAttr("data-pwd-id");
        page('edit_password','Crea password');
    }

}

function countPwd(pwd){
    pwd = pwdHash(pwd);
    var count = query("select count(password) num from password where eliminato = 0 and hash_pwd='"+pwd+"'","single")['num'];
    return count;
}

function copy_field(name){
    var text = $("[name='"+name+"']").val();
    copyClip(text);
}

function crealog(text,id_password=0){
    query("insert into log (id_password,action,data_creazione) values ('"+id_password+"','"+text+"','"+now()+"')");
}

function generaPwd(num="",numeri_da_usare="",simboli_da_usare=""){

    if(!num) num = setting("pwd_tot_caratteri");
    if(!numeri_da_usare) numeri_da_usare = setting("pwd_tot_numeri");
    if(!simboli_da_usare) simboli_da_usare = setting("pwd_tot_speciali");

    var lett = "abcdefghijklmnopqrstuvwxyz".split('');
    var nums = "0123456789".split('');
    var symb = "@%+/!#^?:.(){}[]-_.".split('');
    var pwd = [];
    var arr = [];

    var tot_input = parseInt(numeri_da_usare)+parseInt(simboli_da_usare);
    if(parseInt(num) <= tot_input) num = tot_input+1;

    for(i=0;i<num;i++){
        var indice = Math.floor(Math.random()*(lett.length-1));
        var lettera = lett[indice];
        if(Math.floor(Math.random()*2)%2) lettera = lettera.toUpperCase();
        pwd[i] = lettera;
    }

    for(i=0;i<numeri_da_usare;i++){
        do{
            var indice_pwd = Math.floor(Math.random()*(pwd.length-1));
        }while(arr.indexOf(indice_pwd) != -1);
        arr.push(indice_pwd);
        var x = nums[Math.floor(Math.random()*(nums.length-1))];
        pwd[indice_pwd] = x;
    }

    for(i=0;i<simboli_da_usare;i++){
        do{
            var indice_pwd = Math.floor(Math.random()*(pwd.length-1));
        }while(arr.indexOf(indice_pwd) != -1);
        arr.push(indice_pwd);
        var x = symb[Math.floor(Math.random()*(symb.length-1))];
        pwd[indice_pwd] = x;
    }    

    pwd = pwd.join('');

    return pwd;
}

function pwdTimeCrack(pwd){
  var score = zxcvbn(pwd);
  return score.crack_times_display.offline_slow_hashing_1e4_per_second;
}

function pwdSecure(pwd,target=""){
  var score = zxcvbn(pwd);
  if(target){
    var score_perc = (100/4*score.score);
    var color = "#000";

    if(score.score == 1){
      color = "#c22222";
    
    }else if(score.score == 2){
      color = "#DDB100";

    }else if(score.score == 3){
      color = "#2FA81B";

    }else if(score.score == 4){
      color = "#0E77C8";

    }

    if(!$(target+" .progress").length){
      var str = '<div class="progress position-relative" style="background: #000; height:28px; border: 2px solid #000">';
      str += '<div class="progress-bar" role="progressbar"></div>';
      str += '<div style="font-size:16px; top:12px" class="progress-info text-light text-center w-100 position-absolute"></div>';
      str += '</div>';
      $(target).html(str);
    }

    var info = score.crack_times_display.offline_slow_hashing_1e4_per_second;

    $(target+" .progress-info").html(info);
    $(target+" .progress-bar").css("background",color);
    $(target+" .progress-bar").animate({
      "width" : score_perc+"%",
    },0);


  }else{
    
    return score.score;
  
  }
}

function legacyList(n="",r=""){
  var name = "data-"+cripto($("#title").html());
  if(n==="" && r===""){
    var info = $("main").attr(name);
    if(info !== undefined){
      info = info.split("|");
      pag = info[0]?info[0]:"";
      ser = info[1]?info[1]:"";
      return [pag,ser];
    }else{
      return ["",""];
    }
  }else{
    $("main").attr(name,n+"|"+r);
  }
}

function resetLegacyList(){
  var name = "data-"+cripto($("#title").html());
  $("main").attr(name,"");
}

function get_nome_password(id_password){
    var nome = query("select nome from password where id_password = "+id_password,"single");
    if(nome !== undefined) return nome.nome;
    return "";
}