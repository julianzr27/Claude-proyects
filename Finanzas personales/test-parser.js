// Ejercita el parser de Gmail con los textos reales que hay hoy en el correo de
// Julián. No copia el código: lo recorta del archivo y lo evalúa tal cual.
const fs=require("fs");
const src=fs.readFileSync(process.argv[2],"utf8");
const trozo=src.slice(src.indexOf("const RECV_SENDERS"),src.indexOf("function guessCat"));
if(!trozo.includes("parseAmountCOP")||!trozo.includes("medioPorTexto")){console.error("no recorte las funciones");process.exit(1);}

const state={tarjetas:[{id:"rappi",nombre:"Rappicard"},{id:"visa",nombre:"VISA Banco Occidente"}],
  inversiones:[{id:"anu",nombre:"Ahorro NU",tipo:"cuenta"},{id:"pnu",nombre:"Personal NU",tipo:"cuenta"},
    {id:"pib",nombre:"Pibank",tipo:"cuenta"},{id:"arap",nombre:"Ahorro  Rappi",tipo:"cuenta"}]};
const cuentasDisponibles=()=>state.inversiones;
const A=eval(trozo+"\n({parseAmountCOP,medioPorTexto,aNumCOP,NO_ES_GASTO})");

let fallas=0,n=0;
const ok=(cond,msg,extra)=>{n++;if(!cond){console.error("FALLA: "+msg+(extra!==undefined?"  -> "+JSON.stringify(extra):""));fallas++;}};
const eq=(a,b,msg)=>ok(a===b,msg,{esperado:b,obtenido:a});

// ---- separador de miles: el bug que dividia todo por mil ----
eq(A.aNumCOP("5.000"),5000,"5.000 son cinco mil");
eq(A.aNumCOP("262.200"),262200,"262.200 son doscientos sesenta y dos mil");
eq(A.aNumCOP("1.234.567"),1234567,"millones con dos puntos");
eq(A.aNumCOP("154.176,09"),154176.09,"miles con punto y decimal con coma");
eq(A.aNumCOP("107500.00"),107500,"punto decimal a la gringa (ePayco)");
eq(A.aNumCOP("500"),500,"sin separadores");

// ---- monto: el rotulo manda sobre el numero mas grande ----
eq(A.parseAmountCOP("Total $ 6.985 Tarifa del viaje $ 9.313 Promocion -$ 2.328 Pagos"),6985,"Uber: cobra el Total, no la tarifa");
eq(A.parseAmountCOP("Monto $154.176,09 Metodo de pago *8823 No. de autorizacion 608094 Comercio AIRBNB"),154176,"RappiCard Airbnb");
eq(A.parseAmountCOP("Monto $5.000 Metodo de pago *8823 No. de autorizacion 756214 Comercio Dollarcity"),5000,"RappiCard Dollarcity");
eq(A.parseAmountCOP("Monto $262.200 Metodo de pago *8823 Comercio SERVICENTRO CASIO"),262200,"RappiCard Servicentro");
eq(A.parseAmountCOP("Los siguientes son los datos de tu transaccion: Valor: $ 877.509,89 Empresa: Banco de Occidente"),877510,"PSE: lee el Valor rotulado");
eq(A.parseAmountCOP("transaccion Aceptada $107500.00 COP INVERSIONES EN RECREACION"),107500,"ePayco sin rotulo: cae al maximo");
eq(A.parseAmountCOP("Sin ninguna cifra aqui"),0,"sin monto devuelve cero");
eq(A.parseAmountCOP("Subtotal $ 1.000 y $ 50.000 de algo"),50000,"«Subtotal» no cuenta como rotulo");

// ---- lo que NO es un gasto ----
const no=t=>A.NO_ES_GASTO.test(t);
ok(no("Faltan fondos para pagar en UBER RIDES*DL | Tu compra por $6.195,00 se rechazo por falta de fondos"),"rechazo de Nu descartado");
ok(no("Llego el extracto de tu RappiCard! Pago minimo: $"),"extracto de RappiCard descartado");
ok(no("Privado Extracto Digital 2026-08-19"),"extracto del banco descartado");
ok(!no("RappiCard - Resumen de transaccion | Monto $5.000 Comercio Dollarcity"),"una compra real NO se descarta");
ok(!no("Tu viaje del sabado por la manana con Uber Total $ 6.985"),"un viaje real NO se descarta");

// ---- medio de pago segun el nombre que Julian le puso ----
eq(A.medioPorTexto("noreply@rappicard.co RappiCard - Resumen de transaccion"),"rappi","RappiCard -> tarjeta Rappi");
eq(A.medioPorTexto("serviciopse@achcolombia.com.co PSE Empresa: Banco de Occidente SA (ATH) PAGO TC Credencial Visa"),"visa","Banco de Occidente -> tarjeta VISA");
eq(A.medioPorTexto("noreply@uber.com Tu viaje del sabado"),"","Uber no nombra ninguna posicion: sin especificar");
eq(A.medioPorTexto("nu@nu.com.co Pagaste en Banco de Occidente con Cuenta Nu"),"visa","«banco» sola no basta, «occidente» si");
eq(A.medioPorTexto("mercadeo@somosplenti.com Compra oro"),"","Plenti no esta entre las cuentas de pago");

console.log(fallas?("\n"+fallas+" de "+n+" fallaron"):("parser ok - "+n+" comprobaciones"));
process.exit(fallas?1:0);
