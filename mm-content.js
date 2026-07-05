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
    'Use and order positive and negative integers and decimals.',
    'Add, subtract, multiply and divide integers accurately.',
    'Multiply or divide by powers of 10.',
    'Use brackets and the order of operations (BIDMAS) correctly.',
    'Round numbers to the nearest 10, 100 or 1000.',
    'Check answers using inverse operations.'
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
    { title:'Video 1: Positive and Negative Integers and Decimals', url:'',
      notes:{
        key:[
          '<b>Positive numbers</b> are greater than 0.',
          '<b>Negative numbers</b> are less than 0.',
          'On a number line, numbers further to the right are always greater.',
          'When comparing negative numbers, the number closer to 0 is greater. <span class="ex">Example: −3 &gt; −7</span>',
          'Remember: every positive number is greater than every negative number.',
          'When comparing decimals, compare the digits from left to right (tenths, hundredths, thousandths). <span class="ex">Example: 3.45 &gt; 3.405</span>',
          'You can add zeros to the end of decimals without changing their value. <span class="ex">Example: 2.5 = 2.50</span>',
          'Arrange numbers in ascending order (smallest to largest) or descending order (largest to smallest).'
        ],
        symbols:[
          '&gt; means "greater than." <span class="ex">Example: 8 &gt; 5</span>',
          '&lt; means "less than." <span class="ex">Example: −6 &lt; −2</span>',
          '= means "equal to." <span class="ex">Example: 4.2 = 4.20</span>',
          '≠ means "not equal to." <span class="ex">Example: 7 ≠ 9</span>'
        ],
        tips:[
          'Always think about the position of the number on a number line.',
          'For negative numbers, a larger absolute value means a smaller number. <span class="ex">Example: −10 &lt; −4</span>',
          'Check place value carefully when comparing decimals.'
        ],
        yourTurn:{
          questions:[
            'Which is greater: −5 or −2?',
            'Compare 3.07 and 3.7 using &lt;, &gt; or =.',
            'Put the following numbers in ascending order: −4, 2, −1, 0, 3.',
            'Write the correct symbol (&lt;, &gt;, = or ≠): 6.8 __ 6.80'
          ],
          answers:'1) −2 is greater (closer to zero). &nbsp; 2) 3.07 &lt; 3.7 (0 tenths vs 7 tenths). &nbsp; 3) −4, −1, 0, 2, 3. &nbsp; 4) 6.8 = 6.80 (adding a zero doesn\u2019t change the value).'
        }
      }},
    { title:'Video 2: Ordering Integers and Decimals', url:'', notes:null },
    { title:'Video 3: Comparing and Estimating', url:'', notes:null }
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
    { grade:'Grade 1', marks:2, q:'Write the correct symbol (< or >): −7 ___ −3, and 0.6 ___ 0.09.',
      ms:'−7 < −3 (1 mark). 0.6 > 0.09 — compare tenths: 6 > 0 (1 mark).' },
    { grade:'Grade 2–3', marks:3, q:'Order the following numbers from smallest to largest: −3.7, 0, −1.25, 2.08, −2, 1.5',
      ms:'Negatives first, furthest from zero smallest: −3.7, −2, −1.25 (2 marks). Then 0, 1.5, 2.08 (1 mark). (Total 3 marks)' },
    { grade:'Grade 2', marks:2, q:'The temperature in Inverness at 6am was −4°C. By midday it had risen by 9°C. What was the midday temperature?',
      ms:'−4 + 9 (1 mark) = 5°C (1 mark).' },
    { grade:'Grade 3', marks:3, q:'A diver is at −12 m. She rises 5 m, then descends 8 m. (a) Where is she now? (b) How far is she from the surface?',
      ms:'(a) −12 + 5 = −7, then −7 − 8 = −15 m (2 marks). (b) 15 m from the surface (1 mark).' },
    { grade:'Grade 2', marks:2, q:'Work out 18 − 3 × (2 + 2).',
      ms:'Brackets: 2 + 2 = 4. Multiply: 3 × 4 = 12 (1 mark). 18 − 12 = 6 (1 mark).' },
    { grade:'Grade 3', marks:3, q:'A stadium holds 42,850 people. (a) Round the capacity to the nearest 1,000. (b) Write 42,850 ÷ 100. (c) Use estimation to check whether 42,850 × 9 is closer to 380,000 or 430,000.',
      ms:'(a) 43,000 (1 mark). (b) 428.5 (1 mark). (c) 43,000 × 9 = 387,000 → closer to 380,000 (1 mark).' }
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
    { grade:'Grade 1', marks:2, q:'Write down the value of the 8 in 2.485, and write 0.3 as a fraction.',
      ms:'8 hundredths = 0.08 (1 mark). 0.3 = 3/10 (1 mark).' },
    { grade:'Grade 2', marks:2, q:'Petrol costs £1.479 per litre. Round the price to 2 decimal places, then to 1 decimal place.',
      ms:'£1.48 — the thousandths digit 9 rounds the hundredths up (1 mark). £1.5 (1 mark).' },
    { grade:'Grade 2–3', marks:3, q:'Order these masses from lightest to heaviest: 0.45 kg, 0.405 kg, 0.5 kg, 0.045 kg.',
      ms:'Pad to three places: 0.450, 0.405, 0.500, 0.045 (1 mark). Order: 0.045, 0.405, 0.45, 0.5 kg (2 marks).' },
    { grade:'Grade 3', marks:3, q:'A machine fills 1000 bottles from a 745.5 litre tank. (a) How much does each bottle hold? (b) The label says 0.75 litres — is the label correct? Explain.',
      ms:'(a) 745.5 ÷ 1000 = 0.7455 litres (2 marks). (b) No — 0.7455 < 0.75; compare hundredths: 4 < 5 (1 mark).' }
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
