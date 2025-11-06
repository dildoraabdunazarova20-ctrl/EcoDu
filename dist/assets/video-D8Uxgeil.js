import{s as a,g,a as p}from"./supabase-client-DgRLKLdT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";let o=null,d=null,c=null,l=null,u=document.body,r=document.querySelector(".side-bar");document.querySelector("#menu-btn").onclick=()=>{r.classList.toggle("active"),u.classList.toggle("active")};document.querySelector("#close-btn").onclick=()=>{r.classList.remove("active"),u.classList.remove("active")};document.addEventListener("click",function(e){window.innerWidth<1200&&r.classList.contains("active")&&!r.contains(e.target)&&e.target!==document.querySelector("#menu-btn")&&(r.classList.remove("active"),u.classList.remove("active"))});r.onclick=e=>{e.stopPropagation()};window.onscroll=()=>{window.innerWidth<1200&&(r.classList.remove("active"),u.classList.remove("active"))};async function q(){const t=new URLSearchParams(window.location.search).get("slug");if(!t){window.location.href="index.html";return}o=await g(),o?(d=await p(o.id),E()):w(),await h(t),z(),_()}function E(){document.querySelectorAll(".profile .name").forEach(n=>{n.textContent=(d==null?void 0:d.name)||"User"}),document.querySelectorAll(".profile .image").forEach(n=>{d!=null&&d.avatar_url&&(n.src=d.avatar_url)}),document.querySelectorAll(".flex-btn").forEach(n=>{n.style.display="none"})}function w(){document.getElementById("comment-form-container").innerHTML=`
        <div class="login-prompt">
            <p>Please log in to post comments</p>
            <a href="login.html" class="btn">Log In</a>
        </div>
    `}async function h(e){const{data:t,error:i}=await a.from("videos").select("*").eq("slug",e).maybeSingle();if(i||!t){console.error("Error loading video:",i),alert("Video not found"),window.location.href="index.html";return}c=t,document.getElementById("video-iframe").src=t.video_url,document.getElementById("video-title").textContent=t.title,document.getElementById("video-description").textContent=t.description,document.getElementById("video-date").textContent=new Date(t.created_at).toLocaleDateString(),await y(),await m(),await L()}async function y(){const{data:e}=await a.from("video_likes").select("*").eq("video_id",c.id);if(document.getElementById("like-count").textContent=(e==null?void 0:e.length)||0,o&&(e==null?void 0:e.find(i=>i.user_id===o.id))){document.getElementById("like-btn").classList.add("liked");const i=document.querySelector("#like-btn i");i.classList.remove("far"),i.classList.add("fas")}}async function m(){const{data:e}=await a.from("comments").select(`
            *,
            profiles (name, avatar_url)
        `).eq("video_id",c.id).order("created_at",{ascending:!1}),t=document.getElementById("comments-list"),i=document.getElementById("comment-count");if(i.textContent=`(${(e==null?void 0:e.length)||0})`,!e||e.length===0){t.innerHTML='<p style="color: var(--light-color); font-size: 1.6rem;">No comments yet. Be the first to comment!</p>';return}t.innerHTML=e.map(n=>{var s,f;return`
        <div class="comment-item">
            <div class="comment-header">
                <img src="${((s=n.profiles)==null?void 0:s.avatar_url)||"https://via.placeholder.com/40"}" alt="Avatar" class="comment-avatar">
                <div class="comment-author">
                    <span class="comment-author-name">${((f=n.profiles)==null?void 0:f.name)||"Anonymous"}</span>
                    <span class="comment-date">${k(n.created_at)}</span>
                </div>
            </div>
            <p class="comment-content">${I(n.content)}</p>
            ${o&&n.user_id===o.id?`
                <div class="comment-actions">
                    <button onclick="deleteComment('${n.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `:""}
        </div>
    `}).join("")}async function L(){const{data:e}=await a.from("quizzes").select(`
            *,
            quiz_questions (
                *,
                quiz_options (*)
            )
        `).eq("video_id",c.id).maybeSingle();e?(l=e,document.getElementById("quiz-btn").style.display="flex"):document.getElementById("quiz-btn").style.display="none"}function z(){var t;document.getElementById("like-btn").addEventListener("click",async()=>{if(!o){alert("Please log in to like videos"),window.location.href="login.html";return}const i=document.getElementById("like-btn");if(i.classList.contains("liked")){await a.from("video_likes").delete().eq("user_id",o.id).eq("video_id",c.id),i.classList.remove("liked");const s=i.querySelector("i");s.classList.remove("fas"),s.classList.add("far")}else{await a.from("video_likes").insert([{user_id:o.id,video_id:c.id}]),i.classList.add("liked");const s=i.querySelector("i");s.classList.remove("far"),s.classList.add("fas")}await y()});const e=document.getElementById("post-comment-btn");e&&e.addEventListener("click",async()=>{const i=document.getElementById("comment-input"),n=i.value.trim();if(!n){alert("Please enter a comment");return}const{error:s}=await a.from("comments").insert([{user_id:o.id,video_id:c.id,content:n}]);if(s){alert("Failed to post comment");return}i.value="",await m()}),(t=document.getElementById("quiz-btn"))==null||t.addEventListener("click",()=>{if(!o){alert("Please log in to take quizzes"),window.location.href="login.html";return}v()}),document.getElementById("close-quiz-modal").addEventListener("click",()=>{document.getElementById("quiz-modal").style.display="none"}),document.getElementById("submit-quiz-btn").addEventListener("click",B),document.getElementById("retake-quiz-btn").addEventListener("click",b)}function _(){document.querySelectorAll(".navbar a[data-slug]").forEach(t=>{t.addEventListener("click",i=>{i.preventDefault();const n=t.getAttribute("data-slug");window.location.href=`video.html?slug=${n}`})})}function v(){if(!l)return;document.getElementById("quiz-title").textContent=l.title,document.getElementById("quiz-description").textContent=l.description||"";const e=document.getElementById("quiz-content");e.innerHTML=l.quiz_questions.sort((t,i)=>t.order_index-i.order_index).map((t,i)=>`
            <div class="quiz-question" data-question-id="${t.id}">
                <div class="question-text">${i+1}. ${t.question_text}</div>
                <div class="quiz-options">
                    ${t.quiz_options.sort((n,s)=>n.order_index-s.order_index).map(n=>`
                            <div class="quiz-option">
                                <input type="radio" id="option-${n.id}" name="question-${t.id}" value="${n.option_key}">
                                <label for="option-${n.id}">${n.option_key}. ${n.option_text}</label>
                            </div>
                        `).join("")}
                </div>
            </div>
        `).join(""),document.getElementById("quiz-results").style.display="none",document.getElementById("quiz-content").style.display="block",document.getElementById("submit-quiz-btn").style.display="block",document.getElementById("quiz-modal").style.display="flex"}async function B(){const e=l.quiz_questions;let t=0;e.forEach(i=>{const n=document.querySelector(`input[name="question-${i.id}"]:checked`);n&&n.value===i.correct_answer&&t++}),await a.from("quiz_attempts").insert([{user_id:o.id,quiz_id:l.id,score:t,total_questions:e.length}]),document.getElementById("quiz-score").textContent=t,document.getElementById("quiz-total").textContent=e.length,document.getElementById("quiz-content").style.display="none",document.getElementById("submit-quiz-btn").style.display="none",document.getElementById("quiz-results").style.display="block"}function b(){v()}window.deleteComment=async function(e){if(!confirm("Are you sure you want to delete this comment?"))return;const{error:t}=await a.from("comments").delete().eq("id",e);if(t){alert("Failed to delete comment");return}await m()};function k(e){const t=new Date(e),n=Math.floor((new Date-t)/1e3);return n<60?"Just now":n<3600?`${Math.floor(n/60)} minutes ago`:n<86400?`${Math.floor(n/3600)} hours ago`:n<604800?`${Math.floor(n/86400)} days ago`:t.toLocaleDateString()}function I(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}q();
