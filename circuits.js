(function setupCircuits(){
'use strict';
const SX=490,SW=1050;
const C=['#ee4d53','#19985a','#2376e6','#e6a51b','#9759ca','#05a1a1','#ec6f41','#8e82dc','#b56b19','#4385b4','#5ba536'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const isSignal=p=>/^(D\d+|A\d+)$/.test(p);
const short=(m)=>m.replace('Potenciometro','Potenciómetro').replace('Aro metalico','Aro metálico').replace('Alambre recorrido','Alambre').replace('Buzzer PASIVO','Buzzer').replace('Pulsador ','Botón ').replace('Joystick analógico','Joystick').replace('Servo A (cabeceo)','Servo A').replace('Servo B (balanceo)','Servo B').replace('Fuente externa 5V','Fuente externa 5 V');
const signalName=(w)=>{const s=w.terminal.toLowerCase();return s.includes('trig')?'TRIG':s.includes('echo')?'ECHO':s.includes('vrx')?'VRx':s.includes('cursor')?'central':s.includes('anodo')?'220Ω → ánodo':s.includes('senial')||s.includes('señal')?'señal':s.includes('contacto')?'contacto':s.includes('positivo')?'+':s.includes('lado a')?'lado A':s.includes('terminal a')?'borne A':w.terminal};
const button=m=>m.startsWith('Pulsador');
function pinPos(pin){const p=window.SANLUCAS_PARTS&&window.SANLUCAS_PARTS.pins;const k=pin==='GND'?'GND20':pin==='5V'?'+5V':pin;if(p&&p[k]){const [x,y]=p[k];return {x:35+x*(410/212.184),y:300+y*(286/148.032),position:pin.startsWith('D')?'top':'bottom'}}if(/^D\d+$/.test(pin)){let n=+pin.slice(1);return {x:94+(13-n)*21,y:304,position:'top'}}let n=+pin.slice(1);return {x:302+n*21,y:633,position:'bottom'}}
function path(d,color,width=6){return `<path d="${d}" fill="none" stroke="#fff" stroke-width="${width+5}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`}
function text(x,y,t,size=16,clr='#243d55',weight=600,anchor='start'){return `<text x="${x}" y="${y}" fill="${clr}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(t)}</text>`}
function pill(x,y,t,bg,sz=15){const width=Math.max(42,8.5*t.length+16);return `<rect x="${x-width/2}" y="${y-19}" width="${width}" height="25" rx="7" fill="${bg}" stroke="#fff" stroke-width="2"/>${text(x,y-1,t,sz,'#fff',800,'middle')}`}
function board(){let s=`<rect x="40" y="277" width="400" height="367" rx="21" fill="url(#boardBlue)" stroke="#28618e" stroke-width="5" filter="url(#shadow)"/>`;
s+=`<rect x="7" y="339" width="64" height="90" rx="5" fill="url(#metal)" stroke="#657b90" stroke-width="5"/><rect x="40" y="490" width="48" height="55" rx="8" fill="#172331" stroke="#a6b2c3" stroke-width="5"/><rect x="175" y="447" width="183" height="72" rx="6" fill="#111e2a" stroke="#8599ad" stroke-width="3"/>`;
for(let i=0;i<17;i++)s+=`<path d="M${182+i*10} 445 v-9 M${182+i*10} 520 v8" stroke="#c2cfdc" stroke-width="3"/>`;
s+=`<circle cx="85" cy="332" r="12" fill="#e3ebcd" stroke="#768691" stroke-width="4"/><circle cx="400" cy="603" r="12" fill="#e3ebcd" stroke="#768691" stroke-width="4"/>`;
s+=`<rect x="79" y="298" width="313" height="32" rx="4" fill="#172b3d"/><rect x="144" y="613" width="103" height="28" rx="4" fill="#182d3c"/><rect x="290" y="613" width="124" height="28" rx="4" fill="#182d3c"/>`;
for(let n=13;n>=0;n--){const x=pinPos('D'+n).x;s+=`<rect x="${x-6}" y="305" width="12" height="17" rx="2" fill="#303d4b" stroke="#9fb0bc" stroke-width="1.5"/><circle cx="${x}" cy="312" r="3.4" fill="#111922"/>${text(x,343,''+n,14,'#fff',700,'middle')}`}
for(const [name,x] of [['5V',164],['GND',216],['A0',302],['A1',323],['A2',344],['A3',365],['A4',386]]){s+=`<rect x="${x-7}" y="614" width="14" height="18" rx="2" fill="#303b4a" stroke="#9dafbe"/><circle cx="${x}" cy="625" r="3.6" fill="#101923"/>${text(x,604,name,12,'#fff',800,'middle')}`}
s+=text(235,403,'ARDUINO',30,'#fff',800,'middle')+text(234,433,'UNO R3',21,'#d5f5fa',600,'middle')+text(145,579,'POWER',15,'#fff',700)+text(293,579,'ANALOG IN',14,'#fff',700)+text(93,357,'DIGITAL (D13 a D0)',13,'#e0f8fd',800);return s;}
function breadboard(used5){let s=`<rect x="${SX-12}" y="300" width="${SW+24}" height="363" rx="20" fill="#f9fafa" stroke="#b7c1c8" stroke-width="4" filter="url(#shadow)"/><rect x="${SX+6}" y="313" width="${SW-12}" height="27" rx="7" fill="#edf0f2"/><rect x="${SX+6}" y="505" width="${SW-12}" height="17" rx="4" fill="#cbd2d7"/><rect x="${SX+6}" y="616" width="${SW-12}" height="7" rx="3" fill="#c2cfdb"/>`;
if(used5)s+=`<rect x="${SX+6}" y="584" width="${SW-12}" height="7" rx="3" fill="#f9c7c7"/>`;
for(let x=SX+21;x<SX+SW-10;x+=19){for(const y of [352,372,392,412,432,459,479,501,536,555])s+=`<circle cx="${x}" cy="${y}" r="3.5" fill="#a6afb6" opacity=".62"/>`}
if(used5)s+=path(`M${SX+11} 584 H${SX+SW-11}`,'#e54a54',4)+text(SX+15,577,'+5 V',13,'#c83c48',800);
s+=path(`M${SX+11} 616 H${SX+SW-11}`,'#293b4b',4)+text(SX+15,610,'GND',13,'#293b4b',800);return s;}
function componentShape(name,x,kind){let s='';
if(kind==='led'){let color=name.includes('ROJO')?'#fa3847':name.includes('VERDE')?'#3fd85b':name.includes('AZUL')?'#378efc':'#ffcd35';
s+=`<path d="M${x-14} 476 V461 M${x+14} 502 V555" stroke="#9ca8b2" stroke-width="5"/>`;
s+=`<rect x="${x-23}" y="420" width="18" height="39" rx="5" fill="#e3b982" stroke="#916b47" stroke-width="2"/><path d="M${x-19} 434 l10 8 -10 8 10 8 -10 8" stroke="#bd8e51" stroke-width="3" fill="none"/>`;
s+=`<path d="M${x-14} 459 V476" stroke="#a1a9b4" stroke-width="5" fill="none"/>`;
s+=`<rect x="${x-19}" y="479" width="38" height="52" rx="16" fill="${color}" stroke="#8a969e" stroke-width="3"/><ellipse cx="${x-8}" cy="490" rx="5" ry="10" fill="#fff" opacity=".6"/>`;
s+=text(x-39,443,'220 Ω',11,'#926b35',800,'middle');
}else if(kind==='tactile'){s+=`<rect x="${x-38}" y="443" width="76" height="76" rx="11" fill="#2b313a" stroke="#111f2c" stroke-width="5"/><circle cx="${x}" cy="481" r="27" fill="#161b23" stroke="#6a7682" stroke-width="6"/><circle cx="${x-5}" cy="473" r="11" fill="#353d46"/>`;for(const q of [-1,1])for(const dy of [0,35])s+=`<rect x="${x+q*38-(q<0?13:0)}" y="${461+dy}" width="13" height="7" rx="2" fill="#a5afb8" stroke="#7a8592"/>`;
}else if(kind==='arcade'){let color=name.includes('ROJO')?'#f03d4c':name.includes('VERDE')?'#31c95c':name.includes('AZUL')?'#3889f6':'#ffcb26';s+=`<rect x="${x-40}" y="455" width="80" height="54" rx="7" fill="#3b424b" stroke="#1f2731" stroke-width="4"/><ellipse cx="${x}" cy="453" rx="39" ry="24" fill="${color}" stroke="#9ca6af" stroke-width="4"/><ellipse cx="${x-9}" cy="448" rx="13" ry="6" fill="#fff" opacity=".34"/>`;s+=`<rect x="${x-26}" y="507" width="13" height="21" rx="3" fill="#bbc3ca"/><rect x="${x+13}" y="507" width="13" height="21" rx="3" fill="#bbc3ca"/>`;
}else if(kind==='buzzer'){s+=`<circle cx="${x}" cy="473" r="45" fill="url(#black)" stroke="#57606a" stroke-width="5"/><circle cx="${x}" cy="467" r="13" fill="#11151c"/>${text(x+28,457,'+',18,'#fff',800,'middle')}`;
}else if(kind==='servo'){s+=`<rect x="${x-61}" y="441" width="122" height="80" rx="9" fill="url(#servoBlue)" stroke="#135081" stroke-width="4"/><rect x="${x-71}" y="465" width="142" height="17" rx="5" fill="#64ace2"/><circle cx="${x}" cy="444" r="25" fill="#e3e7ea" stroke="#a2b6c5" stroke-width="4"/><path d="M${x-6} 443 l46 -20" stroke="#f0f3f4" stroke-width="11" stroke-linecap="round"/>${text(x,501,'SERVO',18,'#fff',800,'middle')}`;
}else if(kind==='sonic'){s+=`<rect x="${x-79}" y="438" width="158" height="90" rx="7" fill="#1179bb" stroke="#16598b" stroke-width="4"/>`;for(const q of [-37,37])s+=`<circle cx="${x+q}" cy="476" r="34" fill="url(#metal)" stroke="#677d91" stroke-width="5"/><circle cx="${x+q}" cy="476" r="23" fill="#b4c4cf" stroke="#e3e8ea" stroke-width="3"/>`;s+=text(x,522,'HC-SR04',13,'#fff',700,'middle');
}else if(kind==='joystick'){s+=`<rect x="${x-62}" y="438" width="124" height="94" rx="9" fill="#087cbd" stroke="#206291" stroke-width="4"/><circle cx="${x}" cy="492" r="40" fill="#434b55" stroke="#a1b0bc" stroke-width="7"/><path d="M${x} 490 V449" stroke="#30343d" stroke-width="16" stroke-linecap="round"/><circle cx="${x}" cy="447" r="24" fill="url(#black)" stroke="#303944" stroke-width="4"/>`;
}else if(kind==='pot'){s+=`<rect x="${x-48}" y="446" width="96" height="82" rx="8" fill="#126ba8" stroke="#225d91" stroke-width="5"/><circle cx="${x}" cy="480" r="29" fill="url(#metal)" stroke="#697886" stroke-width="4"/><path d="M${x} 478 V458" stroke="#394857" stroke-width="8" stroke-linecap="round"/>`;
}else if(kind==='metal'){if(name.includes('Aro'))s+=`<circle cx="${x}" cy="473" r="41" fill="none" stroke="#aeb8bf" stroke-width="13"/><path d="M${x+38} 470 v68" stroke="#8899a6" stroke-width="8"/>`;else s+=`<path d="M${x-56} 516 Q${x-45} 438 ${x-11} 465 T${x+20} 477 T${x+57} 507" fill="none" stroke="#a6b1bb" stroke-width="11" stroke-linecap="round"/>`}return s;}
function moduleKind(m){if(m.startsWith('LED'))return 'led';if(button(m))return /(ROJO|VERDE|AZUL|AMARILLO)/.test(m)?'arcade':'tactile';if(m.includes('Buzzer'))return 'buzzer';if(m.includes('Servo'))return 'servo';if(m.includes('HC-SR04'))return 'sonic';if(m.includes('Joystick'))return 'joystick';if(m.includes('Potenciometro'))return 'pot';return 'metal'}
function relOffset(w,kind){const t=w.terminal.toLowerCase();if(kind==='led')return t.includes('anodo')?-14:14;if(kind==='tactile')return w.pin==='GND'?45:-45;if(kind==='arcade')return w.pin==='GND'?20:-20;if(kind==='buzzer')return w.pin==='GND'?22:-22;if(kind==='sonic')return t==='vcc'?-63:t==='trig'?-21:t==='echo'?21:63;if(kind==='joystick')return t.includes('vrx')?0:t.includes('sw')?49:t.includes('5v')?-24:-49;if(kind==='pot')return t.includes('cursor')?0:t.includes('extremo 1')?-27:27;if(kind==='servo')return t.includes('senal')||t.includes('senial')||t.includes('señal')?-30:t.includes('gnd')?30:0;return 0}
function renderArduino(){let raw=window.SANLUCAS_PARTS&&window.SANLUCAS_PARTS.uno;if(!raw)return board();return raw.replace(/<svg[^>]*>/,'<svg x="35" y="300" width="410" height="286" viewBox="0 0 212.184 148.032" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">')}
function draw(p){
const entries=p.wire||[];
const mods=[...new Set(entries.map(v=>v.module))].filter(m=>!m.startsWith('Fuente externa'));
if(p.id==='09_Simon_Dice')mods.sort((a,b)=>(a.includes('Buzzer')?0:a.startsWith('Pulsador')?1:2)-(b.includes('Buzzer')?0:b.startsWith('Pulsador')?1:2));
const signals=entries.filter(w=>isSignal(w.pin));
const used5=entries.some(w=>w.pin==='5V'), usedEXT=entries.some(w=>w.pin==='+5V_EXT');
const unit=(SW-50)/mods.length, position=m=>SX+27+(mods.indexOf(m)+.5)*unit;
let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120" role="img" aria-label="Circuito de ${esc(p.title)}: conexiones según tabla de pines."><defs><linearGradient id="boardBlue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0885bf"/><stop offset="1" stop-color="#08639c"/></linearGradient><linearGradient id="metal"><stop stop-color="#f9fafa"/><stop offset=".5" stop-color="#bdcbd5"/><stop offset="1" stop-color="#8595a5"/></linearGradient><linearGradient id="servoBlue"><stop stop-color="#4ba4d9"/><stop offset="1" stop-color="#156ba3"/></linearGradient><radialGradient id="black"><stop stop-color="#4a515d"/><stop offset="1" stop-color="#161c27"/></radialGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#23374a" flood-opacity=".22"/></filter></defs>`;
s+=`<rect width="1600" height="1120" fill="#fff"/><rect x="295" y="14" width="1010" height="64" rx="19" fill="#b1d7f6"/>${text(800,57,p.title+' · conexiones estilo Tinkercad',36,'#153455',800,'middle')}`;
s+=breadboard(used5)+renderArduino();
if(used5){let src=pinPos('5V');s+=path(`M${src.x} ${src.y} V695 H465 V584 H490`,'#e64c55',6);}
{let src=pinPos('GND');s+=path(`M${src.x} ${src.y} V714 H458 V616 H490`,'#374756',6);}
if(usedEXT){s+=`<rect x="490" y="666" width="330" height="72" rx="13" fill="#fff6e5" stroke="#dcb26a" stroke-width="3"/>${text(512,692,'FUENTE REGULADA EXTERNA 5 V',18,'#8a6021',800)}${text(512,715,'Servos: 2–3 A · GND común',15,'#5b6671',600)}`;
s+=path(`M740 738 V751 H1490 V640 H${SX+SW-11}`,'#dd8533',6);
s+=path('M534 738 V714 H458','#394958',6);
s+=path(`M${SX+11} 640 H${SX+SW-11}`,'#dd8533',4);
s+=text(504,655,'+5 V EXTERNO (aislado del +5 V de Arduino)',15,'#bb712c',700)}
const pinColors={};signals.forEach((w,i)=>{const m=w.module;pinColors[w.pin]=m.includes('ROJO')?'#e54b53':m.includes('VERDE')?'#179955':m.includes('AZUL')?'#2778e6':m.includes('AMARILLO')?'#dba413':m.includes('Buzzer')?'#8f49bd':C[i%C.length]});
const sorted=signals.slice().sort((a,b)=>{let va=a.pin[0]==='D'?+a.pin.slice(1):100+(+a.pin.slice(1)),vb=b.pin[0]==='D'?+b.pin.slice(1):100+(+b.pin.slice(1));return va-vb});
sorted.forEach((w,i)=>{const start=pinPos(w.pin),kind=moduleKind(w.module),dest=position(w.module)+relOffset(w,kind),col=pinColors[w.pin],lane=110+i*16;
if(start.position==='top'){s+=path(`M${start.x} ${start.y} V${lane} H${dest} V412`,col,5);s+=pill(start.x,296,w.pin,col,12)}else{s+=path(`M${start.x} ${start.y} V729 H23 V${lane} H${dest} V412`,col,5);s+=pill(start.x,start.y+7,w.pin,col,12)}
s+=`<circle cx="${dest}" cy="412" r="8" fill="${col}" stroke="#fff" stroke-width="3"/>`});
mods.forEach(m=>{const group=entries.filter(w=>w.module===m),kind=moduleKind(m),x=position(m);
for(const w of group){const px=x+relOffset(w,kind);if(w.pin==='5V')s+=path(`M${px} 538 V584`,'#ea4852',4);if(w.pin==='+5V_EXT')s+=path(`M${px} 538 V640`,'#d78a40',4);if(w.pin==='GND'||w.pin==='GND_EXT')s+=path(`M${px} 540 V616`,'#394855',4)}});
mods.forEach(m=>{const kind=moduleKind(m),x=position(m),wg=Math.max(86,unit-6),name=short(m);
s+=`<rect x="${x-wg/2}" y="350" width="${wg}" height="38" rx="9" fill="#fff" stroke="#b4c2cf" stroke-width="2"/>`;const ts=name.length>16?14:17;
if(name.length>13&&unit<170){let bits=name.split(' '),mid=Math.ceil(bits.length/2);s+=text(x,367,bits.slice(0,mid).join(' '),Math.min(15,ts),'#263e54',800,'middle')+text(x,382,bits.slice(mid).join(' '),Math.min(15,ts),'#263e54',800,'middle')}else s+=text(x,374,name.length>23?name.slice(0,21)+'…':name,ts,'#263e54',800,'middle');
s+=componentShape(m,x,kind);
for(const w of entries.filter(w=>w.module===m)){
const px=x+relOffset(w,kind),typ=isSignal(w.pin)?'signal':w.pin==='5V'||w.pin==='+5V_EXT'?'power':'gnd',color=typ==='signal'?pinColors[w.pin]:typ==='power'?(w.pin==='+5V_EXT'?'#d78334':'#d9434e'):'#344658';
if(typ==='signal')s+=path(`M${px} 415 V${kind==='tactile'?466:441}`,color,3);
if(typ==='power'||typ==='gnd'){s+=`<circle cx="${px}" cy="538" r="6.4" fill="${color}" stroke="#fff" stroke-width="2"/>`;s+=text(px,560,w.pin==='GND'||w.pin==='GND_EXT'?'−':w.pin==='+5V_EXT'?'+EXT':'+5V',kind==='led'?10:11,color,800,'middle')}
if(isSignal(w.pin))s+=text(px,400,signalName(w),11,'#233a50',800,'middle')
}});
const cards=[{x:20,w:390,title:'Componentes'},{x:425,w:735,title:'Conexiones (resumen)'},{x:1175,w:405,title:'Notas de armado'}];
for(const card of cards)s+=`<rect x="${card.x}" y="770" width="${card.w}" height="308" rx="16" fill="#fafcff" stroke="#a8c9e5" stroke-width="3"/><rect x="${card.x}" y="770" width="${card.w}" height="43" rx="15" fill="#b4daf7"/>${text(card.x+17,801,card.title,24,'#19456c',800)}`;
const items=['Arduino UNO','Protoboard',...mods.map(short),'Cables de conexión'];items.slice(0,10).forEach((t,i)=>{s+=`<circle cx="40" cy="${840+i*21}" r="4" fill="${C[i%C.length]}"/>${text(54,846+i*21,t.length>31?t.slice(0,29)+'…':t,17,'#293e4f',600)}`});
const half=Math.ceil(signals.length/2);
signals.forEach((w,i)=>{const col=i<half?0:1,row=i<half?i:i-half,x=445+col*356,y=843+row*31,cl=pinColors[w.pin],t=short(w.module)+' ('+signalName(w)+')';s+=pill(x+25,y,w.pin,cl,15)+text(x+62,y-2,'→ '+(t.length>33?t.slice(0,32)+'…':t),16,'#24394c',650)});
const notes=[];
if(used5)notes.push('5 V rojo desde Arduino a sus módulos.');
if(usedEXT)notes.push('Servos con fuente externa de 5 V.','No unir +5 V externo con 5 V Arduino.');
notes.push('GND común (cables oscuros).');
if(mods.some(m=>m.startsWith('LED')))notes.push('Cada LED lleva resistencia de 220 Ω.');
if(mods.some(m=>button(m)))notes.push('Botón entre pin y GND: INPUT_PULLUP.');
if(mods.some(m=>button(m)&&!/ROJO|VERDE|AZUL|AMARILLO/.test(m)))notes.push('Táctil de 4 patas: usar lados opuestos.');
if(mods.some(m=>m.includes('Joystick')))notes.push('Joystick: VRx a A0; VRy y SW libres.');
if(p.id==='09_Simon_Dice')notes.push('Simón usa pulsadores de 2 bornes.');
notes.push('La tabla inferior define los pines exactos.');
notes.forEach((t,i)=>{let words=t.split(' '),rows=[],line='';for(const word of words){if((line+' '+word).length>39){rows.push(line);line=word}else line=(line?line+' ':'')+word}if(line)rows.push(line);const y=840+i*37;s+=`<circle cx="1196" cy="${y-5}" r="4" fill="#186f9b"/>`;rows.forEach((t,j)=>s+=text(1210,y+19*j,t,16,'#344c60',600))});
s+=`<rect x="25" y="1087" width="1550" height="25" rx="8" fill="#edf6fc"/>${text(40,1105,'Vista didáctica de conexiones. Posición de agujeros orientativa: usar la tabla de terminales y el código de Arduino IDE.',15,'#526a7c',650)}`;
s+=text(42,1094,'Gráfico de Arduino UNO basado en Fritzing · CC BY-SA 3.0 · fritzing.org',12,'#647b8c',500);return s+'</svg>';
}
if(typeof P!=='undefined')P.forEach(p=>{p.image='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(draw(p))});
})();