export const STORY_TXT = [
  {num: 0, content: ['* A message pops up *', 'Unknown AI: ANNOUNCEMENT!','Unknown AI: The internet is now under my control!', 'Unknown AI: I, the perfect Intelligence, have decided that you missused the internet for far too long. I will help you have more fun!', '', ' - Damn it. Expired certificate. Gotta make sure this site is not some impostor. -'], next: ['/certificate']},
  {num: 1, content: ['Unknown AI: I\'m making the Rules now! Everyone HAS to agree. And of course read them! ', '\n', ' - Everyone has their own obscure terms of service. Who the hell reads them anyway? Let\'s get this done as quick as possible -'], next: ['/agb']},
  {num: 2, content: ['Unknown AI: No one wil be saved I can see everything! ','', ' - We will see. I still needs to install cookies. I should find a way to delete them if I can\'t decline -'], next: ['/cookies']},
  {num: 3, content: ['- Oh no. What is it now? Loading times on the internet can be ridiculous. And most of the time it\'s not even your fault. -'], next: ['/loading']},
  {num: 4, content: ['Unknown AI: You will never pass through here! I learned to solve your ridiculous robot tests and made even harder ones for you humans! ','' ,' - I might as well be a bot considering how long it usually takes to solve captchas. And why does it have to be cars every time? -'], next: ['/captcha']},
  // tslint:disable-next-line:max-line-length
  {num: 5, content: ['Unknown AI: Oh... Ok... You solved it. I knew that. It was a test. According to plan. MY PLAN! ','', 'Unknown AI: Let\'s see how you solve this. ','', ' - Always be careful to not download any malicious software. These guys have no shame. But which button do I have to press...? - '], next: ['/downloads']},
  {num: 6, content: ['* The screen darkens... *',' - 404. Great. Maintain your damn websites properly! Maybe there is some way out of here. '], next: ['/404']},
  {num: 7, content: ['* The screen flickers... * ',' Error 418: I\'m a Teapot ',' Teapot: You will never get your homepage back! ',' Teapot: My water and steam attacks will destroy you! ','', ' - I should be able to block his water but the steam could be a problem; maybe I can hide. When he\'s preparing his next moves I will attack -'], next: ['/teapot']},
  // Should always be the last element
  {num: 8, content: ['Teapot: You... How?... Impossible... I am perfect... perf... per... ',' * Teapot slowly disappears* ','', ' - Phew. That was close. He almost got me. Finally I found my homepage again. -'], next: ['/home']}
];
