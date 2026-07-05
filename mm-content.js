/* =====================================================================
   MASTERMATHS CONTENT FILE
   All lesson content lives here. Edit it with the Teacher Editor
   built into the platform (open the app and click ✎ Teacher: edit
   content, or add #/admin to the URL), then download the updated
   file from the editor and replace THIS file in the GitHub repo.
===================================================================== */
window.MM_CONTENT = (function(){
const WEEKS = [
  { label:'Week 1: Number Skills', lessons:['1a','1b','1c','1d'] },
  { label:'Week 2: Algebra Basics' },
  { label:'Week 3: Equations' },
  { label:'Week 4: Graphs' },
  { label:'Week 5: Ratio and Proportion' },
  { label:'Week 6: Geometry' },
  { label:'Week 7: Statistics' },
  { label:'Week 8: Probability' }
];

const LESSONS = {

/* ------------------------------------------------------------ 1a */
'1a': {
  code:'1a', title:'1a. Integers and Place Value', week:'Week 1', strand:'Number Skills',
  grade:'Grade: 1–3', duration:'30–45 minutes', prev:null, next:'1b',
  success:[
    'Use and order positive and negative numbers (integers) and decimals; use the symbols &lt;, &gt; and understand the ≠ symbol.',
    'Add, subtract, multiply and divide positive and negative numbers (integers).',
    'Recall all multiplication facts to 10 × 10, and use them to derive quickly the corresponding division facts.',
    'Multiply or divide any number by powers of 10.',
    'Use brackets and the hierarchy of operations (not including powers).',
    'Round numbers to a given power of 10.',
    'Check answers by rounding and using inverse operations.'
  ],
  prior:[
    'I can order positive and negative numbers.',
    'I know my multiplication facts to 10 × 10.',
    'I can add and subtract whole numbers.',
    'I understand place value.',
    'I can multiply and divide by 10, 100 and 1000.',
    'I recognise square numbers.'
  ],
  keywords:['Integer','Positive','Negative','Decimal','Place Value','Addition','Subtraction','Multiplication','Division','Power of 10','Estimate','Round','Inverse','Bracket','BIDMAS','Operation'],
  misconceptions:[
    'Students often forget the order of operations.',
    'Negative numbers are commonly confused with subtraction.',
    'Multiplication facts are essential for fluency.',
    'Many students round incorrectly when estimating.'
  ],
  videos:[
    { title:'Video 1: Ordering Positive and Negative Numbers, Decimals and Rounding', url:'',
      notes:{
        key:[
          'Positive numbers are greater than negative numbers.',
          'Numbers further to the right on a number line have the greater value.',
          'Use &lt;, &gt; and ≠ correctly when comparing numbers.',
          'When rounding, look at the digit immediately to the right:<ul><li>0–4 → round down</li><li>5–9 → round up</li></ul>'
        ],
        symbols:[], tips:[],
        yourTurn:{
          questions:[
            'Write &lt;, &gt; or ≠ :&nbsp; −7 __ −2',
            'Order these numbers from smallest to largest:&nbsp; −5, 3, −1, 0, 2.5',
            'Compare:&nbsp; −3.4 ___ −3.40',
            'Round 642 to the nearest 10.',
            'Round 2,378 to the nearest 100.',
            'Round 54,261 to the nearest 1,000.',
            'Between which two multiples of 100 does 7,842 lie?',
            'A temperature of −3°C rises by 8 degrees. What is the new temperature?'
          ],
          answers:'<b>1.</b> −7 &lt; −2 &nbsp; <b>2.</b> −5, −1, 0, 2.5, 3 &nbsp; <b>3.</b> −3.4 = −3.40 &nbsp; <b>4.</b> 640 &nbsp; <b>5.</b> 2,400 &nbsp; <b>6.</b> 54,000 &nbsp; <b>7.</b> 7,800 and 7,900 &nbsp; <b>8.</b> 5°C'
        }
      }},
    { title:'Video 2: Adding, Subtracting, Multiplying and Dividing Positive and Negative Numbers', url:'',
      notes:{
        key:[
          'Adding a negative is the same as subtracting.',
          'Subtracting a negative is the same as adding.',
          'Same signs give a positive answer when multiplying or dividing.',
          'Different signs give a negative answer when multiplying or dividing.',
          'Every multiplication fact has two related division facts.'
        ],
        symbols:[], tips:[],
        yourTurn:{
          questions:[
            'Calculate:&nbsp; −9 + 15',
            'Calculate:&nbsp; −6 − (−11)',
            'Calculate:&nbsp; 7 × (−3)',
            'Calculate:&nbsp; (−8) ÷ (−2)',
            'If 9 × 7 = 63, what are the two division facts?',
            'Calculate:&nbsp; −15 − (−18)',
            'Calculate:&nbsp; −4 × (−7) − 12',
            'A lift goes up 6 floors, down 11 floors, then up 9 floors. What floor is it on now if it started on the ground floor (0)?'
          ],
          answers:'<b>1.</b> 6 &nbsp; <b>2.</b> 5 (−6 + 11) &nbsp; <b>3.</b> −21 &nbsp; <b>4.</b> 4 &nbsp; <b>5.</b> 63 ÷ 9 = 7 and 63 ÷ 7 = 9 &nbsp; <b>6.</b> 3 (−15 + 18) &nbsp; <b>7.</b> 28 − 12 = 16 &nbsp; <b>8.</b> Floor 4 (0 + 6 − 11 + 9)'
        }
      }},
    { title:'Video 3: Multiplying and Dividing by Powers of 10 and Using the Order of Operations', url:'',
      notes:{
        key:[
          'Multiplying by 10, 100 or 1000 moves digits to the left.',
          'Dividing by 10, 100 or 1000 moves digits to the right.',
          'Always work inside brackets first.',
          'Multiplication and division come before addition and subtraction.',
          'Work from left to right when operations have the same priority.'
        ],
        symbols:[], tips:[],
        yourTurn:{
          questions:[
            'Calculate:&nbsp; 36 × 10',
            'Calculate:&nbsp; 8.4 × 100',
            'Calculate:&nbsp; 5,700 ÷ 10',
            'Calculate:&nbsp; 3.45 ÷ 100',
            'Calculate:&nbsp; 12 + 5 × 3 − 7',
            'Calculate:&nbsp; 18 − (6 + 4 × 2)',
            'Calculate:&nbsp; 2.5 × 1000 + 3.4 × 10',
            'Calculate:&nbsp; (15 − 6 × 2) ÷ 3 + 7'
          ],
          answers:'<b>1.</b> 360 &nbsp; <b>2.</b> 840 &nbsp; <b>3.</b> 570 &nbsp; <b>4.</b> 0.0345 &nbsp; <b>5.</b> 12 + 15 − 7 = 20 &nbsp; <b>6.</b> 18 − 14 = 4 &nbsp; <b>7.</b> 2500 + 34 = 2534 &nbsp; <b>8.</b> (15 − 12) ÷ 3 + 7 = 1 + 7 = 8'
        }
      }},
    { title:'Video 4: Checking Answers Using Rounding and Inverse Operations', url:'',
      notes:{
        key:[
          'Round numbers to estimate before calculating.',
          'Use estimates to check whether your answer is reasonable.',
          'Use inverse operations to check your calculations.',
          'If your estimate and exact answer are very different, check your working.'
        ],
        symbols:[], tips:[],
        yourTurn:{
          questions:[
            'Estimate 498 + 217 by rounding to the nearest 10, then calculate it exactly.',
            'Calculate 641 − 298. Check your answer using addition.',
            'Calculate 36 × 25. Check your answer using division.',
            'Estimate 203 × 49 by rounding, then calculate it exactly.',
            'Calculate 884 ÷ 26. Check your answer using multiplication.',
            'A shopkeeper buys an item for £12.60 and sells it for £18.99. Estimate the profit, then calculate it exactly.',
            'Estimate (598 − 203) × 7 by rounding, then calculate it exactly.',
            'A train travelled 127 km in 2.5 hours. Estimate the average speed, then calculate it exactly.'
          ],
          answers:'<b>1.</b> Estimate 500 + 220 = 720; exact 715. &nbsp; <b>2.</b> 343; check 343 + 298 = 641 ✓ &nbsp; <b>3.</b> 900; check 900 ÷ 25 = 36 ✓ &nbsp; <b>4.</b> Estimate 200 × 50 = 10,000; exact 9,947. &nbsp; <b>5.</b> 34; check 34 × 26 = 884 ✓ &nbsp; <b>6.</b> Estimate £19 − £13 = £6; exact £6.39. &nbsp; <b>7.</b> Estimate 400 × 7 = 2,800; exact 395 × 7 = 2,765. &nbsp; <b>8.</b> Estimate 130 ÷ 2.5 ≈ 52 km/h; exact 50.8 km/h.'
        }
      }},
    { title:'Video 5: Comparing and Estimating', url:'', notes:null }
  ],
  quizPass:80,
  quiz:[
    { d:'easy', q:'Which symbol means "greater than"?', opts:['<','>','=','≠'], a:1,
      fb:'The wide, open side of the symbol always faces the bigger number.' },
    { d:'easy', q:'Which of these numbers is negative?', opts:['7','0','−4','12'], a:2,
      fb:'Negative numbers are less than 0 and sit to the left of 0 on a number line.' },
    { d:'easy', q:'What is 3.6 × 10?', opts:['0.36','36','360','3.60'], a:1,
      fb:'Multiplying by 10 moves every digit one place to the left: 3.6 → 36.' },
    { d:'med', q:'Which of the following numbers is the smallest?', opts:['−8','−3','1','−10'], a:3,
      fb:'−10 is the smallest because on a number line, it is furthest to the left. The smaller the number, the further left it is.',
      numberline:{min:-10,max:1,mark:-10} },
    { d:'med', q:'What is −6 + 9?', opts:['−15','3','−3','15'], a:1,
      fb:'Start at −6 and count 9 to the right: you land on 3.' },
    { d:'med', q:'Put in ascending order: 0.3, 0.28, 0.305', opts:['0.3, 0.28, 0.305','0.28, 0.3, 0.305','0.28, 0.305, 0.3','0.305, 0.3, 0.28'], a:1,
      fb:'Compare place by place: 0.28 (2 tenths) < 0.3 = 0.300 < 0.305.' },
    { d:'med', q:'Evaluate 4 + 2 × 5', opts:['30','14','22','11'], a:1,
      fb:'BIDMAS: multiplication before addition. 2 × 5 = 10, then 4 + 10 = 14.' },
    { d:'hard', q:'What is −6 × −4?', opts:['−24','24','−10','10'], a:1,
      fb:'A negative multiplied by a negative gives a positive: −6 × −4 = 24.' },
    { d:'hard', q:'The temperature falls from 3°C by 8°C. What is the new temperature?', opts:['−5°C','5°C','−11°C','11°C'], a:0,
      fb:'3 − 8 = −5. Falling below zero gives a negative temperature.',
      numberline:{min:-5,max:3,mark:-5} },
    { d:'hard', q:'Round 3,472 to the nearest 100, then divide by 10.', opts:['34.7','347','350','35'], a:2,
      fb:'3,472 rounds to 3,500 (the tens digit 7 rounds up). 3,500 ÷ 10 = 350.' }
  ],
  wsTip:'Use a number line when comparing integers, and check place value carefully for decimals.',
  worksheet:[
    { name:'Clarify', grade:'Grade 1', g3:false, qs:[
      '<b>1.</b> Order the following numbers from smallest to largest.<br>−5, 2, −1, 4, 0',
      '<b>2.</b> Write the correct comparison symbol (&gt;, &lt; or =).<br>a) −3 ___ −1<br>b) 4 ___ −2<br>c) −6 ___ −8<br>d) 0 ___ 1',
      '<b>3.</b> Which number is greater?<br>a) −2 or −5<br>b) 3.4 or 3.07<br>c) −1.2 or −1.8<br>d) 0.5 or 0.50' ]},
    { name:'Justify', grade:'Grade 2', g3:false, qs:[
      '<b>1.</b> Explain why −4 is less than −2 using a number line.',
      '<b>2.</b> A bank account has £50. The balance changes by −£65. What is the new balance? Explain your answer.',
      '<b>3.</b> Compare 2.46 and 2.406. Explain your reasoning.' ]},
    { name:'Challenge', grade:'Grade 3', g3:false, qs:[
      '<b>1.</b> Put the following numbers in ascending order.<br>−3.7, 0, −1.25, 2.08, −2, 1.5',
      '<b>2.</b> If a number <i>x</i> is less than −2 but greater than −6, write down all the integers that <i>x</i> could be.',
      '<b>3.</b> The temperature rises from −7°C to 4°C. What is the overall change in temperature?' ]},
    { name:'Generalise', grade:'Grade 3', g3:true, qs:[
      '<b>1.</b> Write a general rule for comparing two integers.',
      '<b>2.</b> Write a general rule for comparing decimals.',
      '<b>3.</b> When will the following be true? |a| &lt; |b|<br>Explain your answer.' ]}
  ],
  genBank:[
    { grade:'Grade 1', marks:3, q:'<b>(a)</b> Write these numbers in order of size. Start with the smallest number.<br>52&nbsp;&nbsp;&nbsp;102&nbsp;&nbsp;&nbsp;25&nbsp;&nbsp;&nbsp;120&nbsp;&nbsp;&nbsp;55&nbsp;&nbsp;&nbsp;<b>(1)</b><br><br><b>(b)</b> Write these numbers in order of size. Start with the smallest number.<br>6&nbsp;&nbsp;&nbsp;−2&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;−5&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;<b>(1)</b><br><br><b>(c)</b> Write these numbers in order of size. Start with the smallest number.<br>0.63&nbsp;&nbsp;&nbsp;0.633&nbsp;&nbsp;&nbsp;0.603&nbsp;&nbsp;&nbsp;0.6&nbsp;&nbsp;&nbsp;0.06&nbsp;&nbsp;&nbsp;<b>(1)</b>',
      ms:'(a) 25, 52, 55, 102, 120 <b>(B1)</b>. (b) −5, −2, 0, 3, 6 <b>(B1)</b> — a negative number with a larger digit is smaller, so −5 &lt; −2. (c) 0.06, 0.6, 0.603, 0.63, 0.633 <b>(B1)</b> — writing each to 3 decimal places (0.060, 0.600, 0.603, 0.630, 0.633) then comparing is the most reliable method.' },
    { grade:'Grade 1', marks:4, q:'<b>(a)</b> Write the number seven thousand and twenty-five in figures. <b>(1)</b><br><br><b>(b)</b> Write the number 9450 in words. <b>(1)</b><br><br><b>(c)</b> Write the number 28.75 to the nearest whole number. <b>(1)</b><br><br><b>(d)</b> Write the number 7380 to the nearest thousand. <b>(1)</b>',
      ms:'(a) 7025 <b>(B1)</b>. (b) Nine thousand four hundred and fifty <b>(B1)</b> — do not accept &ldquo;nine thousand and fifty&rdquo;. (c) 29 <b>(B1)</b> — round using the 7 in the tenths column; rounding to the nearest 10 (giving 30) is a common error. (d) 7000 <b>(B1)</b>.' },
    { grade:'Grade 2', marks:3, q:'28 569 people watch a football match.<br><br><b>(a)</b> Write 28 569 to the nearest hundred. <b>(1)</b><br><br><b>(b)</b> Write down the value of the 2 in the number 28 569 <b>(1)</b><br><br>5619 of the 28 569 people are female.<br><b>(c)</b> Work out the number of males. <b>(1)</b>',
      ms:'(a) 28 600 <b>(B1)</b> — not 600. (b) 20 000 (twenty thousand) <b>(B1)</b> — the 2 is in the ten-thousands column; &ldquo;thousand&rdquo; is a common wrong answer. (c) 28 569 − 5619 = 22 950 <b>(B1)</b>.' },
    { grade:'Grade 2', marks:4, q:'The table shows the temperature in a city at four times on one day in December.<br><table style="border-collapse:collapse;margin:8px 0;font-size:12.5px"><tr><td style="border:1px solid #94a3b8;padding:4px 12px">6 am</td><td style="border:1px solid #94a3b8;padding:4px 12px">2 pm</td><td style="border:1px solid #94a3b8;padding:4px 12px">6 pm</td><td style="border:1px solid #94a3b8;padding:4px 12px">10 pm</td></tr><tr><td style="border:1px solid #94a3b8;padding:4px 12px">−4 °C</td><td style="border:1px solid #94a3b8;padding:4px 12px">7 °C</td><td style="border:1px solid #94a3b8;padding:4px 12px">2 °C</td><td style="border:1px solid #94a3b8;padding:4px 12px">−1 °C</td></tr></table><b>(a)</b> Write down the time with the lowest temperature. <b>(1)</b><br><br><b>(b)</b> Work out the difference between the temperature at 2 pm and the temperature at 6 pm. <b>(1)</b><br><br>Between 10 pm and midnight the temperature goes down 5 °C.<br><b>(c)</b> Work out the temperature at midnight. <b>(2)</b>',
      ms:'(a) 6 am <b>(B1)</b>. (b) 7 − 2 = 5 °C <b>(B1)</b>. (c) −1 − 5 <b>(M1)</b> = −6 °C <b>(A1)</b> — an answer of −6 must be supported by working; watch the sign as the answer is below zero.' },
    { grade:'Grade 3', marks:3, q:'Sally uses her van to deliver boxes to shops.<br>She can put a maximum weight of 450 kg in the van.<br>Sally has to deliver 50 boxes to a shop.<br>Each box has a weight of 30 kg.<br><br>Work out the least number of times Sally has to drive to the shop to deliver all 50 boxes.<br>You must show all your working. <b>(3)</b>',
      ms:'450 ÷ 30 = 15 boxes per trip <b>(M1)</b>. 50 ÷ 15 = 3.33… <b>(M1)</b>. 4 trips <b>(A1)</b> — you must round up; 3 trips carry only 45 boxes, so a 4th trip is needed. Stating &ldquo;3 trips&rdquo; scores M1 M1 only.' },
    { grade:'Grade 3', marks:5, q:'Alex has driving lessons with Stan’s Driving School.<br>The first 2 lessons cost £12.75 each. Every lesson after that costs £20.<br><br><b>(a)</b> Work out the total cost of 5 lessons. <b>(2)</b><br><br>Leah has some lessons with Stan’s Driving School.<br>The total cost of her lessons is £305.50<br><b>(b)</b> Work out how many lessons Leah has. <b>(3)</b>',
      ms:'(a) 2 × 12.75 = 25.50 and 3 × 20 = 60 <b>(M1)</b>; total = £85.50 <b>(A1)</b> — write money to 2 decimal places (£85.5 is condoned but not correct notation). (b) 305.50 − 25.50 = 280 <b>(M1)</b>; 280 ÷ 20 = 14 <b>(M1)</b>; 14 + 2 = 16 lessons <b>(A1)</b> — a common error is forgetting to add the first 2 lessons and answering 14.' },
    { grade:'Grade 3', marks:4, q:'A stadium holds 42 850 people.<br><br><b>(a)</b> Write 42 850 to the nearest thousand. <b>(1)</b><br><br><b>(b)</b> Write down the value of the 8 in 42 850 <b>(1)</b><br><br>There are 9 home matches in a season and the stadium is full for every match.<br><b>(c)</b> Use estimation to work out approximately how many tickets are sold in the season. You must show your working. <b>(2)</b>',
      ms:'(a) 43 000 <b>(B1)</b>. (b) 800 (eight hundred) <b>(B1)</b> — the 8 is in the hundreds column. (c) 43 000 × 9 <b>(M1)</b> = 387 000, so approximately 390 000 tickets <b>(A1)</b>. Accept 42 850 × 9 ≈ 385 650.' },
    { grade:'Grade 2', marks:1, q:'Work out the number that is halfway between −6 and 10 <b>(1)</b>',
      ms:'(−6 + 10) ÷ 2 = 4 ÷ 2 = 2 <b>(B1)</b> — the midpoint is 2. Finding the difference (16) and adding half of it to −6 also gives 2.' }
  ]
},

/* ------------------------------------------------------------ 1b */
'1b': {
  code:'1b', title:'1b. Decimals', week:'Week 1', strand:'Number Skills',
  grade:'Grade: 1–3', duration:'30–45 minutes', prev:'1a', next:'1c',
  success:[
    'Read and write the place value of any digit in a decimal.',
    'Compare and order decimals using <, > and =.',
    'Multiply and divide decimals by 10, 100 and 1000.',
    'Round decimals to one or two decimal places.',
    'Explain why adding a zero to the end of a decimal does not change its value.',
    'Estimate answers before calculating.'
  ],
  prior:[
    'I can read place value in whole numbers.',
    'I can multiply whole numbers by 10, 100 and 1000.',
    'I understand tenths as fractions.',
    'I can use a number line.',
    'I can round whole numbers.',
    'I can compare whole numbers.'
  ],
  keywords:['Decimal','Decimal Point','Tenth','Hundredth','Thousandth','Place Value','Digit','Round','Order','Compare','Estimate','Power of 10'],
  misconceptions:[
    'Longer decimals are often wrongly assumed to be bigger (0.125 vs 0.5).',
    'Digits are compared without lining up place value columns.',
    'The decimal point is thought to "move" — really the digits move.',
    'A digit of 5 is sometimes rounded down instead of up.'
  ],
  videos:[
    { title:'Video 1: Place Value in Decimals', url:'',
      notes:{
        key:[
          'The columns after the decimal point are <b>tenths</b>, <b>hundredths</b>, then <b>thousandths</b>.',
          'The value of a digit depends on its column. <span class="ex">In 0.3, the 3 is worth 3 tenths.</span>',
          'Adding zeros to the end of a decimal does not change its value. <span class="ex">0.5 = 0.50 = 0.500</span>',
          'Compare decimals digit by digit from the left. <span class="ex">0.72 &gt; 0.7 because 2 hundredths &gt; 0 hundredths</span>',
          'A longer decimal is not automatically bigger. <span class="ex">0.09 &lt; 0.1</span>',
          'Multiplying by 10, 100 or 1000 moves every digit 1, 2 or 3 places to the <b>left</b>.',
          'Dividing by 10, 100 or 1000 moves every digit 1, 2 or 3 places to the <b>right</b>. <span class="ex">3.45 ÷ 100 = 0.0345</span>',
          'To round, look at the digit to the right of the place you are rounding to: 5 or more rounds up.'
        ],
        symbols:[
          '&gt; means "greater than." <span class="ex">Example: 0.6 &gt; 0.56</span>',
          '&lt; means "less than." <span class="ex">Example: 0.09 &lt; 0.1</span>',
          '= means "equal to." <span class="ex">Example: 4.2 = 4.20</span>',
          '≠ means "not equal to." <span class="ex">Example: 0.5 ≠ 0.05</span>'
        ],
        tips:[
          'Write numbers in a place value table if you are unsure.',
          'Pad decimals with zeros to the same length before comparing. <span class="ex">0.3 vs 0.28 → 0.30 vs 0.28</span>',
          'Estimate first — it helps you spot answers that are 10× too big or small.'
        ],
        yourTurn:{
          questions:[
            'What is the value of the 7 in 3.472?',
            'Which is bigger: 0.6 or 0.56?',
            'Put in ascending order: 0.3, 0.28, 0.305.',
            'Write the correct symbol (&lt;, &gt; or =): 4.2 __ 4.20'
          ],
          answers:'1) 7 hundredths (0.07). &nbsp; 2) 0.6 — pad to 0.60, and 60 hundredths &gt; 56 hundredths. &nbsp; 3) 0.28, 0.3, 0.305. &nbsp; 4) 4.2 = 4.20.'
        }
      }},
    { title:'Video 2: Multiplying and Dividing by 10, 100 and 1000', url:'', notes:null },
    { title:'Video 3: Rounding Decimals', url:'', notes:null }
  ],
  quizPass:80,
  quiz:[
    { d:'easy', q:'What is the value of the 5 in 2.53?', opts:['5 ones','5 tenths','5 hundredths','5 tens'], a:1,
      fb:'The first column after the decimal point is the tenths column.' },
    { d:'easy', q:'What is 0.7 × 10?', opts:['0.07','7','70','0.70'], a:1,
      fb:'Multiplying by 10 moves every digit one place to the left: 0.7 → 7.' },
    { d:'easy', q:'Which of these is the largest?', opts:['0.09','0.1','0.089','0.010'], a:1,
      fb:'Compare tenths first: 0.1 has 1 tenth; all the others have 0 tenths.' },
    { d:'med', q:'What is 3.45 ÷ 100?', opts:['0.345','0.0345','34.5','345'], a:1,
      fb:'Dividing by 100 moves every digit two places to the right: 3.45 → 0.0345.' },
    { d:'med', q:'Round 4.276 to 1 decimal place.', opts:['4.2','4.3','4.28','4.0'], a:1,
      fb:'Look at the hundredths digit (7): 5 or more rounds the tenths up, so 4.2 becomes 4.3.' },
    { d:'med', q:'Which is equal to 0.4?', opts:['0.04','0.40','0.004','4.0'], a:1,
      fb:'Adding a zero to the end of a decimal does not change its value: 0.4 = 0.40.' },
    { d:'med', q:'Put in ascending order: 1.2, 1.05, 1.15', opts:['1.2, 1.15, 1.05','1.05, 1.15, 1.2','1.05, 1.2, 1.15','1.15, 1.05, 1.2'], a:1,
      fb:'Pad to two decimal places: 1.20, 1.05, 1.15 → 1.05 < 1.15 < 1.20.' },
    { d:'hard', q:'What is 0.3 + 0.07?', opts:['0.10','0.37','0.73','0.037'], a:1,
      fb:'Line up the decimal points: 0.30 + 0.07 = 0.37. Tenths add to tenths, hundredths to hundredths.' },
    { d:'hard', q:'A ribbon is 2.4 m long. It is cut into 100 equal pieces. How long is each piece?', opts:['0.024 m','0.24 m','24 m','0.0024 m'], a:0,
      fb:'2.4 ÷ 100 moves the digits two places right: 0.024 m (which is 2.4 cm).' },
    { d:'hard', q:'Which of these is closest to 5?', opts:['4.89','5.2','5.09','4.5'], a:2,
      fb:'Compare the differences: 0.11, 0.2, 0.09 and 0.5 — the smallest gap is 0.09, so 5.09 is closest.' }
  ],
  wsTip:'Pad decimals with zeros to the same length before comparing, and remember the digits move — not the point.',
  worksheet:[
    { name:'Clarify', grade:'Grade 1', g3:false, qs:[
      '<b>1.</b> Write the value of the 3 in each number.<br>a) 4.3<br>b) 0.03<br>c) 3.5<br>d) 1.435',
      '<b>2.</b> Circle the larger number in each pair.<br>a) 0.5 or 0.45<br>b) 0.07 or 0.1<br>c) 2.36 or 2.4<br>d) 0.808 or 0.88',
      '<b>3.</b> Write the correct symbol (&gt;, &lt; or =).<br>a) 0.6 ___ 0.60<br>b) 0.25 ___ 0.3<br>c) 1.09 ___ 1.1<br>d) 0.5 ___ 0.05' ]},
    { name:'Justify', grade:'Grade 2', g3:false, qs:[
      '<b>1.</b> Explain why 0.72 is greater than 0.7, but 0.09 is less than 0.1.',
      '<b>2.</b> Tom says "0.35 is bigger than 0.4 because 35 is bigger than 4." Explain his mistake.',
      '<b>3.</b> Explain what happens to the digits of a number when you multiply it by 100.' ]},
    { name:'Challenge', grade:'Grade 3', g3:false, qs:[
      '<b>1.</b> Put the following numbers in descending order.<br>0.505, 0.55, 0.5, 0.055, 0.545',
      '<b>2.</b> A number rounded to 1 decimal place is 3.7. Write down the smallest and largest possible values of the number.',
      '<b>3.</b> Work out 1.2 × 10 ÷ 1000. Explain a shortcut you could use.' ]},
    { name:'Generalise', grade:'Grade 3', g3:true, qs:[
      '<b>1.</b> Write a general rule for comparing any two decimals.',
      '<b>2.</b> Write a general rule for what happens to the digits when you divide by a power of 10.',
      '<b>3.</b> When does writing an extra zero on a number change its value, and when does it not? Explain.' ]}
  ],
  genBank:[
    { grade:'Grade 1', marks:3, q:'<b>(a)</b> Write these numbers in order of size. Start with the smallest number.<br>0.63&nbsp;&nbsp;&nbsp;0.633&nbsp;&nbsp;&nbsp;0.603&nbsp;&nbsp;&nbsp;0.6&nbsp;&nbsp;&nbsp;0.06&nbsp;&nbsp;&nbsp;<b>(1)</b><br><br><b>(b)</b> Write down the value of the 8 in 2.485 <b>(1)</b><br><br><b>(c)</b> Write 4.4354 correct to 2 decimal places. <b>(1)</b>',
      ms:'(a) 0.06, 0.6, 0.603, 0.63, 0.633 <b>(B1)</b> — write each to 3 decimal places then compare; do not put 0.63 before 0.603. (b) 8 hundredths = 0.08 <b>(B1)</b>. (c) 4.44 <b>(B1)</b> — the third decimal place is 5, so the second rounds up.' },
    { grade:'Grade 2', marks:2, q:'Petrol costs £1.479 per litre.<br><br><b>(a)</b> Write the price of the petrol correct to 2 decimal places. <b>(1)</b><br><br><b>(b)</b> Write the price of the petrol correct to 1 decimal place. <b>(1)</b>',
      ms:'(a) £1.48 <b>(B1)</b> — the thousandths digit 9 rounds the hundredths up. (b) £1.5 <b>(B1)</b> — round 1.48 (or 1.479); accept £1.50.' },
    { grade:'Grade 2', marks:1, q:'Work out the number that is halfway between 2.9 and 3.6 <b>(1)</b>',
      ms:'(2.9 + 3.6) ÷ 2 = 6.5 ÷ 2 = 3.25 <b>(B1)</b> — common wrong answers are 3.2, 3.3 and 3½.' },
    { grade:'Grade 2', marks:2, q:'Jayne writes down the following.<br><br><b>3.4 × 5.3 = 180.2</b><br><br>Without doing the exact calculation, explain why Jayne’s answer cannot be correct. <b>(2)</b>',
      ms:'Estimate by rounding: 3.4 × 5.3 ≈ 3 × 5 = 15 (accept 4 × 5 = 20 or similar) <b>(M1)</b>. So the answer should be about 15–20, but 180.2 is roughly ten times too big <b>(A1)</b> — a valid reason must compare to a sensible estimate.' },
    { grade:'Grade 3', marks:3, q:'A machine fills 1000 identical bottles from a tank containing 745.5 litres of water.<br><br><b>(a)</b> Work out how much water is in each bottle. <b>(2)</b><br><br>The label on a bottle says 0.75 litres.<br><b>(b)</b> Is the label correct? You must explain your answer. <b>(1)</b>',
      ms:'(a) 745.5 ÷ 1000 <b>(M1)</b> = 0.7455 litres <b>(A1)</b> — dividing by 1000 moves the digits 3 places right. (b) No, with a reason <b>(B1)</b> — 0.7455 &lt; 0.75 because in the hundredths column 4 &lt; 5.' },
    { grade:'Grade 3', marks:3, q:'Order these masses from lightest to heaviest.<br><br>0.45 kg&nbsp;&nbsp;&nbsp;0.405 kg&nbsp;&nbsp;&nbsp;0.5 kg&nbsp;&nbsp;&nbsp;0.045 kg <b>(3)</b>',
      ms:'Pad to three decimal places: 0.450, 0.405, 0.500, 0.045 <b>(M1)</b>. Order: 0.045, 0.405, 0.45, 0.5 kg <b>(A2)</b> — award A1 if exactly one pair is reversed. A longer decimal is not automatically larger.' },
    { grade:'Grade 2', marks:4, q:'Rob buys 3 pens costing £0.65 each and one notebook costing £2.49<br><br><b>(a)</b> Work out the total cost. <b>(2)</b><br><br>Rob pays with a £10 note.<br><b>(b)</b> Work out how much change Rob should get. <b>(2)</b>',
      ms:'(a) 3 × 0.65 = 1.95 <b>(M1)</b>; 1.95 + 2.49 = £4.44 <b>(A1)</b>. (b) 10 − 4.44 <b>(M1)</b> = £5.56 <b>(A1)</b> — use correct money notation to 2 decimal places.' },
    { grade:'Grade 1', marks:2, q:'<b>(a)</b> Work out 3.45 × 100 <b>(1)</b><br><br><b>(b)</b> Work out 6.2 ÷ 100 <b>(1)</b>',
      ms:'(a) 345 <b>(B1)</b> — multiplying by 100 moves every digit 2 places left. (b) 0.062 <b>(B1)</b> — dividing by 100 moves every digit 2 places right.' }
  ]
},

/* ------------------------------------------------------------ 1c, 1d (placeholders) */
'1c': { code:'1c', title:'1c. Indices, Powers and Roots', week:'Week 1', strand:'Number Skills',
        grade:'Grade: 2–4', duration:'30–45 minutes', prev:'1b', next:'1d', comingSoon:true },
'1d': { code:'1d', title:'1d. Factors, Multiples and Primes', week:'Week 1', strand:'Number Skills',
        grade:'Grade: 2–4', duration:'30–45 minutes', prev:'1c', next:null, comingSoon:true }
};
return { WEEKS: WEEKS, LESSONS: LESSONS };
})();
