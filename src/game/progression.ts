import type { SkinId } from "./engine";
export type QuestId = "runs" | "shards" | "score" | "survive" | "record" | "highscore";
export type AchievementId = "first_run" | "score_25" | "score_75" | "score_150" | "shard_hunter" | "survivor" | "ten_runs" | "record_100" | "level_20";
export interface DailyQuest { id: QuestId; title: string; description: string; target: number; reward: number; metric: QuestId; }
export const DAILY_QUESTS: DailyQuest[] = [
{id:"runs",title:"RECONNAISSANCE",description:"Terminer 2 tentatives.",target:2,reward:120,metric:"runs"},
{id:"shards",title:"MOISSON DE DONNÉES",description:"Collecter 5 éclats.",target:5,reward:180,metric:"shards"},
{id:"score",title:"FRANCHISSEMENT",description:"Atteindre 30 points sur une tentative.",target:30,reward:200,metric:"score"},
{id:"survive",title:"SURVIVANT",description:"Survivre 45 secondes sur une tentative.",target:45,reward:220,metric:"survive"},
{id:"record",title:"AU-DELÀ DES LIMITES",description:"Atteindre 60 points.",target:60,reward:300,metric:"record"},
{id:"highscore",title:"PIRATAGE MAJEUR",description:"Atteindre 100 points.",target:100,reward:450,metric:"highscore"}];
export interface Achievement { id:AchievementId; title:string; description:string; target:number; metric:"runs"|"best"|"shards"|"time"|"level"; skin:SkinId; }
export const ACHIEVEMENTS: Achievement[] = [
{id:"first_run",title:"PREMIER CONTACT",description:"Terminer une première tentative.",target:1,metric:"runs",skin:"warborn"},
{id:"score_25",title:"OPÉRATEUR",description:"Atteindre 25 points.",target:25,metric:"best",skin:"cobalt"},
{id:"score_75",title:"NETRUNNER",description:"Atteindre 75 points.",target:75,metric:"best",skin:"inferno"},
{id:"score_150",title:"FANTÔME",description:"Atteindre 150 points.",target:150,metric:"best",skin:"spectral"},
{id:"shard_hunter",title:"COLLECTEUR DE DONNÉES",description:"Collecter 100 éclats au total.",target:100,metric:"shards",skin:"headhunter"},
{id:"survivor",title:"INÉPUISABLE",description:"Survivre 180 secondes en une tentative.",target:180,metric:"time",skin:"immortal"},
{id:"ten_runs",title:"VIEILLE BRANCHE",description:"Terminer 50 tentatives.",target:50,metric:"runs",skin:"vanguard"},
{id:"record_100",title:"CENTURION",description:"Atteindre 250 points.",target:250,metric:"best",skin:"apex"},
{id:"level_20",title:"LÉGENDE DU SYSTÈME",description:"Atteindre le niveau 20.",target:20,metric:"level",skin:"overlord"}];
export interface Profile { xp:number; credits:number; runs:number; totalShards:number; best:number; longestRun:number; unlockedAchievements:AchievementId[]; unlockedSkins:SkinId[]; equippedSkin:SkinId; quest:{resetAt:number;active:QuestId[];progress:Record<QuestId,number>;claimed:QuestId[]}; }
const DAY=86400000;
const empty=():Record<QuestId,number>=>({runs:0,shards:0,score:0,survive:0,record:0,highscore:0});
function fresh(now=Date.now()){const pool=[...DAILY_QUESTS];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return{resetAt:now,active:pool.slice(0,3).map(q=>q.id),progress:empty(),claimed:[] as QuestId[]};}
export const levelForXp=(xp:number)=>Math.floor(Math.max(0,xp)/250)+1;
export const xpIntoLevel=(xp:number)=>Math.max(0,xp%250);
const LEVEL_SKINS:{id:SkinId;level:number}[]=[{id:"plasma",level:2},{id:"toxic",level:3},{id:"sunset",level:4},{id:"ice",level:5},{id:"void",level:6},{id:"cobalt",level:7},{id:"crimson",level:8},{id:"sandstorm",level:9},{id:"digital",level:10},{id:"carbon",level:11},{id:"royal",level:12},{id:"hazard",level:13},{id:"aurora",level:14},{id:"obsidian",level:15},{id:"titan",level:16},{id:"eclipse",level:17},{id:"inferno",level:18},{id:"overdrive",level:19},{id:"apex",level:20}];
export function loadProfile():Profile{const base:Profile={xp:0,credits:0,runs:0,totalShards:0,best:0,longestRun:0,unlockedAchievements:[],unlockedSkins:["classic"],equippedSkin:"classic",quest:fresh()};try{const s=JSON.parse(localStorage.getItem("spike-profile")||"null") as Partial<Profile>|null;if(!s)return base;const p:Profile={...base,...s,unlockedAchievements:Array.isArray(s.unlockedAchievements)?s.unlockedAchievements:[],unlockedSkins:Array.isArray(s.unlockedSkins)?s.unlockedSkins:["classic"],quest:s.quest&&typeof s.quest.resetAt==="number"&&Date.now()<s.quest.resetAt+DAY&&Array.isArray(s.quest.active)&&s.quest.active.length===3?{...fresh(s.quest.resetAt),...s.quest,progress:{...empty(),...s.quest.progress}}:fresh()};p.unlockedSkins=Array.from(new Set([...p.unlockedSkins,...LEVEL_SKINS.filter(x=>levelForXp(p.xp)>=x.level).map(x=>x.id)]));return p;}catch{return base;}}
export function saveProfile(p:Profile){try{localStorage.setItem("spike-profile",JSON.stringify(p));}catch{/* stockage indisponible */}}
export function ensureDaily(p:Profile,now=Date.now()):Profile{return now<p.quest.resetAt+DAY?p:{...p,quest:fresh(now)};}
export function remaining(p:Profile,now=Date.now()){return Math.max(0,p.quest.resetAt+DAY-now);}
export function recordRun(profile:Profile,r:{score:number;shards:number;time:number}){const p=ensureDaily(profile);const xpEarned=Math.max(20,Math.round(20+r.score*4+r.shards*8+r.time*1.5));const xp=p.xp+xpEarned,runs=p.runs+1,totalShards=p.totalShards+r.shards,best=Math.max(p.best,r.score),longestRun=Math.max(p.longestRun,r.time),level=levelForXp(xp);const values={runs,best,shards:totalShards,time:longestRun,level};const newly=ACHIEVEMENTS.filter(a=>!p.unlockedAchievements.includes(a.id)&&values[a.metric]>=a.target);const unlockedAchievements=[...p.unlockedAchievements,...newly.map(a=>a.id)];const quest={...p.quest,progress:{...p.quest.progress,runs:p.quest.progress.runs+1,shards:p.quest.progress.shards+r.shards,score:Math.max(p.quest.progress.score,r.score),survive:Math.max(p.quest.progress.survive,Math.floor(r.time)),record:Math.max(p.quest.progress.record,best),highscore:Math.max(p.quest.progress.highscore,r.score)}};return{profile:{...p,xp,runs,totalShards,best,longestRun,unlockedAchievements,unlockedSkins:Array.from(new Set([...p.unlockedSkins,...LEVEL_SKINS.filter(x=>level>=x.level).map(x=>x.id),...newly.map(a=>a.skin)])),quest},xpEarned,unlocked:newly.map(a=>a.id)};}
export function questComplete(p:Profile,id:QuestId){const q=DAILY_QUESTS.find(x=>x.id===id);return !!q&&p.quest.progress[id]>=q.target;}
export function claimQuest(p:Profile,id:QuestId):Profile{const q=DAILY_QUESTS.find(x=>x.id===id);if(!q||!p.quest.active.includes(id)||p.quest.claimed.includes(id)||!questComplete(p,id))return p;return{...p,credits:p.credits+q.reward,quest:{...p.quest,claimed:[...p.quest.claimed,id]}};}
