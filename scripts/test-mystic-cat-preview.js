const fs = require('fs');
const path = require('path');

// Let's create an HTML preview test file that renders the card with the new Mystic Cat assets
// so we can open it in browser_subagent and visually confirm the exact alignment!
const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #07090E; margin: 40px; display: flex; justify-content: center; }
    .card {
      position: relative;
      width: 1200px;
      height: 675px;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
    }
    .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .avatar-photo {
      position: absolute;
      left: 110px;
      top: 135px;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar-frame {
      position: absolute;
      left: 55px;
      top: 80px;
      width: 370px;
      height: 370px;
      pointer-events: none;
    }
    .title-banner {
      position: absolute;
      left: 410px;
      top: 220px;
      width: 480px;
      height: 160px;
      pointer-events: none;
    }
    .title-text {
      position: absolute;
      left: 410px;
      top: 290px;
      width: 480px;
      text-align: center;
      font-family: serif;
      font-size: 26px;
      font-weight: bold;
      color: #FDE68A;
      letter-spacing: 4px;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
    }
    .emblem {
      position: absolute;
      right: 70px;
      top: 60px;
      width: 155px;
      height: 155px;
    }
    .card-frame {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <img class="bg" src="/assets/themes/mystic_cat/mystic_cat_profile_background.png" />
    <img class="avatar-photo" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" />
    <img class="avatar-frame" src="/assets/themes/mystic_cat/mystic_cat_-_avatar_frame.png" />
    <img class="title-banner" src="/assets/themes/mystic_cat/mystic_cat_achievement_title_frame.png" />
    <div class="title-text">VAULT SEEKER</div>
    <img class="emblem" src="/assets/themes/mystic_cat/mystic_cat_-_emblem.png" />
    <img class="card-frame" src="/assets/themes/mystic_cat/mystic_cat_-_profile_frame.png" />
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/test-mystic-cat.html'), testHtml, 'utf8');
console.log('Created test-mystic-cat.html');
