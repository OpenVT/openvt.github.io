 window.onload = function() {
     document.getElementById("news-banner").classList.add("slide-in");
   };

     @keyframes slideIn {
     from {
       transform: translateY(-100%);
     }
     to {
       transform: translateY(0);
     }
   }

   #news-banner.slide-in {
     animation: slideIn 0.5s ease-out;
   }