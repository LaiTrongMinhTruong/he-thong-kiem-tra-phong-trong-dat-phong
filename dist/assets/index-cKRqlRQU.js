var gt=Object.defineProperty;var mt=(r,t,e)=>t in r?gt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var d=(r,t,e)=>mt(r,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();const q="hotel_staff_session",S={get(){try{const r=localStorage.getItem(q);return r?JSON.parse(r):null}catch{return null}},set(r){const t={...r,loginAt:Date.now()};localStorage.setItem(q,JSON.stringify(t))},clear(){localStorage.removeItem(q)},isLoggedIn(){const r=this.get();return!!(r&&r.id&&r.username)}};class g{static getContainer(){return this.container||(this.container=document.getElementById("toast-container"),this.container||(this.container=document.createElement("div"),this.container.id="toast-container",this.container.className="fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full",document.body.appendChild(this.container))),this.container}static show(t,e,n,o=4500){const s=this.getContainer(),a=document.createElement("div");a.className="pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border toast-enter transition-all duration-300 "+this.getColorClasses(t);const i=this.getIcon(t);a.innerHTML=`
      <div class="flex-shrink-0 mr-3 mt-0.5">${i}</div>
      <div class="flex-1 text-sm">
        ${n?`<h4 class="font-semibold mb-0.5">${n}</h4>`:""}
        <p class="leading-relaxed">${e}</p>
      </div>
      <button class="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-600 focus:outline-none" aria-label="Đóng">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;const c=a.querySelector("button");let l;const h=()=>{clearTimeout(l),a.classList.remove("toast-enter"),a.classList.add("toast-leave"),setTimeout(()=>{a.remove()},200)};c==null||c.addEventListener("click",h),l=window.setTimeout(h,o),s.appendChild(a)}static success(t,e="Thành công"){this.show("success",t,e)}static error(t,e="Có lỗi xảy ra"){this.show("error",t,e,6e3)}static warning(t,e="Cảnh báo"){this.show("warning",t,e,5e3)}static info(t,e="Thông báo"){this.show("info",t,e)}static getColorClasses(t){switch(t){case"success":return"bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10";case"error":return"bg-white border-rose-200 text-slate-800 shadow-rose-500/10";case"warning":return"bg-white border-amber-200 text-slate-800 shadow-amber-500/10";case"info":default:return"bg-white border-blue-200 text-slate-800 shadow-blue-500/10"}}static getIcon(t){switch(t){case"success":return'<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"error":return'<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';case"warning":return'<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';case"info":default:return'<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'}}}d(g,"container",null);class p extends Error{constructor(e){super(e.message);d(this,"code");d(this,"field");d(this,"details");this.name="AppError",this.code=e.code,this.field=e.field,this.details=e.details,Object.setPrototypeOf(this,p.prototype)}}const bt="http://localhost:3002";let Q=!0;const W=[];function xt(r){W.push(r)}function Y(r,t){Q!==r&&(Q=r,W.forEach(e=>e(r,t)))}async function b(r,t={}){const e=`${bt}${r.startsWith("/")?r:`/${r}`}`,n={"Content-Type":"application/json",Accept:"application/json"};try{const o=await fetch(e,{...t,headers:{...n,...t.headers}});if(!o.ok){const s=await o.text();let a;try{a=JSON.parse(s)}catch{a=null}throw new p({code:`HTTP_${o.status}`,message:(a==null?void 0:a.message)||`Yêu cầu máy chủ thất bại (HTTP ${o.status}: ${o.statusText}).`,details:a})}return Y(!0),await o.json()}catch(o){if(o instanceof p)throw o;const s="Không thể kết nối đến máy chủ CSDL (json-server tại http://localhost:3002). Vui lòng kiểm tra lệnh npm run server!";throw Y(!1,s),new p({code:"NETWORK_ERROR",message:s,details:o})}}class ft{async findByUsername(t){const e=await b(`/staff?username=${encodeURIComponent(t.trim())}`);return e.length>0?e[0]:null}async findAllStaff(){return b("/staff")}}function D(r){if(!r||typeof r!="string")return!1;const t=r.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!t)return!1;const e=parseInt(t[1],10),n=parseInt(t[2],10),o=parseInt(t[3],10);if(e<1900||e>2100||n<1||n>12)return!1;const s=[31,yt(e)?29:28,31,30,31,30,31,31,30,31,30,31];return!(o<1||o>s[n-1])}function yt(r){return r%4===0&&r%100!==0||r%400===0}function I(){const r=new Date,t=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),n=String(r.getDate()).padStart(2,"0");return`${t}-${e}-${n}`}function k(r,t){const e=r.split("-").map(Number),n=new Date(e[0],e[1]-1,e[2]);n.setDate(n.getDate()+t);const o=n.getFullYear(),s=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${o}-${s}-${a}`}function Z(r,t){if(!D(r)||!D(t))return 0;const[e,n,o]=r.split("-").map(Number),[s,a,i]=t.split("-").map(Number),c=Date.UTC(e,n-1,o),h=Date.UTC(s,a-1,i)-c;return Math.floor(h/(1e3*60*60*24))}function tt(r){const t=I();return Z(t,r)}function K(r,t,e,n){return r<n&&e<t}function y(r){if(!D(r))return r;const[t,e,n]=r.split("-");return`${n}/${e}/${t}`}class A{async findAllBookings(){return b("/bookings")}async findBookingById(t){try{return await b(`/bookings/${t}`)}catch(e){if(e.code==="HTTP_404")return null;throw e}}async findBookingByCode(t){const e=await b(`/bookings?bookingCode=${encodeURIComponent(t.trim())}`);return e.length>0?e[0]:null}async findBookingByCodeAndPhone(t,e){const n=t.trim().toUpperCase(),o=e.trim(),s=await b(`/bookings?bookingCode=${encodeURIComponent(n)}&customerPhone=${encodeURIComponent(o)}`);return s.length>0?s[0]:null}async findOverlapping(t,e,n,o){const s=await b(`/bookings?roomId=${encodeURIComponent(t)}`),a=["pending","confirmed","checked_in"];return s.filter(i=>o&&i.id===o||!a.includes(i.status)?!1:K(e,n,i.checkInDate,i.checkOutDate))}async findActiveBookingsByPhone(t,e,n){const o=t.trim(),s=await b(`/bookings?customerPhone=${encodeURIComponent(o)}`),a=["pending","confirmed"];return s.filter(i=>a.includes(i.status)?K(e,n,i.checkInDate,i.checkOutDate):!1)}async findActiveBookingsByRoomId(t){const e=await b(`/bookings?roomId=${encodeURIComponent(t)}`),n=["pending","confirmed","checked_in"];return e.filter(o=>n.includes(o.status))}async findConfirmedBookingsInNextDays(t,e=7){const n=I(),o=k(n,e);return(await b(`/bookings?roomId=${encodeURIComponent(t)}&status=confirmed`)).filter(a=>K(n,o,a.checkInDate,a.checkOutDate))}async createBooking(t){return b("/bookings",{method:"POST",body:JSON.stringify(t)})}async updateBooking(t,e){return b(`/bookings/${t}`,{method:"PATCH",body:JSON.stringify({...e,updatedAt:new Date().toISOString()})})}}class _{async findAllRooms(){return b("/rooms")}async findRoomById(t){try{return await b(`/rooms/${t}`)}catch(e){if(e.code==="HTTP_404")return null;throw e}}async findRoomByNumber(t){const e=await b(`/rooms?roomNumber=${encodeURIComponent(t)}`);return e.length>0?e[0]:null}async findAllRoomTypes(){return b("/roomTypes")}async findRoomTypeById(t){try{return await b(`/roomTypes/${t}`)}catch(e){if(e.code==="HTTP_404")return null;throw e}}async createRoom(t){return b("/rooms",{method:"POST",body:JSON.stringify(t)})}async updateRoom(t,e){return b(`/rooms/${t}`,{method:"PATCH",body:JSON.stringify(e)})}async deleteRoom(t){await b(`/rooms/${t}`,{method:"DELETE"})}async updateRoomStatus(t,e){return this.updateRoom(t,{status:e})}}class O{async addRoomHistory(t){return b("/roomStatusHistory",{method:"POST",body:JSON.stringify(t)})}async addBookingHistory(t){return b("/bookingHistory",{method:"POST",body:JSON.stringify(t)})}async findBookingHistory(t){return b(`/bookingHistory?bookingId=${encodeURIComponent(t)}&_sort=changedAt&_order=desc`)}async findRoomHistory(t){return b(`/roomStatusHistory?roomId=${encodeURIComponent(t)}&_sort=changedAt&_order=desc`)}}class U{async findAllPayments(){return b("/payments")}async findPaymentByBookingId(t){const e=await b(`/payments?bookingId=${encodeURIComponent(t)}`);return e.length>0?e[0]:null}async findPaymentById(t){try{return await b(`/payments/${t}`)}catch(e){if(e.code==="HTTP_404")return null;throw e}}async createPayment(t){return b("/payments",{method:"POST",body:JSON.stringify(t)})}async updatePayment(t,e){return b(`/payments/${t}`,{method:"PATCH",body:JSON.stringify(e)})}}const E={pending:"Chờ nhân viên xác nhận",confirmed:"Đã xác nhận đặt phòng",checked_in:"Đang lưu trú (Đã nhận phòng)",checked_out:"Đã trả phòng hoàn tất",cancelled:"Đã hủy phòng",no_show:"Khách không đến nhận phòng"},et={pending:"bg-amber-100 text-amber-800 border-amber-200",confirmed:"bg-blue-100 text-blue-800 border-blue-200",checked_in:"bg-emerald-100 text-emerald-800 border-emerald-200",checked_out:"bg-slate-100 text-slate-700 border-slate-200",cancelled:"bg-rose-100 text-rose-800 border-rose-200",no_show:"bg-purple-100 text-purple-800 border-purple-200"};class R{static canTransition(t,e){return t===e?!0:(this.allowedTransitions[t]||[]).includes(e)}static validateTransition(t,e){if(!this.canTransition(t,e))throw new p({code:"INVALID_BOOKING_STATUS_TRANSITION",message:`Chuyển trạng thái đơn đặt phòng không hợp lệ: Không thể chuyển từ "${E[t]}" sang "${E[e]}".`})}}d(R,"allowedTransitions",{pending:["confirmed","cancelled"],confirmed:["checked_in","cancelled","no_show"],checked_in:["checked_out"],checked_out:[],cancelled:[],no_show:[]});const N={available:"Sẵn sàng đón khách",occupied:"Đang có khách ở",cleaning:"Đang dọn dẹp vệ sinh",maintenance:"Đang bảo dưỡng sửa chữa"},vt={available:{bg:"bg-emerald-50",text:"text-emerald-700",badge:"bg-emerald-100 text-emerald-800"},occupied:{bg:"bg-blue-50",text:"text-blue-700",badge:"bg-blue-100 text-blue-800"},cleaning:{bg:"bg-amber-50",text:"text-amber-700",badge:"bg-amber-100 text-amber-800"},maintenance:{bg:"bg-rose-50",text:"text-rose-700",badge:"bg-rose-100 text-rose-800"}};class H{static canTransition(t,e){return t===e?!0:(this.allowedTransitions[t]||[]).includes(e)}static validateTransition(t,e){if(!this.canTransition(t,e))throw new p({code:"INVALID_ROOM_STATUS_TRANSITION",message:`Không thể chuyển trạng thái phòng từ "${N[t]}" sang "${N[e]}".`})}}d(H,"allowedTransitions",{available:["occupied","maintenance","cleaning"],occupied:["cleaning"],cleaning:["available","maintenance"],maintenance:["cleaning","available"]});async function wt(r){const e=new TextEncoder().encode(r),n=await window.crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(n)).map(a=>a.toString(16).padStart(2,"0")).join("")}class nt{constructor(t,e=5,n=60){d(this,"keyPrefix");d(this,"maxAttempts");d(this,"windowSeconds");this.keyPrefix=`ratelimit_${t}`,this.maxAttempts=e,this.windowSeconds=n}getRecord(){try{const t=sessionStorage.getItem(this.keyPrefix);return t?JSON.parse(t):{attempts:[]}}catch{return{attempts:[]}}}saveRecord(t){try{sessionStorage.setItem(this.keyPrefix,JSON.stringify(t))}catch{}}check(){const t=Date.now(),e=this.windowSeconds*1e3,o=this.getRecord().attempts.filter(s=>t-s<e);if(o.length>=this.maxAttempts){const s=o[0],a=Math.ceil((s+e-t)/1e3);return{allowed:!1,remainingAttempts:0,waitSeconds:Math.max(1,a)}}return{allowed:!0,remainingAttempts:this.maxAttempts-o.length,waitSeconds:0}}recordFailure(){const t=Date.now(),e=this.windowSeconds*1e3,o=this.getRecord().attempts.filter(s=>t-s<e);o.push(t),this.saveRecord({attempts:o})}reset(){try{sessionStorage.removeItem(this.keyPrefix)}catch{}}}class j{constructor(t=new ft,e=new A,n=new _,o=new O,s=new U){d(this,"staffRepo");d(this,"bookingRepo");d(this,"roomRepo");d(this,"historyRepo");d(this,"paymentRepo");d(this,"loginLimiter");this.staffRepo=t,this.bookingRepo=e,this.roomRepo=n,this.historyRepo=o,this.paymentRepo=s,this.loginLimiter=new nt("staff_login",5,60)}async login(t,e){const n=this.loginLimiter.check();if(!n.allowed)throw new p({code:"LOGIN_LOCKED",message:`Tài khoản tạm thời bị khóa do đăng nhập sai quá 5 lần. Vui lòng thử lại sau ${n.waitSeconds} giây.`});const o=t.trim();if(!o||!e)throw new p({code:"MISSING_CREDENTIALS",message:"Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."});const s=await this.staffRepo.findByUsername(o);if(!s||s.status!=="active"){this.loginLimiter.recordFailure();const c=this.loginLimiter.check().remainingAttempts;throw new p({code:"INVALID_CREDENTIALS",message:`Tên đăng nhập hoặc mật khẩu không chính xác. (Còn ${c} lần thử).`})}if(await wt(e)!==s.passwordHash){this.loginLimiter.recordFailure();const c=this.loginLimiter.check().remainingAttempts;throw new p({code:"INVALID_CREDENTIALS",message:`Tên đăng nhập hoặc mật khẩu không chính xác. (Còn ${c} lần thử).`})}this.loginLimiter.reset();const i={id:s.id,username:s.username,fullName:s.fullName,status:s.status};return S.set(i),S.get()}logout(){S.clear()}getCurrentStaff(){return S.get()}async confirmBooking(t,e){const n=await this.bookingRepo.findBookingById(t);if(!n)throw new p({code:"BOOKING_NOT_FOUND",message:"Không tìm thấy đơn đặt phòng."});R.validateTransition(n.status,"confirmed");const o=await this.bookingRepo.findOverlapping(n.roomId,n.checkInDate,n.checkOutDate,n.id);if(o.length>0)throw new p({code:"ROOM_CONFLICT",message:`Không thể xác nhận vì phòng này đã có đơn khác (${o[0].bookingCode}) được xác nhận trùng lịch (${n.checkInDate} -> ${n.checkOutDate})!`});const s=await this.paymentRepo.findPaymentByBookingId(t);let a;(!s||s.status==="unpaid")&&(a="Đơn này khách hàng chưa hoàn tất thanh toán (hoặc chọn thanh toán tiền mặt tại quầy).");const i=await this.bookingRepo.updateBooking(t,{status:"confirmed"});return await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:t,fromStatus:n.status,toStatus:"confirmed",changedBy:e,changedAt:new Date().toISOString(),note:"Nhân viên phê duyệt xác nhận đặt phòng."}),{booking:i,warning:a}}async checkIn(t,e){const n=await this.bookingRepo.findBookingById(t);if(!n)throw new p({code:"BOOKING_NOT_FOUND",message:"Không tìm thấy đơn đặt phòng."});R.validateTransition(n.status,"checked_in");const o=await this.bookingRepo.updateBooking(t,{status:"checked_in"}),s=await this.roomRepo.findRoomById(n.roomId);return s&&(H.validateTransition(s.status,"occupied"),await this.roomRepo.updateRoomStatus(s.id,"occupied"),await this.historyRepo.addRoomHistory({id:`RSH_${Date.now()}`,roomId:s.id,fromStatus:s.status,toStatus:"occupied",changedBy:e,changedAt:new Date().toISOString(),note:`Khách nhận phòng (Booking: ${n.bookingCode})`})),await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:t,fromStatus:n.status,toStatus:"checked_in",changedBy:e,changedAt:new Date().toISOString(),note:"Nhân viên hoàn tất thủ tục Check-in cho khách."}),o}async checkOut(t,e){const n=await this.bookingRepo.findBookingById(t);if(!n)throw new p({code:"BOOKING_NOT_FOUND",message:"Không tìm thấy đơn đặt phòng."});R.validateTransition(n.status,"checked_out");const o=await this.bookingRepo.updateBooking(t,{status:"checked_out"}),s=await this.roomRepo.findRoomById(n.roomId);return s&&(H.validateTransition(s.status,"cleaning"),await this.roomRepo.updateRoomStatus(s.id,"cleaning"),await this.historyRepo.addRoomHistory({id:`RSH_${Date.now()}`,roomId:s.id,fromStatus:s.status,toStatus:"cleaning",changedBy:e,changedAt:new Date().toISOString(),note:`Khách trả phòng (Booking: ${n.bookingCode}). Chuyển dọn vệ sinh.`})),await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:t,fromStatus:n.status,toStatus:"checked_out",changedBy:e,changedAt:new Date().toISOString(),note:"Nhân viên hoàn tất thủ tục Check-out."}),o}async markNoShow(t,e){const n=await this.bookingRepo.findBookingById(t);if(!n)throw new p({code:"BOOKING_NOT_FOUND",message:"Không tìm thấy đơn đặt phòng."});R.validateTransition(n.status,"no_show");const o=await this.bookingRepo.updateBooking(t,{status:"no_show"});return await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:t,fromStatus:n.status,toStatus:"no_show",changedBy:e,changedAt:new Date().toISOString(),note:"Nhân viên đánh dấu khách không đến nhận phòng (No-show)."}),o}async cancelBookingByStaff(t,e,n){const o=await this.bookingRepo.findBookingById(t);if(!o)throw new p({code:"BOOKING_NOT_FOUND",message:"Không tìm thấy đơn đặt phòng."});R.validateTransition(o.status,"cancelled");const s=await this.bookingRepo.updateBooking(t,{status:"cancelled",note:`Nhân viên hủy: ${n}`});return await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:t,fromStatus:o.status,toStatus:"cancelled",changedBy:e,changedAt:new Date().toISOString(),note:`Nhân viên hủy đơn đặt phòng. Lý do: ${n}`}),s}async getAllBookingsWithDetails(t){const[e,n,o]=await Promise.all([this.bookingRepo.findAllBookings(),this.roomRepo.findAllRooms(),this.paymentRepo.findAllPayments()]),s=new Map;n.forEach(c=>s.set(c.id,c.roomNumber));const a=new Map;o.forEach(c=>a.set(c.bookingId,c));let i=e;return t&&(i=i.filter(c=>c.status===t)),i.sort((c,l)=>new Date(l.createdAt).getTime()-new Date(c.createdAt).getTime()),i.map(c=>{const l=a.get(c.id);return{booking:c,roomNumber:s.get(c.roomId)||"N/A",payment:l?{status:l.status,amount:l.amount,method:l.method,type:l.type}:null}})}async getDashboardStats(){const[t,e]=await Promise.all([this.roomRepo.findAllRooms(),this.bookingRepo.findAllBookings()]);return{totalRooms:t.length,availableRooms:t.filter(n=>n.status==="available").length,occupiedRooms:t.filter(n=>n.status==="occupied").length,cleaningRooms:t.filter(n=>n.status==="cleaning").length,maintenanceRooms:t.filter(n=>n.status==="maintenance").length,pendingBookings:e.filter(n=>n.status==="pending").length,todayCheckIns:e.filter(n=>n.status==="confirmed").length}}}class z{static render(){const t=document.getElementById("app-header");if(!t)return;const e=window.location.hash||"#/",n=S.isLoggedIn(),o=S.get();t.innerHTML=`
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <a href="#/" class="flex items-center gap-2.5 text-blue-600 hover:text-blue-700 transition-all font-bold text-lg">
              <span class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </span>
              <span class="text-slate-900 font-extrabold tracking-tight">LOTUS HOTEL</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <a href="#/" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${e==="#/"||e==="#/search"?"bg-blue-50 text-blue-700":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}">
              Tìm phòng
            </a>
            <a href="#/lookup" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${e==="#/lookup"?"bg-blue-50 text-blue-700":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}">
              Tra cứu & Hủy phòng
            </a>

            ${n?`
              <div class="h-4 w-px bg-slate-200 mx-2"></div>
              <a href="#/staff/dashboard" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${e==="#/staff/dashboard"?"bg-indigo-50 text-indigo-700":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}">
                Tổng quan
              </a>
              <a href="#/staff/rooms" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${e==="#/staff/rooms"?"bg-indigo-50 text-indigo-700":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}">
                Quản lý phòng
              </a>
              <a href="#/staff/bookings" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${e==="#/staff/bookings"?"bg-indigo-50 text-indigo-700":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}">
                Duyệt đặt phòng
              </a>
            `:""}
          </nav>

          <!-- User / Staff Actions -->
          <div class="flex items-center gap-3">
            ${n&&o?`
              <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>${o.fullName}</span>
              </div>
              <button id="logout-btn" class="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-all">
                Đăng xuất
              </button>
            `:`
              <a href="#/staff/login" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all border border-slate-200">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Khu vực nhân viên
              </a>
            `}
          </div>
        </div>
      </div>
    `;const s=t.querySelector("#logout-btn");s==null||s.addEventListener("click",()=>{this.staffCtrl.logout(),g.info("Đã đăng xuất khỏi hệ thống nhân viên."),this.render(),window.location.hash="#/"})}}d(z,"staffCtrl",new j);function F(r,t){const e={},n=I(),o=k(n,365),s=(r||"").trim(),a=(t||"").trim();if(s||(e.checkInDate="Vui lòng chọn ngày nhận phòng."),a||(e.checkOutDate="Vui lòng chọn ngày trả phòng."),e.checkInDate||e.checkOutDate)return{isValid:!1,nights:0,errors:e};if(D(s)||(e.checkInDate="Ngày nhận phòng không hợp lệ hoặc không tồn tại trong lịch."),D(a)||(e.checkOutDate="Ngày trả phòng không hợp lệ hoặc không tồn tại trong lịch."),e.checkInDate||e.checkOutDate)return{isValid:!1,nights:0,errors:e};if(s<n&&(e.checkInDate=`Ngày nhận phòng không được ở quá khứ (tối thiểu là hôm nay: ${n}).`),s>o&&(e.checkInDate=`Không thể đặt phòng trước quá 365 ngày (tối đa đến ngày ${o}).`),a<=s&&(e.checkOutDate="Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm."),e.checkInDate||e.checkOutDate)return{isValid:!1,nights:0,errors:e};const i=Z(s,a);return i<=0?e.checkOutDate="Khoảng thời gian lưu trú không hợp lệ.":i>30&&(e.checkOutDate="Thời gian lưu trú tối đa cho một lần đặt là 30 đêm."),{isValid:Object.keys(e).length===0,nights:e.checkOutDate?0:i,errors:e}}function st(r){const t={},e=F(r.checkInDate,r.checkOutDate);e.isValid||(e.errors.checkInDate&&(t.checkInDate=e.errors.checkInDate),e.errors.checkOutDate&&(t.checkOutDate=e.errors.checkOutDate));let n;if(r.guests!==void 0&&r.guests!==""){const a=String(r.guests).trim();/^\d+$/.test(a)?(n=parseInt(a,10),n<1&&(t.guests="Số khách tối thiểu là 1.")):t.guests="Số khách phải là số nguyên dương."}let o,s;if(r.minPrice!==void 0&&r.minPrice!==""){const a=String(r.minPrice).trim();/^\d+$/.test(a)?o=parseInt(a,10):t.minPrice="Giá tối thiểu phải là số nguyên không âm."}if(r.maxPrice!==void 0&&r.maxPrice!==""){const a=String(r.maxPrice).trim();/^\d+$/.test(a)?s=parseInt(a,10):t.maxPrice="Giá tối đa phải là số nguyên không âm."}return o!==void 0&&s!==void 0&&o>s&&(t.priceRange="Giá tối thiểu không được lớn hơn giá tối đa."),{isValid:Object.keys(t).length===0,dateValidation:e,errors:t,sanitized:{checkInDate:r.checkInDate.trim(),checkOutDate:r.checkOutDate.trim(),roomTypeId:r.roomTypeId?r.roomTypeId.trim():void 0,guests:n,minPrice:o,maxPrice:s}}}function J(r){const t={},e=String(r.roomNumber||"").trim();e?e.length<1||e.length>10?t.roomNumber="Số phòng phải từ 1 đến 10 ký tự.":/^[a-zA-Z0-9_-]+$/.test(e)||(t.roomNumber="Số phòng chỉ được chứa chữ cái, số và dấu gạch nối."):t.roomNumber="Vui lòng nhập số phòng (ví dụ: 101, 202).";const n=String(r.floor??"").trim();let o=1;n?/^\d+$/.test(n)?(o=parseInt(n,10),(o<1||o>100)&&(t.floor="Số tầng phải từ 1 đến 100.")):t.floor="Số tầng phải là số nguyên dương.":t.floor="Vui lòng nhập số tầng.";const s=String(r.roomTypeId||"").trim();s||(t.roomTypeId="Vui lòng chọn loại phòng.");const a=String(r.status||"available").trim();["available","occupied","cleaning","maintenance"].includes(a)||(t.status="Trạng thái phòng không hợp lệ.");const c=String(r.note||"").trim();return{isValid:Object.keys(t).length===0,errors:t,sanitized:{roomNumber:e,floor:o,roomTypeId:s,status:a,note:c}}}function x(r){const t=Math.round(r||0);return new Intl.NumberFormat("vi-VN").format(t)+" đ"}function kt(r){return Math.round(r*.08)}function L(r,t,e=0){const n=Math.max(1,Math.floor(r)),o=Math.max(0,Math.floor(t)),s=Math.max(0,Math.floor(e)),a=n*o,i=a+s,c=kt(i),l=i+c;return{subtotal:a,extraFee:s,vat:c,total:l}}function V(r){return Math.round(r*.3)}function St(r,t){const e=Math.max(0,Math.floor(r));return t>=7?{refundPercent:100,refundAmount:e,description:"Hủy trước ngày nhận phòng từ 7 ngày trở lên: Hoàn 100% số tiền đã thanh toán."}:t>=3?{refundPercent:50,refundAmount:Math.round(e*.5),description:"Hủy trước ngày nhận phòng từ 3 đến 6 ngày: Hoàn 50% số tiền đã thanh toán."}:{refundPercent:0,refundAmount:0,description:"Hủy sát ngày nhận phòng (< 3 ngày): Không áp dụng hoàn tiền (0%)."}}class G{constructor(t=new _,e=new A,n=new O){d(this,"roomRepo");d(this,"bookingRepo");d(this,"historyRepo");this.roomRepo=t,this.bookingRepo=e,this.historyRepo=n}async searchAvailableRooms(t){const e=st(t);if(!e.isValid){const f=Object.keys(e.errors)[0];throw new p({code:"INVALID_SEARCH_FILTERS",message:e.errors[f],field:f})}const{checkInDate:n,checkOutDate:o,roomTypeId:s,guests:a,minPrice:i,maxPrice:c}=e.sanitized,l=e.dateValidation.nights,[h,m]=await Promise.all([this.roomRepo.findAllRooms(),this.roomRepo.findAllRoomTypes()]),v=new Map;m.forEach(f=>v.set(f.id,f));const T=[];for(const f of h){if(f.status==="maintenance")continue;const $=v.get(f.roomTypeId);if(!$||s&&f.roomTypeId!==s||a&&$.capacity<a||i!==void 0&&$.basePricePerNight<i||c!==void 0&&$.basePricePerNight>c||(await this.bookingRepo.findOverlapping(f.id,n,o)).length>0)continue;const C=L(l,$.basePricePerNight);T.push({room:f,roomType:$,nights:l,subtotal:C.subtotal,vat:C.vat,totalAmount:C.total,depositAmount:Math.round(C.total*.3)})}return{nights:l,checkInDate:n,checkOutDate:o,results:T}}async getRoomDetail(t){const e=await this.roomRepo.findRoomById(t);if(!e)return null;const n=await this.roomRepo.findRoomTypeById(e.roomTypeId);return n?{...e,roomType:n}:null}async getAllRoomsWithTypes(){const[t,e]=await Promise.all([this.roomRepo.findAllRooms(),this.roomRepo.findAllRoomTypes()]),n=new Map;return e.forEach(o=>n.set(o.id,o)),t.map(o=>({...o,roomType:n.get(o.roomTypeId)||{id:o.roomTypeId,name:"Chưa xác định",capacity:1,basePricePerNight:0,amenities:[],description:""}}))}async getAllRoomTypes(){return this.roomRepo.findAllRoomTypes()}async createRoom(t){const e=J(t);if(!e.isValid){const m=Object.keys(e.errors)[0];throw new p({code:"INVALID_ROOM_DATA",message:e.errors[m],field:m})}const{roomNumber:n,floor:o,roomTypeId:s,status:a,note:i}=e.sanitized;if(await this.roomRepo.findRoomByNumber(n))throw new p({code:"ROOM_NUMBER_EXISTS",message:`Số phòng "${n}" đã tồn tại trong hệ thống. Vui lòng chọn số khác.`,field:"roomNumber"});if(!await this.roomRepo.findRoomTypeById(s))throw new p({code:"ROOM_TYPE_NOT_FOUND",message:"Loại phòng đã chọn không tồn tại.",field:"roomTypeId"});const h={id:`R_${Date.now()}`,roomNumber:n,floor:o,roomTypeId:s,status:a||"available",note:i};return this.roomRepo.createRoom(h)}async updateRoom(t,e){const n=await this.roomRepo.findRoomById(t);if(!n)throw new p({code:"ROOM_NOT_FOUND",message:"Không tìm thấy phòng cần sửa."});const o=J({...e,status:n.status});if(!o.isValid){const l=Object.keys(o.errors)[0];throw new p({code:"INVALID_ROOM_DATA",message:o.errors[l],field:l})}const{roomNumber:s,floor:a,roomTypeId:i,note:c}=o.sanitized;if(s!==n.roomNumber){const l=await this.roomRepo.findRoomByNumber(s);if(l&&l.id!==t)throw new p({code:"ROOM_NUMBER_EXISTS",message:`Số phòng "${s}" đã được sử dụng bởi phòng khác.`,field:"roomNumber"})}return this.roomRepo.updateRoom(t,{roomNumber:s,floor:a,roomTypeId:i,note:c})}async deleteRoom(t){const e=await this.roomRepo.findRoomById(t);if(!e)throw new p({code:"ROOM_NOT_FOUND",message:"Không tìm thấy phòng cần xóa."});const n=await this.bookingRepo.findActiveBookingsByRoomId(t);if(n.length>0)throw new p({code:"ROOM_HAS_ACTIVE_BOOKINGS",message:`Không thể xóa phòng ${e.roomNumber}! Phòng này hiện đang có ${n.length} đơn đặt phòng đang hoạt động (chờ duyệt/đã xác nhận/đang ở).`});await this.roomRepo.deleteRoom(t)}async updateRoomStatus(t,e,n,o,s=!1){const a=await this.roomRepo.findRoomById(t);if(!a)throw new p({code:"ROOM_NOT_FOUND",message:"Không tìm thấy phòng."});if(H.validateTransition(a.status,e),e==="available"){const h=(await this.bookingRepo.findActiveBookingsByRoomId(t)).find(m=>m.status==="checked_in");if(h)throw new p({code:"CANNOT_SET_AVAILABLE_WHILE_OCCUPIED",message:`Không thể chuyển phòng ${a.roomNumber} sang "Sẵn sàng" vì khách hàng (${h.customerName}) đang làm thủ tục lưu trú trong phòng. Vui lòng thực hiện thủ tục trả phòng trước!`})}let i;if(e==="maintenance"){const l=await this.bookingRepo.findConfirmedBookingsInNextDays(t,7);if(l.length>0&&!s)return i=`Phòng ${a.roomNumber} đang có ${l.length} đơn đặt phòng ĐÃ XÁC NHẬN trong 7 ngày tới. Bạn có chắc chắn muốn chuyển sang trạng thái Bảo dưỡng không?`,{room:a,warning:i}}const c=await this.roomRepo.updateRoomStatus(t,e);return await this.historyRepo.addRoomHistory({id:`RSH_${Date.now()}`,roomId:t,fromStatus:a.status,toStatus:e,changedBy:n,changedAt:new Date().toISOString(),note:o||`Đổi trạng thái từ ${a.status} sang ${e}`}),{room:c}}}class w{static show(t){this.close();const e=document.getElementById("modal-container")||document.body,n=document.createElement("div");n.className="fixed inset-0 z-50 overflow-y-auto",n.innerHTML=`
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" data-action="backdrop"></div>

        <!-- Modal panel -->
        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
          <div class="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-bold text-slate-900 mb-3">${t.title}</h3>
            <div class="text-sm text-slate-600 space-y-3">${t.contentHtml}</div>
          </div>
          <div class="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
            ${t.confirmText?`
              <button type="button" id="modal-confirm-btn" class="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none ${t.confirmClass||"bg-blue-600 hover:bg-blue-700"}">
                ${t.confirmText}
              </button>
            `:""}
            <button type="button" id="modal-cancel-btn" class="inline-flex justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all">
              ${t.cancelText||"Đóng"}
            </button>
          </div>
        </div>
      </div>
    `;const o=()=>{n.remove(),this.activeModal=null},s=n.querySelector("#modal-confirm-btn"),a=n.querySelector("#modal-cancel-btn"),i=n.querySelector('[data-action="backdrop"]');s&&t.onConfirm&&s.addEventListener("click",async()=>{var c;s.disabled=!0,s.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xử lý...';try{await((c=t.onConfirm)==null?void 0:c.call(t)),o()}catch{s.disabled=!1,s.textContent=t.confirmText||"Xác nhận"}}),a==null||a.addEventListener("click",()=>{var c;(c=t.onCancel)==null||c.call(t),o()}),i==null||i.addEventListener("click",()=>{var c;(c=t.onCancel)==null||c.call(t),o()}),e.appendChild(n),this.activeModal=n}static close(){this.activeModal&&(this.activeModal.remove(),this.activeModal=null)}}d(w,"activeModal",null);function u(r){return r==null?"":String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Tt(r){return typeof r!="string"?"":r.trim().replace(/\s+/g," ")}class $t{static showModal(t,e,n,o=1,s){const a=t.roomType,i=L(o,a.basePricePerNight),c=`
      <div class="space-y-4">
        <!-- Room Banner Info -->
        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
              Tầng ${t.floor}
            </span>
            <h4 class="text-xl font-extrabold text-slate-900 mt-1">Phòng ${u(t.roomNumber)}</h4>
            <p class="text-xs text-slate-500">${u(a.name)} &bull; Sức chứa tối đa: ${a.capacity} người</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">Giá tiêu chuẩn</div>
            <div class="text-lg font-extrabold text-blue-600">${x(a.basePricePerNight)}</div>
            <div class="text-[11px] text-slate-400">/ đêm (chưa VAT)</div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả loại phòng</h5>
          <p class="text-sm text-slate-600 leading-relaxed">${u(a.description)}</p>
        </div>

        <!-- Amenities -->
        <div>
          <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tiện ích trong phòng</h5>
          <div class="flex flex-wrap gap-1.5">
            ${a.amenities.map(l=>`
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                <svg class="w-3.5 h-3.5 text-blue-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                ${u(l)}
              </span>
            `).join("")}
          </div>
        </div>

        ${e&&n?`
          <!-- Estimated Price for selected dates -->
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div class="font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Chi phí dự tính (${o} đêm):</span>
              <span class="font-normal text-slate-500">${y(e)} &rarr; ${y(n)}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Đơn giá phòng (${o} đêm):</span>
              <span>${x(i.subtotal)}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Thuế GTGT (VAT 8%):</span>
              <span>${x(i.vat)}</span>
            </div>
            <div class="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
              <span>Tổng thanh toán:</span>
              <span class="text-blue-600">${x(i.total)}</span>
            </div>
          </div>
        `:""}

        ${t.note?`
          <div class="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Ghi chú phòng:</strong> ${u(t.note)}
          </div>
        `:""}
      </div>
    `;w.show({title:`Chi tiết Phòng ${t.roomNumber}`,contentHtml:c,confirmText:s?"Đặt phòng này":void 0,cancelText:"Đóng",onConfirm:()=>{s==null||s()}})}}class B{static render(t){const{currentPage:e,pageSize:n,totalItems:o}=t,s=Math.max(1,Math.ceil(o/n)),a=Math.min(Math.max(1,e),s),i=o===0?0:(a-1)*n+1,c=Math.min(a*n,o);return`
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 bg-white rounded-xl border border-slate-100 mt-6 text-sm text-slate-600">
        <div class="flex items-center gap-3">
          <span>Hiển thị <strong>${i} - ${c}</strong> trên tổng số <strong>${o}</strong> mục</span>
          ${t.onPageSizeChange?`
            <div class="flex items-center gap-1.5 ml-2">
              <label for="pagination-page-size" class="text-xs text-slate-500">Mỗi trang:</label>
              <select id="pagination-page-size" class="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-blue-500">
                <option value="5" ${n===5?"selected":""}>5</option>
                <option value="10" ${n===10?"selected":""}>10</option>
                <option value="20" ${n===20?"selected":""}>20</option>
              </select>
            </div>
          `:""}
        </div>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            data-page="${a-1}"
            class="pagination-btn px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            ${a<=1?"disabled":""}
          >
            &laquo; Trước
          </button>

          <div class="flex items-center gap-1 px-1">
            <span class="font-medium text-slate-900">${a}</span>
            <span class="text-slate-400">/</span>
            <span>${s}</span>
          </div>

          <button
            type="button"
            data-page="${a+1}"
            class="pagination-btn px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            ${a>=s?"disabled":""}
          >
            Sau &raquo;
          </button>
        </div>
      </div>
    `}static bindEvents(t,e){t.querySelectorAll(".pagination-btn").forEach(s=>{s.addEventListener("click",()=>{const a=parseInt(s.getAttribute("data-page")||"1",10),i=Math.max(1,Math.ceil(e.totalItems/e.pageSize));a>=1&&a<=i&&a!==e.currentPage&&e.onPageChange(a)})});const o=t.querySelector("#pagination-page-size");o&&e.onPageSizeChange&&o.addEventListener("change",()=>{var a;const s=parseInt(o.value,10);[5,10,20].includes(s)&&((a=e.onPageSizeChange)==null||a.call(e,s))})}}class Ct{constructor(t,e=new G){d(this,"container");d(this,"roomCtrl");d(this,"checkInDate");d(this,"checkOutDate");d(this,"roomTypeId");d(this,"guests");d(this,"minPrice");d(this,"maxPrice");d(this,"allResults",[]);d(this,"currentPage",1);d(this,"pageSize",5);d(this,"isSearching",!1);d(this,"searchNights",1);this.container=t,this.roomCtrl=e;const n=I();this.checkInDate=k(n,1),this.checkOutDate=k(n,3),this.roomTypeId="",this.guests="",this.minPrice="",this.maxPrice=""}async render(){const t=I(),e=k(t,365);let n='<option value="">Tất cả các loại phòng</option>';try{const o=await this.roomCtrl.getAllRoomTypes();n+=o.map(s=>`<option value="${s.id}" ${this.roomTypeId===s.id?"selected":""}>${u(s.name)} (Tối đa ${s.capacity} người - ${x(s.basePricePerNight)}/đêm)</option>`).join("")}catch{}this.container.innerHTML=`
      <div class="space-y-8">
        <!-- Hero Section Banner -->
        <div class="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          <div class="relative z-10 max-w-2xl">
            <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Hệ thống đặt phòng trực tuyến
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Tìm kiếm phòng trống &amp; Đặt phòng nhanh chóng
            </h1>
            <p class="mt-3 text-blue-100 text-sm sm:text-base leading-relaxed">
              Trải nghiệm dịch vụ nghỉ dưỡng cao cấp với giá ưu đãi. Kiểm tra tình trạng phòng thực tế theo thời gian thực.
            </p>
          </div>
        </div>

        <!-- Search Bar Form Card -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Bộ lọc tìm phòng trống
          </h2>

          <form id="search-room-form" class="space-y-6" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <!-- Check-In Date -->
              <div>
                <label for="search-check-in" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày nhận phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="search-check-in"
                  min="${t}"
                  max="${e}"
                  value="${this.checkInDate}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <p id="error-checkInDate" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <!-- Check-Out Date -->
              <div>
                <label for="search-check-out" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày trả phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="search-check-out"
                  min="${k(t,1)}"
                  max="${e}"
                  value="${this.checkOutDate}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <p id="error-checkOutDate" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <!-- Room Type Filter -->
              <div>
                <label for="search-room-type" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Loại phòng
                </label>
                <select
                  id="search-room-type"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                >
                  ${n}
                </select>
              </div>

              <!-- Guests Filter -->
              <div>
                <label for="search-guests" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số lượng khách
                </label>
                <input
                  type="number"
                  id="search-guests"
                  placeholder="Vd: 2"
                  min="1"
                  max="20"
                  value="${this.guests}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-guests" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>
            </div>

            <!-- Price Range Filter (Accordion/Row) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2 border-t border-slate-100">
              <div>
                <label for="search-min-price" class="block text-xs font-medium text-slate-600 mb-1.5">
                  Giá tối thiểu (VNĐ / đêm)
                </label>
                <input
                  type="number"
                  id="search-min-price"
                  placeholder="Vd: 500000"
                  min="0"
                  step="100000"
                  value="${this.minPrice}"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-minPrice" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <div>
                <label for="search-max-price" class="block text-xs font-medium text-slate-600 mb-1.5">
                  Giá tối đa (VNĐ / đêm)
                </label>
                <input
                  type="number"
                  id="search-max-price"
                  placeholder="Vd: 2000000"
                  min="0"
                  step="100000"
                  value="${this.maxPrice}"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-maxPrice" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <div class="sm:col-span-2 flex items-end justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                <p id="error-priceRange" class="text-xs text-rose-600 self-center hidden"></p>
                <button
                  type="button"
                  id="btn-reset-filters"
                  class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  Xóa bộ lọc
                </button>
                <button
                  type="submit"
                  id="btn-submit-search"
                  class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <span>Tìm phòng trống</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Search Results Section Container -->
        <div id="search-results-container">
          <!-- Sẽ được cập nhật sau khi tìm kiếm -->
        </div>
      </div>
    `,this.bindEvents(),await this.executeSearch()}bindEvents(){const t=this.container.querySelector("#search-room-form"),e=this.container.querySelector("#search-check-in"),n=this.container.querySelector("#search-check-out"),o=this.container.querySelector("#search-room-type"),s=this.container.querySelector("#search-guests"),a=this.container.querySelector("#search-min-price"),i=this.container.querySelector("#search-max-price"),c=this.container.querySelector("#btn-reset-filters");[s,a,i].forEach(l=>{l==null||l.addEventListener("keydown",h=>{["e","E","+","-","."].includes(h.key)&&h.preventDefault()})}),e==null||e.addEventListener("change",()=>{this.checkInDate=e.value,e.value&&(n.min=k(e.value,1),n.value&&n.value<=e.value&&(n.value=k(e.value,1),this.checkOutDate=n.value)),this.validateInputs()}),n==null||n.addEventListener("change",()=>{this.checkOutDate=n.value,this.validateInputs()}),o==null||o.addEventListener("change",()=>{this.roomTypeId=o.value}),s==null||s.addEventListener("input",()=>{this.guests=s.value,this.validateInputs()}),a==null||a.addEventListener("input",()=>{this.minPrice=a.value,this.validateInputs()}),i==null||i.addEventListener("input",()=>{this.maxPrice=i.value,this.validateInputs()}),c==null||c.addEventListener("click",()=>{const l=I();this.checkInDate=k(l,1),this.checkOutDate=k(l,3),this.roomTypeId="",this.guests="",this.minPrice="",this.maxPrice="",this.render()}),t==null||t.addEventListener("submit",async l=>{l.preventDefault(),!this.isSearching&&await this.executeSearch()})}validateInputs(){const t=this.container.querySelector("#search-check-in"),e=this.container.querySelector("#search-check-out"),n=this.container.querySelector("#search-guests"),o=this.container.querySelector("#search-min-price"),s=this.container.querySelector("#search-max-price"),a=this.container.querySelector("#btn-submit-search"),i=st({checkInDate:(t==null?void 0:t.value)||"",checkOutDate:(e==null?void 0:e.value)||"",roomTypeId:this.roomTypeId,guests:n==null?void 0:n.value,minPrice:o==null?void 0:o.value,maxPrice:s==null?void 0:s.value});return this.displayFieldError("checkInDate",i.errors.checkInDate),this.displayFieldError("checkOutDate",i.errors.checkOutDate),this.displayFieldError("guests",i.errors.guests),this.displayFieldError("minPrice",i.errors.minPrice),this.displayFieldError("maxPrice",i.errors.maxPrice),this.displayFieldError("priceRange",i.errors.priceRange),a&&(a.disabled=!i.isValid,i.isValid?a.classList.remove("opacity-50","cursor-not-allowed"):a.classList.add("opacity-50","cursor-not-allowed")),i.isValid}displayFieldError(t,e){const n=this.container.querySelector(`#error-${t}`);n&&(e?(n.textContent=e,n.classList.remove("hidden")):(n.textContent="",n.classList.add("hidden")))}async executeSearch(){if(!this.validateInputs())return;this.isSearching=!0;const t=this.container.querySelector("#btn-submit-search");t&&(t.disabled=!0,t.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra...');const e=this.container.querySelector("#search-results-container");e&&(e.innerHTML=`
        <div class="py-16 text-center text-slate-500">
          <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
          <p class="text-sm font-medium">Đang kiểm tra phòng trống và tính toán biểu phí...</p>
        </div>
      `);try{const n=await this.roomCtrl.searchAvailableRooms({checkInDate:this.checkInDate,checkOutDate:this.checkOutDate,roomTypeId:this.roomTypeId||void 0,guests:this.guests||void 0,minPrice:this.minPrice||void 0,maxPrice:this.maxPrice||void 0});this.allResults=n.results,this.searchNights=n.nights,this.currentPage=1,this.renderResults()}catch(n){g.error(n.message||"Lỗi khi tìm kiếm phòng trống."),e&&(e.innerHTML=`
          <div class="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
            <h3 class="font-bold text-base mb-1">Không thể tải dữ liệu phòng</h3>
            <p class="text-sm">${u(n.message)}</p>
          </div>
        `)}finally{this.isSearching=!1,t&&(t.disabled=!1,t.innerHTML="<span>Tìm phòng trống</span>")}}renderResults(){var c;const t=this.container.querySelector("#search-results-container");if(!t)return;if(this.allResults.length===0){t.innerHTML=`
        <div class="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto my-6">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Không tìm thấy phòng trống phù hợp</h3>
          <p class="text-slate-500 text-sm mb-6 leading-relaxed">
            Rất tiếc, các phòng trong khoảng ngày <strong>${y(this.checkInDate)} &rarr; ${y(this.checkOutDate)}</strong> đã kín chỗ hoặc không thỏa mãn tiêu chí lọc của bạn.
          </p>
          <div class="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1.5 mb-6 border border-slate-100">
            <p class="font-semibold text-slate-700">Gợi ý để tìm được phòng:</p>
            <p>&bull; Thử thay đổi khoảng ngày nhận / trả phòng sớm hơn hoặc muộn hơn 1-2 ngày.</p>
            <p>&bull; Chọn "Tất cả các loại phòng" để xem toàn bộ phòng còn trống.</p>
            <p>&bull; Nới rộng khoảng giá tìm kiếm nếu bạn đang đặt bộ lọc giá.</p>
          </div>
          <button id="btn-empty-clear-filters" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
            Xem tất cả phòng còn trống ngày này
          </button>
        </div>
      `,(c=t.querySelector("#btn-empty-clear-filters"))==null||c.addEventListener("click",()=>{this.roomTypeId="",this.guests="",this.minPrice="",this.maxPrice="",this.container.querySelector("#search-room-type").value="",this.container.querySelector("#search-guests").value="",this.container.querySelector("#search-min-price").value="",this.container.querySelector("#search-max-price").value="",this.executeSearch()});return}const e=(this.currentPage-1)*this.pageSize,n=e+this.pageSize,s=this.allResults.slice(e,n).map(l=>{const{room:h,roomType:m,totalAmount:v,depositAmount:T}=l;return`
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
            <!-- Room Image Placeholder / Tag -->
            <div class="md:w-64 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
              <div>
                <span class="inline-block px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-600 text-white tracking-wider uppercase">
                  Tầng ${h.floor}
                </span>
                <div class="mt-3">
                  <span class="text-xs text-slate-500 font-medium">Số phòng:</span>
                  <h3 class="text-2xl font-black text-slate-900">${u(h.roomNumber)}</h3>
                </div>
              </div>
              <div class="mt-4 md:mt-0 text-xs text-slate-500">
                <span class="inline-flex items-center gap-1">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Tối đa ${m.capacity} khách
                </span>
              </div>
            </div>

            <!-- Room Content -->
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 class="text-lg font-bold text-slate-900">${u(m.name)}</h4>
                  <div class="text-left sm:text-right">
                    <span class="text-xs text-slate-400 font-medium">Đơn giá:</span>
                    <span class="text-base font-bold text-slate-900 ml-1">${x(m.basePricePerNight)}</span>
                    <span class="text-xs text-slate-400">/ đêm</span>
                  </div>
                </div>

                <p class="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">${u(m.description)}</p>

                <!-- Amenities tags -->
                <div class="mt-3.5 flex flex-wrap gap-1.5">
                  ${m.amenities.slice(0,4).map(f=>`
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                      ${u(f)}
                    </span>
                  `).join("")}
                  ${m.amenities.length>4?`
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                      +${m.amenities.length-4} tiện ích
                    </span>
                  `:""}
                </div>
              </div>

              <!-- Price breakdown & action -->
              <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs text-slate-500">
                    Tổng cộng <strong>${this.searchNights} đêm</strong> (đã gồm 8% VAT):
                  </div>
                  <div class="text-xl font-extrabold text-blue-600">${x(v)}</div>
                  <div class="text-[11px] text-emerald-600 font-medium">
                    (Có thể đặt cọc trước 30%: ${x(T)})
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    class="btn-view-detail px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                    data-room-id="${h.id}"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    type="button"
                    class="btn-book-room px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
                    data-room-id="${h.id}"
                  >
                    Đặt phòng này &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        `}).join(""),a=B.render({currentPage:this.currentPage,pageSize:this.pageSize,totalItems:this.allResults.length,onPageChange:()=>{},onPageSizeChange:()=>{}});t.innerHTML=`
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">
            Tìm thấy <span class="text-blue-600">${this.allResults.length}</span> phòng trống phù hợp
          </h3>
          <span class="text-xs text-slate-500">
            Lưu trú: <strong>${y(this.checkInDate)} &rarr; ${y(this.checkOutDate)}</strong> (${this.searchNights} đêm)
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
          ${s}
        </div>

        <div id="results-pagination-container">
          ${a}
        </div>
      </div>
    `;const i=t.querySelector("#results-pagination-container");i&&B.bindEvents(i,{currentPage:this.currentPage,pageSize:this.pageSize,totalItems:this.allResults.length,onPageChange:l=>{this.currentPage=l,this.renderResults(),i.scrollIntoView({behavior:"smooth"})},onPageSizeChange:l=>{this.pageSize=l,this.currentPage=1,this.renderResults()}}),t.querySelectorAll(".btn-view-detail").forEach(l=>{l.addEventListener("click",async()=>{const h=l.getAttribute("data-room-id");if(!h)return;const m=await this.roomCtrl.getRoomDetail(h);m&&$t.showModal(m,this.checkInDate,this.checkOutDate,this.searchNights,()=>{this.navigateToBooking(h)})})}),t.querySelectorAll(".btn-book-room").forEach(l=>{l.addEventListener("click",()=>{const h=l.getAttribute("data-room-id");h&&this.navigateToBooking(h)})})}navigateToBooking(t){const e=`#/book?roomId=${encodeURIComponent(t)}&checkIn=${encodeURIComponent(this.checkInDate)}&checkOut=${encodeURIComponent(this.checkOutDate)}`;window.location.hash=e}}function It(r,t){const e={},n=String(r.type||"").trim();n!=="deposit"&&n!=="full"&&(e.type="Hình thức thanh toán phải là Đặt cọc (deposit) hoặc Thanh toán đủ (full).");const o=String(r.method||"").trim();o!=="cash"&&o!=="card"&&o!=="transfer"&&(e.method="Phương thức thanh toán không hợp lệ (hỗ trợ Tiền mặt, Thẻ hoặc Chuyển khoản).");const s=String(r.amount??"").trim();if(!/^\d+$/.test(s))e.amount="Số tiền thanh toán phải là số nguyên dương.";else{const a=parseInt(s,10),i=V(t);n==="full"?a!==t&&(e.amount=`Số tiền thanh toán đủ phải chính xác là ${t.toLocaleString("vi-VN")} đ (gửi lên: ${a.toLocaleString("vi-VN")} đ).`):n==="deposit"&&a!==i&&(e.amount=`Số tiền đặt cọc 30% phải chính xác là ${i.toLocaleString("vi-VN")} đ (gửi lên: ${a.toLocaleString("vi-VN")} đ).`)}return{isValid:Object.keys(e).length===0,errors:e}}class ot{constructor(t=new U){d(this,"paymentRepo");this.paymentRepo=t}async createPayment(t,e,n,o,s){const a=It({amount:e,type:n,method:o},s);if(!a.isValid){const c=Object.keys(a.errors)[0];throw new p({code:"INVALID_PAYMENT_DATA",message:a.errors[c],field:c})}const i={id:`P_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,bookingId:t,amount:e,method:o,type:n,status:"unpaid",refundAmount:0};return this.paymentRepo.createPayment(i)}async getPaymentByBookingId(t){return this.paymentRepo.findPaymentByBookingId(t)}async processPayment(t,e,n){const o=await this.paymentRepo.findPaymentById(t);if(!o)throw new p({code:"PAYMENT_NOT_FOUND",message:"Không tìm thấy hóa đơn thanh toán yêu cầu."});if(o.status==="paid")throw new p({code:"PAYMENT_ALREADY_PAID",message:"Đơn đặt phòng này đã được thanh toán trước đó."});if(o.status==="refunded")throw new p({code:"PAYMENT_ALREADY_REFUNDED",message:"Đơn này đã được hoàn tiền, không thể thanh toán tiếp."});if(n!==o.amount)throw new p({code:"PAYMENT_AMOUNT_MISMATCH",message:`Số tiền thanh toán (${n.toLocaleString("vi-VN")} đ) không khớp với số tiền cần trả (${o.amount.toLocaleString("vi-VN")} đ).`});return this.paymentRepo.updatePayment(t,{status:"paid",method:e,paidAt:new Date().toISOString()})}}const Rt=/^[a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ\s]{2,50}$/,Nt=/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,Pt=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;function at(r,t){const e={},n=Tt(r.customerName),o=typeof r.customerPhone=="string"?r.customerPhone.trim():"",s=typeof r.customerEmail=="string"?r.customerEmail.trim().toLowerCase():"";n?n.length<2||n.length>50?e.customerName="Họ và tên phải có độ dài từ 2 đến 50 ký tự.":Rt.test(n)||(e.customerName="Họ tên chỉ được chứa chữ cái và khoảng trắng, không chứa số hoặc ký tự đặc biệt."):e.customerName="Vui lòng nhập họ và tên của bạn.",o?Nt.test(o)||(e.customerPhone="Số điện thoại không hợp lệ (Ví dụ hợp lệ: 0912345678 hoặc +84912345678)."):e.customerPhone="Vui lòng nhập số điện thoại liên hệ.",s?s.length>100?e.customerEmail="Địa chỉ email không được vượt quá 100 ký tự.":Pt.test(s)||(e.customerEmail="Định dạng email không hợp lệ (Ví dụ: khachhang@gmail.com)."):e.customerEmail="Vui lòng nhập email để nhận mã đặt phòng.";let a=0,i=0;const c=String(r.adults??"").trim();c?/^\d+$/.test(c)?(a=parseInt(c,10),a<1?e.adults="Phải có ít nhất 1 người lớn trong phòng.":a>20&&(e.adults="Số lượng người lớn không hợp lý.")):e.adults="Số người lớn phải là số nguyên dương, không chứa ký tự lạ hoặc số thập phân.":e.adults="Vui lòng nhập số lượng người lớn.";const l=String(r.children??"").trim();l===""?i=0:/^\d+$/.test(l)?(i=parseInt(l,10),i<0?e.children="Số trẻ em không được âm.":i>20&&(e.children="Số lượng trẻ em không hợp lý.")):e.children="Số trẻ em phải là số nguyên không âm (0, 1, 2...).";const h=a+i;return!e.adults&&!e.children&&h>t&&(e.guests=`Phòng này chỉ chứa tối đa ${t} khách (Bạn đang chọn ${h} người: ${a} người lớn + ${i} trẻ em).`),{isValid:Object.keys(e).length===0,errors:e,sanitized:{customerName:n,customerPhone:o,customerEmail:s,adults:a,children:i}}}function Bt(){const r="23456789ABCDEFGHJKLMNPQRSTUVWXYZ";let t="BK";const e=new Uint8Array(8);window.crypto.getRandomValues(e);for(let n=0;n<8;n++)t+=r[e[n]%r.length];return t}function Dt(r){return!r||typeof r!="string"?!1:/^BK[A-Z0-9]{8}$/i.test(r.trim())}const Et=/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;function Lt(r){const t={},e=String(r.bookingCode||"").trim().toUpperCase(),n=String(r.customerPhone||"").trim();return e?Dt(e)||(t.bookingCode="Mã đặt phòng không đúng định dạng (Gồm tiền tố BK và 8 ký tự)."):t.bookingCode="Vui lòng nhập mã đặt phòng (Ví dụ: BKTEST01).",n?Et.test(n)||(t.customerPhone="Số điện thoại không đúng định dạng số di động Việt Nam."):t.customerPhone="Vui lòng nhập số điện thoại dùng khi đặt phòng.",{isValid:Object.keys(t).length===0,errors:t,sanitized:{bookingCode:e,customerPhone:n}}}class it{constructor(t=new _,e=new A,n=new O,o=new ot){d(this,"roomRepo");d(this,"bookingRepo");d(this,"historyRepo");d(this,"paymentCtrl");d(this,"lookupLimiter");this.roomRepo=t,this.bookingRepo=e,this.historyRepo=n,this.paymentCtrl=o,this.lookupLimiter=new nt("booking_lookup",5,60)}async book(t){var X;const e=F(t.checkInDate,t.checkOutDate);if(!e.isValid){const P=Object.keys(e.errors)[0];throw new p({code:"INVALID_BOOKING_DATES",message:e.errors[P]||"Ngày nhận hoặc trả phòng không hợp lệ.",field:P})}const n=await this.roomRepo.findRoomById(t.roomId);if(!n)throw new p({code:"ROOM_NOT_FOUND",message:"Phòng được chọn không tồn tại hoặc đã ngừng phục vụ."});if(n.status==="maintenance")throw new p({code:"ROOM_UNDER_MAINTENANCE",message:`Phòng ${n.roomNumber} hiện đang bảo dưỡng sửa chữa, không thể đặt lúc này.`});const o=await this.roomRepo.findRoomTypeById(n.roomTypeId);if(!o)throw new p({code:"ROOM_TYPE_NOT_FOUND",message:"Không tìm thấy thông tin loại phòng tương ứng."});const s=at({customerName:t.customerName,customerPhone:t.customerPhone,customerEmail:t.customerEmail,adults:t.adults,children:t.children},o.capacity);if(!s.isValid){const P=Object.keys(s.errors)[0];throw new p({code:"INVALID_CUSTOMER_INFO",message:s.errors[P]||"Thông tin khách hàng chưa hợp lệ.",field:P})}const{sanitized:a}=s,i=e.nights;if((await this.bookingRepo.findOverlapping(n.id,t.checkInDate,t.checkOutDate)).length>0)throw new p({code:"ROOM_ALREADY_BOOKED",message:`Rất tiếc! Phòng ${n.roomNumber} vừa có khách khác đặt trong khoảng thời gian ${t.checkInDate} đến ${t.checkOutDate}. Vui lòng chọn phòng hoặc ngày khác.`});if((await this.bookingRepo.findActiveBookingsByPhone(a.customerPhone,t.checkInDate,t.checkOutDate)).length>0)throw new p({code:"DUPLICATE_PHONE_BOOKING",message:`Số điện thoại ${a.customerPhone} đã có một đơn đặt phòng khác đang chờ duyệt hoặc đã xác nhận trong khoảng thời gian này.`});let h="",m=!1,v=0;for(;!m&&v<10;)h=Bt(),await this.bookingRepo.findBookingByCode(h)||(m=!0),v++;if(!m)throw new p({code:"CODE_GENERATION_FAILED",message:"Hệ thống đang bận sinh mã đặt phòng, vui lòng thử lại."});const f=L(i,o.basePricePerNight).total,$=t.paymentType==="deposit"?V(f):f,M=`B_${Date.now()}`,C=new Date().toISOString(),ht=await this.paymentCtrl.createPayment(M,$,t.paymentType,t.paymentMethod,f),ut={id:M,bookingCode:h,customerName:a.customerName,customerPhone:a.customerPhone,customerEmail:a.customerEmail,roomId:n.id,checkInDate:t.checkInDate,checkOutDate:t.checkOutDate,adults:a.adults,children:a.children,nights:i,totalAmount:f,status:"pending",note:(X=t.note)==null?void 0:X.trim(),createdAt:C,updatedAt:C},pt=await this.bookingRepo.createBooking(ut);return await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:M,fromStatus:"none",toStatus:"pending",changedBy:"customer",changedAt:C,note:`Khách hàng đặt phòng qua website. Mã: ${h}`}),{booking:pt,payment:ht,room:n,roomType:o}}async lookupBooking(t,e){const n=this.lookupLimiter.check();if(!n.allowed)throw new p({code:"RATE_LIMIT_EXCEEDED",message:`Bạn đã thử tra cứu sai quá 5 lần. Vui lòng chờ ${n.waitSeconds} giây trước khi thử lại.`});const o=Lt({bookingCode:t,customerPhone:e});if(!o.isValid){const l=Object.keys(o.errors)[0];throw new p({code:"INVALID_LOOKUP_INPUT",message:o.errors[l]||"Thông tin tra cứu không hợp lệ.",field:l})}const s=await this.bookingRepo.findBookingByCodeAndPhone(o.sanitized.bookingCode,o.sanitized.customerPhone);if(!s){this.lookupLimiter.recordFailure();const l=this.lookupLimiter.check().remainingAttempts;throw new p({code:"BOOKING_NOT_FOUND",message:`Không tìm thấy đặt phòng phù hợp với mã "${o.sanitized.bookingCode}" và số điện thoại đã nhập. (Còn ${l} lần thử).`})}this.lookupLimiter.reset();const a=await this.roomRepo.findRoomById(s.roomId),i=a?await this.roomRepo.findRoomTypeById(a.roomTypeId):null,c=await this.paymentCtrl.getPaymentByBookingId(s.id);return{booking:s,room:a||{id:s.roomId,roomNumber:"N/A",roomTypeId:"N/A",floor:1,status:"available"},roomType:i||{id:"N/A",name:"Phòng tiêu chuẩn",capacity:2,basePricePerNight:0,amenities:[],description:""},payment:c}}async previewCancel(t,e){const n=await this.lookupBooking(t,e),{booking:o,payment:s}=n,a=I();if(o.status!=="pending"&&o.status!=="confirmed")return{booking:o,payment:s,daysUntilCheckIn:0,refundPercent:0,refundAmount:0,refundDescription:"Đơn này không thể hủy.",canCancel:!1,reasonBlocked:`Không thể hủy đơn đặt phòng ở trạng thái "${o.status}". Đơn đã hoàn tất hoặc đã bị hủy trước đó.`};if(a>=o.checkInDate)return{booking:o,payment:s,daysUntilCheckIn:0,refundPercent:0,refundAmount:0,refundDescription:"Không thể hủy vào hoặc sau ngày nhận phòng.",canCancel:!1,reasonBlocked:`Ngày nhận phòng là ${o.checkInDate}. Đã đến hoặc quá ngày nhận phòng, hệ thống không cho phép hủy trực tuyến. Vui lòng liên hệ trực tiếp lễ tân khách sạn.`};const i=tt(o.checkInDate),c=s&&s.status==="paid"?s.amount:0,l=St(c,i);return{booking:o,payment:s,daysUntilCheckIn:i,refundPercent:l.refundPercent,refundAmount:l.refundAmount,refundDescription:l.description,canCancel:!0}}async cancelBooking(t,e,n){const o=await this.previewCancel(t,e);if(!o.canCancel)throw new p({code:"CANNOT_CANCEL_BOOKING",message:o.reasonBlocked||"Không thể hủy đơn đặt phòng này."});const{booking:s,payment:a,refundAmount:i}=o;R.validateTransition(s.status,"cancelled");const c=await this.bookingRepo.updateBooking(s.id,{status:"cancelled",note:n?`Khách hủy: ${n}`:"Khách hủy phòng qua website"});return a&&await this.paymentCtrl.paymentRepo.updatePayment(a.id,{refundAmount:i,status:i>0?"refunded":a.status}),await this.historyRepo.addBookingHistory({id:`BH_${Date.now()}`,bookingId:s.id,fromStatus:s.status,toStatus:"cancelled",changedBy:"customer",changedAt:new Date().toISOString(),note:`Khách hủy phòng. Hoàn tiền: ${i.toLocaleString("vi-VN")} đ (${o.refundPercent}%). Lý do: ${n||"Không nêu"}`}),{booking:c,refundAmount:i}}}class At{constructor(t,e,n=new it,o=new G){d(this,"container");d(this,"bookingCtrl");d(this,"roomCtrl");d(this,"roomId");d(this,"checkInDate");d(this,"checkOutDate");d(this,"roomData",null);d(this,"nights",1);d(this,"paymentType","full");d(this,"paymentMethod","transfer");d(this,"isSubmitting",!1);this.container=t,this.roomId=e.roomId,this.checkInDate=e.checkInDate,this.checkOutDate=e.checkOutDate,this.bookingCtrl=n,this.roomCtrl=o}async render(){try{if(this.roomData=await this.roomCtrl.getRoomDetail(this.roomId),!this.roomData){this.renderError("Phòng được chọn không tồn tại hoặc đã ngừng phục vụ.");return}}catch{this.renderError("Không thể tải thông tin phòng. Vui lòng thử lại sau.");return}const t=F(this.checkInDate,this.checkOutDate);if(!t.isValid){const s=t.errors.checkInDate||t.errors.checkOutDate||"Khoảng ngày không hợp lệ.";this.renderError(s);return}this.nights=t.nights;const e=this.roomData.roomType,n=L(this.nights,e.basePricePerNight),o=V(n.total);this.container.innerHTML=`
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Back button & Header -->
        <div class="flex items-center justify-between">
          <button id="btn-back-search" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quay lại tìm phòng
          </button>
          <span class="text-xs text-slate-500">Mã phòng: <strong class="text-slate-800">${this.roomData.roomNumber}</strong></span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Booking Form -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 class="text-xl font-bold text-slate-900 mb-2">Thông tin người đặt phòng</h2>
              <p class="text-xs text-slate-500 mb-6">Mã đặt phòng sẽ được gửi qua email và dùng kèm số điện thoại để tra cứu.</p>

              <form id="booking-form" class="space-y-5" novalidate>
                <!-- Customer Name -->
                <div>
                  <label for="input-customer-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên khách hàng <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-customer-name"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <p id="err-customerName" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                </div>

                <!-- Phone & Email Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="input-customer-phone" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="input-customer-phone"
                      placeholder="0912345678"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-customerPhone" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>

                  <div>
                    <label for="input-customer-email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Địa chỉ Email <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="input-customer-email"
                      placeholder="email@example.com"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-customerEmail" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>
                </div>

                <!-- Adults & Children Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label for="input-adults" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Người lớn (&ge; 1) <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="input-adults"
                      min="1"
                      max="${e.capacity}"
                      value="1"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-adults" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>

                  <div>
                    <label for="input-children" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Trẻ em (&ge; 0)
                    </label>
                    <input
                      type="number"
                      id="input-children"
                      min="0"
                      max="${e.capacity}"
                      value="0"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <p id="err-children" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>
                </div>

                <!-- Inline error for total guests exceeding capacity -->
                <p id="err-guests" class="text-xs text-rose-600 hidden font-semibold"></p>

                <!-- Special Note -->
                <div>
                  <label for="input-note" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ghi chú / Yêu cầu đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    id="input-note"
                    rows="2"
                    placeholder="Ví dụ: Nhận phòng sớm, chuẩn bị thêm gối, phòng tầng cao..."
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  ></textarea>
                </div>

                <!-- Payment Options -->
                <div class="pt-4 border-t border-slate-200">
                  <h3 class="text-sm font-bold text-slate-900 mb-3">Hình thức thanh toán</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <label class="payment-type-card flex items-start p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentType==="full"?"border-blue-600 bg-blue-50/50 ring-1 ring-blue-600":""}">
                      <input type="radio" name="paymentType" value="full" class="mt-0.5 text-blue-600 focus:ring-blue-500" ${this.paymentType==="full"?"checked":""} />
                      <div class="ml-3">
                        <span class="block text-xs font-bold text-slate-800">Thanh toán đủ 100%</span>
                        <span class="block text-[11px] text-slate-500 mt-0.5">${x(n.total)}</span>
                      </div>
                    </label>

                    <label class="payment-type-card flex items-start p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentType==="deposit"?"border-blue-600 bg-blue-50/50 ring-1 ring-blue-600":""}">
                      <input type="radio" name="paymentType" value="deposit" class="mt-0.5 text-blue-600 focus:ring-blue-500" ${this.paymentType==="deposit"?"checked":""} />
                      <div class="ml-3">
                        <span class="block text-xs font-bold text-slate-800">Đặt cọc 30% giữ phòng</span>
                        <span class="block text-[11px] text-slate-500 mt-0.5">${x(o)} (Còn lại trả khi nhận phòng)</span>
                      </div>
                    </label>
                  </div>

                  <h3 class="text-sm font-bold text-slate-900 mb-2">Phương thức thanh toán</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod==="transfer"?"border-blue-600 bg-blue-50/50":""}">
                      <input type="radio" name="paymentMethod" value="transfer" class="text-blue-600" ${this.paymentMethod==="transfer"?"checked":""} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Chuyển khoản QR</span>
                    </label>

                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod==="card"?"border-blue-600 bg-blue-50/50":""}">
                      <input type="radio" name="paymentMethod" value="card" class="text-blue-600" ${this.paymentMethod==="card"?"checked":""} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Thẻ ATM / Visa</span>
                    </label>

                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod==="cash"?"border-blue-600 bg-blue-50/50":""}">
                      <input type="radio" name="paymentMethod" value="cash" class="text-blue-600" ${this.paymentMethod==="cash"?"checked":""} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Tiền mặt tại quầy</span>
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-6">
                  <button
                    type="submit"
                    id="btn-submit-booking"
                    class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Xác nhận &amp; Tiến hành Đặt phòng</span>
                  </button>
                  <p class="text-center text-[11px] text-slate-400 mt-2">
                    Bằng việc nhấn xác nhận, bạn đồng ý với chính sách nhận/trả và hoàn hủy phòng của khách sạn.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <!-- Right Column: Room & Price Summary Sticky Card -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24 space-y-4">
              <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Chi tiết đặt phòng
              </h3>

              <!-- Room info -->
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Phòng ${u(this.roomData.roomNumber)}
                  </span>
                  <span class="text-xs text-slate-500">Tầng ${this.roomData.floor}</span>
                </div>
                <h4 class="text-base font-bold text-slate-900">${u(e.name)}</h4>
                <p class="text-xs text-slate-500">Sức chứa tối đa: <strong>${e.capacity} người</strong></p>
              </div>

              <!-- Dates info -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">Nhận phòng:</span>
                  <span class="font-bold text-slate-800">${y(this.checkInDate)} (14:00)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Trả phòng:</span>
                  <span class="font-bold text-slate-800">${y(this.checkOutDate)} (12:00)</span>
                </div>
                <div class="flex justify-between pt-1 border-t border-slate-200 text-slate-700">
                  <span>Thời gian lưu trú:</span>
                  <span class="font-extrabold text-blue-600">${this.nights} đêm</span>
                </div>
              </div>

              <!-- Price Breakdown Table -->
              <div class="space-y-2 text-xs pt-2">
                <div class="flex justify-between text-slate-600">
                  <span>${x(e.basePricePerNight)} &times; ${this.nights} đêm:</span>
                  <span>${x(n.subtotal)}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Thuế GTGT (VAT 8%):</span>
                  <span>${x(n.vat)}</span>
                </div>
                <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Tổng tiền phòng:</span>
                  <span class="text-blue-600">${x(n.total)}</span>
                </div>
              </div>

              <!-- Amount to pay now -->
              <div id="pay-now-banner" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div class="font-medium text-emerald-800">Số tiền cần thanh toán:</div>
                <div id="pay-now-amount" class="text-lg font-black text-emerald-700 mt-0.5">
                  ${x(this.paymentType==="deposit"?o:n.total)}
                </div>
                <div id="pay-now-note" class="text-[11px] text-emerald-600 mt-0.5">
                  ${this.paymentType==="deposit"?"Đặt cọc 30% giữ phòng.":"Thanh toán trọn gói 100%."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,this.bindEvents()}bindEvents(){const t=this.container.querySelector("#booking-form"),e=this.container.querySelector("#btn-back-search"),n=this.container.querySelector("#input-customer-name"),o=this.container.querySelector("#input-customer-phone"),s=this.container.querySelector("#input-customer-email"),a=this.container.querySelector("#input-adults"),i=this.container.querySelector("#input-children"),c=this.container.querySelector("#input-note");[a,i].forEach(l=>{l==null||l.addEventListener("keydown",h=>{["e","E","+","-","."].includes(h.key)&&h.preventDefault()})}),e==null||e.addEventListener("click",()=>{window.location.hash="#/"}),[n,o,s,a,i].forEach(l=>{l==null||l.addEventListener("input",()=>this.validateForm())}),this.container.querySelectorAll('input[name="paymentType"]').forEach(l=>{l.addEventListener("change",()=>{this.paymentType=l.value,this.updatePaymentCards()})}),this.container.querySelectorAll('input[name="paymentMethod"]').forEach(l=>{l.addEventListener("change",()=>{this.paymentMethod=l.value,this.updatePaymentCards()})}),t==null||t.addEventListener("submit",async l=>{if(l.preventDefault(),!this.isSubmitting){if(!this.validateForm()){g.warning("Vui lòng kiểm tra lại các trường thông tin báo đỏ.");return}await this.submitBooking({customerName:n.value,customerPhone:o.value,customerEmail:s.value,adults:parseInt(a.value,10),children:parseInt(i.value||"0",10),note:c.value})}})}updatePaymentCards(){if(!this.roomData)return;const t=this.roomData.roomType,e=L(this.nights,t.basePricePerNight),n=V(e.total),o=this.container.querySelector("#pay-now-amount"),s=this.container.querySelector("#pay-now-note");o&&s&&(this.paymentType==="deposit"?(o.textContent=x(n),s.textContent="Đặt cọc 30% giữ phòng. 70% còn lại thanh toán tại quầy."):(o.textContent=x(e.total),s.textContent="Thanh toán trọn gói 100%.")),this.container.querySelectorAll(".payment-type-card").forEach(a=>{const i=a.querySelector('input[type="radio"]');(i==null?void 0:i.value)===this.paymentType?a.classList.add("border-blue-600","bg-blue-50/50","ring-1","ring-blue-600"):a.classList.remove("border-blue-600","bg-blue-50/50","ring-1","ring-blue-600")}),this.container.querySelectorAll(".payment-method-card").forEach(a=>{const i=a.querySelector('input[type="radio"]');(i==null?void 0:i.value)===this.paymentMethod?a.classList.add("border-blue-600","bg-blue-50/50"):a.classList.remove("border-blue-600","bg-blue-50/50")})}validateForm(){if(!this.roomData)return!1;const t=this.container.querySelector("#input-customer-name"),e=this.container.querySelector("#input-customer-phone"),n=this.container.querySelector("#input-customer-email"),o=this.container.querySelector("#input-adults"),s=this.container.querySelector("#input-children"),a=this.container.querySelector("#btn-submit-booking"),i=at({customerName:t==null?void 0:t.value,customerPhone:e==null?void 0:e.value,customerEmail:n==null?void 0:n.value,adults:o==null?void 0:o.value,children:s==null?void 0:s.value},this.roomData.roomType.capacity);return this.displayFieldError("customerName",i.errors.customerName),this.displayFieldError("customerPhone",i.errors.customerPhone),this.displayFieldError("customerEmail",i.errors.customerEmail),this.displayFieldError("adults",i.errors.adults),this.displayFieldError("children",i.errors.children),this.displayFieldError("guests",i.errors.guests),a&&(a.disabled=!i.isValid,i.isValid?a.classList.remove("opacity-50","cursor-not-allowed"):a.classList.add("opacity-50","cursor-not-allowed")),i.isValid}displayFieldError(t,e){const n=this.container.querySelector(`#err-${t}`);n&&(e?(n.textContent=e,n.classList.remove("hidden")):(n.textContent="",n.classList.add("hidden")))}async submitBooking(t){this.isSubmitting=!0;const e=this.container.querySelector("#btn-submit-booking");e&&(e.disabled=!0,e.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xử lý đặt phòng...');try{const n=await this.bookingCtrl.book({roomId:this.roomId,checkInDate:this.checkInDate,checkOutDate:this.checkOutDate,customerName:t.customerName,customerPhone:t.customerPhone,customerEmail:t.customerEmail,adults:t.adults,children:t.children,note:t.note,paymentType:this.paymentType,paymentMethod:this.paymentMethod});g.success(`Đặt phòng thành công! Mã đơn của bạn là: ${n.booking.bookingCode}`),this.paymentMethod==="transfer"||this.paymentMethod==="card"?window.location.hash=`#/payment?bookingId=${encodeURIComponent(n.booking.id)}`:window.location.hash=`#/booking-success?code=${encodeURIComponent(n.booking.bookingCode)}&phone=${encodeURIComponent(n.booking.customerPhone)}`}catch(n){g.error(n.message||"Đặt phòng thất bại. Vui lòng thử lại.")}finally{this.isSubmitting=!1,e&&(e.disabled=!1,e.innerHTML="<span>Xác nhận &amp; Tiến hành Đặt phòng</span>")}}renderError(t){this.container.innerHTML=`
      <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-rose-200 text-center shadow-sm">
        <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-2">Không thể tiếp tục đặt phòng</h3>
        <p class="text-sm text-slate-600 mb-6">${u(t)}</p>
        <a href="#/" class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
          Quay lại tìm phòng khác
        </a>
      </div>
    `}}class Ot{constructor(t,e,n=new ot,o=new A){d(this,"container");d(this,"bookingId");d(this,"paymentCtrl");d(this,"bookingRepo");d(this,"payment",null);d(this,"booking",null);d(this,"isProcessing",!1);this.container=t,this.bookingId=e,this.paymentCtrl=n,this.bookingRepo=o}async render(){this.container.innerHTML=`
      <div class="py-16 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
        <p class="text-sm font-medium">Đang tải thông tin hóa đơn thanh toán...</p>
      </div>
    `;try{if(this.booking=await this.bookingRepo.findBookingById(this.bookingId),!this.booking){this.renderError("Không tìm thấy đơn đặt phòng yêu cầu thanh toán.");return}if(this.payment=await this.paymentCtrl.getPaymentByBookingId(this.bookingId),!this.payment){this.renderError("Không tìm thấy hóa đơn thanh toán tương ứng.");return}if(this.payment.status==="paid"){window.location.hash=`#/booking-success?code=${encodeURIComponent(this.booking.bookingCode)}&phone=${encodeURIComponent(this.booking.customerPhone)}`;return}this.renderPaymentScreen()}catch{this.renderError("Đã xảy ra lỗi khi kết nối máy chủ thanh toán.")}}renderPaymentScreen(){if(!this.booking||!this.payment)return;const t=this.payment.method==="transfer";this.container.innerHTML=`
      <div class="max-w-xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="text-center pb-6 border-b border-slate-100">
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Cổng thanh toán điện tử
            </span>
            <h2 class="text-2xl font-extrabold text-slate-900">
              ${t?"Chuyển khoản Ngân hàng (VietQR)":"Thanh toán qua Thẻ"}
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Mã đặt phòng: <strong class="text-blue-600 font-mono text-sm">${u(this.booking.bookingCode)}</strong>
            </p>
          </div>

          <!-- Payment Amount Highlight -->
          <div class="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Số tiền cần thanh toán</span>
              <div class="text-2xl font-black text-slate-900 mt-0.5">${x(this.payment.amount)}</div>
              <span class="text-[11px] text-slate-400">
                (${this.payment.type==="deposit"?"Đặt cọc 30%":"Thanh toán đủ 100%"})
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500">Khách hàng</span>
              <div class="text-sm font-bold text-slate-800">${u(this.booking.customerName)}</div>
              <div class="text-xs text-slate-400 font-mono">${u(this.booking.customerPhone)}</div>
            </div>
          </div>

          ${t?`
            <!-- QR Transfer Instructions -->
            <div class="space-y-4">
              <div class="flex justify-center my-4">
                <div class="p-4 bg-white rounded-2xl border-2 border-dashed border-blue-300 shadow-sm text-center">
                  <!-- Simulated VietQR SVG -->
                  <div class="w-48 h-48 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
                    <div class="text-xs font-bold tracking-widest text-emerald-400 mb-1">VIETQR PRO</div>
                    <div class="w-28 h-28 bg-white p-2 rounded-lg grid grid-cols-4 gap-1">
                      <div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div>
                      <div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div>
                      <div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div>
                      <div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div>
                    </div>
                    <div class="text-[9px] text-slate-400 mt-2 font-mono">LOTUS_${this.booking.bookingCode}</div>
                  </div>
                  <p class="text-xs text-slate-500 mt-2 font-medium">Quét mã QR bằng App Ngân hàng</p>
                </div>
              </div>

              <div class="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-slate-500">Ngân hàng thụ hưởng:</span>
                  <strong class="text-slate-900">MB BANK (Ngân hàng Quân Đội)</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Số tài khoản:</span>
                  <strong class="font-mono text-blue-700 font-bold">999988886666</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Tên chủ tài khoản:</span>
                  <strong class="text-slate-900 uppercase">KHACH SAN LOTUS HOTEL</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Nội dung chuyển khoản:</span>
                  <strong class="font-mono text-rose-600 font-bold">LOTUS ${this.booking.bookingCode}</strong>
                </div>
              </div>
            </div>
          `:`
            <!-- Card Form Simulation -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số thẻ ngân hàng</label>
                <input
                  type="text"
                  placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8899"
                  value="9704 2200 1234 5678"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày hết hạn</label>
                  <input type="text" placeholder="MM/YY" value="12/28" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mã CVV</label>
                  <input type="password" placeholder="123" value="888" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono" />
                </div>
              </div>
            </div>
          `}

          <!-- Actions -->
          <div class="mt-8 space-y-3">
            <button
              type="button"
              id="btn-confirm-paid"
              class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Xác nhận tôi đã chuyển khoản / Thanh toán</span>
            </button>
            <button
              type="button"
              id="btn-pay-later"
              class="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all border border-slate-200"
            >
              Thanh toán sau (Lưu đơn ở trạng thái chưa thanh toán)
            </button>
          </div>
        </div>
      </div>
    `,this.bindEvents()}bindEvents(){const t=this.container.querySelector("#btn-confirm-paid"),e=this.container.querySelector("#btn-pay-later");t==null||t.addEventListener("click",async()=>{if(!(this.isProcessing||!this.payment||!this.booking)){this.isProcessing=!0,t.disabled=!0,t.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra giao dịch...';try{await this.paymentCtrl.processPayment(this.payment.id,this.payment.method,this.payment.amount),g.success("Giao dịch thanh toán thành công!"),window.location.hash=`#/booking-success?code=${encodeURIComponent(this.booking.bookingCode)}&phone=${encodeURIComponent(this.booking.customerPhone)}`}catch(n){g.error(n.message||"Xác nhận thanh toán thất bại."),t.disabled=!1,t.innerHTML="<span>Xác nhận tôi đã chuyển khoản / Thanh toán</span>"}finally{this.isProcessing=!1}}}),e==null||e.addEventListener("click",()=>{this.booking&&(g.info("Đơn đặt phòng đã được lưu. Vui lòng thanh toán sớm để đảm bảo giữ phòng."),window.location.hash=`#/booking-success?code=${encodeURIComponent(this.booking.bookingCode)}&phone=${encodeURIComponent(this.booking.customerPhone)}`)})}renderError(t){this.container.innerHTML=`
      <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-rose-200 text-center shadow-sm">
        <h3 class="font-bold text-slate-800 text-lg mb-2">Lỗi thanh toán</h3>
        <p class="text-sm text-slate-600 mb-6">${u(t)}</p>
        <a href="#/" class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
          Về trang chủ
        </a>
      </div>
    `}}class Mt{constructor(t,e,n){d(this,"container");d(this,"code");d(this,"bookingRepo",new A);d(this,"roomRepo",new _);d(this,"paymentRepo",new U);this.container=t,this.code=e}async render(){const t=await this.bookingRepo.findBookingByCode(this.code);if(!t){this.container.innerHTML=`
        <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <h3 class="font-bold text-slate-800 text-lg mb-2">Không tìm thấy thông tin</h3>
          <p class="text-sm text-slate-600 mb-6">Mã đặt phòng không tồn tại.</p>
          <a href="#/" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">Về trang chủ</a>
        </div>
      `;return}const e=await this.roomRepo.findRoomById(t.roomId),n=e?await this.roomRepo.findRoomTypeById(e.roomTypeId):null,o=await this.paymentRepo.findPaymentByBookingId(t.id);this.container.innerHTML=`
      <div class="max-w-2xl mx-auto space-y-6">
        <!-- Success Card -->
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 text-center">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>

          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Đặt phòng thành công
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Cảm ơn bạn đã đặt phòng!
          </h1>
          <p class="text-slate-500 text-sm mt-2">
            Đơn đặt phòng của bạn đã được tiếp nhận và đang chờ nhân viên kiểm duyệt.
          </p>

          <!-- Crucial Reminder Box -->
          <div class="my-6 p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200 text-left flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <div class="text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold block text-sm mb-1">LƯU Ý QUAN TRỌNG:</strong>
              Khách hàng không cần tài khoản đăng nhập. Để <strong>tra cứu hoặc hủy phòng</strong>, bạn bắt buộc phải nhập đúng cả hai thông tin:
              <ul class="list-disc list-inside mt-1.5 space-y-0.5 font-medium">
                <li>Mã đặt phòng: <span class="font-mono font-bold text-blue-700 text-sm">${u(t.bookingCode)}</span></li>
                <li>Số điện thoại đặt phòng: <span class="font-mono font-bold text-slate-800 text-sm">${u(t.customerPhone)}</span></li>
              </ul>
            </div>
          </div>

          <!-- Booking Code Box with Copy Button -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div class="text-left">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MÃ ĐẶT PHÒNG CỦA BẠN</span>
              <div class="text-2xl font-black font-mono text-blue-600 tracking-wider">${u(t.bookingCode)}</div>
            </div>
            <button
              type="button"
              id="btn-copy-code"
              class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              <span>Sao chép mã</span>
            </button>
          </div>

          <!-- Summary details -->
          <div class="mt-6 border-t border-slate-100 pt-6 text-xs text-left space-y-2.5">
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Phòng &amp; Loại phòng:</span>
              <strong class="text-slate-800">Phòng ${(e==null?void 0:e.roomNumber)||"N/A"} - ${(n==null?void 0:n.name)||""}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Thời gian lưu trú:</span>
              <strong class="text-slate-800">${y(t.checkInDate)} &rarr; ${y(t.checkOutDate)} (${t.nights} đêm)</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Người đại diện đặt:</span>
              <strong class="text-slate-800">${u(t.customerName)} (${u(t.customerPhone)})</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Tổng chi phí (VAT 8%):</span>
              <strong class="text-blue-600 font-bold text-sm">${x(t.totalAmount)}</strong>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-slate-500">Tình trạng thanh toán:</span>
              <span class="font-bold ${(o==null?void 0:o.status)==="paid"?"text-emerald-600":"text-amber-600"}">
                ${(o==null?void 0:o.status)==="paid"?"ĐÃ THANH TOÁN THÀNH CÔNG":"CHƯA THANH TOÁN (THANH TOÁN TẠI QUẦY)"}
              </span>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#/lookup?code=${encodeURIComponent(t.bookingCode)}&phone=${encodeURIComponent(t.customerPhone)}"
              class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all text-center"
            >
              Tra cứu đơn đặt này
            </a>
            <a
              href="#/"
              class="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all text-center"
            >
              Về trang tìm phòng
            </a>
          </div>
        </div>
      </div>
    `;const s=this.container.querySelector("#btn-copy-code");s==null||s.addEventListener("click",()=>{navigator.clipboard.writeText(t.bookingCode),g.success("Đã sao chép mã đặt phòng vào bộ nhớ tạm.")})}}const Ht={cash:"Tiền mặt tại quầy",card:"Thẻ tín dụng / Thẻ ghi nợ",transfer:"Chuyển khoản ngân hàng (QR Code)"},rt={unpaid:"Chưa thanh toán",paid:"Đã thanh toán",refunded:"Đã hoàn tiền"},lt={unpaid:"bg-rose-100 text-rose-800 border-rose-200",paid:"bg-emerald-100 text-emerald-800 border-emerald-200",refunded:"bg-slate-100 text-slate-700 border-slate-200"};class Vt{constructor(t,e,n=new it,o=new O){d(this,"container");d(this,"bookingCtrl");d(this,"historyRepo");d(this,"bookingCodeInput","");d(this,"customerPhoneInput","");d(this,"activeDetails",null);d(this,"isSearching",!1);this.container=t,this.bookingCtrl=n,this.historyRepo=o,e!=null&&e.code&&(this.bookingCodeInput=e.code),e!=null&&e.phone&&(this.customerPhoneInput=e.phone)}async render(){this.container.innerHTML=`
      <div class="max-w-3xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-slate-900">Tra cứu &amp; Quản lý Đặt phòng</h1>
          <p class="text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Để bảo vệ thông tin khách hàng, vui lòng cung cấp chính xác <strong>Mã đặt phòng</strong> và <strong>Số điện thoại</strong> đã đăng ký.
          </p>
        </div>

        <!-- Lookup Form Card -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <form id="lookup-form" class="space-y-4" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="lookup-code" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mã đặt phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="lookup-code"
                  placeholder="Ví dụ: BKTEST01"
                  value="${u(this.bookingCodeInput)}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                  required
                />
                <p id="err-lookup-code" class="text-xs text-rose-600 mt-1 hidden"></p>
              </div>

              <div>
                <label for="lookup-phone" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại đặt phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="lookup-phone"
                  placeholder="Ví dụ: 0912345678"
                  value="${u(this.customerPhoneInput)}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p id="err-lookup-phone" class="text-xs text-rose-600 mt-1 hidden"></p>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                type="submit"
                id="btn-submit-lookup"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Tra cứu đặt phòng</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Result Container -->
        <div id="lookup-result-container">
          <!-- Kết quả tra cứu sẽ render ở đây -->
        </div>
      </div>
    `,this.bindFormEvents(),this.bookingCodeInput&&this.customerPhoneInput&&await this.executeLookup()}bindFormEvents(){const t=this.container.querySelector("#lookup-form"),e=this.container.querySelector("#lookup-code"),n=this.container.querySelector("#lookup-phone");t==null||t.addEventListener("submit",async o=>{o.preventDefault(),this.bookingCodeInput=e.value.trim().toUpperCase(),this.customerPhoneInput=n.value.trim(),await this.executeLookup()})}async executeLookup(){if(this.isSearching)return;this.isSearching=!0;const t=this.container.querySelector("#btn-submit-lookup"),e=this.container.querySelector("#lookup-result-container");t&&(t.disabled=!0,t.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra...'),e&&(e.innerHTML=`
        <div class="py-12 text-center text-slate-500">
          <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
          <p class="text-sm">Đang xác thực thông tin đặt phòng...</p>
        </div>
      `);try{this.activeDetails=await this.bookingCtrl.lookupBooking(this.bookingCodeInput,this.customerPhoneInput),g.success("Đã tìm thấy thông tin đơn đặt phòng."),await this.renderBookingDetails()}catch(n){g.error(n.message||"Không tìm thấy thông tin đặt phòng phù hợp."),e&&(e.innerHTML=`
          <div class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
            <svg class="w-8 h-8 text-rose-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h4 class="font-bold text-base mb-1">Tra cứu không thành công</h4>
            <p class="text-sm">${u(n.message)}</p>
          </div>
        `)}finally{this.isSearching=!1,t&&(t.disabled=!1,t.innerHTML="<span>Tra cứu đặt phòng</span>")}}async renderBookingDetails(){if(!this.activeDetails)return;const{booking:t,room:e,roomType:n,payment:o}=this.activeDetails,s=this.container.querySelector("#lookup-result-container");if(!s)return;const a=I(),i=(t.status==="pending"||t.status==="confirmed")&&a<t.checkInDate,c=tt(t.checkInDate),l=await this.historyRepo.findBookingHistory(t.id);if(s.innerHTML=`
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        <!-- Top status bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">MÃ ĐẶT PHÒNG:</span>
              <span class="font-mono font-black text-xl text-blue-700">${u(t.bookingCode)}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Tạo lúc: ${new Date(t.createdAt).toLocaleString("vi-VN")}</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${et[t.status]}">
              ${E[t.status]}
            </span>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Room info -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Thông tin phòng
            </h4>
            <div class="flex justify-between">
              <span class="text-slate-500">Số phòng:</span>
              <strong class="text-slate-800">Phòng ${u(e.roomNumber)} (Tầng ${e.floor})</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Loại phòng:</span>
              <strong class="text-slate-800">${u(n.name)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Thời gian lưu trú:</span>
              <strong class="text-slate-800">${y(t.checkInDate)} &rarr; ${y(t.checkOutDate)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số đêm:</span>
              <strong class="text-blue-600">${t.nights} đêm</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số khách:</span>
              <strong class="text-slate-800">${t.adults} người lớn${t.children>0?`, ${t.children} trẻ em`:""}</strong>
            </div>
          </div>

          <!-- Customer & Payment info -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Thông tin người đặt &amp; Thanh toán
            </h4>
            <div class="flex justify-between">
              <span class="text-slate-500">Khách hàng:</span>
              <strong class="text-slate-800">${u(t.customerName)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số điện thoại:</span>
              <strong class="text-slate-800 font-mono">${u(t.customerPhone)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Email:</span>
              <strong class="text-slate-800">${u(t.customerEmail)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Tổng tiền đơn đặt (VAT 8%):</span>
              <strong class="text-blue-600 font-bold text-sm">${x(t.totalAmount)}</strong>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-slate-500">Tình trạng thanh toán:</span>
              ${o?`
                <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${lt[o.status]}">
                  ${rt[o.status]} (${Ht[o.method]})
                </span>
              `:'<span class="text-slate-400">Chưa có hóa đơn</span>'}
            </div>
            ${o&&o.refundAmount>0?`
              <div class="flex justify-between text-rose-600 font-bold pt-1">
                <span>Số tiền đã hoàn lại:</span>
                <span>${x(o.refundAmount)}</span>
              </div>
            `:""}
          </div>
        </div>

        ${t.note?`
          <div class="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong>Ghi chú:</strong> ${u(t.note)}
          </div>
        `:""}

        <!-- Timeline Lịch sử biến động trạng thái -->
        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Lịch sử xử lý đơn đặt phòng
          </h4>
          <div class="space-y-3">
            ${l.map(h=>`
              <div class="flex items-start text-xs text-slate-600 gap-2.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                <div>
                  <span class="font-bold text-slate-800">${new Date(h.changedAt).toLocaleString("vi-VN")}:</span>
                  <span class="text-slate-600">${u(h.note||"Cập nhật trạng thái")}</span>
                  <span class="text-slate-400 font-mono text-[11px]">(${h.changedBy})</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Action Box (Hủy phòng) -->
        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-500">
            ${i?`
              <span>Còn <strong>${c} ngày</strong> tới ngày nhận phòng. Bạn có thể yêu cầu hủy đặt phòng trực tuyến.</span>
            `:`
              <span class="text-slate-400">Đơn đặt phòng không trong diện được hủy trực tuyến (${E[t.status]}).</span>
            `}
          </div>

          ${i?`
            <button
              type="button"
              id="btn-request-cancel"
              class="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all shadow-sm"
            >
              Hủy đặt phòng này
            </button>
          `:""}
        </div>
      </div>
    `,i){const h=s.querySelector("#btn-request-cancel");h==null||h.addEventListener("click",()=>this.handleCancelClick())}}async handleCancelClick(){if(!this.activeDetails)return;const{booking:t}=this.activeDetails;try{const e=await this.bookingCtrl.previewCancel(t.bookingCode,t.customerPhone);if(!e.canCancel){g.warning(e.reasonBlocked||"Không thể hủy đơn đặt phòng này.");return}const n=`
        <div class="space-y-4">
          <p class="text-sm text-slate-600">
            Bạn đang yêu cầu hủy đơn đặt phòng <strong>${u(t.bookingCode)}</strong>.
          </p>

          <!-- Chính sách hoàn tiền hiển thị trước khi khách xác nhận -->
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <h5 class="font-bold text-amber-900 uppercase">Chính sách hoàn tiền áp dụng:</h5>
            <p class="text-amber-800">${u(e.refundDescription)}</p>
            <div class="pt-2 border-t border-amber-200 flex justify-between font-bold text-sm">
              <span class="text-amber-900">Số tiền hoàn lại dự kiến:</span>
              <span class="text-blue-700">${x(e.refundAmount)} (${e.refundPercent}%)</span>
            </div>
          </div>

          <div>
            <label for="cancel-reason-input" class="block text-xs font-bold text-slate-700 mb-1.5">
              Lý do hủy phòng (tùy chọn)
            </label>
            <textarea
              id="cancel-reason-input"
              rows="2"
              placeholder="Ví dụ: Thay đổi kế hoạch du lịch, bận việc đột xuất..."
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          <p class="text-[11px] text-slate-400">
            * Sau khi hủy, phòng sẽ được giải phóng cho khách khác đặt và không thể hoàn tác hành động này.
          </p>
        </div>
      `;w.show({title:"Xác nhận hủy đặt phòng",contentHtml:n,confirmText:"Xác nhận hủy phòng ngay",cancelText:"Giữ lại đặt phòng",confirmClass:"bg-rose-600 hover:bg-rose-700",onConfirm:async()=>{const o=document.getElementById("cancel-reason-input"),s=(o==null?void 0:o.value.trim())||"",a=await this.bookingCtrl.cancelBooking(t.bookingCode,t.customerPhone,s);g.success(`Đã hủy đặt phòng thành công! Hoàn tiền: ${x(a.refundAmount)}`),await this.executeLookup()}})}catch(e){g.error(e.message||"Lỗi khi chuẩn bị thông tin hủy phòng.")}}}class _t{constructor(t,e=new j){d(this,"container");d(this,"staffCtrl");d(this,"isLoggingIn",!1);this.container=t,this.staffCtrl=e}render(){this.container.innerHTML=`
      <div class="max-w-md mx-auto my-8 space-y-6">
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Khu vực Nhân viên</h2>
            <p class="text-xs text-slate-500 mt-1">Đăng nhập hệ thống quản trị và kiểm duyệt đặt phòng</p>
          </div>

          <form id="staff-login-form" class="space-y-4" novalidate>
            <div>
              <label for="staff-username" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="staff-username"
                placeholder="admin hoặc receptionist"
                value="admin"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label for="staff-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                id="staff-password"
                placeholder="••••••"
                value="123456"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <p id="staff-login-error" class="text-xs text-rose-600 font-medium hidden"></p>

            <button
              type="submit"
              id="btn-staff-login"
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Đăng nhập hệ thống</span>
            </button>
          </form>

          <!-- Seed accounts hint -->
          <div class="mt-8 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
            <p class="font-bold text-slate-700">Tài khoản mẫu seed sẵn trong DB:</p>
            <p>&bull; Quản trị viên: <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">admin</code> / <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">123456</code></p>
            <p>&bull; Lễ tân: <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">receptionist</code> / <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">123456</code></p>
          </div>
        </div>
      </div>
    `,this.bindEvents()}bindEvents(){const t=this.container.querySelector("#staff-login-form"),e=this.container.querySelector("#staff-username"),n=this.container.querySelector("#staff-password"),o=this.container.querySelector("#staff-login-error"),s=this.container.querySelector("#btn-staff-login");t==null||t.addEventListener("submit",async a=>{if(a.preventDefault(),!this.isLoggingIn){this.isLoggingIn=!0,o&&o.classList.add("hidden"),s&&(s.disabled=!0,s.innerHTML='<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xác thực...');try{const i=await this.staffCtrl.login(e.value,n.value);g.success(`Chào mừng ${i.fullName} đăng nhập thành công!`),z.render(),window.location.hash="#/staff/dashboard"}catch(i){o&&(o.textContent=i.message||"Đăng nhập thất bại.",o.classList.remove("hidden")),g.error(i.message||"Đăng nhập không thành công.")}finally{this.isLoggingIn=!1,s&&(s.disabled=!1,s.innerHTML="<span>Đăng nhập hệ thống</span>")}}})}}class jt{constructor(t,e=new j){d(this,"container");d(this,"staffCtrl");this.container=t,this.staffCtrl=e}async render(){this.container.innerHTML=`
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải số liệu thống kê tổng quan...</p>
      </div>
    `;try{const t=await this.staffCtrl.getDashboardStats(),e=this.staffCtrl.getCurrentStaff();this.container.innerHTML=`
        <div class="space-y-8">
          <!-- Welcome header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Bảng điều khiển quản trị
              </span>
              <h1 class="text-2xl font-black text-slate-900 mt-2">
                Xin chào, ${(e==null?void 0:e.fullName)||"Nhân viên"}!
              </h1>
              <p class="text-xs text-slate-500 mt-1">
                Tài khoản: <strong class="font-mono text-slate-700">${e==null?void 0:e.username}</strong> &bull; Trạng thái hệ thống hoạt động ổn định
              </p>
            </div>

            <div class="flex items-center gap-2.5">
              <a
                href="#/staff/bookings"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <span>Duyệt đơn đặt (${t.pendingBookings})</span>
              </a>
              <a
                href="#/staff/rooms"
                class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 transition-all"
              >
                Quản lý danh sách phòng
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total rooms -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-xs font-bold uppercase tracking-wider">Tổng số phòng</span>
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div class="text-3xl font-black text-slate-900 mt-2">${t.totalRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">Quy mô hiện tại của khách sạn</span>
            </div>

            <!-- Available rooms -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-emerald-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Sẵn sàng đón khách</span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div class="text-3xl font-black text-emerald-600 mt-2">${t.availableRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">Phòng sạch trống có thể đặt</span>
            </div>

            <!-- Occupied / Cleaning -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-blue-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Đang có khách / Dọn</span>
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <div class="text-3xl font-black text-blue-600 mt-2">${t.occupiedRooms+t.cleaningRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">${t.occupiedRooms} đang ở, ${t.cleaningRooms} đang dọn dẹp</span>
            </div>

            <!-- Pending Bookings Alert -->
            <div class="bg-white p-5 rounded-2xl border ${t.pendingBookings>0?"border-amber-300 bg-amber-50/30":"border-slate-200"} shadow-sm">
              <div class="flex items-center justify-between text-amber-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Đơn chờ duyệt</span>
                ${t.pendingBookings>0?'<span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>':""}
              </div>
              <div class="text-3xl font-black text-amber-600 mt-2">${t.pendingBookings}</div>
              <span class="text-[11px] text-amber-700 mt-1 block font-medium">Cần nhân viên kiểm tra &amp; xác nhận</span>
            </div>
          </div>

          <!-- Quick Navigation Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <a href="#/staff/bookings" class="block p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Kiểm duyệt &amp; Xác nhận Đặt phòng &rarr;
                </h3>
                <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  ${t.pendingBookings} đơn chờ
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                Xem toàn bộ đơn đặt phòng của khách hàng, kiểm tra tình trạng thanh toán, phê duyệt xác nhận đơn, thực hiện Check-in / Check-out cho khách.
              </p>
            </a>

            <a href="#/staff/rooms" class="block p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Quản lý Danh mục Phòng &amp; Trạng thái &rarr;
                </h3>
                <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                  ${t.totalRooms} phòng
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                Thêm mới phòng, cập nhật thông tin phòng, chuyển đổi trạng thái phòng (Sẵn sàng &harr; Đang dọn &harr; Bảo dưỡng).
              </p>
            </a>
          </div>
        </div>
      `}catch(t){g.error(t.message||"Lỗi khi tải thông tin Dashboard.")}}}class qt{constructor(t,e=new G){d(this,"container");d(this,"roomCtrl");d(this,"allRooms",[]);d(this,"filteredRooms",[]);d(this,"statusFilter","");d(this,"searchKeyword","");d(this,"currentPage",1);d(this,"pageSize",10);this.container=t,this.roomCtrl=e}async render(){this.container.innerHTML=`
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải danh sách phòng...</p>
      </div>
    `;try{this.allRooms=await this.roomCtrl.getAllRoomsWithTypes(),this.filterData(),this.renderTableScreen()}catch(t){g.error(t.message||"Lỗi khi tải danh sách phòng.")}}filterData(){let t=this.allRooms;if(this.statusFilter&&(t=t.filter(e=>e.status===this.statusFilter)),this.searchKeyword){const e=this.searchKeyword.toLowerCase();t=t.filter(n=>n.roomNumber.toLowerCase().includes(e)||n.roomType.name.toLowerCase().includes(e))}this.filteredRooms=t}renderTableScreen(){const t=(this.currentPage-1)*this.pageSize,e=t+this.pageSize,n=this.filteredRooms.slice(t,e),o=n.length===0?'<tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm">Không tìm thấy phòng nào phù hợp</td></tr>':n.map(a=>{const i=vt[a.status]||{badge:"bg-slate-100 text-slate-700"};return`
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
              <td class="px-6 py-4 font-black font-mono text-slate-900 text-sm">
                ${u(a.roomNumber)}
              </td>
              <td class="px-6 py-4 font-medium text-slate-600">
                Tầng ${a.floor}
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800">${u(a.roomType.name)}</div>
                <div class="text-[11px] text-slate-400">Tối đa ${a.roomType.capacity} khách</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${i.badge}">
                  ${N[a.status]}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500 max-w-xs truncate">
                ${u(a.note||"—")}
              </td>
              <td class="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                <button
                  type="button"
                  class="btn-change-status px-2.5 py-1.5 rounded-lg border border-slate-200 text-indigo-600 hover:bg-indigo-50 font-bold transition-all"
                  data-room-id="${a.id}"
                >
                  Đổi trạng thái
                </button>
                <button
                  type="button"
                  class="btn-edit-room px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-all"
                  data-room-id="${a.id}"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  class="btn-delete-room px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
                  data-room-id="${a.id}"
                >
                  Xóa
                </button>
              </td>
            </tr>
          `}).join(""),s=B.render({currentPage:this.currentPage,pageSize:this.pageSize,totalItems:this.filteredRooms.length,onPageChange:()=>{},onPageSizeChange:()=>{}});this.container.innerHTML=`
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Quản lý Phòng Khách sạn</h1>
            <p class="text-xs text-slate-500 mt-1">
              Thực hiện thêm, sửa, xóa phòng và điều chỉnh trạng thái vận hành phòng
            </p>
          </div>
          <button
            type="button"
            id="btn-add-new-room"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Thêm phòng mới</span>
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              id="input-search-room"
              placeholder="Tìm theo số phòng, tên loại..."
              value="${u(this.searchKeyword)}"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-64 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label class="text-xs font-bold text-slate-500 whitespace-nowrap">Trạng thái:</label>
            <select
              id="select-room-status-filter"
              class="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" ${this.statusFilter===""?"selected":""}>Tất cả trạng thái</option>
              <option value="available" ${this.statusFilter==="available"?"selected":""}>Sẵn sàng đón khách</option>
              <option value="occupied" ${this.statusFilter==="occupied"?"selected":""}>Đang có khách</option>
              <option value="cleaning" ${this.statusFilter==="cleaning"?"selected":""}>Đang dọn dẹp</option>
              <option value="maintenance" ${this.statusFilter==="maintenance"?"selected":""}>Bảo dưỡng sửa chữa</option>
            </select>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="px-6 py-3.5">Số phòng</th>
                  <th class="px-6 py-3.5">Tầng</th>
                  <th class="px-6 py-3.5">Loại phòng</th>
                  <th class="px-6 py-3.5">Trạng thái</th>
                  <th class="px-6 py-3.5">Ghi chú</th>
                  <th class="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${o}
              </tbody>
            </table>
          </div>

          <div id="room-manage-pagination" class="px-4 pb-2">
            ${s}
          </div>
        </div>
      </div>
    `,this.bindTableEvents()}bindTableEvents(){var o;const t=this.container.querySelector("#input-search-room");t==null||t.addEventListener("input",()=>{this.searchKeyword=t.value,this.currentPage=1,this.filterData(),this.renderTableScreen()});const e=this.container.querySelector("#select-room-status-filter");e==null||e.addEventListener("change",()=>{this.statusFilter=e.value,this.currentPage=1,this.filterData(),this.renderTableScreen()});const n=this.container.querySelector("#room-manage-pagination");n&&B.bindEvents(n,{currentPage:this.currentPage,pageSize:this.pageSize,totalItems:this.filteredRooms.length,onPageChange:s=>{this.currentPage=s,this.renderTableScreen()},onPageSizeChange:s=>{this.pageSize=s,this.currentPage=1,this.renderTableScreen()}}),(o=this.container.querySelector("#btn-add-new-room"))==null||o.addEventListener("click",()=>{this.showAddRoomModal()}),this.container.querySelectorAll(".btn-edit-room").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-room-id"),i=this.allRooms.find(c=>c.id===a);i&&this.showEditRoomModal(i)})}),this.container.querySelectorAll(".btn-delete-room").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-room-id"),i=this.allRooms.find(c=>c.id===a);i&&this.confirmDeleteRoom(i)})}),this.container.querySelectorAll(".btn-change-status").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-room-id"),i=this.allRooms.find(c=>c.id===a);i&&this.showChangeStatusModal(i)})})}async showAddRoomModal(){const n=`
      <form id="form-modal-add-room" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số phòng *</label>
          <input type="text" id="modal-add-room-number" placeholder="Ví dụ: 203, 305" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
          <p id="err-modal-roomNumber" class="text-xs text-rose-600 mt-1 hidden"></p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tầng *</label>
            <input type="number" id="modal-add-floor" min="1" max="100" value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
            <p id="err-modal-floor" class="text-xs text-rose-600 mt-1 hidden"></p>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Loại phòng *</label>
            <select id="modal-add-room-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" required>
              ${(await this.roomCtrl.getAllRoomTypes()).map(o=>`<option value="${o.id}">${u(o.name)} (Tối đa ${o.capacity} người)</option>`).join("")}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú phòng</label>
          <textarea id="modal-add-note" rows="2" placeholder="Ghi chú về vị trí, hướng phòng..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"></textarea>
        </div>
      </form>
    `;w.show({title:"Thêm phòng mới",contentHtml:n,confirmText:"Lưu phòng",confirmClass:"bg-indigo-600 hover:bg-indigo-700",onConfirm:async()=>{var c,l,h,m;const o=(c=document.getElementById("modal-add-room-number"))==null?void 0:c.value,s=parseInt(((l=document.getElementById("modal-add-floor"))==null?void 0:l.value)||"1",10),a=(h=document.getElementById("modal-add-room-type"))==null?void 0:h.value,i=(m=document.getElementById("modal-add-note"))==null?void 0:m.value;try{await this.roomCtrl.createRoom({roomNumber:o,floor:s,roomTypeId:a,note:i}),g.success(`Đã thêm mới phòng ${o} thành công!`),await this.render()}catch(v){throw g.error(v.message||"Thêm phòng thất bại."),v}}})}async showEditRoomModal(t){const n=(await this.roomCtrl.getAllRoomTypes()).map(s=>`<option value="${s.id}" ${s.id===t.roomTypeId?"selected":""}>${u(s.name)}</option>`).join(""),o=`
      <form class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số phòng *</label>
          <input type="text" id="modal-edit-room-number" value="${u(t.roomNumber)}" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tầng *</label>
            <input type="number" id="modal-edit-floor" min="1" max="100" value="${t.floor}" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Loại phòng *</label>
            <select id="modal-edit-room-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" required>
              ${n}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú</label>
          <textarea id="modal-edit-note" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm">${u(t.note||"")}</textarea>
        </div>
      </form>
    `;w.show({title:`Chỉnh sửa thông tin Phòng ${t.roomNumber}`,contentHtml:o,confirmText:"Lưu thay đổi",confirmClass:"bg-indigo-600 hover:bg-indigo-700",onConfirm:async()=>{var l,h,m,v;const s=(l=document.getElementById("modal-edit-room-number"))==null?void 0:l.value,a=parseInt(((h=document.getElementById("modal-edit-floor"))==null?void 0:h.value)||"1",10),i=(m=document.getElementById("modal-edit-room-type"))==null?void 0:m.value,c=(v=document.getElementById("modal-edit-note"))==null?void 0:v.value;try{await this.roomCtrl.updateRoom(t.id,{roomNumber:s,floor:a,roomTypeId:i,note:c}),g.success(`Cập nhật phòng ${s} thành công!`),await this.render()}catch(T){throw g.error(T.message||"Cập nhật thất bại."),T}}})}confirmDeleteRoom(t){w.show({title:`Xác nhận xóa Phòng ${t.roomNumber}?`,contentHtml:`
        <p class="text-sm text-slate-600">
          Bạn có chắc chắn muốn xóa phòng <strong>${u(t.roomNumber)}</strong> khỏi hệ thống không?
        </p>
        <p class="text-xs text-rose-600 mt-2">
          * Quy tắc: Hệ thống sẽ từ chối xóa nếu phòng này đang có đơn đặt phòng chờ duyệt, đã xác nhận hoặc đang có khách lưu trú.
        </p>
      `,confirmText:"Xóa phòng này",confirmClass:"bg-rose-600 hover:bg-rose-700",onConfirm:async()=>{try{await this.roomCtrl.deleteRoom(t.id),g.success(`Đã xóa phòng ${t.roomNumber} thành công!`),await this.render()}catch(e){throw g.error(e.message||"Không thể xóa phòng."),e}}})}showChangeStatusModal(t){const n=["available","occupied","cleaning","maintenance"].map(s=>`<option value="${s}" ${s===t.status?"selected":""}>${N[s]}</option>`).join(""),o=`
      <form class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Trạng thái hiện tại:</label>
          <span class="font-semibold text-slate-900">${N[t.status]}</span>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Chuyển sang trạng thái mới:</label>
          <select id="modal-change-status-select" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
            ${n}
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Lý do thay đổi / Ghi chú</label>
          <textarea id="modal-change-status-note" rows="2" placeholder="Ví dụ: Đã dọn phòng xong, bảo dưỡng điều hòa..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"></textarea>
        </div>
        <p class="text-[11px] text-slate-400">
          * Chuyển trạng thái tuân theo State Machine. Phòng đang có khách ở không thể chuyển trực tiếp về "Sẵn sàng đón khách".
        </p>
      </form>
    `;w.show({title:`Cập nhật trạng thái Phòng ${t.roomNumber}`,contentHtml:o,confirmText:"Cập nhật trạng thái",confirmClass:"bg-indigo-600 hover:bg-indigo-700",onConfirm:async()=>{var l,h;const s=(l=document.getElementById("modal-change-status-select"))==null?void 0:l.value,a=(h=document.getElementById("modal-change-status-note"))==null?void 0:h.value,i=S.get(),c=(i==null?void 0:i.username)||"admin";try{const m=await this.roomCtrl.updateRoomStatus(t.id,s,c,a);if(m.warning){w.show({title:"Cảnh báo lịch đặt phòng!",contentHtml:`
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  ${u(m.warning)}
                </div>
              `,confirmText:"Vẫn tiếp tục chuyển bảo dưỡng",confirmClass:"bg-amber-600 hover:bg-amber-700",onConfirm:async()=>{await this.roomCtrl.updateRoomStatus(t.id,s,c,a,!0),g.success(`Đã chuyển phòng ${t.roomNumber} sang ${N[s]}`),await this.render()}});return}g.success(`Đã chuyển phòng ${t.roomNumber} sang ${N[s]}`),await this.render()}catch(m){throw g.error(m.message||"Cập nhật trạng thái thất bại."),m}}})}}class Kt{constructor(t,e=new j){d(this,"container");d(this,"staffCtrl");d(this,"historyRepo",new O);d(this,"allBookings",[]);d(this,"currentTab","all");d(this,"searchKeyword","");d(this,"currentPage",1);d(this,"pageSize",10);this.container=t,this.staffCtrl=e}async render(){this.container.innerHTML=`
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải danh sách đặt phòng...</p>
      </div>
    `;try{this.allBookings=await this.staffCtrl.getAllBookingsWithDetails(),this.renderScreen()}catch(t){g.error(t.message||"Lỗi khi tải danh sách đặt phòng.")}}getFilteredList(){let t=this.allBookings;if(this.currentTab!=="all"&&(t=t.filter(e=>e.booking.status===this.currentTab)),this.searchKeyword){const e=this.searchKeyword.toLowerCase();t=t.filter(n=>n.booking.bookingCode.toLowerCase().includes(e)||n.booking.customerName.toLowerCase().includes(e)||n.booking.customerPhone.includes(e)||n.roomNumber.toLowerCase().includes(e))}return t}renderScreen(){const t=this.getFilteredList(),e=(this.currentPage-1)*this.pageSize,n=e+this.pageSize,o=t.slice(e,n),a=[{key:"all",label:"Tất cả"},{key:"pending",label:"Chờ duyệt"},{key:"confirmed",label:"Đã xác nhận"},{key:"checked_in",label:"Đang lưu trú"},{key:"checked_out",label:"Đã trả phòng"},{key:"cancelled",label:"Đã hủy"}].map(l=>`
        <button
          type="button"
          class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.currentTab===l.key?"bg-indigo-600 text-white shadow-sm":"text-slate-600 hover:bg-slate-100"}"
          data-tab="${l.key}"
        >
          ${l.label}
        </button>
      `).join(""),i=o.length===0?'<tr><td colspan="7" class="px-6 py-12 text-center text-slate-400 text-xs">Không có đơn đặt phòng nào trong mục này</td></tr>':o.map(l=>{const h=l.booking,m=l.payment;return`
              <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
                <td class="px-6 py-4">
                  <span class="font-mono font-black text-blue-700 text-sm block">${u(h.bookingCode)}</span>
                  <span class="text-[11px] text-slate-400">${new Date(h.createdAt).toLocaleDateString("vi-VN")}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">${u(h.customerName)}</div>
                  <div class="text-[11px] font-mono text-slate-500">${u(h.customerPhone)}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="font-bold text-slate-800">Phòng ${u(l.roomNumber)}</span>
                </td>
                <td class="px-6 py-4">
                  <div>${y(h.checkInDate)} &rarr; ${y(h.checkOutDate)}</div>
                  <span class="text-[11px] text-blue-600 font-bold">${h.nights} đêm &bull; ${h.adults} lớn${h.children?` + ${h.children} nhỏ`:""}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-extrabold text-slate-900">${x(h.totalAmount)}</div>
                  ${m?`<span class="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${lt[m.status]}">${rt[m.status]||m.status}</span>`:'<span class="text-slate-400 text-[10px]">Chưa tạo</span>'}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${et[h.status]}">
                    ${E[h.status]}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-y-1 whitespace-nowrap">
                  ${this.renderActionButtons(h)}
                </td>
              </tr>
            `}).join(""),c=B.render({currentPage:this.currentPage,pageSize:this.pageSize,totalItems:t.length,onPageChange:()=>{},onPageSizeChange:()=>{}});this.container.innerHTML=`
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Kiểm duyệt &amp; Xác nhận Đặt phòng</h1>
            <p class="text-xs text-slate-500 mt-1">
              Phê duyệt đơn đặt, quản lý quy trình Check-in nhận phòng và Check-out trả phòng
            </p>
          </div>
        </div>

        <!-- Filter Tabs & Search -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-wrap gap-2">
            ${a}
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <input
              type="text"
              id="input-search-booking"
              placeholder="Tìm theo mã BK, tên khách, số điện thoại, số phòng..."
              value="${u(this.searchKeyword)}"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-80 focus:ring-2 focus:ring-indigo-500"
            />
            <span class="text-xs text-slate-500">
              Tổng cộng: <strong>${t.length}</strong> đơn
            </span>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="px-6 py-3.5">Mã đơn</th>
                  <th class="px-6 py-3.5">Khách hàng</th>
                  <th class="px-6 py-3.5">Phòng</th>
                  <th class="px-6 py-3.5">Lưu trú</th>
                  <th class="px-6 py-3.5">Tổng tiền / TT</th>
                  <th class="px-6 py-3.5">Trạng thái</th>
                  <th class="px-6 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                ${i}
              </tbody>
            </table>
          </div>

          <div id="booking-confirm-pagination" class="px-4 pb-2">
            ${c}
          </div>
        </div>
      </div>
    `,this.bindEvents()}renderActionButtons(t){const e=[];return t.status==="pending"?(e.push(`
        <button
          type="button"
          class="btn-confirm-booking px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
          data-id="${t.id}"
        >
          Xác nhận đơn
        </button>
      `),e.push(`
        <button
          type="button"
          class="btn-cancel-booking px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
          data-id="${t.id}"
        >
          Từ chối
        </button>
      `)):t.status==="confirmed"?(e.push(`
        <button
          type="button"
          class="btn-checkin-booking px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
          data-id="${t.id}"
        >
          Check-in
        </button>
      `),e.push(`
        <button
          type="button"
          class="btn-noshow-booking px-2.5 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold transition-all"
          data-id="${t.id}"
        >
          No-show
        </button>
      `),e.push(`
        <button
          type="button"
          class="btn-cancel-booking px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
          data-id="${t.id}"
        >
          Hủy
        </button>
      `)):t.status==="checked_in"&&e.push(`
        <button
          type="button"
          class="btn-checkout-booking px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
          data-id="${t.id}"
        >
          Check-out (Trả phòng)
        </button>
      `),e.push(`
      <button
        type="button"
        class="btn-view-history px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-all"
        data-id="${t.id}"
        title="Xem lịch sử biến động"
      >
        Lịch sử
      </button>
    `),e.join(" ")}bindEvents(){this.container.querySelectorAll(".tab-btn").forEach(s=>{s.addEventListener("click",()=>{this.currentTab=s.getAttribute("data-tab"),this.currentPage=1,this.renderScreen()})});const t=this.container.querySelector("#input-search-booking");t==null||t.addEventListener("input",()=>{this.searchKeyword=t.value,this.currentPage=1,this.renderScreen()});const e=this.container.querySelector("#booking-confirm-pagination");e&&B.bindEvents(e,{currentPage:this.currentPage,pageSize:this.pageSize,totalItems:this.getFilteredList().length,onPageChange:s=>{this.currentPage=s,this.renderScreen()},onPageSizeChange:s=>{this.pageSize=s,this.currentPage=1,this.renderScreen()}});const n=S.get(),o=(n==null?void 0:n.username)||"admin";this.container.querySelectorAll(".btn-confirm-booking").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");if(a)try{const i=await this.staffCtrl.confirmBooking(a,o);i.warning?g.warning(`Đã xác nhận đơn! Cảnh báo: ${i.warning}`):g.success("Đã xác nhận đặt phòng thành công!"),await this.render()}catch(i){g.error(i.message||"Xác nhận đặt phòng thất bại.")}})}),this.container.querySelectorAll(".btn-checkin-booking").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");if(a)try{await this.staffCtrl.checkIn(a,o),g.success('Khách đã hoàn tất thủ tục nhận phòng (Check-in)! Phòng đã chuyển sang trạng thái "Đang có khách".'),await this.render()}catch(i){g.error(i.message||"Lỗi Check-in.")}})}),this.container.querySelectorAll(".btn-checkout-booking").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");if(a)try{await this.staffCtrl.checkOut(a,o),g.success('Khách đã hoàn tất trả phòng (Check-out)! Phòng đã tự động chuyển sang trạng thái "Đang dọn dẹp".'),await this.render()}catch(i){g.error(i.message||"Lỗi Check-out.")}})}),this.container.querySelectorAll(".btn-noshow-booking").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");a&&w.show({title:"Xác nhận khách không đến (No-show)?",contentHtml:'<p class="text-xs text-slate-600">Đơn đặt phòng sẽ chuyển sang trạng thái No-show và phòng được giải phóng.</p>',confirmText:"Đánh dấu No-show",confirmClass:"bg-purple-600 hover:bg-purple-700",onConfirm:async()=>{await this.staffCtrl.markNoShow(a,o),g.info("Đã đánh dấu đơn đặt phòng là No-show."),await this.render()}})})}),this.container.querySelectorAll(".btn-cancel-booking").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");a&&w.show({title:"Hủy đơn đặt phòng này?",contentHtml:`
            <div class="space-y-3 text-xs">
              <p class="text-slate-600">Nhập lý do nhân viên hủy đơn:</p>
              <textarea id="staff-cancel-reason" rows="2" placeholder="Ví dụ: Khách gọi điện yêu cầu hủy, trùng lịch sự cố..." class="w-full px-3 py-2 rounded-xl border border-slate-300"></textarea>
            </div>
          `,confirmText:"Xác nhận hủy",confirmClass:"bg-rose-600 hover:bg-rose-700",onConfirm:async()=>{var c;const i=((c=document.getElementById("staff-cancel-reason"))==null?void 0:c.value)||"Nhân viên hủy";await this.staffCtrl.cancelBookingByStaff(a,o,i),g.success("Đã hủy đơn đặt phòng."),await this.render()}})})}),this.container.querySelectorAll(".btn-view-history").forEach(s=>{s.addEventListener("click",async()=>{const a=s.getAttribute("data-id");if(!a)return;const i=await this.historyRepo.findBookingHistory(a),c=`
          <div class="space-y-3 text-xs">
            ${i.length===0?'<p class="text-slate-400">Chưa có lịch sử</p>':""}
            ${i.map(l=>`
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div class="flex justify-between font-bold text-slate-800">
                  <span>${u(l.fromStatus)} &rarr; ${u(l.toStatus)}</span>
                  <span class="text-slate-400 font-normal">${new Date(l.changedAt).toLocaleString("vi-VN")}</span>
                </div>
                <div class="text-slate-600 mt-1">${u(l.note||"")}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">Thực hiện bởi: ${u(l.changedBy)}</div>
              </div>
            `).join("")}
          </div>
        `;w.show({title:"Lịch sử xử lý đơn đặt phòng",contentHtml:c,cancelText:"Đóng"})})})}}class ct{static init(t="app"){const e=document.getElementById(t);if(!e)throw new Error(`Container #${t} không tồn tại.`);this.appContainer=e,window.addEventListener("hashchange",()=>this.handleRouting()),this.handleRouting()}static async handleRouting(){z.render();const t=window.location.hash||"#/",[e,n]=t.split("?"),o=new URLSearchParams(n||"");if(e.startsWith("#/staff")&&e!=="#/staff/login"&&!S.isLoggedIn()){g.warning("Bạn cần đăng nhập tài khoản nhân viên để truy cập khu vực này."),window.location.hash="#/staff/login";return}switch(window.scrollTo({top:0,behavior:"instant"}),e){case"#/":case"#/search":{await new Ct(this.appContainer).render();break}case"#/book":{const s=o.get("roomId")||"",a=o.get("checkIn")||"",i=o.get("checkOut")||"";if(!s||!a||!i){g.warning("Vui lòng chọn phòng và khoảng ngày hợp lệ trước khi đặt."),window.location.hash="#/";return}await new At(this.appContainer,{roomId:s,checkInDate:a,checkOutDate:i}).render();break}case"#/payment":{const s=o.get("bookingId")||"";if(!s){window.location.hash="#/";return}await new Ot(this.appContainer,s).render();break}case"#/booking-success":{const s=o.get("code")||"",a=o.get("phone")||"";await new Mt(this.appContainer,s,a).render();break}case"#/lookup":{const s=o.get("code")||"",a=o.get("phone")||"";await new Vt(this.appContainer,{code:s,phone:a}).render();break}case"#/staff":case"#/staff/login":{if(S.isLoggedIn()){window.location.hash="#/staff/dashboard";return}new _t(this.appContainer).render();break}case"#/staff/dashboard":{await new jt(this.appContainer).render();break}case"#/staff/rooms":{await new qt(this.appContainer).render();break}case"#/staff/bookings":{await new Kt(this.appContainer).render();break}default:{this.appContainer.innerHTML=`
          <div class="max-w-md mx-auto my-16 bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
            <h2 class="text-3xl font-black text-slate-800 mb-2">404</h2>
            <p class="text-sm text-slate-500 mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
            <a href="#/" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
              Về trang tìm phòng
            </a>
          </div>
        `;break}}}}d(ct,"appContainer");class dt{static init(){this.bannerEl=document.getElementById("network-banner"),xt((t,e)=>{this.updateStatus(t,e)}),window.addEventListener("offline",()=>{this.updateStatus(!1,"Mất kết nối Internet trên thiết bị.")}),window.addEventListener("online",()=>{this.updateStatus(!0)})}static updateStatus(t,e){var n;this.bannerEl&&(t?(this.bannerEl.innerHTML="",this.bannerEl.className=""):(this.bannerEl.className="bg-rose-600 text-white px-4 py-2.5 text-center text-sm font-medium shadow-sm transition-all sticky top-0 z-50",this.bannerEl.innerHTML=`
        <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <svg class="w-5 h-5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span>${e||"Không thể kết nối đến máy chủ CSDL (json-server). Vui lòng kiểm tra lại dịch vụ tại cổng 3002."}</span>
          <button id="retry-connection-btn" class="ml-3 underline font-bold hover:text-rose-100 transition-all">Thử lại</button>
        </div>
      `,(n=this.bannerEl.querySelector("#retry-connection-btn"))==null||n.addEventListener("click",()=>{window.location.reload()})))}}d(dt,"bannerEl",null);document.addEventListener("DOMContentLoaded",()=>{dt.init(),window.addEventListener("unhandledrejection",r=>{var t;console.error("Unhandled Promise Rejection:",r.reason),(t=r.reason)!=null&&t.message&&g.error(r.reason.message)}),window.onerror=(r,t,e,n,o)=>{console.error("Global Window Error:",{message:r,source:t,lineno:e,colno:n,error:o})},ct.init("app")});
