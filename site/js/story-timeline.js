// ===== Section 2 · How SFG began · v2.0 (structure + motion after setup.sa "Giga Projects") =====
(function(){
const SB={"warwick":"assets/images/story/warwick.webp","gaza":"assets/images/story/gaza.webp","promise":"assets/images/story/promise.webp","story":"assets/images/story/story.webp","aj":"assets/images/story/aj.webp"};
const AJ="https://www.youtube.com/watch?v=mTQXXAByvro";
const STEPS=[
 {n:"2020",t:"A Chevening scholar",b:"Ahmed Issa leaves Gaza for Warwick Business School on a fully funded Chevening scholarship.",card:"portrait",img:[["warwick","Ahmed Issa holding his certificate in the foyer of Warwick Business School"]]},
 {n:"2022",t:"Back to Gaza",b:"He returns home, believing education is how Palestinians will lead and rebuild.",card:"portrait",img:[["gaza","Ahmed in a light blue shirt, smiling at his office desk in Gaza"]]},
 {n:"04.2024",t:"A promise",b:"Ahmed evacuates Gaza with his wife and two sons, and makes a promise: to help Palestinian students win the fully funded scholarships that changed his life.",card:"portrait",img:[["promise","A notebook of handwritten plans on a café table, beside a blue-and-white teapot"]]},
 {n:"08.2024",t:"SFG begins",b:"It starts with one Instagram story: “Want to help Ghazawi students to get a scholarship?” Ahmed asks for volunteers to guide students through their applications, and Scholarships for Ghazza is born.",card:"story",img:[["story","Ahmed’s Instagram story asking for volunteer mentors, over a photo of a boy writing in a notebook outdoors"]]},
 {n:"03.2026",t:"On Al Jazeera",b:"SFG’s story reaches Al Jazeera’s The Stream, as more students from Gaza win their places.",card:"wide",credit:true,img:[["aj","Ahmed Issa speaking on Al Jazeera’s The Stream"]]}
];
const N=STEPS.length,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const credit=`<a class="sb_credit" href="${AJ}" target="_blank" rel="noopener">${(window.SFGT||(x=>x))("Watch on Al Jazeera’s The Stream")}<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path transform="rotate(-45 12 12)" fill="currentColor" d="M13.6709 4.66504C14.7728 6.86859 16.4363 8.53812 17.8438 9.66406C18.5448 10.2249 19.1754 10.6453 19.6279 10.9238C19.8538 11.0628 20.0347 11.1668 20.1572 11.2344C20.2184 11.2681 20.2657 11.2927 20.2959 11.3086C20.3106 11.3163 20.3214 11.3218 20.3281 11.3252C20.3313 11.3268 20.3337 11.3285 20.335 11.3291L21.6768 12L20.335 12.6699L20.3359 12.6709H20.335C20.3337 12.6715 20.3313 12.6732 20.3281 12.6748C20.3214 12.6782 20.3106 12.6837 20.2959 12.6914C20.2657 12.7073 20.2184 12.7319 20.1572 12.7656C20.0347 12.8332 19.8538 12.9372 19.6279 13.0762C19.1754 13.3547 18.5448 13.7751 17.8438 14.3359C16.4363 15.4619 14.7728 17.1314 13.6709 19.335L12.3291 18.665C13.5606 16.2021 15.3971 14.3714 16.9062 13.1641C17.0903 13.0168 17.2706 12.8793 17.4443 12.75H4V11.25H17.4443C17.2706 11.1207 17.0903 10.9832 16.9062 10.8359C15.3971 9.62861 13.5606 7.79788 12.3291 5.33496L13.6709 4.66504Z"/></svg></a>`;
const SIZE={warwick:[800,1066],gaza:[800,1067],promise:[800,1066],story:[900,1125],aj:[1280,720]};   // original sizes: photos are shown whole
const media=d=>{
  const imgs=d.img.map(([k,a])=>`<img src="${SB[k]}" alt="${a}" width="${SIZE[k][0]}" height="${SIZE[k][1]}" loading="lazy" decoding="async">`).join("");
  return `<figure class="tl_media is-${d.card}" data-reveal-media>${imgs}</figure>`;
};
const tl=document.querySelector("[data-tl]"),track=document.getElementById("tlTrack"),fill=document.querySelector("[data-sb-fill]");
const cur=document.querySelector("[data-sb-current]"),cap=document.querySelector("[data-sb-caption]"),prev=document.querySelector("[data-sb-prev]"),next=document.querySelector("[data-sb-next]");
const T=window.SFGT||(x=>x);STEPS.forEach(d=>{d.t=T(d.t);d.b=T(d.b);d.img.forEach(m=>{m[1]=T(m[1]);});});
const pad2=i=>String(i+1).padStart(2,"0"),caption=i=>i<N-1?`${T("Next")} · ${STEPS[i+1].t}`:T("The story continues below");
STEPS.forEach((d,i)=>{
  track.insertAdjacentHTML("beforeend",`<article class="tl_step" aria-label="${d.n}: ${d.t}"><div class="tl_text" data-split-group><p class="tl_year h1" aria-hidden="true" data-split>${d.n}</p><h3 class="tl_title title1" data-split>${d.t}</h3><p class="tl_body body1" data-split>${d.b}</p>${d.credit?credit:""}</div>${media(d)}</article>`);
});
const steps=[...track.children];
const narrow=matchMedia("(max-width:991px)");
const rtl=()=>document.documentElement.dir==="rtl";
let maxX=0,active=-1;
function setActive(i){
  if(i===active)return; active=i;
  steps.forEach((s,j)=>s.classList.toggle("is-active",j===i));
  cur.textContent=pad2(i);cap.textContent=caption(i);fill.style.width=((i+1)/N*100)+"%";
  prev.disabled=i===0;next.disabled=i===N-1;
}
// Desktop: the section is as tall as the track is wide, so scrolling down by X moves the track sideways by X
function layout(){
  if(narrow.matches){tl.style.height="";track.style.transform="";track.style.removeProperty("--tl-h");update();return;}
  track.style.transform="";
  const st=track.parentElement,cs=getComputedStyle(st),head=st.querySelector(".sb_head");
  const room=st.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-head.offsetHeight-parseFloat(cs.rowGap);
  track.style.setProperty("--tl-h",Math.max(240,Math.min(480,room))+"px");
  maxX=Math.max(0,track.scrollWidth-innerWidth);
  tl.style.height=(innerHeight+maxX)+"px";
  update();
}
function startOf(el){const t=track.getBoundingClientRect(),r=el.getBoundingClientRect();return rtl()?t.right-r.right:r.left-t.left;}
function update(){
  if(narrow.matches){
    const w=steps[0].offsetWidth+24;setActive(Math.max(0,Math.min(N-1,Math.round(Math.abs(track.scrollLeft)/w))));return;
  }
  const r=tl.getBoundingClientRect(),x=maxX?Math.min(maxX,Math.max(0,-r.top)):0;
  track.style.transform=`translate3d(${rtl()?x:-x}px,0,0)`;
  let idx=0;steps.forEach((s,i)=>{const b=s.firstElementChild.getBoundingClientRect(),edge=rtl()?innerWidth-b.right:b.left;if(edge<=innerWidth*.6)idx=i;});   // the step whose text has reached the middle
  setActive(idx);
}
function go(i){
  i=Math.max(0,Math.min(N-1,i));
  if(narrow.matches){track.scrollTo({left:(rtl()?-1:1)*(steps[i].offsetWidth+24)*i,behavior:reduce?"auto":"smooth"});return;}
  const pad=parseFloat(getComputedStyle(track).paddingInlineStart)||0;
  const x=Math.min(maxX,Math.max(0,startOf(steps[i])-pad));
  scrollTo({top:tl.getBoundingClientRect().top+scrollY+x,behavior:reduce?"auto":"smooth"});
}
prev.addEventListener("click",()=>go(active-1));next.addEventListener("click",()=>go(active+1));
addEventListener("scroll",update,{passive:true});track.addEventListener("scroll",update,{passive:true});
addEventListener("resize",layout);narrow.addEventListener("change",layout);
new MutationObserver(layout).observe(document.documentElement,{attributes:true,attributeFilter:["dir"]});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(layout);
layout();
})();
