## [109-1] Web Programming Final 
#### (Group 21) 情侶記帳App — TOGETHER

#### Deployed Link: http://linux2.csie.org:3001

#### Demo Video Link: https://youtu.be/zPC_MvgjG3M

#### Introduction:
- 情侶出遊或吃飯，通常不會將帳務記的很細，但如此一來某些人可能會感到困擾。為解決以上痛點，開發出這個情侶記帳app，來記錄雙方各自花費、兩人共同花費、兩人互相的欠款及歷史花費圖表等詳細資訊。
- 比較相關競品，另外開發settle up的功能，可以計算即時剩餘欠款金額。
- 同時作為情侶生活的紀錄，也可以加入紀念日等資訊。
- 增加設定預算的功能，讓兩人一起開源節流，一步步共築夢想藍圖！

#### Usage:
註冊/配對/登入：
- 註冊及登入未配對的使用者時會看到自己的邀請碼，以及可以輸入對方邀請碼的介面
- 其中一方輸入另一方邀請碼後，配對成功

設定 profile：
- 設定兩人頭像、預算、預設的共同消費分擔方式、紀念日

主頁：
- 新增、修改、刪除消費記錄
- 篩選、檢視本月消費
- 檢視本月各分項的預算和目前花費

settle up 頁面：
- 篩選、檢視過往消費紀錄中的欠款情形、還款記錄
- 篩選、檢視現在的淨欠款
- 新增、刪除還款記錄
- 修改、刪除欠款記錄

chart 頁面：
- 檢視過去一年每月的消費圖表

#### Github Link: https://github.com/howard41436/web_programming_final_project

#### 心得:
以前一直沒有很有系統地學完整個web開發步驟和流程，通常都是某堂課的final project需要用網頁來demo成品，只好快速的套一堆模板和網路上現成的code就結束了。但因為快畢業要找實習或正職工作，多數軟體工程師還是需要很多web的開發經驗及技術，所以來修這門課！整學期修完後真的很有收穫，學到很多實用的框架或package，也對全端有更多的認識，總而言之，好課推！

#### 使用之第三方套件、框架、程式碼:

前端：redux, react-router, react-chartjs-2, immer, paper-dashboard
後端：bcrypt, cors, body-parser, debug, dotenv,  express, mongoose

#### 使用介紹
請參照 FB 貼文以及 demo 影片。

#### 組員貢獻
- 資工四 楊皓丞: 後端（API server 以及資料庫的串接）
- 資工四 唐浩: 前端（所有React Components、Redux、Router）
- 資管四 陳惟中: 前端UIUX網頁介面排版及設計

###### Note
- 此為新開發的專案，不是之前的作品延伸
- 沒有其他外掛參與專案


