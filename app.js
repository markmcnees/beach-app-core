const SC=window.SCHOOL_CONFIG;
// User-facing label for the privileged role. Config-driven via SC.coachLabel, defaulting to Coach so every existing school is unchanged. Display only; the internal role string stays 'coach'.
const COACH_LABEL = (SC && SC.coachLabel) ? SC.coachLabel : 'Coach';
// User-facing sign-off for AI generated plans. Config-driven via SC.coachSignoff, defaulting to Coach Mark so every existing school is unchanged.
const COACH_SIGNOFF = (SC && SC.coachSignoff) ? SC.coachSignoff : 'Coach Mark';
// School's own name for AI prompts/labels that must not hardcode one school.
// shortName preferred (e.g. 'Leon', 'Grass Club'), then displayName, then schoolName.
const SCHOOL_NAME = (SC && (SC.shortName || SC.displayName || SC.schoolName)) || 'the team';
// Login logo image height in px. Config-driven via SC.logoHeight, defaulting to 64 so every existing school renders exactly as today.
const LOGO_H = (SC && SC.logoHeight) ? SC.logoHeight : 64;
// Logo img source: '' when the config uses the Firebase logo flag (so no broken load /
// onerror flash; the listenData read fills the real src), else the config's logo value.
const LOGO_SRC = (SC && SC.logo === 'firebase') ? '' : (SC ? SC.logo : '');
// Worker base for server-side coach auth (PIN verify, sessions, PIN change). The PIN
// is never held or compared on the client; these endpoints do it against a bcrypt hash.
const AUTH_WORKER = 'https://courtsense-email-worker.markmcnees-479.workers.dev';

// ============================================================
// DEMO FIXTURE — only consumed when SC.demoMode === true
// ============================================================
const _DEMO = {
  players: [
    {id:'sd01', firstName:'Suzie',  lastName:'Spiker',     classYear:'SR', court:1, jersey:1,  active:true, tier:'gold', leadership:'exec', gender:'F', csRank:1480},
    {id:'sd02', firstName:'Debby',  lastName:'Digger',     classYear:'SR', court:1, jersey:7,  active:true, tier:'gold', leadership:'faculty', gender:'F', csRank:1465},
    {id:'sd03', firstName:'Bonnie', lastName:'Blocker',    classYear:'JR', court:2, jersey:12, active:true, tier:'gold', gender:'F', csRank:1440},
    {id:'sd04', firstName:'Sammy',  lastName:'Setter',     classYear:'JR', court:2, jersey:3,  active:true, tier:'gold', gender:'M', csRank:1455},
    {id:'sd05', firstName:'Penny',  lastName:'Passer',     classYear:'JR', court:3, jersey:24, active:true, tier:'gold', gender:'F', csRank:1420},
    {id:'sd06', firstName:'Sandy',  lastName:'Server',     classYear:'SO', court:3, jersey:9,  active:true, tier:'gold', gender:'M', csRank:1410},
    {id:'sd07', firstName:'Sarah',  lastName:'Sandbagger', classYear:'SO', court:4, jersey:5,  active:true, tier:'gold', gender:'F', csRank:1390},
    {id:'sd08', firstName:'Holly',  lastName:'Hitter',     classYear:'SO', court:4, jersey:15, active:true, tier:'gold', gender:'M', csRank:1375},
    {id:'sd09', firstName:'Riley',  lastName:'Receiver',   classYear:'FR', court:5, jersey:21, active:true, tier:'garnet', gender:'M', csRank:1510},
    {id:'sd10', firstName:'Olivia', lastName:'Option',     classYear:'FR', court:5, jersey:8,  active:true, tier:'garnet', gender:'F', csRank:1525},
    {id:'sd11', firstName:'Wendy',  lastName:'Wave',       classYear:'SO', court:6, jersey:33, active:true, tier:'garnet', gender:'F', csRank:1545},
    {id:'sd12', firstName:'Dana',   lastName:'Dune',       classYear:'FR', court:6, jersey:18, active:true, tier:'garnet', gender:'M', csRank:1560},
    {id:'sd13', firstName:'Tara',   lastName:'Tide',       classYear:'SO', court:7, jersey:2,  active:true, tier:'garnet', gender:'F', csRank:1535},
    {id:'sd14', firstName:'Cora',   lastName:'Coral',      classYear:'FR', court:7, jersey:44, active:true, tier:'garnet', gender:'M', csRank:1580},
    {id:'sd15', firstName:'Marina', lastName:'Mist',       classYear:'FR', court:8, jersey:11, active:true, tier:'garnet', gender:'F', csRank:1505},
    {id:'sd16', firstName:'Shelly', lastName:'Shoal',      classYear:'SO', court:8, jersey:6,  active:true, tier:'garnet', gender:'M', csRank:1595}
  ],
  schedule: [
    {id:'sch01', date:'2026-04-08', opponent:'Coastal Prep',     location:'home', time:'4:00 PM', scoreUs:3, scoreThem:2},
    {id:'sch02', date:'2026-04-15', opponent:'Bayshore Academy', location:'away', time:'4:00 PM', scoreUs:4, scoreThem:1},
    {id:'sch03', date:'2026-04-22', opponent:'Riptide High',     location:'home', time:'4:00 PM', scoreUs:2, scoreThem:3},
    {id:'sch04', date:'2026-04-29', opponent:'Dune Valley',      location:'away', time:'4:00 PM', scoreUs:3, scoreThem:2},
    {id:'sch05', date:'2026-05-13', opponent:'Coastal Prep',     location:'away', time:'4:00 PM'},
    {id:'sch06', date:'2026-05-20', opponent:'Riptide High',     location:'home', time:'4:00 PM'}
  ],
  duals: [
    {
      id:'dl01', date:'2026-04-08', opponent:'Coastal Prep', location:'home',
      leonCourts:3, oppCourts:2, dualWin:true, createdAt:'2026-04-08',
      courts:[
        {court:1, pair:['sd01','sd02'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:18},{scoreUs:21,scoreThem:19}]},
        {court:2, pair:['sd03','sd04'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:19,scoreThem:21},{scoreUs:21,scoreThem:18},{scoreUs:15,scoreThem:12}]},
        {court:3, pair:['sd05','sd06'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:15},{scoreUs:21,scoreThem:17}]},
        {court:4, pair:['sd07','sd08'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:18,scoreThem:21},{scoreUs:19,scoreThem:21}]},
        {court:5, pair:['sd09','sd10'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:21,scoreThem:19},{scoreUs:18,scoreThem:21},{scoreUs:12,scoreThem:15}]}
      ]
    },
    {
      id:'dl02', date:'2026-04-15', opponent:'Bayshore Academy', location:'away',
      leonCourts:4, oppCourts:1, dualWin:true, createdAt:'2026-04-15',
      courts:[
        {court:1, pair:['sd01','sd02'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:15},{scoreUs:21,scoreThem:18}]},
        {court:2, pair:['sd03','sd04'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:19},{scoreUs:21,scoreThem:17}]},
        {court:3, pair:['sd05','sd06'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:18},{scoreUs:19,scoreThem:21},{scoreUs:15,scoreThem:13}]},
        {court:4, pair:['sd07','sd08'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:19},{scoreUs:21,scoreThem:18}]},
        {court:5, pair:['sd09','sd10'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:19,scoreThem:21},{scoreUs:17,scoreThem:21}]}
      ]
    },
    {
      id:'dl03', date:'2026-04-22', opponent:'Riptide High', location:'home',
      leonCourts:2, oppCourts:3, dualWin:false, createdAt:'2026-04-22',
      courts:[
        {court:1, pair:['sd01','sd02'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:19},{scoreUs:19,scoreThem:21},{scoreUs:15,scoreThem:13}]},
        {court:2, pair:['sd03','sd04'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:18,scoreThem:21},{scoreUs:21,scoreThem:19},{scoreUs:12,scoreThem:15}]},
        {court:3, pair:['sd05','sd06'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:17,scoreThem:21},{scoreUs:19,scoreThem:21}]},
        {court:4, pair:['sd07','sd08'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:18},{scoreUs:21,scoreThem:19}]},
        {court:5, pair:['sd09','sd10'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:18,scoreThem:21},{scoreUs:19,scoreThem:21}]}
      ]
    },
    {
      id:'dl04', date:'2026-04-29', opponent:'Dune Valley', location:'away',
      leonCourts:3, oppCourts:2, dualWin:true, createdAt:'2026-04-29',
      courts:[
        {court:1, pair:['sd01','sd02'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:17},{scoreUs:21,scoreThem:19}]},
        {court:2, pair:['sd03','sd04'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:18},{scoreUs:19,scoreThem:21},{scoreUs:15,scoreThem:12}]},
        {court:3, pair:['sd05','sd06'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:19,scoreThem:21},{scoreUs:17,scoreThem:21}]},
        {court:4, pair:['sd07','sd08'], isExhibition:false, courtResult:'L',
          sets:[{scoreUs:18,scoreThem:21},{scoreUs:21,scoreThem:19},{scoreUs:13,scoreThem:15}]},
        {court:5, pair:['sd09','sd10'], isExhibition:false, courtResult:'W',
          sets:[{scoreUs:21,scoreThem:19},{scoreUs:21,scoreThem:18}]}
      ]
    }
  ],
  standings: {
    'Sand Sharks':       {w:3, l:1, auto:true},
    'Coastal Prep':      {w:2, l:2, auto:false},
    'Bayshore Academy':  {w:1, l:3, auto:false},
    'Riptide High':      {w:3, l:1, auto:false},
    'Dune Valley':       {w:1, l:3, auto:false},
    'Tidewater HS':      {w:2, l:2, auto:false}
  },
  assignments: {
    asg01: {
      id:'asg01', date:'2026-05-13', type:'gameday', opponent:'Coastal Prep',
      location:'away', time:'4:00 PM',
      courts:[
        {court:1, p1:'sd01', p2:'sd02'},
        {court:2, p1:'sd03', p2:'sd04'},
        {court:3, p1:'sd05', p2:'sd06'},
        {court:4, p1:'sd07', p2:'sd08'},
        {court:5, p1:'sd09', p2:'sd10'}
      ],
      scorers:{
        "1":{primary:'sd11',secondary:'sd12'},
        "2":{primary:'sd13',secondary:null},
        "3":{primary:'sd14',secondary:'sd15'},
        "4":{primary:'sd16',secondary:null},
        "5":{primary:'sd11',secondary:'sd13'}
      },
      notes:null, createdAt:'2026-05-09'
    },
    asg02: {
      id:'asg02', date:'2026-05-20', type:'gameday', opponent:'Riptide High',
      location:'home', time:'4:00 PM',
      courts:[
        {court:1, p1:'sd01', p2:'sd02'},
        {court:2, p1:'sd03', p2:'sd04'},
        {court:3, p1:'sd05', p2:'sd06'},
        {court:4, p1:'sd07', p2:'sd08'},
        {court:5, p1:'sd09', p2:'sd10'}
      ],
      scorers:{
        "1":{primary:'sd13',secondary:'sd14'},
        "2":{primary:'sd15',secondary:null},
        "3":{primary:'sd16',secondary:'sd11'},
        "4":{primary:'sd12',secondary:null},
        "5":{primary:'sd14',secondary:'sd16'}
      },
      notes:null, createdAt:'2026-05-09'
    },
    asg03: {
      id:'asg03', date:'2026-05-20', type:'gameday', opponent:'Tidewater HS',
      location:'home', time:'6:00 PM',
      courts:[
        {court:1, p1:'sd01', p2:'sd02'},
        {court:2, p1:'sd03', p2:'sd04'},
        {court:3, p1:'sd05', p2:'sd06'},
        {court:4, p1:'sd07', p2:'sd08'},
        {court:5, p1:'sd09', p2:'sd10'}
      ],
      scorers:{
        "1":{primary:'sd15',secondary:'sd16'},
        "2":{primary:'sd11',secondary:null},
        "3":{primary:'sd12',secondary:'sd13'},
        "4":{primary:'sd14',secondary:null},
        "5":{primary:'sd16',secondary:'sd12'}
      },
      notes:null, createdAt:'2026-05-09'
    }
  },
  opponents: {
    riptide_high: {
      info:{displayName:'Riptide High', lastDual:'2026-04-22'},
      players:{
        jade_barrow:  {firstName:'Jade',  lastName:'Barrow', fullName:'Jade Barrow',  jersey:'2',  typicalCourt:1, isAlternate:false, firstSeen:'2026-04-22', lastSeen:'2026-04-22'},
        nova_swell:   {firstName:'Nova',  lastName:'Swell',  fullName:'Nova Swell',   jersey:'5',  typicalCourt:1, isAlternate:false, firstSeen:'2026-04-22', lastSeen:'2026-04-22'},
        kai_breaker:  {firstName:'Kai',   lastName:'Breaker',fullName:'Kai Breaker',  jersey:'8',  typicalCourt:2, isAlternate:false, firstSeen:'2026-04-22', lastSeen:'2026-04-22'},
        sage_marsh:   {firstName:'Sage',  lastName:'Marsh',  fullName:'Sage Marsh',   jersey:'11', typicalCourt:2, isAlternate:false, firstSeen:'2026-04-22', lastSeen:'2026-04-22'},
        remy_cove:    {firstName:'Remy',  lastName:'Cove',   fullName:'Remy Cove',    jersey:'14', typicalCourt:3, isAlternate:true,  firstSeen:'2026-04-22', lastSeen:'2026-04-22'}
      },
      pairs:{
        jade_barrow__nova_swell: {player1:'Jade Barrow', player2:'Nova Swell', court:1, firstSeen:'2026-04-22', lastSeen:'2026-04-22'},
        kai_breaker__sage_marsh: {player1:'Kai Breaker', player2:'Sage Marsh', court:2, firstSeen:'2026-04-22', lastSeen:'2026-04-22'}
      },
      notes:{
        sn_rip_1:{id:'sn_rip_1', targetType:'player', targetId:'jade_barrow', targetLabel:'Jade Barrow', text:'Big jump serve, goes to the line under pressure. Float her a tough deep ball and make her pass on the move.', tags:['serve','passing'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-03-18', createdAt:'2026-03-18T15:00:00.000Z'},
        sn_rip_2:{id:'sn_rip_2', targetType:'player', targetId:'nova_swell', targetLabel:'Nova Swell', text:'Left side hitter who loves the cross. Set the block early and dig the line behind it.', tags:['defense'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-01', createdAt:'2026-04-01T15:00:00.000Z'},
        sn_rip_3:{id:'sn_rip_3', targetType:'player', targetId:'kai_breaker', targetLabel:'Kai Breaker', text:'Tall and blocks well, but slow to transition off the net. Push the second ball to open court.', tags:['transition','block'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-09', createdAt:'2026-04-09T15:00:00.000Z'},
        sn_rip_4:{id:'sn_rip_4', targetType:'player', targetId:'sage_marsh', targetLabel:'Sage Marsh', text:'Streaky server who shanks the first pass when rushed. Serve her early and often.', tags:['serve'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-22', createdAt:'2026-04-22T15:00:00.000Z'},
        sn_rip_5:{id:'sn_rip_5', targetType:'pair', targetId:'jade_barrow__nova_swell', targetLabel:'Jade Barrow & Nova Swell', text:'Top pair runs the offense through the right side. Serve the off blocker and make the weaker passer move.', tags:['serve'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-22', createdAt:'2026-04-22T15:30:00.000Z'}
      }
    },
    coastal_prep: {
      info:{displayName:'Coastal Prep', lastDual:'2026-04-08', notes:'Scrappy team, strongest at court 5. Run their offense through the left side.'},
      players:{
        della_pier:   {firstName:'Della',   lastName:'Pier',   fullName:'Della Pier',   jersey:'3',  typicalCourt:1, isAlternate:false, firstSeen:'2026-03-15', lastSeen:'2026-04-08'},
        brett_shore:  {firstName:'Brett',   lastName:'Shore',  fullName:'Brett Shore',  jersey:'10', typicalCourt:1, isAlternate:false, firstSeen:'2026-03-15', lastSeen:'2026-04-08'},
        kelp_jensen:  {firstName:'Kelp',    lastName:'Jensen', fullName:'Kelp Jensen',  jersey:'6',  typicalCourt:3, isAlternate:false, firstSeen:'2026-03-29', lastSeen:'2026-04-08'},
        marlowe_reef: {firstName:'Marlowe', lastName:'Reef',   fullName:'Marlowe Reef', jersey:'7',  typicalCourt:5, isAlternate:false, firstSeen:'2026-04-08', lastSeen:'2026-04-08'},
        wren_tidal:   {firstName:'Wren',    lastName:'Tidal',  fullName:'Wren Tidal',   jersey:'14', typicalCourt:4, isAlternate:true,  firstSeen:'2026-04-08', lastSeen:'2026-04-08'}
      },
      pairs:{
        brett_shore__della_pier: {player1:'Della Pier', player2:'Brett Shore', court:1, firstSeen:'2026-03-15', lastSeen:'2026-04-08'},
        kelp_jensen__marlowe_reef: {player1:'Kelp Jensen', player2:'Marlowe Reef', court:3, firstSeen:'2026-03-29', lastSeen:'2026-04-08'}
      },
      notes:{
        sn_cos_1:{id:'sn_cos_1', targetType:'player', targetId:'della_pier', targetLabel:'Della Pier', text:'Steady ball control, very hard to ace. Beats you with placement, not power. Stay disciplined and grind the rally.', tags:['passing'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-03-15', createdAt:'2026-03-15T15:00:00.000Z'},
        sn_cos_2:{id:'sn_cos_2', targetType:'player', targetId:'marlowe_reef', targetLabel:'Marlowe Reef', text:'Their best at court 5, aggressive hitter. Do not give her a clean approach, serve deep to take away her tempo.', tags:['defense','serve'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-08', createdAt:'2026-04-08T15:00:00.000Z'},
        sn_cos_3:{id:'sn_cos_3', targetType:'pair', targetId:'brett_shore__della_pier', targetLabel:'Della Pier & Brett Shore', text:'Veteran pair, patient in long rallies. Speed up the tempo and attack the seam between them.', tags:['transition'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-03-29', createdAt:'2026-03-29T15:00:00.000Z'}
      }
    },
    bayshore_academy: {
      info:{displayName:'Bayshore Academy', lastDual:'2026-04-15', notes:'Young roster, improving fast. Inconsistent serve receive, attack their court 5.'},
      players:{
        opal_bay:     {firstName:'Opal',  lastName:'Bay',    fullName:'Opal Bay',    jersey:'2',  typicalCourt:1, isAlternate:false, firstSeen:'2026-04-01', lastSeen:'2026-04-15'},
        skye_harbor:  {firstName:'Skye',  lastName:'Harbor', fullName:'Skye Harbor', jersey:'9',  typicalCourt:2, isAlternate:false, firstSeen:'2026-04-15', lastSeen:'2026-04-15'},
        marin_quill:  {firstName:'Marin', lastName:'Quill',  fullName:'Marin Quill', jersey:'11', typicalCourt:3, isAlternate:false, firstSeen:'2026-04-15', lastSeen:'2026-04-15'},
        cove_addy:    {firstName:'Cove',  lastName:'Addy',   fullName:'Cove Addy',   jersey:'5',  typicalCourt:5, isAlternate:true,  firstSeen:'2026-04-15', lastSeen:'2026-04-15'}
      },
      pairs:{
        opal_bay__skye_harbor: {player1:'Opal Bay', player2:'Skye Harbor', court:1, firstSeen:'2026-04-15', lastSeen:'2026-04-15'}
      },
      notes:{
        sn_bay_1:{id:'sn_bay_1', targetType:'player', targetId:'opal_bay', targetLabel:'Opal Bay', text:'Young but athletic, big arm swing with timing that is still inconsistent. Serve tough and rush her approach.', tags:['serve'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-01', createdAt:'2026-04-01T15:00:00.000Z'},
        sn_bay_2:{id:'sn_bay_2', targetType:'pair', targetId:'opal_bay__skye_harbor', targetLabel:'Opal Bay & Skye Harbor', text:'Shaky serve receive between them. Serve the seam and they tend to collide or leave it.', tags:['serve','passing'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-15', createdAt:'2026-04-15T15:00:00.000Z'}
      }
    },
    dune_valley: {
      info:{displayName:'Dune Valley', lastDual:'2026-04-29', notes:'Defensive-minded, digs everything. Be patient and finish at the net.'},
      players:{
        rilla_sands:  {firstName:'Rilla', lastName:'Sands',  fullName:'Rilla Sands',  jersey:'4',  typicalCourt:1, isAlternate:false, firstSeen:'2026-03-22', lastSeen:'2026-04-29'},
        june_marsh:   {firstName:'June',  lastName:'Marsh',  fullName:'June Marsh',   jersey:'8',  typicalCourt:1, isAlternate:false, firstSeen:'2026-03-22', lastSeen:'2026-04-29'},
        cleo_grove:   {firstName:'Cleo',  lastName:'Grove',  fullName:'Cleo Grove',   jersey:'13', typicalCourt:2, isAlternate:false, firstSeen:'2026-04-12', lastSeen:'2026-04-29'},
        faye_dunn:    {firstName:'Faye',  lastName:'Dunn',   fullName:'Faye Dunn',    jersey:'1',  typicalCourt:4, isAlternate:false, firstSeen:'2026-04-29', lastSeen:'2026-04-29'}
      },
      pairs:{
        june_marsh__rilla_sands: {player1:'Rilla Sands', player2:'June Marsh', court:1, firstSeen:'2026-03-22', lastSeen:'2026-04-29'}
      },
      notes:{
        sn_dun_1:{id:'sn_dun_1', targetType:'player', targetId:'rilla_sands', targetLabel:'Rilla Sands', text:'Digs everything, will not give you a free ball. Be patient and finish high at the net instead of forcing it.', tags:['defense'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-03-22', createdAt:'2026-03-22T15:00:00.000Z'},
        sn_dun_2:{id:'sn_dun_2', targetType:'player', targetId:'cleo_grove', targetLabel:'Cleo Grove', text:'Strong defender but a weaker attacker. Let her swing, her kill is a low percentage shot.', tags:['defense'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-12', createdAt:'2026-04-12T15:00:00.000Z'},
        sn_dun_3:{id:'sn_dun_3', targetType:'pair', targetId:'june_marsh__rilla_sands', targetLabel:'Rilla Sands & June Marsh', text:'Grind-it-out defensive pair. Win the long rallies by staying aggressive and closing at the net.', tags:['transition'], authorId:'demo_coach', authorName:'Coach Mark', date:'2026-04-29', createdAt:'2026-04-29T15:00:00.000Z'}
      }
    }
  },
  gamedays: [
    // ---- Official dual stat lines (courts 1-5), set scores mirror _DEMO.duals ----
    {id:'gd01', date:'2026-04-08', opponent:'Coastal Prep', court:1, pair:['sd01','sd02'], sets:[
      {scoreUs:21, scoreThem:18, stats:{sd01:{k:8,b:1,a:1,se:0,re:0,he:1,de:1}, sd02:{k:3,b:0,a:4,se:1,re:0,he:0,de:3}}},
      {scoreUs:21, scoreThem:19, stats:{sd01:{k:7,b:2,a:2,se:1,re:0,he:1,de:0}, sd02:{k:4,b:0,a:3,se:0,re:1,he:1,de:4}}}
    ]},
    {id:'gd02', date:'2026-04-08', opponent:'Coastal Prep', court:2, pair:['sd03','sd04'], sets:[
      {scoreUs:19, scoreThem:21, stats:{sd03:{k:4,b:4,a:0,se:1,re:0,he:2,de:1}, sd04:{k:3,b:1,a:5,se:0,re:1,he:1,de:1}}},
      {scoreUs:21, scoreThem:18, stats:{sd03:{k:5,b:5,a:1,se:0,re:0,he:1,de:0}, sd04:{k:4,b:0,a:6,se:1,re:0,he:0,de:2}}},
      {scoreUs:15, scoreThem:12, stats:{sd03:{k:3,b:3,a:0,se:0,re:0,he:1,de:1}, sd04:{k:2,b:0,a:4,se:0,re:0,he:1,de:1}}}
    ]},
    {id:'gd03', date:'2026-04-08', opponent:'Coastal Prep', court:3, pair:['sd05','sd06'], sets:[
      {scoreUs:21, scoreThem:15, stats:{sd05:{k:4,b:1,a:3,se:1,re:1,he:1,de:2}, sd06:{k:3,b:1,a:2,se:1,re:1,he:1,de:2}}},
      {scoreUs:21, scoreThem:17, stats:{sd05:{k:3,b:0,a:4,se:1,re:0,he:2,de:1}, sd06:{k:4,b:1,a:1,se:2,re:1,he:1,de:2}}}
    ]},
    {id:'gd04', date:'2026-04-08', opponent:'Coastal Prep', court:4, pair:['sd07','sd08'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd07:{k:2,b:0,a:1,se:2,re:2,he:3,de:1}, sd08:{k:3,b:1,a:0,se:1,re:1,he:2,de:1}}},
      {scoreUs:19, scoreThem:21, stats:{sd07:{k:3,b:0,a:1,se:1,re:2,he:2,de:2}, sd08:{k:2,b:1,a:1,se:2,re:1,he:3,de:1}}}
    ]},
    {id:'gd05', date:'2026-04-08', opponent:'Coastal Prep', court:5, pair:['sd09','sd10'], sets:[
      {scoreUs:21, scoreThem:19, stats:{sd09:{k:2,b:0,a:2,se:1,re:2,he:2,de:2}, sd10:{k:2,b:0,a:1,se:2,re:1,he:2,de:1}}},
      {scoreUs:18, scoreThem:21, stats:{sd09:{k:1,b:0,a:1,se:2,re:2,he:3,de:1}, sd10:{k:2,b:1,a:0,se:1,re:2,he:2,de:2}}},
      {scoreUs:12, scoreThem:15, stats:{sd09:{k:1,b:0,a:1,se:1,re:1,he:2,de:1}, sd10:{k:1,b:0,a:1,se:2,re:1,he:2,de:1}}}
    ]},
    {id:'gd06', date:'2026-04-22', opponent:'Riptide High', court:1, pair:['sd01','sd02'], sets:[
      {scoreUs:21, scoreThem:19, stats:{sd01:{k:6,b:1,a:1,se:1,re:0,he:2,de:1}, sd02:{k:2,b:0,a:5,se:0,re:1,he:0,de:3}}},
      {scoreUs:19, scoreThem:21, stats:{sd01:{k:5,b:0,a:1,se:2,re:1,he:3,de:1}, sd02:{k:1,b:0,a:3,se:1,re:2,he:1,de:2}}},
      {scoreUs:15, scoreThem:13, stats:{sd01:{k:6,b:1,a:0,se:0,re:0,he:1,de:1}, sd02:{k:2,b:0,a:2,se:0,re:0,he:0,de:2}}}
    ]},
    {id:'gd07', date:'2026-04-22', opponent:'Riptide High', court:2, pair:['sd03','sd04'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd03:{k:3,b:3,a:1,se:1,re:1,he:2,de:1}, sd04:{k:2,b:0,a:4,se:1,re:1,he:1,de:2}}},
      {scoreUs:21, scoreThem:19, stats:{sd03:{k:5,b:4,a:0,se:0,re:0,he:1,de:1}, sd04:{k:3,b:1,a:5,se:0,re:0,he:1,de:1}}},
      {scoreUs:12, scoreThem:15, stats:{sd03:{k:2,b:2,a:0,se:1,re:1,he:2,de:0}, sd04:{k:1,b:0,a:3,se:1,re:1,he:2,de:1}}}
    ]},
    {id:'gd08', date:'2026-04-22', opponent:'Riptide High', court:3, pair:['sd05','sd06'], sets:[
      {scoreUs:17, scoreThem:21, stats:{sd05:{k:2,b:0,a:3,se:2,re:2,he:2,de:1}, sd06:{k:2,b:1,a:1,se:2,re:1,he:2,de:1}}},
      {scoreUs:19, scoreThem:21, stats:{sd05:{k:3,b:1,a:2,se:1,re:1,he:2,de:2}, sd06:{k:3,b:0,a:1,se:1,re:2,he:2,de:1}}}
    ]},
    {id:'gd09', date:'2026-04-22', opponent:'Riptide High', court:4, pair:['sd07','sd08'], sets:[
      {scoreUs:21, scoreThem:18, stats:{sd07:{k:3,b:1,a:2,se:1,re:1,he:2,de:2}, sd08:{k:4,b:1,a:0,se:1,re:0,he:1,de:2}}},
      {scoreUs:21, scoreThem:19, stats:{sd07:{k:2,b:0,a:1,se:1,re:1,he:2,de:1}, sd08:{k:3,b:2,a:1,se:0,re:1,he:1,de:1}}}
    ]},
    {id:'gd10', date:'2026-04-22', opponent:'Riptide High', court:5, pair:['sd09','sd10'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd09:{k:2,b:0,a:1,se:2,re:2,he:3,de:1}, sd10:{k:1,b:0,a:1,se:1,re:2,he:2,de:2}}},
      {scoreUs:19, scoreThem:21, stats:{sd09:{k:2,b:1,a:1,se:1,re:2,he:2,de:2}, sd10:{k:2,b:0,a:0,se:2,re:1,he:3,de:1}}}
    ]},
    // ---- Exhibition stat lines (courts 6-8), development players ----
    {id:'gd11', date:'2026-04-22', opponent:'Riptide High', court:6, pair:['sd11','sd12'], sets:[
      {scoreUs:21, scoreThem:17, stats:{sd11:{k:2,b:0,a:1,se:1,re:1,he:2,de:1}, sd12:{k:1,b:1,a:0,se:2,re:1,he:2,de:1}}},
      {scoreUs:19, scoreThem:21, stats:{sd11:{k:1,b:0,a:1,se:2,re:2,he:3,de:1}, sd12:{k:1,b:0,a:0,se:1,re:2,he:2,de:2}}},
      {scoreUs:15, scoreThem:11, stats:{sd11:{k:2,b:1,a:0,se:1,re:1,he:1,de:1}, sd12:{k:1,b:0,a:1,se:1,re:1,he:1,de:1}}}
    ]},
    {id:'gd12', date:'2026-04-22', opponent:'Riptide High', court:7, pair:['sd13','sd14'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd13:{k:1,b:0,a:1,se:2,re:2,he:2,de:1}, sd14:{k:1,b:0,a:0,se:2,re:1,he:3,de:1}}},
      {scoreUs:21, scoreThem:18, stats:{sd13:{k:2,b:1,a:0,se:1,re:1,he:1,de:2}, sd14:{k:2,b:0,a:1,se:1,re:1,he:1,de:1}}},
      {scoreUs:12, scoreThem:15, stats:{sd13:{k:1,b:0,a:0,se:2,re:2,he:2,de:1}, sd14:{k:0,b:0,a:1,se:2,re:1,he:2,de:1}}}
    ]},
    {id:'gd13', date:'2026-04-22', opponent:'Riptide High', court:8, pair:['sd15','sd16'], sets:[
      {scoreUs:21, scoreThem:19, stats:{sd15:{k:2,b:0,a:1,se:1,re:1,he:1,de:1}, sd16:{k:1,b:1,a:0,se:1,re:1,he:2,de:1}}},
      {scoreUs:21, scoreThem:16, stats:{sd15:{k:2,b:1,a:0,se:1,re:0,he:1,de:2}, sd16:{k:1,b:0,a:1,se:1,re:1,he:1,de:1}}}
    ]},
    // ---- Court-5 cameo: a development player earns a look on an official court ----
    {id:'gd14', date:'2026-04-29', opponent:'Dune Valley', court:5, pair:['sd09','sd11'], sets:[
      {scoreUs:21, scoreThem:18, stats:{sd09:{k:3,b:0,a:2,se:1,re:1,he:1,de:2}, sd11:{k:2,b:0,a:1,se:1,re:1,he:1,de:1}}},
      {scoreUs:21, scoreThem:19, stats:{sd09:{k:2,b:1,a:2,se:0,re:1,he:1,de:2}, sd11:{k:2,b:1,a:0,se:1,re:1,he:1,de:1}}}
    ]},
    // ---- Bayshore Academy 2026-04-15: full courts 1-5 (set scores mirror dl02) ----
    {id:'gd15', date:'2026-04-15', opponent:'Bayshore Academy', court:1, pair:['sd01','sd02'], sets:[
      {scoreUs:21, scoreThem:15, stats:{sd01:{k:8,b:1,a:2,se:0,re:0,he:1,de:1}, sd02:{k:3,b:0,a:4,se:0,re:0,he:0,de:3}}},
      {scoreUs:21, scoreThem:18, stats:{sd01:{k:7,b:1,a:1,se:1,re:0,he:1,de:0}, sd02:{k:4,b:0,a:3,se:0,re:1,he:1,de:3}}}
    ]},
    {id:'gd16', date:'2026-04-15', opponent:'Bayshore Academy', court:2, pair:['sd03','sd04'], sets:[
      {scoreUs:21, scoreThem:19, stats:{sd03:{k:5,b:4,a:0,se:0,re:0,he:1,de:1}, sd04:{k:3,b:1,a:5,se:1,re:0,he:1,de:1}}},
      {scoreUs:21, scoreThem:17, stats:{sd03:{k:4,b:5,a:1,se:0,re:0,he:1,de:0}, sd04:{k:4,b:0,a:5,se:0,re:0,he:0,de:2}}}
    ]},
    {id:'gd17', date:'2026-04-15', opponent:'Bayshore Academy', court:3, pair:['sd05','sd06'], sets:[
      {scoreUs:21, scoreThem:18, stats:{sd05:{k:4,b:1,a:3,se:1,re:1,he:1,de:2}, sd06:{k:3,b:1,a:2,se:1,re:1,he:1,de:2}}},
      {scoreUs:19, scoreThem:21, stats:{sd05:{k:3,b:0,a:2,se:2,re:1,he:2,de:1}, sd06:{k:2,b:1,a:1,se:1,re:2,he:2,de:1}}},
      {scoreUs:15, scoreThem:13, stats:{sd05:{k:3,b:1,a:1,se:0,re:0,he:1,de:1}, sd06:{k:3,b:0,a:1,se:1,re:1,he:1,de:2}}}
    ]},
    {id:'gd18', date:'2026-04-15', opponent:'Bayshore Academy', court:4, pair:['sd07','sd08'], sets:[
      {scoreUs:21, scoreThem:19, stats:{sd07:{k:3,b:1,a:2,se:1,re:1,he:2,de:2}, sd08:{k:4,b:1,a:0,se:1,re:0,he:1,de:1}}},
      {scoreUs:21, scoreThem:18, stats:{sd07:{k:3,b:0,a:1,se:1,re:1,he:1,de:2}, sd08:{k:4,b:2,a:1,se:0,re:1,he:1,de:1}}}
    ]},
    {id:'gd19', date:'2026-04-15', opponent:'Bayshore Academy', court:5, pair:['sd09','sd10'], sets:[
      {scoreUs:19, scoreThem:21, stats:{sd09:{k:2,b:0,a:1,se:2,re:2,he:3,de:1}, sd10:{k:1,b:0,a:1,se:1,re:2,he:2,de:2}}},
      {scoreUs:17, scoreThem:21, stats:{sd09:{k:1,b:0,a:1,se:2,re:2,he:2,de:1}, sd10:{k:2,b:0,a:0,se:2,re:1,he:3,de:1}}}
    ]},
    // ---- Dune Valley 2026-04-29: courts 1-4 (court 5 already covered by gd14 cameo; scores mirror dl04) ----
    {id:'gd20', date:'2026-04-29', opponent:'Dune Valley', court:1, pair:['sd01','sd02'], sets:[
      {scoreUs:21, scoreThem:17, stats:{sd01:{k:7,b:1,a:2,se:0,re:0,he:1,de:1}, sd02:{k:3,b:0,a:4,se:1,re:0,he:0,de:4}}},
      {scoreUs:21, scoreThem:19, stats:{sd01:{k:8,b:2,a:1,se:1,re:0,he:1,de:0}, sd02:{k:4,b:0,a:3,se:0,re:1,he:1,de:3}}}
    ]},
    {id:'gd21', date:'2026-04-29', opponent:'Dune Valley', court:2, pair:['sd03','sd04'], sets:[
      {scoreUs:21, scoreThem:18, stats:{sd03:{k:5,b:4,a:0,se:0,re:0,he:1,de:1}, sd04:{k:3,b:1,a:5,se:0,re:0,he:1,de:1}}},
      {scoreUs:19, scoreThem:21, stats:{sd03:{k:3,b:3,a:1,se:1,re:1,he:2,de:1}, sd04:{k:2,b:0,a:4,se:1,re:1,he:2,de:1}}},
      {scoreUs:15, scoreThem:12, stats:{sd03:{k:4,b:3,a:0,se:0,re:0,he:1,de:0}, sd04:{k:2,b:0,a:3,se:0,re:0,he:1,de:1}}}
    ]},
    {id:'gd22', date:'2026-04-29', opponent:'Dune Valley', court:3, pair:['sd05','sd06'], sets:[
      {scoreUs:19, scoreThem:21, stats:{sd05:{k:3,b:1,a:2,se:1,re:1,he:2,de:2}, sd06:{k:3,b:0,a:1,se:1,re:2,he:2,de:1}}},
      {scoreUs:17, scoreThem:21, stats:{sd05:{k:2,b:0,a:3,se:2,re:2,he:2,de:1}, sd06:{k:2,b:1,a:1,se:2,re:1,he:2,de:1}}}
    ]},
    {id:'gd23', date:'2026-04-29', opponent:'Dune Valley', court:4, pair:['sd07','sd08'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd07:{k:2,b:0,a:1,se:2,re:2,he:3,de:1}, sd08:{k:3,b:1,a:0,se:1,re:1,he:2,de:1}}},
      {scoreUs:21, scoreThem:19, stats:{sd07:{k:3,b:1,a:2,se:1,re:1,he:1,de:2}, sd08:{k:4,b:1,a:1,se:0,re:0,he:1,de:2}}},
      {scoreUs:13, scoreThem:15, stats:{sd07:{k:2,b:0,a:1,se:2,re:1,he:2,de:1}, sd08:{k:2,b:1,a:0,se:1,re:1,he:2,de:1}}}
    ]}
  ],
  skills: {
    sd01:{serving:8,passing:7,setting:6,hitting:9,blocking:6,defense:7,courtSense:8,communication:7},
    sd02:{serving:7,passing:9,setting:7,hitting:6,blocking:5,defense:9,courtSense:8,communication:8},
    sd03:{serving:7,passing:6,setting:5,hitting:7,blocking:9,defense:6,courtSense:7,communication:7},
    sd04:{serving:6,passing:8,setting:9,hitting:5,blocking:4,defense:7,courtSense:8,communication:8},
    sd05:{serving:6,passing:6,setting:6,hitting:5,blocking:5,defense:6,courtSense:5,communication:6},
    sd06:{serving:6,passing:5,setting:5,hitting:6,blocking:5,defense:5,courtSense:6,communication:5},
    sd07:{serving:4,passing:5,setting:3,hitting:4,blocking:3,defense:5,courtSense:4,communication:5},
    sd08:{serving:4,passing:4,setting:3,hitting:5,blocking:4,defense:4,courtSense:3,communication:4},
    sd09:{serving:3,passing:4,setting:2,hitting:3,blocking:2,defense:4,courtSense:3,communication:3},
    sd10:{serving:3,passing:3,setting:2,hitting:3,blocking:3,defense:4,courtSense:4,communication:3},
    sd11:{serving:2,passing:3,setting:3,hitting:2,blocking:3,defense:3,courtSense:3,communication:2},
    sd12:{serving:2,passing:2,setting:2,hitting:2,blocking:2,defense:2,courtSense:5,communication:3},
    sd13:{serving:3,passing:2,setting:2,hitting:2,blocking:3,defense:2,courtSense:3,communication:2},
    sd14:{serving:2,passing:3,setting:2,hitting:1,blocking:2,defense:3,courtSense:4,communication:3},
    sd15:{serving:2,passing:2,setting:3,hitting:2,blocking:1,defense:2,courtSense:3,communication:2},
    sd16:{serving:2,passing:2,setting:2,hitting:2,blocking:2,defense:2,courtSense:5,communication:3}
  },
  goals: {
    sd01:{
      goal_sd01_a:{goalType:'college_any', label:'Play college beach volleyball (any level)', selectedAt:'2026-04-10',
        aiFeedback:{text:'Suzie, your hitting is already a college level weapon and your numbers back it up. The next step is serving consistency under pressure and tighter shot selection late in sets. Build jump serve reps to a target twice a week and keep leading your pair on the sand. Hold your error count where it is and college coaches will notice the all around game.', generatedAt:'2026-04-12', status:'approved', editedBy:'Coach', approvedAt:'2026-04-13'}}
    },
    sd05:{
      goal_sd05_a:{goalType:'skill_setting', label:'Improve my setting', selectedAt:'2026-04-14',
        aiFeedback:{text:'Penny, your court sense is solid and you move well to the ball. To raise your setting, get square to your target before the ball arrives and keep your hands high and quiet. Add fifteen minutes of partner setting to your warmup and track clean sets versus misfires.', generatedAt:'2026-04-15', status:'draft', editedBy:null, approvedAt:null}}
    },
    sd09:{
      goal_sd09_a:{goalType:'skill_passing', label:'Improve my passing', selectedAt:'2026-04-20', aiFeedback:null}
    },
    sd02:{
      goal_sd02_a:{goalType:'skill_serving', label:'Improve my serving', selectedAt:'2026-04-11',
        aiFeedback:{text:'Debby, your defense and ball control are real strengths and your dig numbers prove it. To round out your game, your float serve needs more pace and a tighter target. Spend two short serving blocks each practice aiming deep corners, and you will turn free points into pressure on the other side. Keep at it. Coach Mark.', generatedAt:'2026-04-13', status:'approved', editedBy:'Coach', approvedAt:'2026-04-14'}}
    },
    sd03:{
      goal_sd03_a:{goalType:'d2', label:'Play D2 college beach volleyball', selectedAt:'2026-04-09',
        aiFeedback:{text:'Bonnie, your blocking is the best on this roster and D2 programs look for exactly that presence at the net. Keep extending your range to the line, and tighten your serve so you are not handing back easy sideouts. Film two matches this month and we will get clips to the coaches on your list. Coach Mark.', generatedAt:'2026-04-11', status:'approved', editedBy:'Coach', approvedAt:'2026-04-12'}}
    },
    sd07:{
      goal_sd07_a:{goalType:'skill_hitting', label:'Improve my hitting', selectedAt:'2026-04-18',
        aiFeedback:{text:'Sarah, you compete hard and your defense is steady. Your hitting will jump once you slow your approach and finish high through the ball instead of swiping across it. Add ten minutes of approach timing every practice and track clean kills versus hitting errors.', generatedAt:'2026-04-19', status:'draft', editedBy:null, approvedAt:null}}
    },
    sd11:{
      goal_sd11_a:{goalType:'skill_defense', label:'Improve my defense', selectedAt:'2026-04-21', aiFeedback:null}
    }
  },
  liveScoring: {},
  scrimmages: [
    {id:'sc01', date:'2026-04-11', opponent:'Intrasquad', court:1, pair:['sd01','sd04'], sets:[
      {scoreUs:21, scoreThem:17, stats:{sd01:{k:7,b:1,a:2,se:1,re:0,he:1,de:1}, sd04:{k:3,b:1,a:5,se:0,re:1,he:1,de:1}}},
      {scoreUs:21, scoreThem:15, stats:{sd01:{k:8,b:2,a:1,se:0,re:0,he:1,de:0}, sd04:{k:4,b:0,a:6,se:1,re:0,he:0,de:1}}}
    ]},
    {id:'sc02', date:'2026-04-11', opponent:'Intrasquad', court:2, pair:['sd02','sd05'], sets:[
      {scoreUs:19, scoreThem:21, stats:{sd02:{k:3,b:0,a:4,se:1,re:1,he:1,de:3}, sd05:{k:4,b:1,a:2,se:1,re:1,he:2,de:1}}},
      {scoreUs:21, scoreThem:18, stats:{sd02:{k:4,b:0,a:3,se:0,re:0,he:0,de:4}, sd05:{k:5,b:1,a:3,se:1,re:0,he:1,de:2}}}
    ]},
    {id:'sc03', date:'2026-04-18', opponent:'Intrasquad', court:1, pair:['sd03','sd06'], sets:[
      {scoreUs:21, scoreThem:16, stats:{sd03:{k:5,b:4,a:1,se:0,re:0,he:1,de:1}, sd06:{k:3,b:1,a:2,se:1,re:1,he:1,de:2}}},
      {scoreUs:21, scoreThem:19, stats:{sd03:{k:4,b:5,a:0,se:1,re:0,he:2,de:0}, sd06:{k:4,b:1,a:1,se:1,re:1,he:1,de:2}}}
    ]},
    {id:'sc04', date:'2026-04-18', opponent:'Intrasquad', court:3, pair:['sd07','sd09'], sets:[
      {scoreUs:18, scoreThem:21, stats:{sd07:{k:2,b:0,a:1,se:2,re:2,he:3,de:1}, sd09:{k:2,b:0,a:2,se:1,re:2,he:2,de:2}}},
      {scoreUs:16, scoreThem:21, stats:{sd07:{k:3,b:0,a:1,se:1,re:2,he:2,de:2}, sd09:{k:1,b:0,a:1,se:2,re:2,he:3,de:1}}}
    ]},
    {id:'sc05', date:'2026-04-25', opponent:'Intrasquad', court:2, pair:['sd05','sd08'], sets:[
      {scoreUs:21, scoreThem:14, stats:{sd05:{k:5,b:1,a:3,se:0,re:0,he:1,de:2}, sd08:{k:4,b:2,a:1,se:1,re:1,he:1,de:1}}},
      {scoreUs:21, scoreThem:18, stats:{sd05:{k:4,b:0,a:4,se:1,re:1,he:1,de:1}, sd08:{k:5,b:1,a:0,se:1,re:0,he:2,de:1}}}
    ]}
  ],
  matches: [
    {id:'qm01', date:'2026-04-05', team1:['sd01','sd05'], team2:['sd02','sd06'], score1:21, score2:17},
    {id:'qm02', date:'2026-04-05', team1:['sd03','sd07'], team2:['sd04','sd08'], score1:21, score2:15},
    {id:'qm03', date:'2026-04-05', team1:['sd01','sd06'], team2:['sd03','sd09'], score1:21, score2:19},
    {id:'qm04', date:'2026-04-12', team1:['sd02','sd04'], team2:['sd05','sd10'], score1:21, score2:16},
    {id:'qm05', date:'2026-04-12', team1:['sd01','sd08'], team2:['sd03','sd05'], score1:19, score2:21},
    {id:'qm06', date:'2026-04-12', team1:['sd06','sd07'], team2:['sd02','sd09'], score1:18, score2:21},
    {id:'qm07', date:'2026-04-19', team1:['sd01','sd03'], team2:['sd02','sd05'], score1:21, score2:14},
    {id:'qm08', date:'2026-04-19', team1:['sd04','sd06'], team2:['sd07','sd08'], score1:15, score2:21},
    {id:'qm09', date:'2026-04-26', team1:['sd01','sd02'], team2:['sd03','sd04'], score1:21, score2:19},
    {id:'qm10', date:'2026-04-26', team1:['sd05','sd09'], team2:['sd06','sd10'], score1:21, score2:17}
  ],
  jumpTests: {
    jt01a:{id:'jt01a', playerId:'sd01', player:'sd01', date:'2026-03-20', standingReach:"7'5\"", blockJump:"9'3\"", approachJump:"9'7\""},
    jt01b:{id:'jt01b', playerId:'sd01', player:'sd01', date:'2026-04-24', standingReach:"7'5\"", blockJump:"9'5\"", approachJump:"9'9\""},
    jt02a:{id:'jt02a', playerId:'sd02', player:'sd02', date:'2026-03-20', standingReach:"7'4\"", blockJump:"9'2\"", approachJump:"9'6\""},
    jt02b:{id:'jt02b', playerId:'sd02', player:'sd02', date:'2026-04-24', standingReach:"7'4\"", blockJump:"9'4\"", approachJump:"9'8\""},
    jt03a:{id:'jt03a', playerId:'sd03', player:'sd03', date:'2026-03-20', standingReach:"7'4\"", blockJump:"9'3\"", approachJump:"9'5\""},
    jt03b:{id:'jt03b', playerId:'sd03', player:'sd03', date:'2026-04-24', standingReach:"7'4\"", blockJump:"9'5\"", approachJump:"9'7\""},
    jt04a:{id:'jt04a', playerId:'sd04', player:'sd04', date:'2026-03-20', standingReach:"7'3\"", blockJump:"9'0\"", approachJump:"9'4\""},
    jt04b:{id:'jt04b', playerId:'sd04', player:'sd04', date:'2026-04-24', standingReach:"7'3\"", blockJump:"9'2\"", approachJump:"9'6\""},
    jt05a:{id:'jt05a', playerId:'sd05', player:'sd05', date:'2026-03-20', standingReach:"7'3\"", blockJump:"9'0\"", approachJump:"9'3\""},
    jt05b:{id:'jt05b', playerId:'sd05', player:'sd05', date:'2026-04-24', standingReach:"7'3\"", blockJump:"9'1\"", approachJump:"9'5\""},
    jt06a:{id:'jt06a', playerId:'sd06', player:'sd06', date:'2026-03-20', standingReach:"7'2\"", blockJump:"8'11\"", approachJump:"9'2\""},
    jt06b:{id:'jt06b', playerId:'sd06', player:'sd06', date:'2026-04-24', standingReach:"7'2\"", blockJump:"9'0\"", approachJump:"9'4\""},
    jt07a:{id:'jt07a', playerId:'sd07', player:'sd07', date:'2026-03-20', standingReach:"7'2\"", blockJump:"8'10\"", approachJump:"9'1\""},
    jt07b:{id:'jt07b', playerId:'sd07', player:'sd07', date:'2026-04-24', standingReach:"7'2\"", blockJump:"8'11\"", approachJump:"9'2\""},
    jt08a:{id:'jt08a', playerId:'sd08', player:'sd08', date:'2026-03-20', standingReach:"7'2\"", blockJump:"8'10\"", approachJump:"9'0\""},
    jt08b:{id:'jt08b', playerId:'sd08', player:'sd08', date:'2026-04-24', standingReach:"7'2\"", blockJump:"9'0\"", approachJump:"9'2\""},
    jt09a:{id:'jt09a', playerId:'sd09', player:'sd09', date:'2026-03-20', standingReach:"7'1\"", blockJump:"8'8\"", approachJump:"8'11\""},
    jt09b:{id:'jt09b', playerId:'sd09', player:'sd09', date:'2026-04-24', standingReach:"7'1\"", blockJump:"8'10\"", approachJump:"9'1\""},
    jt10a:{id:'jt10a', playerId:'sd10', player:'sd10', date:'2026-03-20', standingReach:"7'1\"", blockJump:"8'8\"", approachJump:"8'10\""},
    jt10b:{id:'jt10b', playerId:'sd10', player:'sd10', date:'2026-04-24', standingReach:"7'1\"", blockJump:"8'9\"", approachJump:"9'0\""},
    jt11a:{id:'jt11a', playerId:'sd11', player:'sd11', date:'2026-03-20', standingReach:"7'1\"", blockJump:"8'7\"", approachJump:"8'10\""},
    jt11b:{id:'jt11b', playerId:'sd11', player:'sd11', date:'2026-04-24', standingReach:"7'1\"", blockJump:"8'9\"", approachJump:"9'0\""},
    jt12a:{id:'jt12a', playerId:'sd12', player:'sd12', date:'2026-03-20', standingReach:"7'0\"", blockJump:"8'7\"", approachJump:"8'9\""},
    jt12b:{id:'jt12b', playerId:'sd12', player:'sd12', date:'2026-04-24', standingReach:"7'0\"", blockJump:"8'8\"", approachJump:"8'11\""},
    jt13a:{id:'jt13a', playerId:'sd13', player:'sd13', date:'2026-03-20', standingReach:"7'0\"", blockJump:"8'6\"", approachJump:"8'9\""},
    jt13b:{id:'jt13b', playerId:'sd13', player:'sd13', date:'2026-04-24', standingReach:"7'0\"", blockJump:"8'8\"", approachJump:"8'11\""},
    jt14a:{id:'jt14a', playerId:'sd14', player:'sd14', date:'2026-03-20', standingReach:"6'11\"", blockJump:"8'6\"", approachJump:"8'8\""},
    jt14b:{id:'jt14b', playerId:'sd14', player:'sd14', date:'2026-04-24', standingReach:"6'11\"", blockJump:"8'7\"", approachJump:"8'10\""},
    jt15a:{id:'jt15a', playerId:'sd15', player:'sd15', date:'2026-03-20', standingReach:"7'0\"", blockJump:"8'6\"", approachJump:"8'8\""},
    jt15b:{id:'jt15b', playerId:'sd15', player:'sd15', date:'2026-04-24', standingReach:"7'0\"", blockJump:"8'7\"", approachJump:"8'10\""},
    jt16a:{id:'jt16a', playerId:'sd16', player:'sd16', date:'2026-03-20', standingReach:"6'11\"", blockJump:"8'5\"", approachJump:"8'7\""},
    jt16b:{id:'jt16b', playerId:'sd16', player:'sd16', date:'2026-04-24', standingReach:"6'11\"", blockJump:"8'7\"", approachJump:"8'9\""}
  },
  starDrills: {
    dr01a:{id:'dr01a', playerId:'sd01', player:'sd01', date:'2026-03-20', time:13.8},
    dr01b:{id:'dr01b', playerId:'sd01', player:'sd01', date:'2026-04-24', time:12.9},
    dr02a:{id:'dr02a', playerId:'sd02', player:'sd02', date:'2026-03-20', time:13.5},
    dr02b:{id:'dr02b', playerId:'sd02', player:'sd02', date:'2026-04-24', time:12.6},
    dr03a:{id:'dr03a', playerId:'sd03', player:'sd03', date:'2026-03-20', time:14.5},
    dr03b:{id:'dr03b', playerId:'sd03', player:'sd03', date:'2026-04-24', time:13.8},
    dr04a:{id:'dr04a', playerId:'sd04', player:'sd04', date:'2026-03-20', time:14.2},
    dr04b:{id:'dr04b', playerId:'sd04', player:'sd04', date:'2026-04-24', time:13.5},
    dr05a:{id:'dr05a', playerId:'sd05', player:'sd05', date:'2026-03-20', time:14.8},
    dr05b:{id:'dr05b', playerId:'sd05', player:'sd05', date:'2026-04-24', time:14.1},
    dr06a:{id:'dr06a', playerId:'sd06', player:'sd06', date:'2026-03-20', time:15.0},
    dr06b:{id:'dr06b', playerId:'sd06', player:'sd06', date:'2026-04-24', time:14.3},
    dr07a:{id:'dr07a', playerId:'sd07', player:'sd07', date:'2026-03-20', time:16.2},
    dr07b:{id:'dr07b', playerId:'sd07', player:'sd07', date:'2026-04-24', time:15.4},
    dr08a:{id:'dr08a', playerId:'sd08', player:'sd08', date:'2026-03-20', time:15.8},
    dr08b:{id:'dr08b', playerId:'sd08', player:'sd08', date:'2026-04-24', time:15.0},
    dr09a:{id:'dr09a', playerId:'sd09', player:'sd09', date:'2026-03-20', time:16.8},
    dr09b:{id:'dr09b', playerId:'sd09', player:'sd09', date:'2026-04-24', time:16.0},
    dr10a:{id:'dr10a', playerId:'sd10', player:'sd10', date:'2026-03-20', time:17.0},
    dr10b:{id:'dr10b', playerId:'sd10', player:'sd10', date:'2026-04-24', time:16.2},
    dr11a:{id:'dr11a', playerId:'sd11', player:'sd11', date:'2026-03-20', time:17.5},
    dr11b:{id:'dr11b', playerId:'sd11', player:'sd11', date:'2026-04-24', time:16.8},
    dr12a:{id:'dr12a', playerId:'sd12', player:'sd12', date:'2026-03-20', time:18.2},
    dr12b:{id:'dr12b', playerId:'sd12', player:'sd12', date:'2026-04-24', time:17.4},
    dr13a:{id:'dr13a', playerId:'sd13', player:'sd13', date:'2026-03-20', time:18.0},
    dr13b:{id:'dr13b', playerId:'sd13', player:'sd13', date:'2026-04-24', time:17.2},
    dr14a:{id:'dr14a', playerId:'sd14', player:'sd14', date:'2026-03-20', time:18.8},
    dr14b:{id:'dr14b', playerId:'sd14', player:'sd14', date:'2026-04-24', time:18.0},
    dr15a:{id:'dr15a', playerId:'sd15', player:'sd15', date:'2026-03-20', time:18.5},
    dr15b:{id:'dr15b', playerId:'sd15', player:'sd15', date:'2026-04-24', time:17.7},
    dr16a:{id:'dr16a', playerId:'sd16', player:'sd16', date:'2026-03-20', time:19.4},
    dr16b:{id:'dr16b', playerId:'sd16', player:'sd16', date:'2026-04-24', time:18.6}
  }
};

// ============================================================
// THIN SHELL INJECTION — builds CSS and HTML from SCHOOL_CONFIG
// ============================================================
(function injectApp(){
  var c=SC.colors;
  // Gold accent: config-driven via SC.colors.accent, falling back to the platform default so any school without an accent renders exactly as before.
  var accent=(c && c.accent) ? c.accent : '#d4a843';

  // Helper: hex color to r,g,b string for rgba()
  function hexRgb(hex){
    hex=hex.replace('#','');
    if(hex.length===3)hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    return parseInt(hex.slice(0,2),16)+','+parseInt(hex.slice(2,4),16)+','+parseInt(hex.slice(4,6),16);
  }

  // ── Inject CSS ──────────────────────────────────────────────
  var rootLine=':root{--red:'+c.primary+';--red-dark:'+c.primaryDark+';--red-deeper:'+c.primaryDeeper+';--red-light:'+c.primaryLight+';--red-bg:'+c.primaryBg+';--black:#1a1a1a;--charcoal:#2d2d2d;--white:#ffffff;--off-white:#fafafa;--cream:#f7f4f0;--gold:'+accent+';--gold-light:#f0d98a;--gray:#6b7280;--gray-light:#d1d5db;--gray-lighter:#e8eaed;--green:#16a34a;--green-bg:#dcfce7;--loss-red:#991b1b;--blue:#4338ca;--blue-bg:#e0e7ff;--purple:#7c3aed;--purple-bg:#f3e8ff;--radius:10px;--shadow:0 2px 10px rgba(0,0,0,0.06);--shadow-lg:0 8px 30px rgba(0,0,0,0.12);}';
  var headerLine='.header{background:linear-gradient(135deg,var(--red-deeper) 0%,var(--red) 50%,var(--red-dark) 100%);padding:14px 20px 10px;position:relative;z-index:100;box-shadow:0 4px 24px rgba('+hexRgb(c.primary)+',0.3);}';
  var staticCSS=`

*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;}
body{font-family:'Barlow',sans-serif;background:var(--cream);color:var(--black);min-height:100vh;-webkit-font-smoothing:antialiased;}

.header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.header h1{font-family:'Bebas Neue',sans-serif;font-weight:400;font-size:26px;color:var(--white);letter-spacing:3px;display:flex;align-items:center;gap:8px;text-shadow:0 2px 8px rgba(0,0,0,0.2);}
.header h1 .crown{font-size:22px;}
.sync-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-left:6px;}
.sync-dot.online{background:#4ade80;box-shadow:0 0 6px #4ade80;animation:pulse 2s infinite;}
.sync-dot.offline{background:#ef4444;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}@keyframes switchSlideIn{from{transform:translateY(-100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
.season-badge{background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);color:var(--white);font-family:'Bebas Neue',sans-serif;font-size:13px;padding:4px 14px;border-radius:20px;letter-spacing:2px;border:1px solid rgba(255,255,255,0.25);}
.tabs{display:flex;flex-direction:column;gap:2px;background:rgba(0,0,0,0.15);border-radius:8px;padding:2px;}
.tabs::-webkit-scrollbar{display:none;}
.tab{flex:1;padding:8px 4px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:1px;cursor:pointer;border-radius:6px;transition:all 0.2s ease;border:none;background:transparent;white-space:nowrap;min-width:0;}
.mode-bar{display:flex;gap:8px;padding:8px 12px 0;border-bottom:1px solid rgba(255,255,255,0.15);margin-bottom:4px;}
.mode-btn{flex:1;padding:9px 12px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1.5px;border:none;border-radius:8px 8px 0 0;cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.55);background:transparent;white-space:nowrap;min-width:0;}
.mode-btn.active{background:rgba(255,255,255,0.18);color:#fff;}
/* HS five-button nav only: shrink font, tracking, and side padding so all five labels fit a phone width without overflowing into the next tab. Club two-button nav is unaffected. */
.mode-bar-hs .mode-btn{font-size:12px;letter-spacing:0.5px;padding:9px 6px;}
/* HS four-tab nav active state: navy Team-pillar pill. Scoped to mode-bar-hs so the club two-button nav is unaffected. */
.mode-bar-hs .mode-btn.active{background:#082A4F;color:#fff;}
/* HS Practice picker (Team/Development/Roster) active state, navy to match the nav. Scoped to the HS toggle id so the club Gold/Garnet picker is unaffected. */
#ta-hs-toggle .filter-btn.active{background:#082A4F;color:#fff;}
.sub-tabs{display:flex;padding:6px 12px 6px;gap:6px;}
.sub-tabs .tab{flex:1;padding:9px 8px;font-size:13px;letter-spacing:1px;border-radius:8px;text-align:center;}
.tab.active{background:rgba(255,255,255,0.2);color:var(--white);}.tab:hover{color:var(--white);}
.content{padding:16px;max-width:840px;margin:0 auto;}
.tab-content{display:none;}.tab-content.active{display:block;}
.card{background:var(--white);border-radius:var(--radius);padding:18px;margin-bottom:14px;box-shadow:var(--shadow);border:1px solid rgba(0,0,0,0.04);animation:fadeIn 0.25s ease;}
.card-title{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:var(--red);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.card-title .bar{width:4px;height:18px;border-radius:2px;background:var(--red);display:inline-block;}
.card-title.blue{color:var(--blue);}.card-title.blue .bar{background:var(--blue);}
.card-title.gold{color:var(--gold);}.card-title.gold .bar{background:var(--gold);}
.dual-card{background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);border-left:4px solid var(--gold);position:relative;}
.dual-card.win{border-left-color:var(--green);}.dual-card.loss{border-left-color:var(--loss-red);}
.dual-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.dual-result-badge{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:1px;line-height:1;}
.dual-result-badge.win{color:var(--green);}.dual-result-badge.loss{color:var(--loss-red);}
.dual-court-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:13px;}
.dual-court-row:last-child{border-bottom:none;}
.dual-review-block{background:var(--off-white);border-radius:10px;padding:14px;margin-bottom:14px;}
.card-title.purple{color:var(--purple);}.card-title.purple .bar{background:var(--purple);}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.stat-grid.cols-3{grid-template-columns:repeat(3,1fr);}
.stat-box{text-align:center;padding:14px 8px;border-radius:8px;background:var(--off-white);border:1px solid var(--gray-lighter);}
.stat-number{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--red);line-height:1;}
.stat-number.green{color:var(--green);}.stat-number.blue{color:var(--blue);}.stat-number.purple{color:var(--purple);}
.stat-label{font-size:10px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.8px;margin-top:4px;}
.court-badge{display:inline-block;font-family:'Bebas Neue',sans-serif;font-size:11px;padding:2px 8px;border-radius:4px;letter-spacing:1px;}
.court-1{background:#fde2e8;color:var(--red-dark);}.court-2{background:#e0e7ff;color:#3730a3;}.court-3{background:#fef3c7;color:#92400e;}.court-4{background:#d1fae5;color:#065f46;}.court-5{background:#f3e8ff;color:#6b21a8;}.court-6{background:#fce7f3;color:#9d174d;}.court-7{background:#ecfdf5;color:#065f46;}.court-8{background:#fffbeb;color:#92400e;}
/* LIVE SCORING */
.live-court-card{background:var(--white);border-radius:var(--radius);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);border-left:4px solid var(--blue);}
.live-court-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.live-pair-name{font-weight:700;font-size:14px;color:var(--black);}
.live-opp-name{font-size:12px;color:var(--gray);margin-top:2px;}
.live-score-row{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:8px;}
.live-score-col{text-align:center;}
.live-score-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;color:var(--gray);margin-bottom:3px;}
.live-score-input{width:100%;padding:12px 4px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:28px;text-align:center;color:var(--black);background:var(--white);}
.live-score-input:focus{outline:none;border-color:var(--blue);}
.ls-counter{display:flex;flex-direction:column;align-items:center;gap:4px;}
.ls-num{font-family:'Bebas Neue',sans-serif;font-size:52px;line-height:1;min-width:70px;text-align:center;color:var(--black);}
.ls-inp{font-family:'Bebas Neue',sans-serif;font-size:52px;line-height:1;width:100%;min-width:70px;text-align:center;color:var(--black);background:transparent;border:none;border-bottom:2px dashed transparent;outline:none;padding:0;cursor:default;-moz-appearance:textfield;}
.ls-inp:focus{border-bottom-color:var(--blue);cursor:text;background:var(--blue-bg);border-radius:6px;}
.ls-inp::-webkit-inner-spin-button,.ls-inp::-webkit-outer-spin-button{-webkit-appearance:none;}
.ls-btn{width:100%;padding:10px 0;border-radius:10px;border:none;font-family:'Bebas Neue',sans-serif;font-size:28px;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation;transition:transform 0.08s,background 0.08s;}
.ls-btn:active{transform:scale(0.92);}
.ls-btn-plus{background:var(--blue);color:var(--white);}
.ls-btn-plus:active{background:#1d4ed8;}
.ls-btn-minus{background:var(--gray-lighter);color:var(--charcoal);}
.ls-btn-minus:active{background:#d1d5db;}
.live-set-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:12px;font-family:'Bebas Neue',sans-serif;font-size:13px;margin:2px;}
.live-set-chip.win{background:var(--green-bg);color:var(--green);}.live-set-chip.loss{background:#fee2e2;color:var(--loss-red);}
/* COACH NOTES */
.cnote-tabs{display:flex;gap:4px;margin-bottom:12px;}
.cnote-tab{flex:1;padding:8px 4px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;border:2px solid var(--gray-lighter);border-radius:6px;background:var(--white);color:var(--gray);cursor:pointer;transition:all 0.15s;}
.cnote-tab.active{border-color:var(--charcoal);background:var(--charcoal);color:var(--white);}
.cnote-section{display:none;}.cnote-section.active{display:block;}
.cnote-player-row{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);}
.cnote-player-row:last-child{border-bottom:none;}
.cnote-player-label{font-size:12px;font-weight:700;min-width:80px;padding-top:6px;color:var(--charcoal);}
.cnote-textarea{flex:1;padding:8px 10px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Barlow',sans-serif;font-size:13px;resize:vertical;min-height:52px;width:100%;}
.cnote-textarea:focus{outline:none;border-color:var(--charcoal);}
/* PLAYER PORTAL TABS */
.pp-tab-bar{display:flex;gap:4px;margin-bottom:14px;background:var(--gray-lighter);border-radius:10px;padding:3px;}
.pp-tab-btn{flex:1;padding:10px 8px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1.5px;border:none;background:transparent;color:var(--gray);cursor:pointer;border-radius:8px;transition:all 0.2s;}
.pp-tab-btn.active{background:var(--white);color:var(--red);box-shadow:0 2px 8px rgba(0,0,0,0.08);}
.pp-panel{display:none;}.pp-panel.active{display:block;}
/* PLAYER GAME DAY */
.pgd-assignment{background:linear-gradient(135deg,#1e40af 0%,#3730a3 100%);border-radius:var(--radius);padding:18px;margin-bottom:14px;color:var(--white);}
.pgd-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2px;opacity:0.75;margin-bottom:4px;}
.pgd-title{font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:6px;}
.pgd-court-badge{display:inline-block;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;border:1px solid rgba(255,255,255,0.3);}
.pgd-set-entry{background:var(--off-white);border-radius:10px;padding:16px;margin-bottom:12px;border:2px solid var(--gray-lighter);}
.pgd-score-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:14px;}
.pgd-score-block{text-align:center;}
.pgd-score-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1.5px;color:var(--gray);margin-bottom:8px;}
.pgd-score-ctrl{display:flex;align-items:center;justify-content:center;gap:6px;}
.pgd-score-num{font-family:'Bebas Neue',sans-serif;font-size:48px;min-width:64px;text-align:center;line-height:1;}
.pgd-score-btn{width:44px;height:44px;border-radius:10px;border:2px solid var(--gray-lighter);background:var(--white);font-size:24px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.1s;-webkit-user-select:none;user-select:none;touch-action:manipulation;}
.pgd-score-btn:active{transform:scale(0.88);background:var(--gray-lighter);}
.pgd-vs{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--gray-light);letter-spacing:2px;text-align:center;}
.pgd-set-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;font-family:'Bebas Neue',sans-serif;font-size:14px;margin:3px;}
.pgd-set-chip.win{background:var(--green-bg);color:var(--green);}.pgd-set-chip.loss{background:#fee2e2;color:var(--loss-red);}
.pgd-notes-area{width:100%;padding:12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;resize:vertical;min-height:80px;box-sizing:border-box;}
.pgd-notes-area:focus{outline:none;border-color:var(--blue);}
/* PLAYER OPTIONAL STATS */
.pgd-stats-toggle{width:100%;background:none;border:2px dashed var(--gray-lighter);border-radius:8px;padding:10px;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:var(--gray);cursor:pointer;margin-top:10px;transition:all 0.2s;}
.pgd-stats-toggle:hover,.pgd-stats-toggle.open{border-color:var(--blue);color:var(--blue);background:#dbeafe;}
.pgd-stats-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:10px;}
.pgd-stat-col{text-align:center;}
.pgd-stat-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;color:var(--gray);margin-bottom:4px;}
.pgd-stat-label .stat-desc{display:block;font-size:9px;color:var(--gray-light);font-family:'Barlow',sans-serif;letter-spacing:0;font-weight:600;}
.pgd-stat-ctrl{display:flex;flex-direction:column;align-items:center;gap:4px;}
.pgd-stat-num{font-family:'Bebas Neue',sans-serif;font-size:28px;line-height:1;min-width:36px;text-align:center;}
.pgd-stat-btn{width:36px;height:28px;border-radius:6px;border:1px solid var(--gray-lighter);background:var(--white);font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none;touch-action:manipulation;}
.pgd-stat-btn:active{transform:scale(0.88);background:var(--gray-lighter);}
/* SPECTATOR & EDIT */
.pgd-player-stats-block{background:var(--off-white);border-radius:8px;padding:10px;margin-top:8px;}
.pgd-player-stats-label{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;}
.pgd-court-section{background:var(--white);border-radius:var(--radius);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);border-left:4px solid var(--blue);}
.pgd-court-section.spectator{border-left-color:var(--purple);}
.pgd-set-edit-form{background:#f0f9ff;border:2px solid var(--blue);border-radius:8px;padding:12px;margin:6px 0;}
.pgd-edit-score-row{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:10px;}
.pgd-edit-input{width:100%;padding:8px 4px;border:2px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:22px;text-align:center;}
.pgd-edit-input:focus{outline:none;border-color:var(--blue);}
.pgd-enteredby{font-size:10px;color:var(--gray);font-style:italic;margin-top:3px;}
/* NOTIFICATION BANNER */
.notif-banner{margin:0 0 14px;padding:14px 16px;border-radius:10px;border:2px solid var(--blue);background:#dbeafe;animation:fadeIn 0.3s ease;}
.notif-banner.scrimmage{border-color:var(--purple);background:var(--purple-bg);}
.notif-banner-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1.5px;color:var(--blue);margin-bottom:4px;}
.notif-banner.scrimmage .notif-banner-label{color:var(--purple);}
.notif-banner-title{font-family:'Bebas Neue',sans-serif;font-size:18px;margin-bottom:4px;}
.notif-banner-detail{font-size:13px;font-weight:700;}
.class-badge{display:inline-block;font-size:10px;font-weight:800;padding:1px 6px;border-radius:3px;text-transform:uppercase;letter-spacing:0.5px;}
.class-SR{background:var(--black);color:var(--white);}.class-JR{background:var(--red);color:var(--white);}.class-SO{background:var(--gold);color:var(--black);}.class-FR{background:var(--gray-light);color:var(--charcoal);}
.tier-badge,.badge-exec,.badge-faculty{display:inline-block;font-family:'Bebas Neue',sans-serif;font-size:11px;padding:2px 8px;border-radius:4px;letter-spacing:1px;}
.tier-garnet{background:#782F40;color:#ffffff;}.tier-gold{background:#CEB888;color:#2d2d2d;}.tier-unassigned{background:var(--gray-light);color:var(--charcoal);}
.tier-roster{background:#082A4F;color:#fff;}.tier-development{background:#217F7F;color:#fff;}
.badge-exec{background:#5e2432;color:#ffffff;}.badge-faculty{background:#13243A;color:#ffffff;}
.tier-select{font-family:'Barlow',sans-serif;font-size:12px;padding:2px 6px;border:1px solid var(--gray-light);border-radius:5px;color:var(--charcoal);margin-left:4px;}
.player-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;}
.player-table thead th{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--gray);padding:8px 6px;text-align:left;border-bottom:2px solid var(--gray-lighter);cursor:pointer;white-space:nowrap;user-select:none;}
.player-table thead th:hover{color:var(--red);}.player-table thead th.sort-active{color:var(--red-dark);}
.player-table thead th .sort-arrow{font-size:10px;margin-left:2px;}
.player-table tbody td{padding:10px 6px;border-bottom:1px solid rgba(0,0,0,0.04);vertical-align:middle;}
.player-table tbody tr:hover{background:var(--off-white);}
.player-name{font-weight:700;color:var(--black);white-space:nowrap;}
.plus-minus{font-family:'Bebas Neue',sans-serif;font-size:16px;}
.pm-positive{color:var(--green);}.pm-negative{color:var(--loss-red);}.pm-zero{color:var(--gray);}
.wl-record{font-family:'Bebas Neue',sans-serif;font-size:15px;color:var(--black);}
.filter-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center;}
.filter-btn{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:0.8px;padding:6px 14px;border-radius:20px;border:2px solid var(--gray-light);background:var(--white);color:var(--gray);cursor:pointer;transition:all 0.15s;}
.filter-btn.active{border-color:var(--red);background:var(--red);color:var(--white);}.filter-btn:hover{border-color:var(--red);}
.filter-btn.blue.active{border-color:var(--blue);background:var(--blue);color:var(--white);}.filter-btn.blue:hover{border-color:var(--blue);}
.filter-btn.purple.active{border-color:var(--purple);background:var(--purple);color:var(--white);}.filter-btn.purple:hover{border-color:var(--purple);}
.form-group{margin-bottom:14px;}
.form-label{display:block;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;color:var(--charcoal);margin-bottom:5px;}
.form-input,.form-select{width:100%;padding:11px 14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;color:var(--black);background:var(--white);transition:border-color 0.2s;-webkit-appearance:none;}
.form-input:focus,.form-select:focus{outline:none;border-color:var(--red);}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.team-section{padding:14px;border-radius:8px;margin-bottom:10px;}
.team-section.team-a{background:#fef2f2;border:2px solid #fecaca;}
.team-section.team-b{background:#f0f4ff;border:2px solid #c7d2fe;}
.team-label{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1.5px;margin-bottom:10px;}
.team-a .team-label{color:var(--red);}.team-b .team-label{color:var(--blue);}
.vs-divider{text-align:center;font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--gray-light);margin:4px 0;letter-spacing:3px;}
.score-row{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:end;margin-top:8px;}
.score-col{text-align:center;}
.score-col-label{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1.5px;margin-bottom:4px;}
.score-col-label.label-a{color:var(--red);}.score-col-label.label-b{color:var(--blue);}
.score-input{width:100%;padding:14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:32px;text-align:center;color:var(--black);background:var(--white);transition:border-color 0.2s;}
.score-input:focus{outline:none;border-color:var(--red);}
.score-input-sm{padding:8px;font-size:22px;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:13px 28px;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;cursor:pointer;border:none;transition:all 0.2s;width:100%;}
.btn-primary{background:var(--red);color:var(--white);}.btn-primary:hover{background:var(--red-dark);}
.btn-blue{background:var(--blue);color:var(--white);}.btn-blue:hover{background:#3730a3;}
.btn-purple{background:var(--purple);color:var(--white);}.btn-purple:hover{background:#6d28d9;}
.btn-secondary{background:var(--off-white);color:var(--charcoal);border:2px solid var(--gray-lighter);}.btn-secondary:hover{background:var(--gray-lighter);}
.btn-danger{background:var(--red-bg);color:var(--loss-red);font-size:13px;padding:8px 14px;}.btn-danger:hover{background:#fcd5d5;}
.btn-success{background:var(--green);color:var(--white);}.btn-success:hover{background:#15803d;}
.btn-small{padding:6px 12px;font-size:12px;width:auto;}
.match-card{background:var(--white);border-radius:var(--radius);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);border:1px solid rgba(0,0,0,0.05);position:relative;}
.match-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.match-body{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;}
.match-team{font-size:13px;font-weight:700;line-height:1.4;}
.match-team.winner{color:var(--green);}.match-team.loser{color:var(--gray);}
.match-team.left{text-align:left;}.match-team.right{text-align:right;}
.match-score{font-family:'Bebas Neue',sans-serif;font-size:24px;text-align:center;white-space:nowrap;color:var(--black);letter-spacing:1px;}
.match-date{font-size:12px;color:var(--gray);font-weight:600;}
.match-actions{position:absolute;top:8px;right:8px;display:flex;gap:2px;}
.match-action-btn{background:none;border:none;color:var(--gray-light);cursor:pointer;font-size:14px;padding:4px 6px;line-height:1;border-radius:4px;}
.match-action-btn:hover{color:var(--red);background:var(--red-bg);}
.match-action-btn.edit-btn:hover{color:var(--blue);background:var(--blue-bg);}
.modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:500;align-items:center;justify-content:center;padding:16px;}
.modal-overlay.active{display:flex;}
.modal{background:var(--white);border-radius:14px;padding:24px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg);animation:modalIn 0.2s ease;}
@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);}}
.modal-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--red);margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;}
.modal-close{background:none;border:none;font-size:22px;color:var(--gray);cursor:pointer;padding:4px 8px;border-radius:4px;}.modal-close:hover{color:var(--red);background:var(--red-bg);}
.modal-footer{display:flex;gap:10px;margin-top:18px;}.modal-footer .btn{flex:1;}
.planned-card{background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:10px;box-shadow:var(--shadow);border-left:4px solid var(--gray-light);position:relative;}
.planned-card.completed{border-left-color:var(--green);opacity:0.7;}.planned-card.pending{border-left-color:var(--red);}
.planned-matchup{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin:10px 0;}
.planned-team{font-weight:700;font-size:14px;line-height:1.5;}.planned-team.left{text-align:left;}.planned-team.right{text-align:right;}
.planned-vs{font-family:'Bebas Neue',sans-serif;color:var(--gray-light);font-size:16px;letter-spacing:2px;}
.planned-score-entry{display:grid;grid-template-columns:1fr auto 1fr auto;gap:8px;align-items:end;margin-top:10px;}
.planned-score-col{text-align:center;}
.planned-score-col-label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;margin-bottom:3px;}
.planned-score-input{padding:10px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:24px;text-align:center;width:100%;background:var(--off-white);color:var(--black);}
.planned-score-input:focus{outline:none;border-color:var(--red);background:var(--white);}
.planned-save-btn{padding:10px 16px;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;cursor:pointer;border:none;background:var(--green);color:var(--white);white-space:nowrap;align-self:end;}
.planned-save-btn:hover{background:#15803d;}
.planned-result{font-family:'Bebas Neue',sans-serif;font-size:22px;text-align:center;color:var(--black);letter-spacing:1px;margin-top:10px;}
.date-filter{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;}
.date-filter input[type="date"]{padding:8px 12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;color:var(--black);}
.date-filter input:focus{outline:none;border-color:var(--red);}
.demo-banner{position:fixed;top:0;left:0;right:0;z-index:99999;background:#f59e0b;color:#1a1a1a;text-align:center;padding:8px 12px;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;box-shadow:0 2px 8px rgba(0,0,0,0.15);pointer-events:none;}
.demo-creds strong{font-family:'Courier New',monospace;font-size:14px;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:4px;margin:0 4px;}
.demo-creds .sep{margin:0 12px;color:var(--gray);}
.demo-creds-inline{background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:10px 14px;margin:0 0 16px;font-size:13px;color:var(--charcoal);text-align:center;letter-spacing:0.3px;line-height:1.6;}
body.demo{padding-top:32px;}
.demo-guide-btn{position:fixed;bottom:20px;right:20px;z-index:99996;background:var(--red);color:var(--white);padding:12px 20px;border-radius:50px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1.5px;box-shadow:0 4px 16px rgba(0,0,0,0.2);cursor:pointer;border:none;display:flex;align-items:center;gap:8px;transition:transform 0.2s,box-shadow 0.2s;}
.demo-guide-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.25);}
.demo-guide-btn .icon{font-size:18px;}
.demo-guide-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99997;display:none;align-items:flex-end;justify-content:center;padding:20px;}
.demo-guide-overlay.show{display:flex;animation:fadeIn 0.2s ease;}
.demo-guide-modal{background:var(--white);border-radius:16px 16px 0 0;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;padding:0;animation:slideUp 0.3s ease;}
@media(min-width:640px){.demo-guide-overlay{align-items:center;}.demo-guide-modal{border-radius:16px;}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.demo-guide-header{position:sticky;top:0;background:var(--white);padding:20px 24px 12px;border-bottom:1px solid var(--gray-light);display:flex;justify-content:space-between;align-items:center;}
.demo-guide-header h2{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:2px;color:var(--red-dark);margin:0;}
.demo-guide-close{background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray);padding:4px 8px;line-height:1;}
.demo-guide-close:hover{color:var(--charcoal);}
.demo-guide-intro{padding:8px 24px 16px;color:var(--gray-dark);font-size:14px;line-height:1.5;}
.demo-guide-list{padding:0 24px 24px;list-style:none;margin:0;}
.demo-guide-list li{padding:14px 0;border-bottom:1px solid var(--gray-lighter);display:flex;gap:12px;align-items:flex-start;}
.demo-guide-list li:last-child{border-bottom:none;}
.demo-guide-num{flex-shrink:0;width:28px;height:28px;background:var(--red);color:var(--white);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:14px;}
.demo-guide-content{flex:1;}
.demo-guide-content h3{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;margin:0 0 4px;color:var(--charcoal);}
.demo-guide-content p{font-size:14px;line-height:1.5;color:var(--gray-dark);margin:0;}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--charcoal);color:var(--white);padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;box-shadow:var(--shadow-lg);z-index:1000;transition:transform 0.3s ease;white-space:nowrap;}.toast.show{transform:translateX(-50%) translateY(0);}
.empty-state{text-align:center;padding:40px 20px;color:var(--gray);}.empty-state .emoji{font-size:40px;margin-bottom:12px;}.empty-state p{font-size:14px;line-height:1.6;}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -18px;padding:0 18px;}
.roster-item{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);flex-wrap:wrap;}.roster-item:last-child{border-bottom:none;}
.roster-name{font-weight:700;flex:1;min-width:120px;}
.cs-rank{font-family:'Bebas Neue',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;color:var(--gray);margin-left:6px;}
.court-select{padding:4px 8px;border:1px solid var(--gray-light);border-radius:4px;font-size:12px;font-family:'Barlow',sans-serif;}
.data-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;}
.plan-add-row{background:var(--off-white);border:2px dashed var(--gray-lighter);border-radius:var(--radius);padding:16px;margin-bottom:14px;}
.ext-match-card{background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);border:1px solid rgba(0,0,0,0.05);position:relative;}
.ext-match-card .ext-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.ext-match-card .ext-matchup{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;}
.ext-match-card .ext-pair{font-weight:700;font-size:14px;}
.ext-match-card .ext-vs{font-family:'Bebas Neue',sans-serif;color:var(--gray-light);font-size:14px;letter-spacing:2px;}
.ext-match-card .ext-opp{font-weight:700;font-size:14px;color:var(--gray);}
.set-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:13px;}
.set-row:last-child{border-bottom:none;}
.set-label{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--gray);min-width:36px;}
.set-score{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;}
.set-score.win{color:var(--green);}.set-score.loss{color:var(--loss-red);}
.set-stats-mini{font-size:11px;color:var(--gray);margin-left:auto;}
.set-add-form{background:var(--off-white);border:2px dashed var(--gray-lighter);border-radius:8px;padding:12px;margin-top:10px;}
.set-add-form .form-label{font-size:12px;}
.set-add-form .form-input,.set-add-form .form-select{padding:8px 10px;font-size:13px;}
.stat-input-row{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:8px;}
.stat-input-row label{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:0.5px;color:var(--gray);text-align:center;display:block;}
.stat-input-row input{width:100%;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-family:'Bebas Neue',sans-serif;font-size:16px;text-align:center;}
.stat-input-row input:focus{outline:none;border-color:var(--red);}
.toggle-stats-btn{font-size:12px;color:var(--blue);background:none;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-weight:600;padding:4px 0;text-decoration:underline;}
.ext-summary{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-lighter);}
.ext-summary-item{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:0.5px;}
.section-divider{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1.5px;color:var(--gray);margin:14px 0 8px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
/* Phone: coach portal + live scoring tweaks */
@media(max-width:480px){
  .header{padding:10px 14px 8px;}
  .header h1{font-size:20px;letter-spacing:2px;}
  .tab{font-size:10px;padding:7px 2px;letter-spacing:0.5px;}
  .content{padding:10px;}
  .card{padding:12px;}
  .stat-grid{gap:6px;grid-template-columns:repeat(2,1fr);}
  .stat-number{font-size:22px;}
  .stat-label{font-size:9px;}
  .player-table{font-size:12px;}
  .player-table thead th{font-size:10px;padding:6px 4px;}
  .player-table tbody td{padding:8px 4px;}
  .match-score{font-size:20px;}
  .match-team{font-size:12px;}
  .planned-team{font-size:12px;}
  .modal{padding:16px;}
  .score-input{font-size:26px;padding:12px;}
  /* Live Score Entry: bigger tap targets */
  .ls-num{font-size:64px;}
  .ls-inp{font-size:64px;}
  .ls-btn{padding:16px 0;font-size:34px;border-radius:14px;}
  .live-court-card{padding:16px;}
  .live-score-row{gap:12px;}
}
/* LOGIN SCREEN */
.login-overlay{position:fixed;top:0;left:0;width:100%;height:100%;min-height:100dvh;background:linear-gradient(135deg,var(--red-deeper) 0%,var(--red) 50%,var(--red-dark) 100%);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;}
body.demo .login-overlay{align-items:flex-start;padding-top:60px;padding-bottom:40px;overflow-y:auto;}
body.demo .login-box{padding:20px 28px;}
body.demo .login-logo > span[style*="font-size"]{margin-bottom:4px;}
body.demo .login-sub{margin-bottom:12px;}
body.demo .login-toggle{margin-bottom:12px;}
body.demo .login-fans{margin-top:8px !important;padding-top:8px !important;}
body.demo .login-fans > button{padding:6px 18px !important;}
body.demo .login-fans > div{margin-top:3px !important;}
body.demo .login-numpad-btn{padding:10px;}
body.demo .login-pin-dots{margin:10px 0;}
body.demo .login-error{margin-top:4px;min-height:14px;}
.login-overlay.hidden{display:none;}
.login-box{background:var(--white);border-radius:16px;padding:36px 28px;width:100%;max-width:380px;box-shadow:var(--shadow-lg);text-align:center;}
.login-logo{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:4px;color:var(--red);margin-bottom:4px;display:flex;flex-direction:column;align-items:center;gap:6px;}
.login-logo > span[style*="font-size"]{margin-bottom:20px;}
.login-logo .crown{font-size:30px;}
.login-sub{font-size:13px;color:var(--gray);margin-bottom:24px;letter-spacing:0.5px;}
.login-toggle{display:flex;gap:2px;background:var(--gray-lighter);border-radius:8px;padding:2px;margin-bottom:20px;}
.login-toggle-btn{flex:1;padding:10px;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1.5px;border:none;background:transparent;color:var(--gray);cursor:pointer;border-radius:6px;transition:all 0.2s;}
.login-toggle-btn.active{background:var(--red);color:var(--white);}
.login-section{display:none;}.login-section.active{display:block;}
.login-pin-dots{display:flex;justify-content:center;gap:12px;margin:20px 0;}
.login-pin-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--gray-light);background:transparent;transition:all 0.15s;}
.login-pin-dot.filled{background:var(--red);border-color:var(--red);}
.login-numpad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:240px;margin:0 auto;}
.login-numpad-btn{padding:14px;font-family:'Bebas Neue',sans-serif;font-size:22px;border:2px solid var(--gray-lighter);border-radius:10px;background:var(--white);color:var(--black);cursor:pointer;transition:all 0.15s;}
.login-numpad-btn:hover{border-color:var(--red);background:var(--red-bg);}
.login-numpad-btn:active{background:var(--red);color:var(--white);}
.login-numpad-btn.empty{visibility:hidden;border:none;}
.login-numpad-btn.backspace{font-size:16px;}
.login-error{color:var(--loss-red);font-size:13px;font-weight:700;margin-top:10px;min-height:20px;}
.login-player-select{margin:16px 0;}
.login-player-select select{width:100%;padding:12px 14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:15px;color:var(--black);background:var(--white);}
.login-player-select select:focus{outline:none;border-color:var(--red);}
.login-btn{width:100%;padding:14px;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;cursor:pointer;border:none;background:var(--red);color:var(--white);transition:all 0.2s;margin-top:12px;}
.login-btn:hover{background:var(--red-dark);}
.login-btn:disabled{background:var(--gray-light);cursor:not-allowed;}
/* HEADER USER INFO */
.header-user{display:flex;align-items:center;gap:10px;}
.header-username{font-family:'Bebas Neue',sans-serif;font-size:14px;color:rgba(255,255,255,0.9);letter-spacing:1px;}
.logout-btn{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;padding:4px 12px;border-radius:4px;border:1px solid rgba(255,255,255,0.4);background:transparent;color:rgba(255,255,255,0.8);cursor:pointer;transition:all 0.15s;}
.logout-btn:hover{background:rgba(255,255,255,0.15);color:var(--white);}
/* PLAYER PORTAL */
.player-portal{display:none;padding:16px;max-width:840px;margin:0 auto;}
.player-portal.active{display:block;}
.player-portal .pp-name{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:var(--red);margin-bottom:2px;}
.player-portal .pp-meta{font-size:13px;color:var(--gray);margin-bottom:16px;}
.rank-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.04);}
.rank-row:last-child{border-bottom:none;}
.rank-label{font-size:12px;font-weight:600;color:var(--charcoal);min-width:90px;}
.rank-bar-wrap{flex:1;position:relative;height:24px;background:var(--gray-lighter);border-radius:12px;overflow:hidden;}
.rank-bar-fill{height:100%;border-radius:12px;transition:width 0.4s ease;min-width:4px;}
.rank-bar-fill.top3{background:var(--green);}.rank-bar-fill.mid{background:var(--gold);}.rank-bar-fill.low{background:var(--gray-light);}
.rank-position{font-family:'Bebas Neue',sans-serif;font-size:16px;min-width:60px;text-align:right;}
.rank-position .ordinal{font-size:11px;font-weight:400;color:var(--gray);}
.rank-value{font-size:12px;color:var(--gray);min-width:50px;text-align:right;}
/* GOALS */
.goal-card{background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);border-left:4px solid var(--gold);position:relative;}
.goal-card.approved{border-left-color:var(--green);}
.goal-card.draft{border-left-color:var(--gray-light);}
.goal-card .goal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.goal-card .goal-label{font-weight:700;font-size:14px;}
.goal-card .goal-status{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;padding:2px 8px;border-radius:4px;}
.goal-status.pending{background:var(--gray-lighter);color:var(--gray);}
.goal-status.ai-ready{background:#fef3c7;color:#92400e;}
.goal-status.approved{background:var(--green-bg);color:var(--green);}
.goal-feedback{background:var(--off-white);border-radius:8px;padding:14px;margin-top:10px;font-size:13px;line-height:1.7;white-space:pre-wrap;}
.goal-feedback .coach-stamp{font-size:11px;color:var(--gray);margin-top:8px;font-style:italic;}
.goal-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}
.ai-loading{text-align:center;padding:20px;color:var(--gray);}
.ai-loading .spinner{display:inline-block;width:20px;height:20px;border:3px solid var(--gray-lighter);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
/* Phone: login screen */
@media(max-width:480px){
  .login-box{padding:24px 16px;max-width:100%;border-radius:12px;}
  .login-logo{font-size:32px;}
  .login-numpad{max-width:100%;gap:10px;}
  .login-numpad-btn{padding:18px;font-size:26px;border-radius:12px;}
  .login-pin-dot{width:20px;height:20px;}
  .login-pin-dots{gap:18px;margin:24px 0;}
  .login-toggle-btn{padding:12px 6px;font-size:14px;}
  .login-btn{padding:16px;font-size:20px;}
  .header-username{font-size:12px;}
  /* Player portal: sticky bottom tab bar */
  .pp-tab-bar{position:sticky;bottom:0;z-index:50;border-radius:0;
    padding:4px;background:var(--white);
    box-shadow:0 -2px 14px rgba(0,0,0,0.12);margin-bottom:0;}
  .pp-tab-btn{padding:12px 4px;font-size:12px;letter-spacing:1px;}
  .player-portal{padding:10px 10px 80px;}
}
@media(max-width:360px){
  .header h1{font-size:17px;}
  .tab{font-size:9px;}
  .login-numpad-btn{padding:16px;font-size:22px;}
}
`;
  var lines=staticCSS.split('\n');
  // Insert root at line 1, header at line 5
  lines.splice(1,0,rootLine);
  lines.splice(5,0,headerLine);
  var styleEl=document.createElement('style');
  styleEl.textContent=lines.join('\n');
  document.head.appendChild(styleEl);

  // ── Set title ──────────────────────────────────────────────
  document.title=SC.title||SC.schoolName;

  // ── Inject HTML body ───────────────────────────────────────
  var venue=SC.homeVenue||'Home';
  document.body.innerHTML=`
  <meta name="build-version" content="20260314030338">
</head>
<body>
${SC.demoMode ? '<div class="demo-banner">DEMO DATA — '+SC.schoolName+' — Nothing saves — Refresh to reset</div>' : ''}
<!-- LOGIN SCREEN -->
<div class="login-overlay" id="login-overlay">
  <div class="login-box">
    <div class="login-logo" style="flex-direction:column;align-items:center;gap:6px;"><img id="cs-logo-login" src="${LOGO_SRC}" style="height:${LOGO_H}px;width:auto;" alt="${SC.logoAlt}" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=&quot;font-size:64px;line-height:1.2;&quot;>${SC.teamEmoji}</span>')">${!LOGO_SRC && SC.logo !== 'firebase' ? `<span style="font-size:${LOGO_H}px;">${SC.teamEmoji}</span>` : ''}<span>${SC.displayName}</span></div>
    <div class="login-sub">2026 Beach Volleyball Season</div>
    ${SC.demoMode ? '<div class="demo-creds-inline">'+COACH_LABEL+' PIN: <strong>1234</strong><span class="sep">·</span>Player password: <strong>'+SC.defaultPw+'</strong></div>' : ''}
    <div class="login-toggle">
      <button class="login-toggle-btn active" onclick="switchLogin('coach')">${COACH_LABEL.toUpperCase()}</button>
      <button class="login-toggle-btn" onclick="switchLogin('player')">Player</button>
    </div>
    <div class="login-section active" id="login-coach">
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--charcoal);margin-bottom:8px;">Enter ${COACH_LABEL} PIN</div>
      <div class="login-pin-dots" id="pin-dots">
        <div class="login-pin-dot"></div><div class="login-pin-dot"></div>
        <div class="login-pin-dot"></div><div class="login-pin-dot"></div>
      </div>
      <div class="login-numpad" id="numpad">
        <button class="login-numpad-btn" onclick="pinPress('1')">1</button>
        <button class="login-numpad-btn" onclick="pinPress('2')">2</button>
        <button class="login-numpad-btn" onclick="pinPress('3')">3</button>
        <button class="login-numpad-btn" onclick="pinPress('4')">4</button>
        <button class="login-numpad-btn" onclick="pinPress('5')">5</button>
        <button class="login-numpad-btn" onclick="pinPress('6')">6</button>
        <button class="login-numpad-btn" onclick="pinPress('7')">7</button>
        <button class="login-numpad-btn" onclick="pinPress('8')">8</button>
        <button class="login-numpad-btn" onclick="pinPress('9')">9</button>
        <button class="login-numpad-btn empty"></button>
        <button class="login-numpad-btn" onclick="pinPress('0')">0</button>
        <button class="login-numpad-btn backspace" onclick="pinBack()">⌫</button>
      </div>
      <div class="login-error" id="pin-error"></div>
    </div>
    <div class="login-section" id="login-player">
      ${SC.emailLogin?`
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--charcoal);margin-bottom:8px;">Log In With Your Email</div>
      <input type="email" style="width:100%;padding:12px 14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:15px;" id="login-email" placeholder="you@fsu.edu" autocomplete="email" autocapitalize="none" spellcheck="false">
      <input type="password" style="width:100%;padding:12px 14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:15px;margin-top:8px;" id="login-pw" placeholder="Password" autocomplete="current-password">
      <div class="login-error" id="pw-error"></div>
      <button class="login-btn" id="player-login-btn" onclick="playerLoginEmail()">View My Stats</button>
      `:`
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--charcoal);margin-bottom:8px;">Select Your Name</div>
      <div class="login-player-select"><select id="login-player-select"><option value="">— Choose Player —</option></select></div>
      <input type="password" style="width:100%;padding:12px 14px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:15px;margin-top:8px;" id="login-pw" placeholder="Enter Password">
      <div class="login-error" id="pw-error"></div>
      <button class="login-btn" id="player-login-btn" onclick="playerLogin()">View My Stats</button>
      `}
    </div>
    <div class="login-fans" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-lighter);text-align:center;">
      <button onclick="showLeonFans()" style="display:inline-flex;align-items:center;gap:6px;font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--white);border:none;cursor:pointer;padding:9px 20px;border-radius:8px;background:var(--red);transition:background 0.2s;" onmouseover="this.style.background='var(--red-dark)';" onmouseout="this.style.background='var(--red)';">
        🏐 ${SC.displayName} Fan Page
      </button>
      <div style="font-size:11px;color:var(--red);font-weight:700;margin-top:6px;">Parents · Fans · Press — No login required</div>
    </div>
  </div>
</div>

<!-- MAIN APP -->
<div id="app-wrapper" style="display:none;">
<div class="header">
  <div class="header-top">
    <h1><span class="crown"><img id="cs-logo-header" src="${LOGO_SRC}" style="height:28px;width:auto;vertical-align:middle;" alt="${SC.abbrev}" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=&quot;font-size:28px;line-height:1.2;vertical-align:middle;&quot;>${SC.teamEmoji}</span>')">${!LOGO_SRC && SC.logo !== 'firebase' ? `<span style="font-size:28px;">${SC.teamEmoji}</span>` : ''}</span> ${SC.displayName} <span class="sync-dot" id="sync-dot"></span></h1>
    <div class="header-user">
      <span class="header-username" id="header-username"></span>
      <button class="logout-btn" onclick="logout()">Logout</button>
    </div>
  </div>
  <div class="tabs" id="tabs">
    <div class="mode-bar${SC.tiersEnabled?'':' mode-bar-hs'}" id="mode-bar">
      ${SC.tiersEnabled?`
      <button class="mode-btn active" id="mode-manage" onclick="switchMode('manage')">⚙️ Manage</button>
      <button class="mode-btn" id="mode-gameday" onclick="switchMode('gameday')">🏐 Logistics</button>
      `:`
      <button class="mode-btn" onclick="hsNav('players',this)">Players</button>
      <button class="mode-btn" onclick="hsNav('practice',this)">Practice</button>
      <button class="mode-btn active" onclick="hsNav('duals',this)">Duals</button>
      <button class="mode-btn" onclick="hsNav('manage',this)">Manage</button>
      `}
    </div>
    <div class="sub-tabs" id="sub-tabs-gameday"${SC.tiersEnabled?' style="display:none;"':''}>
      ${SC.tiersEnabled?`
      <button class="tab active" data-tab="recruiting">Recruiting</button>
      <button class="tab" data-tab="accounting">Accounting</button>
      <button class="tab" data-tab="travel">Travel</button>
      `:`
      <button class="tab active" data-tab="dashboard">Dashboard</button>
      <button class="tab" data-tab="gameday">Planner</button>
      <button class="tab" data-tab="dualhistory">Dual History</button>
      <button class="tab" data-tab="duals">Live Scoring</button>
      `}
    </div>
    <div class="sub-tabs" id="sub-tabs-manage"${SC.tiersEnabled?'':' style="display:none;"'}>
      ${SC.tiersEnabled?`
      ${SC.chatEnabled?'<button class="tab active" data-tab="broadcast">Broadcast</button>':''}
      <button class="tab" data-tab="inbox">Inbox</button>
      <button class="tab${SC.chatEnabled?'':' active'}" data-tab="settings">Roster</button>
      <button class="tab" data-tab="teamanalysis">Practice</button>
      <button class="tab" data-tab="players">Kings/Queens</button>
      <button class="tab" data-tab="goals">Goals</button>
      <button class="tab" data-tab="practicegroups" style="display:none;">Practice Groups</button>
      <button class="tab" data-tab="dashboard" style="display:none;">Dashboard</button>
      <button class="tab" data-tab="scouts" style="display:none;">Scouts</button>
      `:`
      <button class="tab" data-tab="recruiting">Recruiting</button>
      <button class="tab" data-tab="players">Stats</button>
      <button class="tab" data-tab="settings">Practice Groups</button>
      <button class="tab" data-tab="goals">Goals</button>
      `}
    </div>
    ${SC.tiersEnabled?'':`<div class="sub-tabs" id="sub-tabs-hsmanage" style="display:none;">
      <button class="tab" data-tab="communicate">Communicate</button>
      <button class="tab" data-tab="hsimport">Import/Export</button>
      <button class="tab" data-tab="logistics">Logistics</button>
    </div>`}
  </div>
</div>
<div class="content" id="coach-content">

  <!-- ====== DASHBOARD ====== -->
    <div class="tab-content" id="tab-dashboard">
<div class="card"><div class="card-title"><span class="bar"></span> Season Overview</div>
      <div class="stat-grid cols-3">
        <div class="stat-box"><div class="stat-number" style="color:var(--red);" id="dash-dual-rec">0-0</div><div class="stat-label">Dual W-L</div></div>
        <div class="stat-box"><div class="stat-number" style="color:var(--red);" id="dash-courts-rec">0-0</div><div class="stat-label">Match W-L</div></div>
        <div class="stat-box"><div class="stat-number" style="color:var(--red);" id="dash-sets-rec">0-0</div><div class="stat-label">Sets W-L</div></div>
      </div>
    </div>
<div class="card"><div class="card-title"><span class="bar"></span> Season Schedule</div>
      <div id="dash-schedule"></div>
      <div id="dash-schedule-add" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-lighter);">
        <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">Add Game</div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Date</label><input type="date" class="form-input" id="sched-date" style="padding:8px;font-size:13px;"></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opponent</label><input type="text" class="form-input" id="sched-opp" placeholder="e.g. Chiles" style="padding:8px;font-size:13px;"></div>
        </div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Location</label>
            <select class="form-select" id="sched-loc" style="padding:8px;font-size:13px;"><option value="home">Home</option><option value="away">Away</option><option value="neutral">Neutral</option></select></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Time</label><input type="text" class="form-input" id="sched-time" placeholder="3:00pm" style="padding:8px;font-size:13px;"></div>
        </div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">SW Score</label><input type="number" class="form-input" id="sched-us" placeholder="—" min="0" max="5" style="padding:8px;font-size:13px;"></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opp Score</label><input type="number" class="form-input" id="sched-them" placeholder="—" min="0" max="5" style="padding:8px;font-size:13px;"></div>
        </div>
        <button class="btn btn-primary btn-small" onclick="addScheduleGame()">Add Game</button>
      </div>
    </div>
<div class="card"><div class="card-title"><span class="bar"></span> Area Standings<span id="maxpreps-status" style="font-size:10px;font-weight:400;font-family:'Barlow',sans-serif;color:var(--gray);margin-left:8px;letter-spacing:0;"></span></div>
      <div id="dash-standings"></div>
      <div id="dash-standings-add" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-lighter);">
        <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">Update Team Record</div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Team</label>
            <select class="form-select" id="stand-team" style="padding:8px;font-size:13px;"></select></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Wins</label><input type="number" class="form-input" id="stand-w" min="0" style="padding:8px;font-size:13px;" value="0"></div>
        </div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Losses</label><input type="number" class="form-input" id="stand-l" min="0" style="padding:8px;font-size:13px;" value="0"></div>
          <div class="form-group" style="margin-bottom:0;"><button class="btn btn-primary btn-small" style="margin-top:22px;" onclick="updateStanding()">Update</button></div>
        </div>
      </div>
    </div>


  </div>

<!-- ====== PLAYERS ====== -->
  <div class="tab-content" id="tab-players">
    ${SC.tiersEnabled?`<div class="filter-row" id="players-tier-toggle" style="display:flex;gap:8px;"></div>
    <div class="filter-row" id="players-gender-toggle" style="display:none;gap:8px;margin-top:6px;"></div>`:`<div class="filter-row" id="type-filter-players">
      <button class="filter-btn" data-ptype="all">All</button>
      <button class="filter-btn blue active" data-ptype="gameday">Dual</button>
      <button class="filter-btn" data-ptype="exhibition" style="background:var(--white);color:#0e7a4d;border-color:#0e7a4d;">Exhibition</button>
      <button class="filter-btn purple" data-ptype="scrimmage">Scrimmage</button>
      <button class="filter-btn" data-ptype="queens">Queens</button>
    </div>`}
    
    <div class="card" style="padding:8px 12px;"><div class="table-wrap">
      <table class="player-table" id="players-table"><thead><tr id="players-thead"></tr></thead><tbody></tbody></table>
    </div></div>
  </div>

  <!-- ====== QUEENS (SW vs SW) ====== -->
  <div class="tab-content" id="tab-queens">
    <div class="card"><div class="card-title"><span class="bar"></span> Record Queens Match</div>
      <div class="form-row" style="margin-bottom:14px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Date</label><input type="date" class="form-input" id="q-date"></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Court</label>
          <select class="form-select" id="q-court"><option value="1">Court 1</option><option value="2">Court 2</option><option value="3">Court 3</option><option value="4">Court 4</option><option value="5">Court 5</option><option value="6">Court 6 — Exhib</option><option value="7">Court 7 — Exhib</option><option value="8">Court 8 — Exhib</option></select></div></div>
      <div id="q-split-pairs" style="display:none;"></div>
      <div class="team-section team-a"><div class="team-label">Team A</div>
        <div class="form-row"><select class="form-select" id="q-a1"><option value="">Player 1</option></select><select class="form-select" id="q-a2"><option value="">Player 2</option></select></div></div>
      <div class="vs-divider">VS</div>
      <div class="team-section team-b"><div class="team-label">Team B</div>
        <div class="form-row"><select class="form-select" id="q-b1"><option value="">Player 1</option></select><select class="form-select" id="q-b2"><option value="">Player 2</option></select></div></div>
      <div id="q-split-toggle" style="display:none;margin-top:10px;">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--purple);cursor:pointer;">
          <input type="checkbox" id="q-is-split" style="width:16px;height:16px;accent-color:var(--purple);" onchange="toggleSplitQ()">
          🔀 Split Match — different pairs for Set 2
        </label>
      </div>
      <div id="q-split-extra" style="display:none;margin-top:10px;padding:10px;background:#f5f3ff;border-radius:8px;border:1px solid #c4b5fd;">
        <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;color:var(--purple);margin-bottom:8px;">SET 2 — DIFFERENT PAIRS</div>
        <div class="team-section team-a" style="margin-bottom:6px;"><div class="team-label">Set 2 — Team A</div>
          <div class="form-row"><select class="form-select" id="q-s2a1"><option value="">Player 1</option></select><select class="form-select" id="q-s2a2"><option value="">Player 2</option></select></div></div>
        <div class="vs-divider" style="margin:4px 0;">VS</div>
        <div class="team-section team-b"><div class="team-label">Set 2 — Team B</div>
          <div class="form-row"><select class="form-select" id="q-s2b1"><option value="">Player 1</option></select><select class="form-select" id="q-s2b2"><option value="">Player 2</option></select></div></div>
      </div>
      <div class="score-row">
        <div class="score-col"><div class="score-col-label label-a">Team A</div><input type="number" class="score-input" id="q-sa" placeholder="0" min="0" max="99"></div>
        <span class="score-dash">—</span>
        <div class="score-col"><div class="score-col-label label-b">Team B</div><input type="number" class="score-input" id="q-sb" placeholder="0" min="0" max="99"></div></div>
      <div style="margin-top:16px;"><button class="btn btn-primary" id="save-queens">Save Match</button></div>
    </div>
    <div class="card" style="border:2px solid var(--gold);">
      <div class="card-title gold"><span class="bar" style="background:var(--gold);"></span> 📷 Upload Queens Scoresheet</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Photograph a handwritten Queens scoresheet. AI reads all court matchups and set scores then creates the match entries.</p>
      <div class="form-group"><label class="form-label" style="font-size:11px;">Match Date</label>
        <input type="date" class="form-input" id="qs-scan-date" style="padding:8px;font-size:13px;"></div>
      <input type="file" id="qs-scan-file" accept="image/*" style="display:none;">
      <button class="btn btn-small" style="width:100%;background:var(--gold);color:var(--black);border:none;font-size:15px;padding:12px;" onclick="document.getElementById('qs-scan-file').click();">&#128248; Take Photo or Upload Scoresheet</button>
      <div id="qs-scan-preview" style="margin-top:10px;"></div>
      <div id="qs-scan-result" style="margin-top:10px;"></div>
    </div>
    <div class="card"><div class="card-title"><span class="bar"></span> Queens Match Log</div>
      <div class="filter-row" id="court-filter-queens">
        <button class="filter-btn active" data-qcourt="all">All</button>
        <button class="filter-btn" data-qcourt="1">Pair 1</button><button class="filter-btn" data-qcourt="2">Pair 2</button>
        <button class="filter-btn" data-qcourt="3">Pair 3</button><button class="filter-btn" data-qcourt="4">Pair 4</button>
        <button class="filter-btn" data-qcourt="5">Pair 5</button><button class="filter-btn" data-qcourt="6">Pair 6</button>
        <button class="filter-btn" data-qcourt="7">Pair 7</button><button class="filter-btn" data-qcourt="8">Pair 8</button>
      </div>
      <div id="queens-log"></div>
    </div>
  </div>

  <!-- ====== GAME DAY (SW vs External — Season) ====== -->
    <div class="tab-content" id="tab-gameday">
<div class="card"><div class="card-title blue"><span class="bar"></span> 📋 Planner</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:10px;">Set lineups for duals and practice. Players see their assignment in their portal.</p>
      <div style="background:var(--off-white);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">Create Assignment</div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Date</label><input type="date" class="form-input" id="assign-date" style="padding:8px;font-size:13px;"></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Type</label>
            <select class="form-select" id="assign-type" style="padding:8px;font-size:13px;">
              <option value="gameday">Dual</option><option value="scrimmage">Scrimmage</option><option value="queens">Queens</option>
            </select></div>
        </div>
        <div class="form-row" style="margin-bottom:8px;">
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opponent (Game Day)</label><input type="text" class="form-input" id="assign-opp" placeholder="e.g. Chiles" style="padding:8px;font-size:13px;"></div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Courts</label>
            <select class="form-select" id="assign-courts" style="padding:8px;font-size:13px;">
              <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option>
            </select></div>
        </div>
        <div id="assign-court-slots"></div>
        <div id="assign-notes-section" style="margin-top:8px;"></div>
        <button class="btn btn-blue btn-small" style="width:100%;margin-top:10px;" onclick="saveAssignment()">Save Assignment</button>
      <div style="text-align:center;margin:10px 0 4px;font-size:11px;color:var(--gray);letter-spacing:0.5px;">— OR —</div>
      <div style="margin-bottom:6px;">
        <div style="font-size:11px;font-weight:700;color:var(--gray);letter-spacing:1px;margin-bottom:6px;">SCAN ASSIGNMENT SHEET</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <button id="ca-toggle-mine" class="btn btn-primary btn-small" style="flex:1;" onclick="setCaTeam('mine')">My Sheet</button>
          <button id="ca-toggle-opp" class="btn btn-secondary btn-small" style="flex:1;" onclick="setCaTeam('opponent')">Opponent's Sheet</button>
        </div>
        <div id="ca-opp-wrap" style="display:none;margin-bottom:8px;">
          <input id="ca-opp" type="text" class="form-input" placeholder="Opponent school name" style="width:100%;font-size:13px;padding:8px;">
        </div>
        <button class="btn btn-secondary btn-small" style="width:100%;" onclick="document.getElementById('ca-file').click()">📸 Scan Sheet</button>
      </div>
      </div>
      <div id="assignments-list"></div>
    </div>
<div class="card"><div class="card-title blue"><span class="bar"></span> 🤖 AI Pairing Recommendations</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:10px;">AI analyzes skills, match history, position compatibility, side preference, and court levels to suggest optimal pairings.</p>
      <div class="form-row" style="margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Courts to fill</label>
          <select class="form-select" id="ai-pair-courts" style="padding:8px;font-size:13px;">
            <option value="1">1 court</option><option value="2">2 courts</option><option value="3">3 courts</option><option value="4">4 courts</option><option value="5">5 courts</option><option value="6">6 courts</option><option value="7">7 courts</option><option value="8">8 courts</option>
          </select></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Context</label>
          <select class="form-select" id="ai-pair-context" style="padding:8px;font-size:13px;" onchange="document.getElementById('ai-pair-rounds-row').style.display=this.value==='queens'?'block':'none'">
            <option value="gameday">Dual (strongest pairings)</option>
            <option value="scrimmage">Scrimmage (mix it up)</option>
            <option value="queens">Queens Practice (competitive balance)</option>
          </select></div>
      </div>
      <div class="form-row" style="margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Date</label>
          <input type="date" class="form-select" id="ai-pair-date" style="padding:8px;font-size:13px;"></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Location</label>
          <select class="form-select" id="ai-pair-location" style="padding:8px;font-size:13px;">
            <option>${SC.homeVenue||'Home'}</option><option>Away</option>
          </select></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Time</label>
          <input type="time" class="form-select" id="ai-pair-time" style="padding:8px;font-size:13px;"></div>
      </div>
      <div id="ai-pair-rounds-row" style="display:none;margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Rounds / Games</label>
          <select class="form-select" id="ai-pair-rounds" style="padding:8px;font-size:13px;">
            <option value="1">1 round</option>
            <option value="2">2 rounds — different partners each</option>
            <option value="3">3 rounds — full rotation</option>
            <option value="4">4 rounds</option>
          </select>
          <div style="font-size:11px;color:var(--gray);margin-top:4px;">Each round re-mixes all partners so players get new matchups</div>
        </div>
      </div>
      <button class="btn btn-blue btn-small" onclick="generateAIPairings()" id="ai-pair-btn" style="width:100%;">🤖 Generate Pairings</button>
      <div id="ai-pairings-result" style="margin-top:12px;"></div>
    </div>
    </div>

<!-- ====== DUALS / LIVE SCORING ====== -->
  <div class="tab-content active" id="tab-duals">
<div class="card" style="border:2px solid var(--blue);">
      <div class="card-title blue"><span class="bar"></span> 🏐 Live Score Entry
        <span style="font-size:11px;font-weight:400;color:var(--gray);letter-spacing:0;font-family:'Barlow',sans-serif;margin-left:6px;">Auto-loads today's assignment</span>
      </div>
      <div id="next-match-banner" style="display:none;"></div>
      <div id="live-assignment-list" style="margin-bottom:12px;"></div>
      <div id="live-courts-container"><div style="text-align:center;color:var(--gray);font-size:13px;padding:16px;">Select an assignment above to load courts.</div></div>
    <div id="shared-lineup-panel" style="display:none;background:#f0f7ff;border:1px solid #bcd6f5;border-radius:10px;padding:14px;margin-top:12px;"></div>
    <div id="dual-sheet-card" style="display:none;" class="card"><div class="card-title blue"><span class="bar"></span> 📋 Dual Sheet</div><div id="dual-sheet-container"></div></div>
    </div>
<div class="card" style="border:2px solid var(--charcoal);">
      <div class="card-title" style="color:var(--charcoal);"><span class="bar" style="background:var(--charcoal);"></span> 🔒 ${COACH_LABEL} Notes
        <span style="font-size:11px;font-weight:400;letter-spacing:0;font-family:'Barlow',sans-serif;color:var(--gray);margin-left:6px;">Private — coaches only</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <input type="date" class="form-input" id="cnote-date" style="max-width:180px;padding:8px 12px;">
        <button class="btn btn-secondary btn-small" onclick="loadCoachNotes()" style="white-space:nowrap;">Load Notes</button>
      </div>
      <div class="cnote-tabs">
        <button class="cnote-tab active" onclick="switchCnote('game',this)">📋 Game</button>
        <button class="cnote-tab" onclick="switchCnote('players',this)">👤 Players</button>
        <button class="cnote-tab" onclick="switchCnote('pairs',this)">🤝 Pairs</button>
      </div>
      <div class="cnote-section active" id="cnote-game">
        <label style="font-size:12px;font-weight:700;color:var(--gray);display:block;margin-bottom:6px;">Game Summary &amp; General Notes</label>
        <textarea class="cnote-textarea" id="cnote-game-text" rows="4" placeholder="Overall performance, strategy observations, conditions, key moments..."></textarea>
        <button class="btn btn-secondary btn-small" style="margin-top:8px;" onclick="saveCoachNote('game')">Save Game Notes</button>
        <span id="cnote-game-saved" style="font-size:11px;color:var(--green);margin-left:8px;opacity:0;transition:opacity 0.4s;">✓ Saved</span>
      </div>
      <div class="cnote-section" id="cnote-players">
        <div id="cnote-players-list"><div style="color:var(--gray);font-size:13px;">Load notes for a date first.</div></div>
      </div>
      <div class="cnote-section" id="cnote-pairs">
        <div id="cnote-pairs-list"><div style="color:var(--gray);font-size:13px;">Load notes for a date first.</div></div>
      </div>
    </div>
<div class="card" style="border:2px solid var(--gold);">
      <div class="card-title gold"><span class="bar" style="background:var(--gold);"></span> Upload Dual Scoresheet</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Photograph the handwritten scoresheet after a dual. AI reads the opponent, pairings, and all set scores — then automatically creates the dual record and individual match entries for player stats.</p>
      <div class="form-group">
        <label class="form-label" style="font-size:11px;">Match Date</label>
        <input type="date" class="form-input" id="dual-scan-date" style="padding:8px;font-size:13px;">
      </div>
      <input type="file" id="dual-scan-file" accept="image/*" style="display:none;">
      <button class="btn btn-small" style="width:100%;background:var(--gold);color:var(--black);border:none;font-size:15px;padding:12px;" onclick="document.getElementById('dual-scan-file').click();">&#128248; Take Photo or Upload Scoresheet</button>
      <div id="dual-scan-preview" style="margin-top:10px;"></div>
      <div id="dual-scan-result" style="margin-top:10px;"></div>
    </div>
  </div>

<!-- ====== DUAL HISTORY ====== -->
  <div class="tab-content" id="tab-dualhistory">
<div class="card"><div class="card-title blue"><span class="bar"></span> 📅 Past Court Lineups</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:10px;">Court assignments from past duals and scrimmages, derived from match records.</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
        <input type="date" id="lineup-search-date" class="form-input" style="flex:1;min-width:120px;font-size:12px;" placeholder="Date" oninput="filterPastLineups()">
        <input type="text" id="lineup-search-opp" class="form-input" style="flex:1;min-width:120px;font-size:12px;" placeholder="Opponent" oninput="filterPastLineups()">
        <input type="text" id="lineup-search-player" class="form-input" style="flex:1;min-width:120px;font-size:12px;" placeholder="Player name" oninput="filterPastLineups()">
      </div>
      <div id="past-lineups-list"></div>
    </div>
<div class="card">
      <div class="card-title"><span class="bar"></span> Dual History</div>
      <div id="duals-list"><div class="empty-state"><div class="emoji">&#127942;</div><p>No dual matches recorded yet.<br>Upload a scoresheet to get started!</p></div></div>
    </div>
  </div>

<!-- ====== SCRIMMAGE (SW vs External — Non-Season) ====== -->
  <div class="tab-content" id="tab-scrimmage">
    <div class="card"><div class="card-title purple"><span class="bar"></span> New Scrimmage Match</div>
      <div class="form-row" style="margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Date</label><input type="date" class="form-input" id="sc-date"></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Court</label>
          <select class="form-select" id="sc-court"><option value="1">Court 1</option><option value="2">Court 2</option><option value="3">Court 3</option><option value="4">Court 4</option><option value="5">Court 5</option><option value="6">Court 6 — Exhib</option><option value="7">Court 7 — Exhib</option><option value="8">Court 8 — Exhib</option></select></div></div>
      <div class="form-row" style="margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Player 1</label><select class="form-select" id="sc-p1"><option value="">Select</option></select></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label">Player 2</label><select class="form-select" id="sc-p2"><option value="">Select</option></select></div></div>
      <div class="form-group" style="margin-bottom:10px;"><label class="form-label">Opponent</label><input type="text" class="form-input" id="sc-opp" placeholder="e.g. Lincoln CT3"></div>
      <button class="btn btn-purple" id="save-sc-match">Create Match</button>
    </div>
    <div class="card"><div class="card-title purple"><span class="bar"></span> Scrimmage Matches</div>
      <div class="date-filter"><label style="font-size:13px;font-weight:700;">Date:</label><input type="date" id="sc-filter-date" class="form-input" style="max-width:180px;padding:8px 12px;"></div>
      <div id="sc-matches-list"></div>
    </div>
    <div class="card" style="border:2px solid var(--purple);">
      <div class="card-title purple"><span class="bar"></span> 📷 Upload Scrimmage Scoresheet</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Photograph the handwritten scoresheet. AI reads the pairings and set scores then creates individual match entries.</p>
      <div class="form-group"><label class="form-label" style="font-size:11px;">Match Date</label>
        <input type="date" class="form-input" id="sc-scan-date" style="padding:8px;font-size:13px;"></div>
      <input type="file" id="sc-scan-file" accept="image/*" style="display:none;">
      <button class="btn btn-small" style="width:100%;background:var(--purple);color:var(--white);border:none;font-size:15px;padding:12px;" onclick="document.getElementById('sc-scan-file').click();">&#128248; Take Photo or Upload Scoresheet</button>
      <div id="sc-scan-preview" style="margin-top:10px;"></div>
      <div id="sc-scan-result" style="margin-top:10px;"></div>
    </div>
  </div>

  <!-- ====== GOALS (Coach) ====== -->
  <div class="tab-content" id="tab-goals">
    <div class="card"><div class="card-title" style="color:var(--gold);"><span class="bar" style="background:var(--gold);"></span> Player Goals & AI Development Plans</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:14px;">Review player goals. Generate AI performance plans, edit them, and approve before players see the feedback.</p>
      <div class="filter-row"><select class="form-select" id="goals-player-filter" style="max-width:250px;"><option value="all">All Players</option></select></div>
      <div id="coach-goals-list"></div>
    </div>
  </div>

  <!-- ====== SCOUTS ====== -->
  <div class="tab-content" id="tab-scouts">
    <div class="card"><div class="card-title" style="color:#0369a1;"><span class="bar" style="background:#0369a1;"></span> 🕵️ Opponent Scouting</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Opponent player notes accumulated across all duals. Scan a lineup sheet to add players.</p>
      <div id="scouts-school-list"><div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">No opponents scouted yet. Scan an opponent lineup sheet from the Planner tab.</div></div>
    </div>
    <div id="scouts-detail-panel" style="display:none;"></div>
  </div>

  <!-- ====== ROSTER ====== -->
    <div class="tab-content" id="tab-settings">
<div class="card"><div class="card-title"><span class="bar"></span> Player Roster</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Assign pair levels. Changes sync in real time.</p><div id="roster-list"></div></div>
  </div>
  ${SC.tiersEnabled?'':'<div class="tab-content" id="tab-practice"></div>'}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-hspractice"><div class="card" style="text-align:center;padding:34px 20px;">
    <div style="font-family:'Bebas Neue';font-size:24px;letter-spacing:1px;color:#082A4F;margin-bottom:8px;">Practice</div>
    <p style="font-size:13px;color:var(--gray);line-height:1.6;margin:0;">The practice planner is coming to the coach app. Team analysis, development plans, and the practice builder land here next.</p>
  </div></div>`}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-hsrecruiting"><div class="card" style="text-align:center;padding:34px 20px;">
    <div style="font-family:'Bebas Neue';font-size:24px;letter-spacing:1px;color:#082A4F;margin-bottom:8px;">Recruiting</div>
    <p style="font-size:13px;color:var(--gray);line-height:1.6;margin:0;">Recruiting is coming to the coach app.</p>
  </div></div>`}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-hspgroups"><div class="card" style="text-align:center;padding:34px 20px;">
    <div style="font-family:'Bebas Neue';font-size:24px;letter-spacing:1px;color:#082A4F;margin-bottom:8px;">Practice Groups</div>
    <p style="font-size:13px;color:var(--gray);line-height:1.6;margin:0;">Practice Groups is coming to the coach app.</p>
  </div></div>`}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-hsimport">
    ${SC.tiersEnabled?'':`<div class="card"><div class="card-title"><span class="bar"></span> Add Player</div>
      <div class="form-row" style="margin-bottom:10px;"><input type="text" class="form-input" id="new-first" placeholder="First Name"><input type="text" class="form-input" id="new-last" placeholder="Last Name"></div>
      <div class="form-row" style="margin-bottom:10px;">
        <input type="number" class="form-input" id="new-jersey" placeholder="Jersey #" min="0" max="99" style="max-width:110px;">
        <input type="number" class="form-input" id="new-truvolley" placeholder="TruVolley Rating" step="0.01" min="0" style="max-width:150px;">
        <select class="form-select" id="new-class"><option value="FR">Freshman</option><option value="SO">Sophomore</option><option value="JR">Junior</option><option value="SR">Senior</option></select>
        <select class="form-select" id="new-court"><option value="1">Court 1</option><option value="2">Court 2</option><option value="3">Court 3</option><option value="4">Court 4</option><option value="5">Court 5</option><option value="6">Court 6 — Exhib</option><option value="7">Court 7 — Exhib</option><option value="8">Court 8 — Exhib</option></select></div>
      <div class="form-row" style="margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <input type="number" class="form-input" id="new-gradyear" placeholder="Grad Year" min="2025" max="2035" style="max-width:130px;">
        <input type="text" class="form-input" id="new-height" placeholder="Height e.g. 5'11&quot;" style="max-width:150px;">
        <input type="text" class="form-input" id="new-reach" placeholder="Standing reach e.g. 7'8&quot;" style="max-width:190px;">
        <select class="form-select" id="new-hand"><option value="">Hand</option><option value="R">Right</option><option value="L">Left</option></select>
        <select class="form-select" id="new-side"><option value="">Side</option><option value="L">Left</option><option value="R">Right</option></select>
        <select class="form-select" id="new-role"><option value="">Role</option><option value="block">Block</option><option value="defense">Defense</option><option value="split">Split</option></select></div>
      <div class="form-row" style="margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <input type="text" class="form-input" id="new-p1-name" placeholder="Parent 1 Name" style="max-width:170px;">
        <input type="email" class="form-input" id="new-p1-email" placeholder="Parent 1 Email" style="max-width:200px;">
        <input type="tel" class="form-input" id="new-p1-phone" placeholder="Parent 1 Phone" style="max-width:170px;"></div>
      <div class="form-row" style="margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <input type="text" class="form-input" id="new-p2-name" placeholder="Parent 2 Name" style="max-width:170px;">
        <input type="email" class="form-input" id="new-p2-email" placeholder="Parent 2 Email" style="max-width:200px;">
        <input type="tel" class="form-input" id="new-p2-phone" placeholder="Parent 2 Phone" style="max-width:170px;"></div>
      <button class="btn btn-secondary" id="add-player">Add Player</button></div>`}
    <div class="card">
    <div class="card-title"><span class="bar"></span> Import and Export</div>
    <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:14px;">Export your full program to Excel or JSON any time, for a backup or to share with staff. Import a roster from the CourtSense Excel template to add or update players.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;" onclick="exportExcel()">📊 Export Excel</button>
      <button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;" onclick="exportJSON()">Export JSON</button>
      <button class="btn btn-small btn-secondary" onclick="triggerRosterImport()">Import</button>
      <input type="file" id="roster-import-input" accept=".xlsx,.xls" style="display:none;" onchange="handleRosterImportFile(this)">
    </div>
  </div>
  <div class="card" id="pin-change-card"><div class="card-title"><span class="bar"></span> 🔐 Change ${COACH_LABEL} PIN</div><p style="font-size:12px;color:var(--gray);margin-bottom:10px;">Update the PIN coaches use to access protected features.</p><div class="form-row" style="margin-bottom:8px;"><div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Current PIN</label><input type="password" class="form-input" id="pin-current" placeholder="Current PIN" style="padding:8px;font-size:13px;"></div><div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">New PIN</label><input type="password" class="form-input" id="pin-new" placeholder="New PIN (4+ digits)" style="padding:8px;font-size:13px;"></div></div><button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;" onclick="changeCoachPin()">Update PIN</button><div id="pin-change-status" style="font-size:12px;margin-top:8px;"></div></div></div>`}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-hslogistics"><div class="card" style="text-align:center;padding:34px 20px;">
    <div style="font-family:'Bebas Neue';font-size:24px;letter-spacing:1px;color:#082A4F;margin-bottom:8px;">Logistics</div>
    <p style="font-size:13px;color:var(--gray);line-height:1.6;margin:0;">Logistics is coming to the coach app.</p>
  </div></div>`}
  ${SC.tiersEnabled?'':`<div class="tab-content" id="tab-communicate">
    <div class="card">
      <div class="card-title"><span class="bar"></span> 💬 Communicate</div>
      <p style="font-size:13px;color:var(--charcoal);line-height:1.7;margin-bottom:14px;">Send an announcement to your team. Players and parents get an email, and players also see it in the app.</p>
      <div style="display:flex;gap:8px;margin-bottom:10px;" id="hs-bc-audience">
        <button class="filter-btn active" onclick="setHsBcAudience('all',this)" style="flex:1;text-align:center;">Everyone</button>
        <button class="filter-btn" onclick="setHsBcAudience('players',this)" style="flex:1;text-align:center;">Players only</button>
        <button class="filter-btn" onclick="setHsBcAudience('parents',this)" style="flex:1;text-align:center;">Parents only</button>
      </div>
      <input type="text" class="form-input" id="hs-bc-subject" placeholder="Subject" style="margin-bottom:8px;">
      <textarea class="form-input" id="hs-bc-body" rows="4" placeholder="Your announcement..." style="margin-bottom:8px;resize:vertical;"></textarea>
      <button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;" onclick="sendHsBroadcast()">Send</button>
      <div id="hs-bc-status" style="font-size:13px;margin-top:8px;"></div>
      <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin:16px 0 6px;">Recent announcements</div>
      <div id="hs-bc-list"></div>
    </div>
    <div class="card">
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">Coming with parent accounts</div>
      <div style="opacity:0.7;border:1px dashed var(--gray-lighter);border-radius:10px;padding:12px 14px;background:var(--off-white,#faf8f9);">
        <div style="font-size:13px;font-weight:700;color:var(--charcoal);margin-bottom:4px;">Two-way team chat with parent visibility</div>
        <p style="font-size:12px;color:var(--gray);line-height:1.6;margin:0;">A team message space that parents can see is on the way this fall, built on top of parent accounts so families are looped in from the start. We are getting the parent side right first.</p>
      </div>
    </div>
  </div>`}
  ${SC.chatEnabled?'<div class="tab-content" id="tab-broadcast"></div>':''}
  ${SC.tiersEnabled?'<div class="tab-content" id="tab-inbox"></div>':''}
  ${SC.tiersEnabled?'<div class="tab-content" id="tab-teamanalysis"></div>':''}
  <!-- Stage 2a: un-gated for HS too (was tiersEnabled-only). Panels exist for all configs; HS routing wired per surface in later commits. -->
  <div class="tab-content" id="tab-practicegroups"></div>
  <div class="tab-content" id="tab-recruiting"></div>
  ${SC.tiersEnabled?`<div class="tab-content" id="tab-accounting"></div>
  <div class="tab-content" id="tab-travel"></div>`:`<div class="tab-content" id="tab-logistics">
    <div id="tab-accounting"></div>
    <div id="tab-travel"></div>
  </div>`}

</div>
<!-- PLAYER PORTAL (shown when logged in as player) -->
<div class="player-portal" id="player-portal">
  <!-- Header -->
  <div class="card">
    <div class="pp-name" id="pp-name"></div>
    <div class="pp-meta" id="pp-meta"></div>
    <div id="pp-tier-request"></div>
    <div id="pp-practice"></div>
  </div>

  <!-- Notification banner -->
  <div id="pp-notif-banner"></div>

  <!-- Team announcements (coach broadcasts, read-only) -->
  <div id="pp-broadcasts"></div>

  <!-- Tab bar: My Stats | Live Score Entry | My Matches -->
  <div class="pp-tab-bar">
    <button class="pp-tab-btn active" onclick="switchPPTab('stats',this)">📊 My Stats</button>
    <button class="pp-tab-btn" onclick="switchPPTab('live',this)">🏐 Live Score Entry</button>
    ${!SC.clubPortalLite?'<button class="pp-tab-btn" onclick="switchPPTab(\'scouts\',this)">🕵️ Scouts</button>':''}
    ${!SC.clubPortalLite?'<button class="pp-tab-btn" onclick="switchPPTab(\'matches\',this)">📋 My Matches</button>':''}
    ${!SC.clubPortalLite?'<button class="pp-tab-btn" onclick="switchPPTab(\'learn\',this)">🎓 Learn</button>':''}
    ${SC.chatEnabled?'<button class="pp-tab-btn" onclick="switchPPTab(\'chat\',this)">💬 Club Chat</button>':''}
    ${SC.tiersEnabled?'<button class="pp-tab-btn" onclick="switchPPTab(\'messages\',this)">✉️ Messages <span id="pp-msg-unread" style="color:var(--red);font-weight:700;"></span></button>':''}
    ${SC.tiersEnabled?'<button class="pp-tab-btn" onclick="switchPPTab(\'travel\',this)">🚌 Travel</button>':''}
    ${SC.pickupEnabled?'<button class="pp-tab-btn" onclick="window.open(\'https://courtsense.app/pickup/\',\'_blank\')">🏖️ Pickup</button>':''}
  </div>

  <!-- ══ MY STATS PANEL ══ -->
  <div class="pp-panel active" id="pp-panel-stats">

    <button class="btn btn-blue btn-small" style="width:100%;margin-bottom:12px;" onclick="showAthleteCard(currentPlayerId)">View Athlete Card</button>

    <!-- Season Summary -->
    ${!SC.clubPortalLite?`<div class="card"><div class="card-title"><span class="bar"></span> My Season Summary</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;" id="pp-stat-toggle">
        <button class="filter-btn active" id="pp-stat-official" onclick="ppSetStatView('official',this)" style="flex:1;text-align:center;">Official (CT 1-5)</button>
        <button class="filter-btn" id="pp-stat-exhibition" onclick="ppSetStatView('exhibition',this)" style="flex:1;text-align:center;color:#0e7a4d;border-color:#0e7a4d;">Exhibition (CT 6+)</button>
      </div>
      <div id="pp-summary"></div>
    </div>`:''}

    <!-- Goals (moved here) -->
    <div class="card"><div class="card-title" style="color:var(--gold);"><span class="bar" style="background:var(--gold);"></span> My Goals &amp; Development Plan</div>
      <div id="pp-goals-list"></div>
      <div style="margin-top:14px;border-top:1px solid var(--gray-lighter);padding-top:14px;">
        <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">Add a Goal</div>
        <select class="form-select" id="pp-goal-select" style="margin-bottom:8px;">
          <option value="">— Choose a Goal —</option>
          <optgroup label="🏐 Court Goals">
            <option value="court1">Move up to Court 1</option>
            <option value="court2">Move up to Court 2</option>
            <option value="court3">Earn starting spot on Court 3</option>
            <option value="hold_court">Hold my current court assignment</option>
          </optgroup>
          <optgroup label="🎓 College Goals">
            <option value="d1">Play D1 college beach volleyball</option>
            <option value="d2">Play D2 college beach volleyball</option>
            <option value="naia">Play NAIA/JUCO beach volleyball</option>
            <option value="college_any">Play college beach volleyball (any level)</option>
          </optgroup>
          <optgroup label="📈 Skill Goals">
            <option value="skill_serving">Improve my serving</option>
            <option value="skill_passing">Improve my passing</option>
            <option value="skill_setting">Improve my setting</option>
            <option value="skill_hitting">Improve my hitting</option>
            <option value="skill_blocking">Improve my blocking</option>
            <option value="skill_defense">Improve my defense</option>
            <option value="skill_court_sense">Improve court sense &amp; IQ</option>
            <option value="skill_communication">Improve on-court communication</option>
          </optgroup>
          <optgroup label="⚡ Performance Goals">
            <option value="star_drill">Improve star drill time</option>
            <option value="vertical">Increase my vertical jump</option>
            <option value="jump_serve">Develop a jump serve</option>
            <option value="consistency">Become more consistent</option>
            <option value="both_sides">Learn to play both sides</option>
            <option value="versatile">Be more versatile (hitter + defender)</option>
          </optgroup>
          <optgroup label="👑 Leadership Goals">
            <option value="captain">Become team captain</option>
            <option value="leader">Be a vocal leader on court</option>
            <option value="teammate">Be a better teammate &amp; communicator</option>
            <option value="mentor">Mentor younger players</option>
          </optgroup>
          <optgroup label="🏆 Season Goals">
            <option value="starter">Earn a starting position</option>
            <option value="most_improved">Be most improved player</option>
            <option value="win_pct">Improve my win percentage</option>
            <option value="positive_diff">Finish season with positive +/-</option>
          </optgroup>
        </select>
        <button class="btn btn-primary btn-small" style="background:var(--gold);width:100%;" onclick="addPlayerGoal()">Set This Goal</button>
      </div>
    </div>

    <!-- Coach Notes (moved here) -->
    <div class="card"><div class="card-title"><span class="bar"></span> ${COACH_LABEL} Notes</div>
      <div id="pp-notes"></div>
    </div>

    <!-- Rankings -->
    <div class="card"><div class="card-title"><span class="bar"></span> My Team Rankings</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">How you stack up against your teammates</p>
      <div id="pp-rankings"></div>
    </div>

    <!-- Skills -->
    <div class="card"><div class="card-title"><span class="bar"></span> My Skills</div>
      <div id="pp-skills"></div>
    </div>

    <!-- Star Drill -->
    <div class="card"><div class="card-title"><span class="bar"></span> My Star Drill Times</div>
      <div id="pp-drills"></div>
    </div>

    <!-- Verticals -->
    <div class="card"><div class="card-title"><span class="bar"></span> My Verticals</div>
      <div id="pp-verts"></div>
    </div>

    <!-- Season Schedule -->
    ${!SC.clubPortalLite?`<div class="card"><div class="card-title"><span class="bar"></span> Season Schedule</div>
      <div id="pp-assignment" style="margin-bottom:12px;"></div>
      <div id="pp-schedule"></div>
    </div>`:''}

    <!-- Area Standings -->
    ${!SC.clubPortalLite?`<div class="card"><div class="card-title"><span class="bar"></span> Area Standings</div>
      <div id="pp-standings"></div>
    </div>`:''}

    <!-- Change Password (name-select login only; email-login clubs use their CourtSense account, so it is hidden for them) -->
    ${SC.emailLogin?'':`<div class="card"><div class="card-title"><span class="bar"></span> Change Password</div>
      <div style="padding:4px;">
        <input type="password" style="width:100%;padding:10px 12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:8px;" id="t-pw-current" placeholder="Current Password">
        <input type="password" style="width:100%;padding:10px 12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:8px;" id="t-pw-new" placeholder="New Password">
        <input type="password" style="width:100%;padding:10px 12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:8px;" id="t-pw-confirm" placeholder="Confirm New Password">
        <button class="btn btn-primary btn-small" onclick="changePassword()">Update Password</button>
      </div>
    </div>`}

    <!-- Email Notifications -->
    <div class="card" style="border-top:3px solid var(--blue);">
      <div class="card-title" style="color:var(--blue);"><span class="bar" style="background:var(--blue);"></span> &#x1F4E7; Email Notifications</div>
      <div style="padding:4px;">
        <div style="font-size:12px;color:var(--gray);margin-bottom:10px;">Get notified about assignments, coach feedback, and game results.</div>
        <input type="email" id="pp-email-addr" placeholder="your@email.com" style="width:100%;box-sizing:border-box;padding:10px 12px;border:2px solid var(--gray-lighter);border-radius:8px;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:12px;">
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
            <input type="checkbox" id="pp-notif-assign" style="width:16px;height:16px;accent-color:var(--blue);"> Court assignments &amp; lineup updates
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
            <input type="checkbox" id="pp-notif-plan" style="width:16px;height:16px;accent-color:var(--blue);"> Training plan approved by coach
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
            <input type="checkbox" id="pp-notif-cnote" style="width:16px;height:16px;accent-color:var(--blue);"> New coach notes for me
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
            <input type="checkbox" id="pp-notif-score" style="width:16px;height:16px;accent-color:var(--blue);"> Game results posted
          </label>
        </div>
        <button class="btn btn-blue btn-small" onclick="saveEmailPrefs(); loadEmailPrefs(currentPlayerId);" style="width:100%;">Save Preferences</button>
        <div id="pp-email-saved" style="text-align:center;font-size:12px;color:var(--green);margin-top:6px;opacity:0;transition:opacity 0.3s;">&#x2713; Saved!</div>
      </div>
    </div>

  </div><!-- end pp-panel-stats -->

  <!-- ══ LIVE SCORE ENTRY PANEL ══ -->
  <div class="pp-panel" id="pp-panel-live">
    <div class="card" style="border:2px solid var(--blue);">
      <div class="card-title blue"><span class="bar"></span> 🏐 Live Score Entry
        <span style="font-size:11px;font-weight:400;color:var(--gray);letter-spacing:0;font-family:'Barlow',sans-serif;margin-left:6px;">Today's courts</span>
      </div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:12px;">Use +/− to keep score live, or type a number to correct. Each court saves independently.</p>
      <div id="pp-live-courts"><div style="text-align:center;color:var(--gray);font-size:13px;padding:20px;">Loading today's assignment...</div></div>
    </div>
  </div>

  <!-- ══ MY MATCHES PANEL ══ -->
  <div class="pp-panel" id="pp-panel-matches">
    <div class="card"><div class="card-title blue"><span class="bar"></span> My Match Results</div>
      <div id="pp-gameday"></div>
    </div>
    <div class="card"><div class="card-title"><span class="bar"></span> My Queens Matches</div>
      <div id="pp-queens"></div>
    </div>
    <div class="card"><div class="card-title purple"><span class="bar"></span> My Scrimmage Results</div>
      <div id="pp-scrimmage"></div>
    </div>
  </div>

  <!-- ══ SCOUTS PANEL ══ -->
  <div class="pp-panel" id="pp-panel-scouts">
    <div class="card"><div class="card-title" style="color:#0369a1;"><span class="bar" style="background:#0369a1;"></span> 🕵️ Opponent Scouting</div>
      <div id="pp-scouts-list"><div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">No opponents scouted yet.</div></div>
    </div>
    <div id="pp-scouts-detail" style="display:none;"></div>
  </div>

  <div class="pp-panel" id="pp-panel-learn">
    <div class="card">
      <div class="card-title" style="color:var(--red);"><span class="bar"></span> 🎓 CourtSense IQ</div>
      <p style="font-size:13px;color:var(--gray);margin-bottom:12px;line-height:1.5;">Test your beach volleyball court knowledge. Your score averages with your coach rating for Court Sense.</p>
      <div id="pp-quiz-history" style="margin-bottom:14px;"></div>
      <button class="btn btn-primary" id="pp-start-quiz-btn" onclick="togglePPQuiz()" style="width:100%;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;margin-bottom:10px;">TAKE COURTSENSE IQ QUIZ</button>
      <div id="pp-quiz-frame-wrap" style="display:none;border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,0.1);">
        <iframe id="pp-quiz-iframe" src="" style="width:100%;height:720px;border:none;display:block;"></iframe>
      </div>
    </div>
  </div>
  ${SC.chatEnabled?'<div class="pp-panel" id="pp-panel-chat"></div>':''}
  ${SC.tiersEnabled?'<div class="pp-panel" id="pp-panel-messages"></div>':''}
  ${SC.tiersEnabled?'<div class="pp-panel" id="pp-panel-travel"></div>':''}

</div><!-- end player-portal -->

<!-- EDIT MODAL -->
<!-- ASSIGNMENT EDIT MODAL -->
<div class="modal-overlay" id="assign-edit-modal">
  <div class="modal" style="max-width:480px;width:100%;max-height:90vh;overflow-y:auto;">
    <div class="modal-title" id="assign-edit-title">Edit Assignment <button class="modal-close" onclick="closeAssignEditModal()">&#x2715;</button></div>
    <div id="assign-edit-body"></div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeAssignEditModal()">Cancel</button>
      <button class="btn btn-secondary" onclick="addAssignEditCourt()" style="background:var(--off-white);color:var(--charcoal);">+ Court</button>
      <button class="btn btn-blue" onclick="saveAssignEdit()">Save Changes</button>
    </div>
  </div>
</div>
<div class="modal-overlay" id="coach-player-overlay" onclick="if(event.target===this)coachClosePlayer()">
  <div id="coach-player-modal" style="background:var(--white);border-radius:16px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;padding:0;">
    <div style="background:var(--primary);color:#fff;padding:16px 20px;border-radius:16px 16px 0 0;display:flex;justify-content:space-between;align-items:center;">
      ${SC.tiersEnabled?`<div style="display:flex;align-items:center;gap:12px;">
        <div id="cpm-photo"></div>
        <div>
          <div id="cpm-name" style="font-family:'Bebas Neue';font-size:22px;letter-spacing:1px;"></div>
          <div id="cpm-meta" style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;"></div>
        </div>
      </div>`:`<div>
        <div id="cpm-name" style="font-family:'Bebas Neue';font-size:22px;letter-spacing:1px;"></div>
        <div id="cpm-meta" style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;"></div>
      </div>`}
      <button onclick="coachClosePlayer()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:16px;">✕</button>
    </div>
    <div style="padding:16px 20px;display:flex;flex-direction:column;gap:20px;">
      <div style="border-top:1px solid var(--gray-lighter);padding-top:16px;"><div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">📊 Team Rankings</div><div id="cpm-rankings"></div></div>
      ${SC.tiersEnabled?`<div id="cpm-standing-block" style="border-top:1px solid var(--gray-lighter);padding-top:16px;"></div>`:''}
      <div id="cpm-identity" style="border-top:1px solid var(--gray-lighter);padding-top:16px;">
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">🪪 Player Identity</div>
        <div id="cpm-id-summary" style="font-size:12px;color:var(--gray);margin-bottom:8px;"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="text" id="cpm-id-height" class="form-input" placeholder="Height e.g. 5'11&quot;" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-id-reach" class="form-input" placeholder="Standing reach e.g. 7'8&quot;" style="flex:1;min-width:150px;padding:8px;font-size:13px;">
          <input type="number" id="cpm-id-gradyear" class="form-input" placeholder="Grad Year" min="2025" max="2035" style="flex:1;min-width:110px;padding:8px;font-size:13px;">
          <select id="cpm-id-position" class="form-select" style="flex:1;min-width:110px;padding:8px;font-size:13px;"><option value="">Position</option><option value="block">Block</option><option value="defense">Defense</option><option value="split">Split</option></select>
          <select id="cpm-id-side" class="form-select" style="flex:1;min-width:100px;padding:8px;font-size:13px;"><option value="">Side</option><option value="L">Left</option><option value="R">Right</option></select>
          <select id="cpm-id-hand" class="form-select" style="flex:1;min-width:100px;padding:8px;font-size:13px;"><option value="">Hand</option><option value="R">Right</option><option value="L">Left</option></select>
          <input type="number" id="cpm-id-truvolley" class="form-input" placeholder="TruVolley Rating" step="0.01" min="0" style="flex:1;min-width:130px;padding:8px;font-size:13px;">
        </div>
        ${!SC.tiersEnabled ? `<div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--gray);margin:4px 0 8px;">Parent Contacts</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="text" id="cpm-p1-name" class="form-input" placeholder="Parent 1 Name" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
          <input type="email" id="cpm-p1-email" class="form-input" placeholder="Parent 1 Email" style="flex:1;min-width:150px;padding:8px;font-size:13px;">
          <input type="tel" id="cpm-p1-phone" class="form-input" placeholder="Parent 1 Phone" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="text" id="cpm-p2-name" class="form-input" placeholder="Parent 2 Name" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
          <input type="email" id="cpm-p2-email" class="form-input" placeholder="Parent 2 Email" style="flex:1;min-width:150px;padding:8px;font-size:13px;">
          <input type="tel" id="cpm-p2-phone" class="form-input" placeholder="Parent 2 Phone" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
        </div>` : ''}
        <button class="btn btn-red btn-small" style="width:100%;" onclick="coachSaveIdentity()">Save Identity</button>
        <button class="btn btn-secondary btn-small" style="width:100%;margin-top:8px;" onclick="showAthleteCard(document.getElementById('coach-player-overlay').dataset.pid)">View Athlete Card</button>
      </div>
      ${SC.demoMode?`<div id="cpm-athinfo" style="border-top:1px solid var(--gray-lighter);padding-top:16px;">
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">🎓 Athlete Info (demo)</div>
        <p style="font-size:11px;color:var(--gray);margin-bottom:8px;">Preview only. Edits show on the athlete card for this session and reset on refresh.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="text" id="cpm-ai-gpa" class="form-input" placeholder="GPA" style="flex:1;min-width:80px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-sat" class="form-input" placeholder="SAT" style="flex:1;min-width:80px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-act" class="form-input" placeholder="ACT" style="flex:1;min-width:80px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-major" class="form-input" placeholder="Intended major" style="flex:1;min-width:150px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-club" class="form-input" placeholder="Club team" style="flex:1;min-width:150px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-years" class="form-input" placeholder="Years club experience" style="flex:1;min-width:160px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-ai-tourney" class="form-input" placeholder="National tournament results" style="flex:1;min-width:220px;padding:8px;font-size:13px;">
        </div>
        <button class="btn btn-small" style="width:100%;background:#082A4F;color:#fff;border:none;" onclick="coachSaveAthleteInfo()">Save Athlete Info (demo)</button>
      </div>`:''}
      <div>
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">⭐ Skills (1–10)</div>
        <div id="cpm-skills"></div>
        <button class="btn btn-red btn-small" style="width:100%;margin-top:10px;" onclick="coachSaveSkills()">Save Skills</button>
      </div>
      <div style="border-top:1px solid var(--gray-lighter);padding-top:16px;">
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">⏱ Star Drill</div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <input type="date" id="cpm-drill-date" class="form-input" style="flex:1;padding:8px;font-size:13px;">
          <input type="number" id="cpm-drill-time" class="form-input" placeholder="Time (sec)" step="0.1" min="0" style="flex:1;padding:8px;font-size:13px;">
          <button class="btn btn-blue btn-small" onclick="coachAddDrill()">Add</button>
        </div>
        <div id="cpm-drill-history"></div>
      </div>
      <div style="border-top:1px solid var(--gray-lighter);padding-top:16px;">
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">📏 Verticals</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <input type="date" id="cpm-vert-date" class="form-input" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-vert-bj" class="form-input" placeholder="Block Jump" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
          <input type="text" id="cpm-vert-aj" class="form-input" placeholder="Approach Jump" style="flex:1;min-width:120px;padding:8px;font-size:13px;">
        </div>
        <button class="btn btn-blue btn-small" style="width:100%;" onclick="coachAddVertical()">Add Measurement</button>
        <div id="cpm-vert-history" style="margin-top:8px;"></div>
      </div>
      <div style="border-top:1px solid var(--gray-lighter);padding-top:16px;">
        <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">📝 ${COACH_LABEL} Notes</div>
        <input type="date" id="cpm-note-date" class="form-input" style="width:100%;padding:8px;font-size:13px;margin-bottom:6px;">
        <textarea id="cpm-note-text" class="form-input" placeholder="Add a note..." rows="3" style="width:100%;padding:8px;font-size:13px;resize:vertical;margin-bottom:6px;"></textarea>
        <button class="btn btn-blue btn-small" style="width:100%;" onclick="coachAddNote()">Save Note</button>
        <div id="cpm-note-history" style="margin-top:10px;"></div>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="edit-modal">
  <div class="modal"><div class="modal-title">Edit Match <button class="modal-close" onclick="closeEdit()">✕</button></div>
    <div id="edit-modal-body"></div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeEdit()">Cancel</button><button class="btn btn-primary" id="edit-save">Save Changes</button></div>
  </div>
</div>
<!-- SET STATS MODAL -->
<div class="modal-overlay" id="set-modal">
  <div class="modal"><div class="modal-title" id="set-modal-title">Add Set <button class="modal-close" onclick="closeSetModal()">✕</button></div>
    <div id="set-modal-body"></div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeSetModal()">Cancel</button><button class="btn btn-blue" id="set-modal-save">Save Set</button></div>
  </div>
</div>
</div><!-- end app-wrapper -->
<div class="toast" id="toast"></div>


    <!-- Hidden inputs for court assignment scanner -->
    <input type="file" id="ca-file" accept="image/*" capture="environment" style="display:none;">
    <input type="date" id="ca-date" style="display:none;">
    <select id="ca-type" style="display:none;"><option value="gameday">Dual</option><option value="scrimmage">Scrimmage</option><option value="queens">Queens</option></select>
    <select id="ca-team" style="display:none;"><option value="mine">My Sheet</option><option value="opponent">Opponent's Sheet</option></select>
    <div id="ca-preview" style="display:none;"></div>
    <div id="ca-result" style="margin-top:10px;"></div><div id="school-fans-overlay" style="display:none;position:fixed;inset:0;background:linear-gradient(160deg,${SC.colors.primaryDeeper} 0%,${SC.colors.primary} 50%,${SC.colors.primaryDark} 100%);z-index:10000;overflow-y:auto;-webkit-overflow-scrolling:touch;">
  <div style="max-width:480px;margin:0 auto;padding:16px 14px 40px;">
    <div style="text-align:center;padding:24px 0 12px;">
      <div style="margin-bottom:8px;"><img id="cs-logo-fans" src="${LOGO_SRC}" style="height:80px;width:auto;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.4));" alt="${SC.logoAlt}" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=&quot;font-size:80px;line-height:1.2;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.4));&quot;>${SC.teamEmoji}</span>')">${!LOGO_SRC && SC.logo !== 'firebase' ? `<span style="font-size:80px;">${SC.teamEmoji}</span>` : ''}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:3px;color:#fff;">${SC.schoolName}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.65);margin-top:2px;">Beach Volleyball &middot; 2026 Season</div>
      <div id="lf-record" style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:#d4a843;margin-top:8px;"></div>
      <div style="margin-top:12px;display:flex;justify-content:center;gap:8px;">
        <button onclick="hideLeonFans()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;padding:7px 18px;border-radius:20px;cursor:pointer;">&#x2715; Close</button>
        <button onclick="lfManualRefresh()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;padding:7px 14px;border-radius:20px;cursor:pointer;">&#x21BA; Refresh</button>
      </div>
      <div style="margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px;">
        <span id="lf-refresh-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#4ade80;opacity:0.4;transition:opacity 0.3s;animation:pulse 2s infinite;"></span>
        <span style="font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:1px;">LIVE &middot; AUTO-UPDATES EVERY 30s</span>
      </div>
    </div>
    <div id="lf-banner" style="border-radius:12px;padding:14px;margin-bottom:14px;"></div>
    <div id="lf-today" style="display:none;background:#ffffff;border:2px solid ${SC.colors.primary};border-radius:14px;padding:14px;margin-bottom:14px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;color:${SC.colors.primary};margin-bottom:10px;">&#x26A1; IN PROGRESS</div>
      <div id="lf-today-courts"></div>
    </div>
    <div id="lf-upcoming-section" style="display:none;background:#ffffff;border:1px solid #f7a8b8;border-radius:14px;margin-bottom:14px;overflow:hidden;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;color:${SC.colors.primaryDeeper};padding:12px 14px 8px;">Upcoming Games</div>
      <div id="lf-upcoming"></div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.9);margin-bottom:8px;">Season Results</div>
    <div id="lf-results"></div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.9);margin:16px 0 8px;">Roster</div>
    <div id="lf-roster"></div>

    <!-- Email Opt-In -->
    <div id="lf-email-section" style="margin-top:24px;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.2);border-radius:14px;padding:18px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;color:#fff;margin-bottom:4px;">&#x1F4E7; Stay Updated</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:14px;">Get notified about game results and schedule changes.</div>
      <div id="lf-email-success" style="display:none;text-align:center;padding:10px;background:rgba(74,222,128,0.15);border-radius:8px;border:1px solid rgba(74,222,128,0.4);">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:15px;color:#4ade80;">&#x2713; You&rsquo;re signed up!</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:2px;">We&rsquo;ll keep you in the loop.</div>
      </div>
      <div id="lf-email-form">
        <input type="email" id="lf-email-input" placeholder="your@email.com" style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:none;background:rgba(255,255,255,0.15);color:#fff;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:10px;outline:none;" />
        <div style="display:flex;gap:16px;margin-bottom:12px;">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,0.75);cursor:pointer;">
            <input type="checkbox" id="lf-notif-results" checked style="width:14px;height:14px;accent-color:#d4a843;"> Game Results
          </label>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,0.75);cursor:pointer;">
            <input type="checkbox" id="lf-notif-schedule" checked style="width:14px;height:14px;accent-color:#d4a843;"> Schedule Updates
          </label>
        </div>
        <button onclick="submitLeonFanEmail()" style="width:100%;padding:10px;background:#d4a843;color:${SC.colors.primaryDeeper};font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1.5px;border:none;border-radius:8px;cursor:pointer;font-weight:700;">Subscribe</button>
        <div id="lf-email-error" style="color:#f87171;font-size:12px;margin-top:6px;text-align:center;"></div>
      </div>
    </div>
  </div>
</div>
<div id="athlete-overlay" style="display:none;position:fixed;inset:0;background:linear-gradient(160deg,${SC.colors.primaryDeeper} 0%,${SC.colors.primary} 50%,${SC.colors.primaryDark} 100%);z-index:10000;overflow-y:auto;-webkit-overflow-scrolling:touch;">
  <div style="max-width:480px;margin:0 auto;padding:12px 14px 40px;">
    <div style="text-align:right;padding:4px 0 8px;">
      <button onclick="hideAthleteCard()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;padding:7px 18px;border-radius:20px;cursor:pointer;">&#x2715; Close</button>
    </div>
    <div id="ac-header"></div>
    <div id="ac-record"></div>
    <div id="ac-seasons"></div>
    <div id="ac-athletic"></div>
    <div id="ac-academics"></div>
    <div id="ac-club"></div>
    <div id="ac-highlights"></div>
    <div id="ac-share"></div>
  </div>
</div>
${SC.demoMode ? `
<button class="demo-guide-btn" id="demo-guide-btn" onclick="document.getElementById('demo-guide-overlay').classList.add('show')"><span class="icon">📖</span>Demo Guide</button>
<div class="demo-guide-overlay" id="demo-guide-overlay" onclick="if(event.target===this)this.classList.remove('show')">
  <div class="demo-guide-modal">
    <div class="demo-guide-header">
      <h2>Try These Things</h2>
      <button class="demo-guide-close" onclick="document.getElementById('demo-guide-overlay').classList.remove('show')">×</button>
    </div>
    <p class="demo-guide-intro">Sand Sharks is a fictional team with sample data. Click around — nothing saves, refresh resets everything. Here is what is worth looking at:</p>
    <ol class="demo-guide-list">
      <li><span class="demo-guide-num">1</span><div class="demo-guide-content"><h3>See the team standings</h3><p>Click the Standings tab. Sand Sharks are 3-1 in district. Tap any opponent for head-to-head.</p></div></li>
      <li><span class="demo-guide-num">2</span><div class="demo-guide-content"><h3>Look at a player's profile</h3><p>Tap any player name. Stats, partner history, and season trajectory.</p></div></li>
      <li><span class="demo-guide-num">3</span><div class="demo-guide-content"><h3>Check partner chemistry</h3><p>Standings → tap a player → Partners. Shows W/L by partner across the season — which pairings are working, which aren't.</p></div></li>
      <li><span class="demo-guide-num">4</span><div class="demo-guide-content"><h3>View a played dual</h3><p>Schedule tab → tap a past dual. Court-by-court set scores, who played who.</p></div></li>
      <li><span class="demo-guide-num">5</span><div class="demo-guide-content"><h3>Open the planner</h3><p>Planner tab → enter ${COACH_LABEL} PIN 1234. Set lineups for upcoming matches. Try the auto-pair feature.</p></div></li>
      <li><span class="demo-guide-num">6</span><div class="demo-guide-content"><h3>Try the Excel export</h3><p>Manage, then Import/Export. Roster, results, schedule all in one workbook.</p></div></li>
      <li><span class="demo-guide-num">7</span><div class="demo-guide-content"><h3>Check the live scoring view</h3><p>From any dual, tap "Live Score." Mobile-friendly view for keeping score on the sand.</p></div></li>
    </ol>
  </div>
</div>
` : ''}`;
if(SC.demoMode) document.body.classList.add('demo');
})();


var _dualCloseInProgress=false;

// Proxy helper — auto-injects schoolId into every AI request
async function aiProxy(payload){
  return fetch(SC.aiProxyUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({schoolId:SC.shortName,...payload})
  });
}


// ============================================================
// FIREBASE CONFIG
// ============================================================
const FB_CONFIG=SC.fbConfig;
const DB_ROOT=SC.dbRoots.matches;

// ── SHARED LINEUP — school name → Firebase key map ─────────────────────────
// Loaded from Firebase (school_key_map) at runtime by listenData and merged over the
// entries below. Those entries are a static fallback so the existing schools keep
// working if the Firebase read is slow, empty, or fails. New schools are added to the
// Firebase node and need no code deploy.
let SCHOOL_KEY_MAP={
  'Leon':'leon_queens_matches',
  'Leon Beach':'leon_queens_matches',
  'South Walton':'south_walton_matches',
  'SW Beach':'south_walton_matches'
};
const MY_SCHOOL_KEY=DB_ROOT; // e.g. 'leon_queens_matches'

function getSharedLineupKey(date, oppScheduleName){
  const oppKey=SCHOOL_KEY_MAP[oppScheduleName];
  if(!oppKey)return null; // opponent not on platform
  const keys=[MY_SCHOOL_KEY, oppKey].sort();
  return 'shared_lineups/'+date.replace(/-/g,'')+'_'+keys[0].replace('_matches','')+'_'+keys[1].replace('_matches','');
}

function getMyLineupSubKey(){
  return MY_SCHOOL_KEY.replace('_matches','');
}

function getOppLineupSubKey(oppScheduleName){
  const oppKey=SCHOOL_KEY_MAP[oppScheduleName];
  if(!oppKey)return null;
  return oppKey.replace('_matches','');
}

// ── Shared lineup Firebase listeners (per loaded assignment) ─────────────────
let _sharedLineupListener=null;
let _sharedLineupRef=null;

function listenSharedLineup(date, oppName){
  // Detach previous listener
  if(_sharedLineupRef&&_sharedLineupListener){
    _sharedLineupRef.off('value',_sharedLineupListener);
    _sharedLineupRef=null; _sharedLineupListener=null;
  }
  const sharedKey=getSharedLineupKey(date, oppName);
  if(!sharedKey||!db)return;
  _sharedLineupRef=db.ref(sharedKey);
  _sharedLineupListener=_sharedLineupRef.on('value',snap=>{
    const val=snap.val()||{};
    const oppSubKey=getOppLineupSubKey(oppName);
    const mySubKey=getMyLineupSubKey();
    // Only reveal opponent lineup once BOTH schools have posted (released)
    const bothReleased=oppSubKey&&val[oppSubKey]&&val[oppSubKey].released&&val[mySubKey]&&val[mySubKey].released;
    if(bothReleased){
      const oppCourts=val[oppSubKey].courts||{};
      const a=window._loadedAssignment;
      if(a){
        // Build oppLineup array from their courts object
        const oppLineup=Object.entries(oppCourts).map(([ct,c])=>({
          court:parseInt(ct),
          player1:c.p1||'',
          player2:c.p2||'',
          jersey1:c.j1||'',
          jersey2:c.j2||''
        }));
        if(!a.oppLineup||JSON.stringify(a.oppLineup)!==JSON.stringify(oppLineup)){
          a.oppLineup=oppLineup;
          // Re-render live scoring to show opponent names
          const container=document.getElementById('live-courts-container');
          if(container&&a.date)renderLiveScoring(a.date,a);
          toast('Both lineups posted - opponent lineup now visible ✓');
        }
      }
    } else {
      // Clear opponent lineup from UI if mutual reveal not met
      const a=window._loadedAssignment;
      if(a&&a.oppLineup){
        a.oppLineup=null;
        const container=document.getElementById('live-courts-container');
        if(container&&a.date)renderLiveScoring(a.date,a);
      }
    }
    // Store draft status for UI
    window._myLineupDraft=val[mySubKey]||null;
    renderSharedLineupPanel(date, oppName, val);
    renderDualSheet(date, oppName, val);
  });
}

function renderSharedLineupPanel(date, oppName, sharedVal){
  const el=document.getElementById('shared-lineup-panel');
  if(!el)return;
  const sharedKey=getSharedLineupKey(date, oppName);
  if(!sharedKey){
    el.style.display='none';return;
  }
  el.style.display='block';
  const mySubKey=getMyLineupSubKey();
  const oppSubKey=getOppLineupSubKey(oppName);
  const myData=sharedVal[mySubKey]||null;
  const oppData=oppSubKey?sharedVal[oppSubKey]:null;
  const myReleased=myData&&myData.released;
  const oppReleased=oppData&&oppData.released;
  const bothReleased=myReleased&&oppReleased;

  let h=`<div style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1.5px;color:var(--blue);margin-bottom:10px;">📋 SHARED LINEUP — vs ${oppName}</div>`;

  // My status
  h+=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">`;
  if(!myData){
    h+=`<span style="font-size:12px;color:var(--gray);">Your lineup: not posted</span>
    <button class="btn btn-primary btn-small" onclick="saveLineupDraft('${date}','${oppName}')">💾 Save Draft</button>`;
  } else if(!myReleased){
    h+=`<span style="font-size:12px;color:var(--gold);font-weight:700;">✓ Draft saved</span>
    <button class="btn btn-primary btn-small" onclick="saveLineupDraft('${date}','${oppName}')">↺ Update Draft</button>
    <button class="btn btn-small" style="background:var(--green);color:#fff;border:none;" onclick="releaseLineup('${date}','${oppName}')">🚀 Release to ${oppName}</button>`;
  } else {
    h+=`<span style="font-size:12px;color:var(--green);font-weight:700;">✓ Lineup posted</span>
    <button class="btn btn-secondary btn-small" onclick="saveLineupDraft('${date}','${oppName}')">↺ Update</button>`;
  }
  h+=`</div>`;

  // Mutual reveal status indicator
  if(oppSubKey){
    if(bothReleased){
      h+=`<div style="font-size:12px;color:var(--green);padding:6px 10px;margin-bottom:6px;background:#ecfdf5;border-radius:6px;font-weight:700;">✓ Both lineups posted - opponent lineup available</div>`;
    } else if(myReleased&&!oppReleased){
      h+=`<div style="font-size:12px;color:var(--gold);padding:6px 10px;margin-bottom:6px;background:#fffbeb;border-radius:6px;font-weight:700;">⏳ Lineup posted - waiting for ${oppName}</div>`;
    } else if(!myReleased&&oppReleased){
      h+=`<div style="font-size:12px;color:var(--gold);padding:6px 10px;margin-bottom:6px;background:#fffbeb;border-radius:6px;font-weight:700;">⏳ ${oppName} has posted - post yours to reveal both lineups</div>`;
    } else if(oppData&&!oppReleased){
      h+=`<div style="font-size:12px;color:var(--gray);padding:6px 0;">⏳ ${oppName} has a draft saved but hasn't released yet.</div>`;
    } else {
      h+=`<div style="font-size:12px;color:var(--gray);padding:6px 0;">⏳ Waiting for ${oppName} to post their lineup...</div>`;
    }
  }

  el.innerHTML=h;
}

function saveLineupDraft(date, oppName){
  const a=window._loadedAssignment;
  if(!a||!db){toast('No assignment loaded');return;}
  const sharedKey=getSharedLineupKey(date, oppName);
  if(!sharedKey)return;
  const mySubKey=getMyLineupSubKey();
  // Build courts map from current assignment
  const courts={};
  (a.courts||[]).forEach(c=>{
    if(!c.court)return;
    const p1=gP(c.p1),p2=gP(c.p2);
    courts[c.court]={
      p1:p1?p1.firstName+' '+p1.lastName:'',
      p2:p2?p2.firstName+' '+p2.lastName:'',
      pid1:c.p1||'',pid2:c.p2||''
    };
  });
  const existing=window._myLineupDraft;
  db.ref(sharedKey+'/'+mySubKey).update({
    courts,
    released:existing?existing.released:false,
    updatedAt:new Date().toISOString(),
    school:MY_SCHOOL_KEY
  });
  toast('Lineup draft saved ✓');
}

function releaseLineup(date, oppName){
  const sharedKey=getSharedLineupKey(date, oppName);
  if(!sharedKey||!db)return;
  const mySubKey=getMyLineupSubKey();
  // Save draft first, then release
  saveLineupDraft(date, oppName);
  setTimeout(()=>{
    db.ref(sharedKey+'/'+mySubKey+'/released').set(true);
    toast('Lineup released to '+oppName+' ✓');
    // Refresh dual sheet
    const sharedKey2=getSharedLineupKey(date,oppName);
    if(sharedKey2&&db)db.ref(sharedKey2).once('value',snap=>renderDualSheet(date,oppName,snap.val()||{}));
  },400);
}

// ── MOVEMENT RESTRICTION MODAL ─────────────────────────────
function showMovementModal(violations){
  const names=violations.map(v=>`${v.name} (Pair ${v.from} → Pair ${v.to})`).join(', ');
  const modal=document.getElementById('movement-reason-modal');
  if(!modal){
    // Create modal
    const m=document.createElement('div');
    m.id='movement-reason-modal';
    m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
    m.innerHTML=`<div style="background:var(--white);border-radius:12px;padding:20px;max-width:400px;width:100%;box-shadow:var(--shadow-lg);">
      <div style="font-family:'Bebas Neue';font-size:18px;letter-spacing:1px;color:var(--red);margin-bottom:8px;">⚠️ MOVEMENT EXCEEDS 1 PAIR</div>
      <div style="font-size:13px;color:var(--charcoal);margin-bottom:12px;" id="mvr-names"></div>
      <div style="font-size:12px;font-weight:700;color:var(--gray);margin-bottom:8px;">REASON FOR MOVEMENT</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;" id="mvr-choices">
        ${['Injury','Performance-based move','Strategic adjustment','Player request','Coach discretion'].map((r,i)=>`<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;"><input type="radio" name="mvr" value="${r}" ${i===0?'checked':''}> ${r}</label>`).join('')}
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" style="flex:1;" onclick="saveWithMovementReason()">Save with Reason</button>
        <button class="btn btn-secondary" onclick="document.getElementById('movement-reason-modal').remove()">Cancel</button>
      </div>
    </div>`;
    document.body.appendChild(m);
  } else {
    modal.style.display='flex';
  }
  const nameEl=document.getElementById('mvr-names');
  if(nameEl)nameEl.textContent='Moving: '+names;
}

function saveWithMovementReason(){
  const modal=document.getElementById('movement-reason-modal');
  const selected=document.querySelector('input[name="mvr"]:checked');
  const reason=selected?selected.value:'Coach discretion';
  const{existingAssign,id,date,type,opp,slots}=window._pendingAssignment||{};
  if(!slots){if(modal)modal.remove();return;}
  if(existingAssign){fbRemove('assignments/'+existingAssign.id);}
  const assignData={id,date,type,opponent:opp||null,courts:slots,
    movementReason:reason,
    movementViolations:(window._pendingViolations||[]).map(v=>({name:v.name,from:v.from,to:v.to})),
    notes:null,createdAt:new Date().toISOString()};
  fbSet('assignments/'+id,assignData);
  notifyLineup(assignData);
  toast('Assignment saved — movement reason logged ✓');
  window._pendingAssignment=null;
  window._pendingViolations=null;
  if(modal)modal.remove();
  renderAssignments();
  // Prompt lineup release
  promptLineupRelease(date, opp);
}

// ── MAKE LINEUP PUBLIC PROMPT ──────────────────────────────
function promptLineupRelease(date, oppName){
  if(!oppName||!date)return;
  const sharedKey=getSharedLineupKey(date,oppName);
  if(!sharedKey)return;
  const modal=document.createElement('div');
  modal.id='lineup-release-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  modal.innerHTML=`<div style="background:var(--white);border-radius:12px;padding:20px;max-width:380px;width:100%;box-shadow:var(--shadow-lg);">
    <div style="font-family:'Bebas Neue';font-size:18px;letter-spacing:1px;color:var(--blue);margin-bottom:8px;">📋 LINEUP READY</div>
    <div style="font-size:13px;color:var(--charcoal);margin-bottom:16px;">Make your lineup public for <strong>${oppName}</strong> on <strong>${fD(date)}</strong>?<br><br><span style="font-size:11px;color:var(--gray);">This shares your lineup with ${oppName} and makes it visible on the dual sheet.</span></div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary" style="flex:1;background:var(--green);border-color:var(--green);" onclick="releaseLineup('${date}','${oppName}');document.getElementById('lineup-release-modal').remove();toast('Lineup made public ✓');">✓ Make Lineup Public</button>
      <button class="btn btn-secondary" onclick="document.getElementById('lineup-release-modal').remove()">Not Yet</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

// ── DUAL SHEET ─────────────────────────────────────────────
function renderDualSheet(date, oppName, sharedVal){
  const el=document.getElementById('dual-sheet-container');
  if(!el)return;
  const mySubKey=getMyLineupSubKey();
  const oppSubKey=getOppLineupSubKey(oppName);
  const myData=(sharedVal||{})[mySubKey]||null;
  const oppData=oppSubKey?(sharedVal||{})[oppSubKey]:null;
  const myReleased=myData&&myData.released;
  const oppReleased=oppData&&oppData.released;
  const bothReleased=myReleased&&oppReleased;
  const myCourts=myData?myData.courts:{};
  const oppCourts=oppData?oppData.courts:{};

  let h=`<div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:2px;margin-bottom:12px;color:var(--charcoal);">FHSAA DUAL MATCH LINEUP</div>`;
  h+=`<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray);margin-bottom:8px;">
    <span>${fD(date)}</span><span>${SC.schoolName} vs ${oppName||'Opponent'}</span>
  </div>`;

  // Header row
  const myStatusTag=myReleased?'<span style="color:var(--green);font-size:10px;"> ✓ POSTED</span>':'';
  const oppStatusTag=bothReleased?'<span style="color:var(--green);font-size:10px;"> ✓ POSTED</span>':(oppReleased?'<span style="color:var(--gold);font-size:10px;"> 🔒 POSTED</span>':'');
  h+=`<div style="display:grid;grid-template-columns:40px 1fr 1fr;gap:4px;margin-bottom:4px;">
    <div></div>
    <div style="text-align:center;font-family:'Bebas Neue';font-size:13px;color:var(--red);letter-spacing:1px;padding:6px;background:var(--red-bg);border-radius:6px;">
      ${SC.schoolName}${myStatusTag}
    </div>
    <div style="text-align:center;font-family:'Bebas Neue';font-size:13px;color:var(--gray);letter-spacing:1px;padding:6px;background:var(--gray-lighter);border-radius:6px;">
      ${oppName||'Opponent'}${oppStatusTag}
    </div>
  </div>`;

  // Pair rows 1-5
  [1,2,3,4,5].forEach(pair=>{
    const myC=myCourts[pair]||null;
    const oppC=oppCourts[pair]||null;
    h+=`<div style="display:grid;grid-template-columns:40px 1fr 1fr;gap:4px;margin-bottom:4px;align-items:center;">
      <div style="font-family:'Bebas Neue';font-size:14px;color:var(--blue);text-align:center;">P${pair}</div>
      <div style="background:var(--off-white);border-radius:6px;padding:8px;min-height:44px;">`;
    if(myC&&(myC.p1||myC.p2)){
      h+=`<div style="font-size:12px;font-weight:700;">${myC.p1||'—'}</div>`;
      h+=`<div style="font-size:12px;font-weight:700;">${myC.p2||'—'}</div>`;
    } else {
      h+=`<div style="font-size:11px;color:var(--gray);font-style:italic;">Not set</div>`;
    }
    h+=`</div><div style="background:var(--off-white);border-radius:6px;padding:8px;min-height:44px;">`;
    if(bothReleased&&oppC&&(oppC.p1||oppC.p2)){
      h+=`<div style="font-size:12px;font-weight:700;">${oppC.p1||'—'}</div>`;
      h+=`<div style="font-size:12px;font-weight:700;">${oppC.p2||'—'}</div>`;
    } else if(!oppSubKey){
      h+=`<button class="btn btn-secondary btn-small" style="font-size:10px;" onclick="triggerOppLineupPhoto()">📸 Scan Form</button>`;
    } else if(oppReleased&&!bothReleased){
      h+=`<div style="font-size:11px;color:var(--gold);font-style:italic;">🔒 Hidden until you post</div>`;
    } else {
      h+=`<div style="font-size:11px;color:var(--gray);font-style:italic;">Waiting...</div>`;
    }
    h+=`</div></div>`;
  });

  // Movement reason note if present
  const myAssign=Object.values(D.assignments||{}).find(a=>a.date===date&&a.type==='gameday');
  if(myAssign&&myAssign.movementReason){
    h+=`<div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:6px;font-size:11px;color:#92400e;">
      📝 Movement note: ${myAssign.movementReason}
    </div>`;
  }

  el.innerHTML=h;
}

function triggerOppLineupPhoto(){
  // Reuse existing scan input
  const input=document.getElementById('scan-file');
  if(input)input.click();
  else toast('Use the Scan Court Sheet button above to photograph the opponent form');
}

// ── LINEUP HISTORY SEARCH ──────────────────────────────────
function filterPastLineups(){
  const dateVal=(document.getElementById('lineup-search-date')?.value||'').trim();
  const oppVal=(document.getElementById('lineup-search-opp')?.value||'').toLowerCase().trim();
  const playerVal=(document.getElementById('lineup-search-player')?.value||'').toLowerCase().trim();
  renderPastLineups(dateVal, oppVal, playerVal);
}

async function changeCoachPin(){
  const curEl=document.getElementById('pin-current');
  const newEl=document.getElementById('pin-new');
  const statusEl=document.getElementById('pin-change-status');
  const cur=curEl?curEl.value.trim():'';
  const newPin=newEl?newEl.value.trim():'';
  if(!newPin||newPin.length<4){if(statusEl)statusEl.textContent='PIN must be at least 4 digits';return;}
  let session=null; try{session=JSON.parse(sessionStorage.getItem('csCoachSession'));}catch(e){}
  const token=session&&session.token;
  if(!token){if(statusEl)statusEl.textContent='';toast('Session expired, log in again');logout();return;}
  try{
    const r=await fetch(AUTH_WORKER+'/auth/coach-set-pin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbRoot:DB_ROOT,token:token,currentPin:cur,newPin:newPin})});
    if(r.status===403){if(statusEl)statusEl.textContent='';toast('Session expired, log in again');logout();return;}
    const j=await r.json().catch(()=>null);
    if(j&&j.ok){
      if(statusEl)statusEl.textContent='PIN updated ✓';
      if(curEl)curEl.value='';if(newEl)newEl.value='';
      setTimeout(()=>{if(statusEl)statusEl.textContent='';},2000);
    }else if(j&&j.code==='bad_pin'){
      if(statusEl)statusEl.textContent='Current PIN is incorrect';
    }else{
      if(statusEl)statusEl.textContent='Could not update PIN. Try again.';
    }
  }catch(e){
    if(statusEl)statusEl.textContent='Could not reach the server. Try again.';
  }
}

const COURTS=[1,2,3,4,5,6,7,8],CL={1:'PG 1',2:'PG 2',3:'PG 3',4:'PG 4',5:'PG 5',6:'Exhib',7:'Exhib',8:'Exhib'};
const EXHIBITION_COURTS=new Set([6,7,8]);
const CO={SR:0,JR:1,SO:2,FR:3};
let db=null;

const DEF_P=[
  {id:'p01',firstName:'Riley',lastName:'Knipple',classYear:'SR',court:1,jersey:9},
  {id:'p02',firstName:'Destyni',lastName:'Zuema',classYear:'SR',court:1,jersey:5},
  {id:'p03',firstName:'Aubrey',lastName:'Brown',classYear:'JR',court:3,jersey:10},
  {id:'p04',firstName:'Madi',lastName:'Bunker',classYear:'JR',court:3,jersey:2},
  {id:'p05',firstName:'Eden',lastName:'Codd',classYear:'JR',court:2,jersey:7},
  {id:'p06',firstName:'Kendall',lastName:'Cruse',classYear:'JR',court:2,jersey:8},
  {id:'p07',firstName:'Aubri',lastName:'Moore',classYear:'JR',court:3,jersey:13},
  {id:'p08',firstName:'Riley',lastName:'Perezluha',classYear:'JR',court:1,jersey:3},
  {id:'p09',firstName:'Lizzie',lastName:'Roader',classYear:'JR',court:3,jersey:17},
  {id:'p10',firstName:'Bentley',lastName:'Barnard',classYear:'SO',court:1,jersey:6},
  {id:'p11',firstName:'Jazmin',lastName:'Burdick',classYear:'SO',court:2,jersey:4},
  {id:'p12',firstName:'Madalynn',lastName:'Edenfield',classYear:'SO',court:3,jersey:11},
  {id:'p13',firstName:'Jordyn',lastName:'Russell',classYear:'SO',court:1,jersey:15},
  {id:'p14',firstName:'Leilani',lastName:'Winfrey',classYear:'SO',court:3,jersey:18},
  {id:'p15',firstName:'Salem',lastName:'Ehrhardt',classYear:'FR',court:2,jersey:12},
  {id:'p16',firstName:'Reagan',lastName:'Giles',classYear:'FR',court:2,jersey:1}
];
const DEF_M=[
  {id:'m01',date:'2026-02-06',court:3,team1:['p07','p04'],team2:['p14','p03'],score1:21,score2:3},
  {id:'m02',date:'2026-02-06',court:1,team1:['p01','p10'],team2:['p08','p13'],score1:21,score2:16},
  {id:'m03',date:'2026-02-06',court:2,team1:['p05','p06'],team2:['p15','p16'],score1:21,score2:15},
  {id:'m04',date:'2026-02-06',court:3,team1:['p09','p14'],team2:['p03','p07'],score1:21,score2:4},
  {id:'m05',date:'2026-02-06',court:1,team1:['p01','p08'],team2:['p02','p10'],score1:21,score2:13},
  {id:'m06',date:'2026-02-06',court:2,team1:['p16','p06'],team2:['p05','p12'],score1:21,score2:13},
  {id:'m07',date:'2026-02-06',court:3,team1:['p09','p12'],team2:['p14','p04'],score1:21,score2:8},
  {id:'m08',date:'2026-02-06',court:1,team1:['p02','p08'],team2:['p13','p10'],score1:21,score2:18},
  {id:'m09',date:'2026-02-06',court:2,team1:['p15','p04'],team2:['p05','p06'],score1:21,score2:15}
];

let D={players:[],matches:[],planned:[],gamedays:[],scrimmages:[],schedule:[],standings:{},goals:{},assignments:{},duals:[],opponents:{},liveScoring:{},quizScores:{},tierRequests:{},broadcasts:{},threads:{},tryoutSessions:{},tryoutAttendance:{},dues:{},practiceSchedule:{},travel:{},standing:{}};
// Active competitive season. Config leaf at DB_ROOT/config/currentSeasonId; defaults to the current year, overwritten by the init read below if a stored value exists. Result creates are stamped with this via fbSetResult.
let _currentSeasonId=(new Date()).getFullYear().toString();
let profilesData={}; // from leon_queens node for AI context
let pgdNotes={}; // player self-notes per date: pgdNotes[pid][date]
let _autoLoginDone=false;

// ============================================================
// FIREBASE
// ============================================================
function initFB(){
  // Admin cross-school entry: ?csadmin=<token> stores the worker-issued session and enters
  // coach mode directly, then strips the param. Skips the normal login/autoLogin path.
  try{
    const _adminTok=new URLSearchParams(location.search).get('csadmin');
    if(_adminTok){
      history.replaceState(null,'',location.pathname+location.hash);
      adminEnterSchool(_adminTok);
      _autoLoginDone=true;
    }
  }catch(e){}
  // Door check-in deep link: hold ?tryout=<sid> and strip it; recorded once the member is logged in.
  try{captureTryoutParam();}catch(e){}
  if(SC.demoMode){
    // DEMO MODE: hydrate D from _DEMO fixture, no Firebase touched.
    D.players     = JSON.parse(JSON.stringify(_DEMO.players));
    // Demo result fixtures are the 2026 season; stamp so they pass the season filter (_activeSeason() returns '2026' in demo mode).
    const _stampSeason=arr=>JSON.parse(JSON.stringify(arr)).map(r=>({...r,seasonId:r.seasonId||'2026'}));
    D.duals       = _stampSeason(_DEMO.duals);
    D.schedule    = _stampSeason(_DEMO.schedule);
    D.standings   = JSON.parse(JSON.stringify(_DEMO.standings));
    D.assignments = JSON.parse(JSON.stringify(_DEMO.assignments));
    D.opponents   = JSON.parse(JSON.stringify(_DEMO.opponents));
    D.gamedays    = _stampSeason(_DEMO.gamedays);
    D.scrimmages  = _stampSeason(_DEMO.scrimmages);
    D.matches     = _stampSeason(_DEMO.matches);
    D.tierRequests= {};
    // Layer 5a demo seed: a couple of starter messages across channels so switching shows content. Authored by existing demo player ids.
    D.chat        = {
      allclub:{ seed_ac1:{authorId:'sd01',text:'Welcome to the All Club channel. Updates for everyone land here.',createdAt:Date.now()-7200000} },
      gold:{ seed_g1:{authorId:'sd05',text:'Gold squad, great work at practice today.',createdAt:Date.now()-3600000} },
      garnet:{ seed_gar1:{authorId:'sd09',text:'Garnet squad, proud of how we battled today. Keep showing up and we keep climbing.',createdAt:Date.now()-1800000} }
    };
    D.goals       = JSON.parse(JSON.stringify(_DEMO.goals));
    D.liveScoring = JSON.parse(JSON.stringify(_DEMO.liveScoring));
    profilesData  = {
      skills:     JSON.parse(JSON.stringify(_DEMO.skills)),
      jumpTests:  JSON.parse(JSON.stringify(_DEMO.jumpTests)),
      starDrills: JSON.parse(JSON.stringify(_DEMO.starDrills)),
      // Recruiting identity fields for the demo, on the profiles node so the profile modal (pp = profilesData.players[pid]) resolves.
      players: {
        sd01: { height: "5'11\"", reach: "7'8\"",  gradYear: 2027, position: "split", preferredSide: "L", dominantHand: "R" },
        sd03: { height: "6'0\"",  reach: "7'10\"", gradYear: 2028, position: "block", preferredSide: "R", dominantHand: "R" }
      }
    };
    // Demo-only: shift all three same-day duals to today's date (td(), the same
    // YYYY-MM-DD the Live Score Entry panel gates on) so all three appear as
    // loadable TODAY rows. Mutates the hydrated copies only; the _DEMO source
    // literals stay static.
    var _t = td();
    if(D.assignments && D.assignments.asg01) D.assignments.asg01.date = _t;
    if(D.assignments && D.assignments.asg02) D.assignments.asg02.date = _t;
    if(D.assignments && D.assignments.asg03) D.assignments.asg03.date = _t;
    setSS(true);
    refreshCurrent();
    if(!_autoLoginDone){_autoLoginDone=true;autoLogin();}
    return;
  }
  try{if(!firebase.apps.length)firebase.initializeApp(FB_CONFIG);
    db=firebase.database();setSS(true);listenData();
  }catch(e){console.error(e);setSS(false);}
}
function setSS(on){const d=document.getElementById('sync-dot');d.className='sync-dot '+(on?'online':'offline');d.title=on?'Connected':'Offline';}
function listenData(){if(!db)return;
  db.ref(DB_ROOT+'/config/currentSeasonId').once('value',function(snap){if(snap.val())_currentSeasonId=snap.val();});
  db.ref(SC.dbRoots.profiles+'/quizScores').on('value',snap=>{D.quizScores=snap.val()||{};if(currentRole==='player')renderPlayerPortal();});
  db.ref(DB_ROOT).on('value',snap=>{
    const val=snap.val();
    const hasP=val&&val.players&&Object.keys(val.players).length>0;
    if(hasP){
      D.players=Object.values(val.players);
      D.matches=val.matches?Object.values(val.matches):[];
      D.planned=val.planned?Object.values(val.planned):[];
      D.gamedays=val.gamedays?Object.values(val.gamedays):[];
      D.scrimmages=val.scrimmages?Object.values(val.scrimmages):[];
      D.schedule=val.schedule?Object.values(val.schedule):[];
      D.standings=val.standings||{};
      D.goals=val.goals||{};
      D.assignments=val.assignments||{};
      D.duals=val.duals?Object.values(val.duals):[];
      D.opponents=val.opponents||{};
      D.tierRequests=val.tier_requests||{};
      D.chat=val.chat||{};
    }else{
      // DEF_P/DEF_M are the Leon roster. Only fall back to them on the Leon node when auto-seed is on; every other empty node starts empty (no phantom Leon roster in RAM). Matches the seedDB guard.
      const _seedLeon=(DB_ROOT==='leon_queens_matches' && SC.allowAutoSeed);
      D.players=_seedLeon?JSON.parse(JSON.stringify(DEF_P)):[];
      D.matches=_seedLeon?JSON.parse(JSON.stringify(DEF_M)):[];
      D.planned=[];D.gamedays=[];D.scrimmages=[];D.duals=[];D.chat={};
      seedDB();
    }
    refreshCurrent();
    if(!_autoLoginDone){_autoLoginDone=true;autoLogin();}
  },err=>{console.error(err);setSS(false);});
  db.ref(SC.dbRoots.passwords).on('value',s=>{passwords=s.val()||{};});
  db.ref(DB_ROOT+'/player_notes').on('value',s=>{
    const all=s.val()||{};
    // Restructure from [date][pid] → pgdNotes[pid][date]
    pgdNotes={};
    Object.entries(all).forEach(([date,players])=>{
      Object.entries(players||{}).forEach(([pid,notes])=>{
        if(!pgdNotes[pid])pgdNotes[pid]={};
        pgdNotes[pid][date]=notes;
      });
    });
  });
  db.ref(DB_ROOT+'/opponents').on('value',s=>{
    D.opponents=s.val()||{};
    if(currentRole==='coach'){const t=document.querySelector('.tab.active');if(t&&t.dataset.tab==='scouts')renderScouts();}
    if(currentRole==='player')renderPlayerScouts();
  });
  db.ref(DB_ROOT+'/broadcasts').on('value',s=>{
    D.broadcasts=s.val()||{};
    if(currentRole==='player')renderPlayerBroadcasts();
    if(currentRole==='coach'){const t=document.querySelector('.tab.active');if(t&&t.dataset.tab==='communicate')renderHsBroadcastList();}
  });
  // Exec/member two-way messaging threads (club only). Re-render whichever view is showing.
  db.ref(DB_ROOT+'/threads').on('value',s=>{
    D.threads=s.val()||{};
    if(currentRole==='coach'){const t=document.querySelector('.tab.active');if(t&&t.dataset.tab==='inbox'&&typeof renderExecInbox==='function')renderExecInbox();}
    if(currentRole==='player'){if(typeof updateMemberMsgBadge==='function')updateMemberMsgBadge();const mp=document.getElementById('pp-panel-messages');if(mp&&mp.classList.contains('active')&&typeof renderMemberMessages==='function')renderMemberMessages();}
  });
  // Tryout sessions and attendance (recruiting). Live-update the exec view so a scanned door
  // check-in appears without a manual refresh; also drain any pending ?tryout once sessions load.
  db.ref(DB_ROOT+'/tryoutSessions').on('value',s=>{
    D.tryoutSessions=s.val()||{};
    _tryoutSessionsLoaded=true;
    processPendingTryout();
    _maybeRenderRecruiting();
  });
  db.ref(DB_ROOT+'/tryoutAttendance').on('value',s=>{
    D.tryoutAttendance=s.val()||{};
    _maybeRenderRecruiting();
  });
  // Club dues (exec only). Re-render Accounting live, but never while the exec is typing the amount.
  db.ref(DB_ROOT+'/dues').on('value',s=>{
    D.dues=s.val()||{};
    if(currentRole!=='coach')return;
    const pane=document.getElementById('tab-accounting'); if(!pane)return;
    const ae=document.activeElement; if(ae&&ae.id==='acct-amount')return;
    if(typeof renderAccounting==='function')renderAccounting();
  });
  // Weekly practice schedule (club). Members see their own squad card; execs see both. Do not
  // clobber an exec who is mid-edit (any ps-* control focused).
  db.ref(DB_ROOT+'/practiceSchedule').on('value',s=>{
    D.practiceSchedule=s.val()||{};
    if(currentRole==='player'){ renderPlayerPortal(); return; }
    if(currentRole==='coach'){
      const pane=document.getElementById('tab-teamanalysis'); if(!pane)return;
      const ae=document.activeElement; if(ae&&ae.id&&ae.id.indexOf('ps-')===0)return;
      if(typeof renderTeamAnalysis==='function')renderTeamAnalysis();
    }
  });
  // Travel tournaments (club). Loaded for members too (member side, pass 2). Re-render the exec
  // Travel tab live, but never while an exec is mid-edit (any tv-* field focused).
  db.ref(DB_ROOT+'/travel').on('value',s=>{
    D.travel=s.val()||{};
    if(currentRole==='player'){
      // Member Travel panel re-renders live (a teammate's invite/accept/withdraw shows up),
      // but never while the member is mid-edit (any mtv-* control focused, e.g. the seats box).
      const tp=document.getElementById('pp-panel-travel');
      const ae=document.activeElement; if(ae&&ae.id&&ae.id.indexOf('mtv-')===0)return;
      if(tp&&tp.classList.contains('active')&&typeof renderMemberTravel==='function')renderMemberTravel();
      return;
    }
    if(currentRole!=='coach')return;
    const pane=document.getElementById('tab-travel'); if(!pane)return;
    const ae=document.activeElement; if(ae&&ae.id&&ae.id.indexOf('tv-')===0)return;
    if(typeof renderTravel==='function')renderTravel();
  });
  // Good standing (club). Exec-set at standing/{memberId}; absent = good standing. A member reads only
  // their own (shown in their Travel panel); the exec sees any member's in the coach player modal.
  db.ref(DB_ROOT+'/standing').on('value',s=>{
    D.standing=s.val()||{};
    if(currentRole==='player'){
      const tp=document.getElementById('pp-panel-travel');
      if(tp&&tp.classList.contains('active')&&typeof renderMemberTravel==='function')renderMemberTravel();
    }
  });
  db.ref(SC.dbRoots.profiles).on('value',s=>{
    profilesData=s.val()||{};
    // Re-render player portal if active (to update rankings with skills/drills/verts)
    if(currentRole==='player')renderPlayerPortal();
    if(currentRole==='coach'){const t=document.querySelector('.tab.active');if(t&&t.dataset.tab==='goals')renderCoachGoals();}
  });
  db.ref('.info/connected').on('value',s=>{setSS(s.val()===true);});
  db.ref('school_key_map').on('value', s => {
    const m = s.val();
    if(m && typeof m === 'object'){
      SCHOOL_KEY_MAP = Object.assign({}, SCHOOL_KEY_MAP, m);
    }
  });
  // Firebase-hosted logo: when the config flags logo:'firebase', read the actual PNG data
  // URL from courtsense_school_logos/{slug} and swap it into the three logo imgs. slug is
  // derived from DB_ROOT (provisioning set base = slug with dashes -> underscores). Setting
  // src + clearing display undoes the onerror hide; the emoji fallback span (already added)
  // is removed so only the real logo shows.
  if(SC.logo === 'firebase'){
    const _base = (SC.dbRoots && SC.dbRoots.matches) ? SC.dbRoots.matches.replace(/_matches$/,'') : '';
    const _slug = _base.replace(/_/g,'-');
    if(_slug){
      db.ref('courtsense_school_logos/'+_slug).once('value', s => {
        const url = s.val();
        if(typeof url === 'string' && url.indexOf('data:image/png;base64,') === 0){
          ['cs-logo-login','cs-logo-header','cs-logo-fans'].forEach(id => {
            const el = document.getElementById(id);
            if(el){
              el.src = url;
              el.style.display = '';
              const nx = el.nextElementSibling;
              if(nx && nx.tagName === 'SPAN') nx.remove();
            }
          });
        }
      });
    }
  }
  db.ref(DB_ROOT+'/live_scoring').on('value',snap=>{
    D.liveScoring=snap.val()||{};
    var fo=document.getElementById('school-fans-overlay');
    if(fo&&fo.style.display!=='none')renderFans();
    const today=td();
    Object.entries(lsView()).forEach(([idx,live])=>{
      if(!live||live.date!==today)return;
      // Coach view
      if(currentRole==='coach'&&window._loadedAssignment){
        const usEl=document.getElementById('ls-us-'+idx);
        const themEl=document.getElementById('ls-them-'+idx);
        if(usEl&&themEl){
          if(usEl.tagName==='INPUT'){usEl.value=live.us;}else{usEl.textContent=live.us;}
          if(themEl.tagName==='INPUT'){themEl.value=live.them;}else{themEl.textContent=live.them;}
          const card=document.getElementById('lc-card-'+idx);
          if(card&&live.scoredBy){
            let lbl=card.querySelector('.live-scored-by');
            if(!lbl){lbl=document.createElement('div');lbl.className='live-scored-by';lbl.style.cssText='font-size:10px;color:var(--gray);font-style:italic;text-align:center;margin-top:4px;';card.querySelector('.live-score-row')?.after(lbl);}
            lbl.textContent='✎ '+live.scoredBy+' keeping score';
          }
        }
      }
      // Player view — mirror coach view: update counters + show who's scoring
      if(currentRole==='player'){
        const usEl=document.getElementById('pp-us-'+idx);
        const themEl=document.getElementById('pp-them-'+idx);
        if(usEl&&themEl){
          if(usEl.tagName==='INPUT'){usEl.value=live.us;}else{usEl.textContent=live.us;}
          if(themEl.tagName==='INPUT'){themEl.value=live.them;}else{themEl.textContent=live.them;}
          const card=document.getElementById('pp-lc-'+idx);
          if(card&&live.scoredBy){
            let lbl=card.querySelector('.live-scored-by');
            if(!lbl){lbl=document.createElement('div');lbl.className='live-scored-by';lbl.style.cssText='font-size:10px;color:var(--gray);font-style:italic;text-align:center;margin-top:4px;';card.querySelector('.live-score-row')?.after(lbl);}
            lbl.textContent='✎ '+live.scoredBy+' keeping score';
          }
        }
      }
    });
  });
}
function seedDB(){if(!db || !SC.allowAutoSeed)return;
  if(DB_ROOT !== 'leon_queens_matches') return; // DEF_P is the Leon roster; never seed it into any other school node
  const u={};
  DEF_P.forEach(p=>{u[DB_ROOT+'/players/'+p.id]=JSON.parse(JSON.stringify(p));u[SC.dbRoots.profiles+'/players/'+p.id]=JSON.parse(JSON.stringify(p));});
  DEF_M.forEach(m=>{u[DB_ROOT+'/matches/'+m.id]=JSON.parse(JSON.stringify(m));});
  db.ref().update(u);
}
// Demo-mode (db===null) in-memory persistence. Mirrors how the DB_ROOT listener
// maps each node into the D store, so demo edits made through fbSet/fbRemove
// survive for the session and downstream reads (resMatchesCourt, renderers) see
// the same array-vs-object shapes as live mode. Live Firebase writes never reach
// this path; it runs only when db is null. Direct db.ref writes bypass it (handled separately).
const _DEMO_NODES={
  players:{key:'players',arr:true},   matches:{key:'matches',arr:true},
  planned:{key:'planned',arr:true},   gamedays:{key:'gamedays',arr:true},
  scrimmages:{key:'scrimmages',arr:true}, schedule:{key:'schedule',arr:true},
  duals:{key:'duals',arr:true},
  standings:{key:'standings',arr:false}, goals:{key:'goals',arr:false},
  assignments:{key:'assignments',arr:false}, opponents:{key:'opponents',arr:false},
  chat:{key:'chat',arr:false}, tier_requests:{key:'tierRequests',arr:false}
};
// Set val at a nested key path inside obj, creating intermediate objects as needed.
function _setDeep(obj,keys,val){
  if(!keys.length)return;
  let o=obj;
  for(let i=0;i<keys.length-1;i++){const k=keys[i];if(!o[k]||typeof o[k]!=='object')o[k]={};o=o[k];}
  o[keys[keys.length-1]]=val;
}
// Delete the leaf key at a nested key path inside obj.
function _delDeep(obj,keys){
  if(!keys.length)return;
  let o=obj;
  for(let i=0;i<keys.length-1;i++){const k=keys[i];if(!o[k]||typeof o[k]!=='object')return;o=o[k];}
  delete o[keys[keys.length-1]];
}
function _demoWrite(path,val){
  if(val===null){_demoRemove(path);return;}
  const seg=String(path).split('/').filter(s=>s.length);
  const node=_DEMO_NODES[seg[0]];
  if(!node)return;
  if(node.arr){
    if(!Array.isArray(D[node.key]))D[node.key]=[];
    const arr=D[node.key];
    const id=seg[1];
    if(id===undefined)return;
    if(seg.length===2){
      // Full-object upsert on node/id: replace the element whose .id matches, else push.
      const obj=Object.assign({},val,{id:(val&&val.id!==undefined)?val.id:id});
      const i=arr.findIndex(x=>x&&x.id===id);
      if(i>=0)arr[i]=obj;else arr.push(obj);
    }else{
      // Deeper field set on node/id/field...: create the record first if missing.
      let rec=arr.find(x=>x&&x.id===id);
      if(!rec){rec={id:id};arr.push(rec);}
      _setDeep(rec,seg.slice(2),val);
    }
  }else{
    if(!D[node.key]||typeof D[node.key]!=='object')D[node.key]={};
    _setDeep(D[node.key],seg.slice(1),val);
  }
  refreshCurrent();
}
function _demoRemove(path){
  const seg=String(path).split('/').filter(s=>s.length);
  const node=_DEMO_NODES[seg[0]];
  if(!node)return;
  if(node.arr){
    if(!Array.isArray(D[node.key]))return;
    const id=seg[1];
    if(id===undefined)return;
    if(seg.length===2){
      // Remove the whole record.
      const i=D[node.key].findIndex(x=>x&&x.id===id);
      if(i>=0)D[node.key].splice(i,1);
    }else{
      // Delete a nested field on the record.
      const rec=D[node.key].find(x=>x&&x.id===id);
      if(rec)_delDeep(rec,seg.slice(2));
    }
  }else{
    if(!D[node.key]||typeof D[node.key]!=='object')return;
    _delDeep(D[node.key],seg.slice(1));
  }
  refreshCurrent();
}
function fbSet(path,val){if(db)db.ref(DB_ROOT+'/'+path).set(val);else _demoWrite(path,val);}
function fbRemove(path){if(db)db.ref(DB_ROOT+'/'+path).remove();else _demoRemove(path);}
// Result-create writer: stamps seasonId onto full-object result creates (matches/duals/gamedays/scrimmages/schedule).
// Preserves an explicit seasonId if the object already carries one. fbSet stays generic for non-result writes.
function fbSetResult(node,id,obj){fbSet(node+'/'+id,Object.assign({},obj,{seasonId:obj.seasonId||_currentSeasonId}));}
// Active competitive season for read-side filtering. In demo mode the fixtures are the 2026 season regardless of wall-clock year.
function _activeSeason(){ return SC.demoMode ? '2026' : _currentSeasonId; }
// A result belongs to the active season if stamped with it. null-tolerant as belt-and-suspenders: live data is fully backfilled, so an unstamped record is only a straggler and should still show in the active season rather than vanish.
function inSeason(r){ return !!r && (r.seasonId===_activeSeason() || r.seasonId==null); }
// Distinct seasonIds present across every result node, newest first. Always includes the active season so a fresh season shows even before its first result. Today this is just ['2026']; it grows a season per year automatically.
function allSeasonIds(){
  const s=new Set();
  [D.schedule,D.matches,D.gamedays,D.duals,D.scrimmages].forEach(a=>(a||[]).forEach(r=>{if(r&&r.seasonId)s.add(r.seasonId);}));
  if(!s.size)s.add(_activeSeason());
  return [...s].sort().reverse();
}

// ============================================================
// UTILS
// ============================================================
function gP(id){return D.players.find(p=>p.id===id);}
function pN(id){const p=gP(id);if(!p)return'?';return D.players.filter(x=>x.firstName===p.firstName).length>1?p.firstName+' '+p.lastName.charAt(0)+'.':p.firstName;}
function pFull(id){const p=gP(id);return p?p.firstName+' '+p.lastName:'?';}
function fD(s){if(!s)return'';return new Date(s+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function td(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function gi(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
// Display-only court badge. Shows an en dash for an unplaced (null/undefined/blank/NaN)
// court and never emits a court-null class. prefix is an optional label like 'PG'.
function courtBadge(c,prefix){
  const has=c!=null&&c!==''&&!(typeof c==='number'&&isNaN(c));
  return '<span class="court-badge'+(has?' court-'+c:'')+'">'+(has?((prefix?prefix+' ':'')+c):'–')+'</span>';
}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function arrEq(a,b){if(!a||!b||a.length!==b.length)return false;const sa=[...a].sort(),sb=[...b].sort();return sa.every((v,i)=>v===sb[i]);}
function pmClass(v){return v>0?'pm-positive':v<0?'pm-negative':'pm-zero';}
function pmStr(v){return(v>0?'+':'')+v;}

// Queens stats (Leon vs Leon — each side gets their own score)
function queensStats(pid,matches,opts){
  if(!opts||!opts.allSeasons) matches=(matches||[]).filter(inSeason);
  let w=0,l=0,pf=0,pa=0;
  matches.forEach(m=>{
    const t1=(m.team1||[]).includes(pid),t2=(m.team2||[]).includes(pid);
    if(!t1&&!t2)return;
    if(t1){pf+=m.score1||0;pa+=m.score2||0;(m.score1||0)>(m.score2||0)?w++:l++;}
    else{pf+=m.score2||0;pa+=m.score1||0;(m.score2||0)>(m.score1||0)?w++:l++;}
  });
  return{wins:w,losses:l,diff:pf-pa,pf,pa,pct:(w+l)>0?(w/(w+l)*100):0,gp:w+l};
}

// External match stats (game day or scrimmage — both partners share score)
function extStats(pid,matchList,opts){
  if(!opts||!opts.allSeasons) matchList=(matchList||[]).filter(inSeason);
  let setsW=0,setsL=0,pf=0,pa=0,k=0,b=0,a=0,se=0,re=0,he=0,de=0,totalSets=0,matchesPlayed=0,matchesWon=0,matchesLost=0;
  matchList.forEach(m=>{
    if(!(m.pair||[]).includes(pid))return;
    matchesPlayed++;
    let localW=0,localL=0;
    (m.sets||[]).forEach(s=>{
      const su=s.scoreUs||0,st=s.scoreThem||0;
      pf+=su;pa+=st;totalSets++;
      su>st?setsW++:setsL++;
      su>st?localW++:localL++;
      const ps=s.stats?.[pid]||{};
      k+=ps.k||0;b+=ps.b||0;a+=ps.a||0;se+=ps.se||0;re+=ps.re||0;he+=ps.he||0;de+=ps.de||0;
    });
    // Best 2 of 3: a played match (at least one set) is a win if the pair won more sets than it lost.
    if(localW+localL>0) (localW>localL?matchesWon++:matchesLost++);
  });
  return{setsWon:setsW,setsLost:setsL,diff:pf-pa,pf,pa,sets:totalSets,matches:matchesPlayed,matchesWon,matchesLost,k,b,a,se,re,he,de};
}

// Combined stats for Players tab "All" view.
// sel undefined -> active season (unchanged default). sel={season:S} -> that season only. sel={allSeasons:true} -> all-time.
function combinedStats(pid, sel){
  let mArr=D.matches, gArr=D.gamedays, sArr=D.scrimmages, opts;
  if(sel && sel.allSeasons){ opts={allSeasons:true}; }
  else if(sel && sel.season){ const S=sel.season; mArr=(D.matches||[]).filter(r=>r.seasonId===S); gArr=(D.gamedays||[]).filter(r=>r.seasonId===S); sArr=(D.scrimmages||[]).filter(r=>r.seasonId===S); opts={allSeasons:true}; }
  const qs=queensStats(pid,mArr,opts);
  const gs=extStats(pid,gArr,opts);
  const ss=extStats(pid,sArr,opts);
  return{
    qWins:qs.wins,qLosses:qs.losses,qDiff:qs.diff,qGP:qs.gp,
    gdSets:gs.sets,gdDiff:gs.diff,gdK:gs.k,gdB:gs.b,gdA:gs.a,gdSE:gs.se,gdRE:gs.re,gdHE:gs.he,gdDE:gs.de,
    scSets:ss.sets,scDiff:ss.diff,
    totalDiff:qs.diff+gs.diff+ss.diff,
    totalGames:qs.gp+gs.matches+ss.matches
  };
}

function fillSel(ids,courtHint){
  const sorted=[...D.players].sort((a,b)=>{
    if(courtHint){if(a.court==courtHint&&b.court!=courtHint)return-1;if(b.court==courtHint&&a.court!=courtHint)return 1;}
    return a.court-b.court||a.lastName.localeCompare(b.lastName);
  });
  ids.forEach(selId=>{const sel=document.getElementById(selId);if(!sel)return;const cur=sel.value;
    sel.innerHTML='<option value="">Select Player</option>';let last=null;
    sorted.forEach(p=>{const g=courtHint?(p.court==courtHint?'a':'b'):'ct'+p.court;
      if(g!==last&&last!==null){const o=document.createElement('option');o.disabled=true;o.textContent='───────';sel.appendChild(o);}last=g;
      const o=document.createElement('option');o.value=p.id;o.textContent=p.firstName+' '+p.lastName+' ('+p.classYear+')';sel.appendChild(o);
    });if(cur)sel.value=cur;});
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDash(){
  const _dr=getDualRecord();
  const _drEl=document.getElementById('dash-dual-rec');if(_drEl)_drEl.textContent=_dr.w+'-'+_dr.l;
  const _crEl=document.getElementById('dash-courts-rec');if(_crEl)_crEl.textContent=_dr.cw+'-'+_dr.cl;
  const _srEl=document.getElementById('dash-sets-rec');if(_srEl)_srEl.textContent=_dr.sw+'-'+_dr.sl;
  // Season-scoped result views for the dashboard summary.
  const _sMatches=D.matches.filter(inSeason), _sGamedays=D.gamedays.filter(inSeason), _sScrimmages=D.scrimmages.filter(inSeason);
  const totalQM=_sMatches.length;

  // Game Day sets
  let gdSW=0,gdSL=0,gdPF=0,gdPA=0,gdDays=new Set(),gdMatches=0;
  _sGamedays.forEach(m=>{gdDays.add(m.date);gdMatches++;
    (m.sets||[]).forEach(s=>{const su=s.scoreUs||0,st=s.scoreThem||0;gdPF+=su;gdPA+=st;su>st?gdSW++:gdSL++;});
  });
  const _gdRecEl=document.getElementById('dash-gd-rec');if(_gdRecEl)_gdRecEl.textContent=gdSW+'-'+gdSL;

  // Scrimmage sets
  let scSW=0,scSL=0;
  _sScrimmages.forEach(m=>{(m.sets||[]).forEach(s=>{(s.scoreUs||0)>(s.scoreThem||0)?scSW++:scSL++;});});

  // Total match days
  const allDates=new Set();
  _sMatches.forEach(m=>allDates.add(m.date));
  _sGamedays.forEach(m=>allDates.add(m.date));
  _sScrimmages.forEach(m=>allDates.add(m.date));

  // (gd-overview/table/top-performers removed — elements not in HTML)
    // Season Schedule
  renderSchedule();
  // Standings
  renderStandings();
  // Show add form only for coaches
  const addEl=document.getElementById('dash-schedule-add');
  if(addEl)addEl.style.display=currentRole==='coach'?'block':'none';
}

function renderSchedule(){
  const games=[...D.schedule.filter(inSeason)].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(!games.length){document.getElementById('dash-schedule').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No schedule data yet.</div>';return;}
  const today=td();
  let wins=0,losses=0;
  games.forEach(g=>{if(g.scoreUs!=null&&g.scoreThem!=null){if(g.type==='scrimmage')return;g.scoreUs>g.scoreThem?wins++:losses++;}});
  let h=`<div style="display:flex;gap:12px;margin-bottom:14px;">
    <div style="font-family:'Bebas Neue';font-size:22px;color:var(--green);">${wins}-${losses}</div>
    <div style="font-size:12px;color:var(--gray);align-self:center;">Season Record (Courts W-L)</div></div>`;
  games.forEach(g=>{
    const played=g.scoreUs!=null&&g.scoreThem!=null&&g.scoreUs!==''&&g.scoreThem!=='';
    const win=played&&g.scoreUs>g.scoreThem;
    const loss=played&&g.scoreUs<g.scoreThem;
    const upcoming=!played&&g.date>=today;
    const loc=g.location==='away'?'@':'vs';
    h+=`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.04);">
      <div style="min-width:60px;font-size:12px;color:var(--gray);font-weight:600;">${fD(g.date)}</div>
      <div style="flex:1;">
        <span style="font-size:11px;color:var(--gray);">${loc}</span>
        <span style="font-weight:700;font-size:14px;margin-left:4px;">${g.opponent||'TBD'}</span>
        ${g.time&&upcoming?'<span style="font-size:11px;color:var(--gray);margin-left:6px;">'+g.time+'</span>':''}
      </div>
      <div style="text-align:right;min-width:50px;">`;
    if(played){
      h+=`<span style="font-family:'Bebas Neue';font-size:18px;color:${win?'var(--green)':'var(--loss-red)'};">${g.scoreUs}-${g.scoreThem}</span>
        <div style="font-size:10px;font-weight:700;color:${win?'var(--green)':'var(--loss-red)'};">${win?'W':'L'}</div>`;
    }else if(upcoming){
      h+='<span style="font-size:12px;color:var(--gray);font-style:italic;">Upcoming</span>';
    }else{
      h+='<span style="font-size:12px;color:var(--gray);">—</span>';
    }
    h+=`</div>`;
    if(currentRole==='coach'){
      h+=`<button style="background:none;border:none;color:var(--gray-light);cursor:pointer;font-size:12px;padding:2px 4px;" onclick="delSchedule('${g.id}')" title="Delete">✕</button>`;
    }
    h+='</div>';
  });
  document.getElementById('dash-schedule').innerHTML=h;
}

function addScheduleGame(){
  const date=document.getElementById('sched-date').value;
  const opp=document.getElementById('sched-opp').value.trim();
  if(!date||!opp){toast('Enter date and opponent');return;}
  const loc=document.getElementById('sched-loc').value;
  const time=document.getElementById('sched-time').value.trim();
  const us=document.getElementById('sched-us').value;
  const them=document.getElementById('sched-them').value;
  const id=gi('sch');
  const entry={id,date,opponent:opp,location:loc,time:time||null};
  if(us!==''&&them!==''){entry.scoreUs=parseInt(us);entry.scoreThem=parseInt(them);}
  fbSetResult('schedule',id,entry);
  toast('Game added!');
  document.getElementById('sched-opp').value='';document.getElementById('sched-us').value='';
  document.getElementById('sched-them').value='';document.getElementById('sched-time').value='';
}
function delSchedule(id){fbRemove('schedule/'+id);toast('Removed');}

function normTeam(name){
  const aliases={
    'florida state university hs':'FSU HS',
    'fsu high school':'FSU HS',
    'florida state univ hs':'FSU HS',
    'fsuhs':'FSU HS'
  };
  return aliases[(name||'').toLowerCase().trim()]||name;
}
function renderStandings(){
  // Leon's record from schedule
  const games=[...D.schedule.filter(inSeason)];
  let leonW=0,leonL=0;
  const oppFromSchedule={}; // auto-compute opponent records vs Leon
  games.forEach(g=>{
    if(g.scoreUs!=null&&g.scoreThem!=null){
      g.scoreUs>g.scoreThem?leonW++:leonL++;
      const opp=normTeam(g.opponent||'');
      if(opp){
        if(!oppFromSchedule[opp])oppFromSchedule[opp]={w:0,l:0};
        // Opponent's perspective: if Leon won, opponent lost
        g.scoreUs>g.scoreThem?oppFromSchedule[opp].l++:oppFromSchedule[opp].w++;
      }
    }
  });

  // Merge: manual standings override auto-computed, but auto fills in if no manual entry
  const teams={};
  // First add auto-computed from schedule (vs Leon only)
  Object.entries(oppFromSchedule).forEach(([name,rec])=>{teams[name]={w:rec.w,l:rec.l,auto:true};});
  // Then override with manually set records
  Object.entries(D.standings).forEach(([name,s])=>{teams[normTeam(name)]={w:s.w||0,l:s.l||0,auto:false};});
  // This school always present
  teams[SC.myStandingsKey]={w:leonW,l:leonL,auto:true};

  // Sort by win %, then wins
  const sorted=Object.entries(teams).sort((a,b)=>{
    const pctA=(a[1].w+a[1].l)>0?a[1].w/(a[1].w+a[1].l):0;
    const pctB=(b[1].w+b[1].l)>0?b[1].w/(b[1].w+b[1].l):0;
    return pctB-pctA||b[1].w-a[1].w;
  });

  let h='<div style="overflow-x:auto;"><table class="player-table" style="min-width:280px;"><thead><tr><th style="width:30px;">#</th><th>Team</th><th>W</th><th>L</th><th>Pct</th><th></th></tr></thead><tbody>';
  sorted.forEach(([name,s],i)=>{
    const pct=(s.w+s.l)>0?((s.w/(s.w+s.l))*100).toFixed(0)+'%':'—';
    const isMine=_isOwnStanding(name);
    h+=`<tr style="${isMine?'background:var(--red-bg);font-weight:700;':''}">
      <td style="font-family:'Bebas Neue';font-size:14px;color:var(--gray);">${i+1}</td>
      <td style="${isMine?'color:var(--red);':''}font-weight:700;">${name}${isMine?' '+(SC.teamEmoji||''):''}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--green);">${s.w}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--loss-red);">${s.l}</td>
      <td style="font-family:'Bebas Neue';font-size:14px;">${pct}</td>
      <td>${s.auto&&!isMine?'<span style="font-size:9px;color:var(--gray);">vs '+(SC.myStandingsKey||'us')+'</span>':''}</td></tr>`;
  });
  h+='</tbody></table></div>';
  if(Object.keys(oppFromSchedule).length)h+='<div style="font-size:10px;color:var(--gray);margin-top:6px;font-style:italic;">Records marked "vs '+(SC.myStandingsKey||'us')+'" are auto-calculated from schedule. Update with full season records using the form below.</div>';
  document.getElementById('dash-standings').innerHTML=h;
  fetchMaxPrepsStandings(); // async — overlays with live MaxPreps data

  // Populate team dropdown for coaches
  const sel=document.getElementById('stand-team');
  if(sel){
    const cur=sel.value;
    sel.innerHTML='';
    const areaTeams=['Chiles','Lincoln','FSUS','Wakulla','Maclay','Community Christian','Godby','Rickards','St. John Paul II','Mosley','Sneads','South Walton','Gulf Breeze','Bishop Kenny'];
    areaTeams.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);});
    // Add any teams in standings that aren't in the default list
    Object.keys(D.standings).forEach(t=>{if(!areaTeams.includes(t)&&t!==SC.myStandingsKey){const o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o);}});
    if(cur)sel.value=cur;
  }
  // Show add form for coaches only
  const addEl=document.getElementById('dash-standings-add');
  if(addEl)addEl.style.display=currentRole==='coach'?'block':'none';
}

// ============================================================
// MAXPREPS LIVE STANDINGS FETCH
// ============================================================
// Own-team highlight test shared by all three standings tables. No school-specific
// hardcoding: matches SC.myStandingsKey case-insensitively. Locally-computed tables
// pass the exact key as the row name, so they use equality; the external MaxPreps
// feed may format the name differently, so those callers pass fuzzy=true (substring
// either direction) to tolerate "Leon" / "Leon High School" vs "Leon Queens".
function _isOwnStanding(name, fuzzy){
  const key=SC.myStandingsKey; if(!key) return false;
  const nl=String(name).toLowerCase(), kl=String(key).toLowerCase();
  return fuzzy ? (nl.includes(kl)||kl.includes(nl)) : (nl===kl);
}

const MAXPREPS_URL=SC.maxPrepsUrl;
const PROXY_BASE=SC.aiProxyUrl+'/proxy';

async function fetchMaxPrepsStandings(){
  const el=document.getElementById('dash-standings');
  const st=document.getElementById('maxpreps-status');
  if(!el)return;
  // Only fetch this school's own configured MaxPreps URL. With none set, leave the
  // locally-computed standings table alone (never overlay another school's data).
  if(!MAXPREPS_URL){if(st)st.textContent='';return;}
  if(st)st.textContent='🔄 loading…';

  const ATTEMPTS=[
    PROXY_BASE+'?url='+encodeURIComponent(MAXPREPS_URL),
  ];

  let teams=null;

  for(const proxyUrl of ATTEMPTS){
    try{
      const resp=await fetch(proxyUrl);
      if(resp.status===405){if(st)st.textContent='(offline)';return;}
      const xStatus=resp.headers.get('X-Proxy-Status')||'?';
      const raw=await resp.text();

      if(xStatus==='406'||xStatus==='403'||xStatus==='429')continue;

      // ── Try JSON response (API endpoint) ──
      if(raw.trim().startsWith('{')||raw.trim().startsWith('[')){
        try{
          const json=JSON.parse(raw);
          // Walk for standings array
          const find=(obj,depth)=>{
            if(depth>8||!obj||typeof obj!=='object')return null;
            if(Array.isArray(obj)&&obj.length>=2){
              const s=obj[0];
              if(s&&typeof s==='object'&&(s.wins!==undefined||s.losses!==undefined||s.schoolName!==undefined||s.overallRecord!==undefined))return obj;
            }
            for(const v of Object.values(obj)){const r=find(v,depth+1);if(r)return r;}
            return null;
          };
          const rows=find(json,0);
          if(rows){
            teams=rows.map(t=>{
              const name=t.schoolName||t.name||t.teamName||t.school?.name||'?';
              const rec=t.overallRecord||t.record||{};
              const w=+(t.wins??t.w??rec.wins??rec.w??0);
              const l=+(t.losses??t.l??rec.losses??rec.l??0);
              return{name:String(name).trim(),w,l};
            }).filter(t=>t.name&&t.name!=='?');
            if(teams.length)break;
          }
        }catch(e){}
      }

      // ── Try __NEXT_DATA__ ──
      const ndMatch=raw.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if(ndMatch){
        try{
          const nd=JSON.parse(ndMatch[1]);
          const find=(obj,depth,path)=>{
            if(depth>10||!obj||typeof obj!=='object')return null;
            if(Array.isArray(obj)&&obj.length>=2){
              const s=obj[0];
              if(s&&typeof s==='object'&&(s.wins!==undefined||s.losses!==undefined||s.schoolName!==undefined)){
                return obj;
              }
            }
            for(const [k,v] of Object.entries(obj)){const r=find(v,depth+1,path+'.'+k);if(r)return r;}
            return null;
          };
          const rows=find(nd,0,'root');
          if(rows){
            teams=rows.map(t=>{
              const name=t.schoolName||t.name||t.school?.name||'?';
              const rec=t.overallRecord||t.record||{};
              const w=+(t.wins??rec.wins??0);
              const l=+(t.losses??rec.losses??0);
              return{name:String(name).trim(),w,l};
            }).filter(t=>t.name&&t.name!=='?');
            if(teams.length)break;
          }
        }catch(e){}
      }

      // ── Log what we got if nothing parsed ──
      if(!teams||!teams.length){
      }

    }catch(e){}
  }

  if(!teams||!teams.length){
    if(st)st.textContent='(offline)';
    return;
  }

  teams.sort((a,b)=>{
    const pa=(a.w+a.l)>0?a.w/(a.w+a.l):0;
    const pb=(b.w+b.l)>0?b.w/(b.w+b.l):0;
    return pb-pa||b.w-a.w;
  });

  let h='<div style="overflow-x:auto;"><table class="player-table" style="min-width:280px;"><thead><tr><th style="width:30px;">#</th><th>Team</th><th>W</th><th>L</th><th>Pct</th></tr></thead><tbody>';
  teams.forEach(({name,w,l},i)=>{
    const pct=(w+l)>0?((w/(w+l))*100).toFixed(0)+'%':'—';
    const isMine=_isOwnStanding(name, true);
    h+=`<tr style="${isMine?'background:var(--red-bg);font-weight:700;':''}">
      <td style="font-family:'Bebas Neue';font-size:14px;color:var(--gray);">${i+1}</td>
      <td style="${isMine?'color:var(--red);':''}font-weight:700;">${name}${isMine?' '+(SC.teamEmoji||''):''}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--green);">${w}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--loss-red);">${l}</td>
      <td style="font-family:'Bebas Neue';font-size:14px;">${pct}</td></tr>`;
  });
  h+='</tbody></table></div>';
  h+=`<div style="font-size:10px;color:var(--gray);margin-top:6px;font-style:italic;">📡 Live · MaxPreps · ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>`;
  el.innerHTML=h;
  if(st)st.textContent='';
}
function updateStanding(){
  const team=document.getElementById('stand-team').value;
  const w=parseInt(document.getElementById('stand-w').value)||0;
  const l=parseInt(document.getElementById('stand-l').value)||0;
  if(!team){toast('Select a team');return;}
  fbSet('standings/'+team,{w,l});
  toast(team+' updated to '+w+'-'+l);
}

// ============================================================
// PLAYERS TAB
// ============================================================
let pSort={key:'court',dir:'asc'},pCourt='all',pType='gameday';
// Players-view tier and gender filter state (Grass Club only). Independent of the Roster tab's rosterTierFilter so the two views do not share state.
let playersTierFilter='all', playersGenderFilter='all';
function setPlayersTierFilter(v,btn){ playersTierFilter=v; if(v==='all')playersGenderFilter='all'; renderPlayers(); }
function setPlayersGenderFilter(v,btn){ playersGenderFilter=v; renderPlayers(); }
function renderPlayers(){
  // Club (Grass Club) shows a tier filter (and a gender sub-filter when a tier is picked) instead of the stat-view pills,
  // and uses the combined stat view. Non-club configs are untouched and keep their stat-view pills.
  if(SC.tiersEnabled){
    pType='all';
    const tierBox=document.getElementById('players-tier-toggle');
    if(tierBox){
      tierBox.innerHTML=[['all','All'],['gold','Gold'],['garnet','Garnet']].map(([v,lbl])=>
        `<button class="filter-btn${playersTierFilter===v?' active':''}" onclick="setPlayersTierFilter('${v}',this)" style="flex:1;text-align:center;">${lbl}</button>`).join('');
    }
    const genBox=document.getElementById('players-gender-toggle');
    if(genBox){
      if(playersTierFilter==='all'){ genBox.style.display='none'; genBox.innerHTML=''; }
      else{
        genBox.style.display='flex';
        genBox.innerHTML=[['all','Both'],['M','Male'],['F','Female']].map(([v,lbl])=>
          `<button class="filter-btn${playersGenderFilter===v?' active':''}" onclick="setPlayersGenderFilter('${v}',this)" style="flex:1;text-align:center;">${lbl}</button>`).join('');
      }
    }
  }
  // Build header based on type
  const thead=document.getElementById('players-thead');
  let cols;
  if(pType==='queens'){
    cols=[{k:'name',l:'Player'},{k:'court',l:'Pair'},{k:'wins',l:'W'},{k:'losses',l:'L'},{k:'pct',l:'%'},{k:'diff',l:'+/-'}];
  }else if(pType==='gameday'||pType==='scrimmage'||pType==='exhibition'){
    cols=[{k:'name',l:'Player'},{k:'court',l:'Pair'},{k:'sets',l:'Sets'},{k:'diff',l:'+/-'},{k:'k',l:'K'},{k:'b',l:'B'},{k:'a',l:'A'},{k:'se',l:'SE'},{k:'re',l:'RE'},{k:'he',l:'HE'},{k:'de',l:'DE'}];
  }else{
    // Club (SC.tiersEnabled) drops the Pair column from the combined Kings/Queens view; high schools keep it.
    cols=SC.tiersEnabled
      ?[{k:'name',l:'Player'},{k:'qrec',l:'Q W-L'},{k:'qdiff',l:'Q +/-'},{k:'gdsets',l:'GD Sets'},{k:'gddiff',l:'GD +/-'},{k:'diff',l:'Total +/-'}]
      :[{k:'name',l:'Player'},{k:'court',l:'Pair'},{k:'qrec',l:'Q W-L'},{k:'qdiff',l:'Q +/-'},{k:'gdsets',l:'GD Sets'},{k:'gddiff',l:'GD +/-'},{k:'diff',l:'Total +/-'}];
  }
  thead.innerHTML=cols.map(c=>`<th data-psort="${c.k}">${c.l} <span class="sort-arrow"></span></th>`).join('');
  thead.querySelectorAll('th[data-psort]').forEach(th=>{th.addEventListener('click',()=>{
    if(pSort.key===th.dataset.psort)pSort.dir=pSort.dir==='asc'?'desc':'asc';
    else{pSort.key=th.dataset.psort;pSort.dir='desc';}renderPlayers();});});

  const list=pType==='gameday'?(D.gamedays||[]).filter(m=>(m.court||0)<=5):pType==='scrimmage'?D.scrimmages:pType==='exhibition'?(D.gamedays||[]).filter(m=>(m.court||0)>5):null;
  let rows=D.players.map(p=>{
    if(pType==='queens'){
      const s=queensStats(p.id,D.matches);
      return{p,s,sortVals:{name:p.lastName,court:p.court,wins:s.wins,losses:s.losses,pct:s.pct,diff:s.diff},gp:s.gp};
    }else if(pType==='gameday'||pType==='scrimmage'||pType==='exhibition'){
      const s=extStats(p.id,list);
      return{p,s,sortVals:{name:p.lastName,court:p.court,sets:s.sets,diff:s.diff,k:s.k,b:s.b,a:s.a,se:s.se,re:s.re,he:s.he,de:s.de},gp:s.sets};
    }else{
      const c=combinedStats(p.id);
      return{p,c,sortVals:{name:p.lastName,court:p.court,qrec:c.qWins,qdiff:c.qDiff,gdsets:c.gdSets,gddiff:c.gdDiff,diff:c.totalDiff},gp:c.totalGames};
    }
  });
  if(pCourt!=='all')rows=rows.filter(r=>r.p.court===parseInt(pCourt));
  // Club tier/gender filter (Grass Club only). Gender only narrows when a specific tier is selected.
  if(SC.tiersEnabled){
    if(playersTierFilter!=='all')rows=rows.filter(r=>(r.p.tier||'unassigned')===playersTierFilter);
    if(playersTierFilter!=='all'&&playersGenderFilter!=='all')rows=rows.filter(r=>r.p.gender===playersGenderFilter);
  }
  // Sort
  rows.sort((a,b)=>{
    let va=a.sortVals[pSort.key],vb=b.sortVals[pSort.key];
    if(va===undefined)va=0;if(vb===undefined)vb=0;
    if(typeof va==='string')return pSort.dir==='asc'?va.localeCompare(vb):vb.localeCompare(va);
    return pSort.dir==='asc'?va-vb:vb-va;
  });

  const tbody=document.querySelector('#players-table tbody');
  const pNameCell=(p)=>{
    // Exec-side CS ranking pill, club only and only when the player has a rank. Never shown player-side.
    const rk=(SC.tiersEnabled&&p.csRank)?` <span class="cs-rank">${p.csRank}</span>`:'';
    return currentRole==='coach'?`<button class="player-name" style="background:none;border:none;padding:0;cursor:pointer;text-decoration:underline dotted;color:var(--red);font-family:inherit;font-size:inherit;font-weight:700;text-align:left;-webkit-tap-highlight-color:transparent;" onclick="coachOpenPlayer('${p.id}')">${p.firstName||''} ${(p.lastName||'').charAt(0)}.${rk}</button>`:`<span class="player-name">${p.firstName||''} ${(p.lastName||'').charAt(0)}.${rk}</span>`;
  };
  if(pType==='queens'){
    tbody.innerHTML=rows.map(r=>{const p=r.p,s=r.s;
      return`<tr><td>${pNameCell(p)}</td>
        <td>${courtBadge(p.court)}</td>
        <td>${s.wins}</td><td>${s.losses}</td><td>${s.gp>0?Math.round(s.pct)+'%':'—'}</td>
        <td class="plus-minus ${pmClass(s.diff)}">${s.gp>0?pmStr(s.diff):'—'}</td></tr>`;}).join('');
  }else if(pType==='gameday'||pType==='scrimmage'||pType==='exhibition'){
    tbody.innerHTML=rows.map(r=>{const p=r.p,s=r.s;
      return`<tr><td>${pNameCell(p)}</td>
        <td>${courtBadge(p.court)}</td>
        <td>${s.sets}</td>
        <td class="plus-minus ${pmClass(s.diff)}">${s.sets>0?pmStr(s.diff):'—'}</td>
        <td>${s.k}</td><td>${s.b}</td><td>${s.a}</td><td>${s.se}</td><td>${s.re}</td><td>${s.he}</td><td>${s.de}</td></tr>`;}).join('');
  }else{
    tbody.innerHTML=rows.map(r=>{const p=r.p,c=r.c;
      return`<tr><td>${pNameCell(p)}</td>
        ${SC.tiersEnabled?'':`<td>${courtBadge(p.court)}</td>`}
        <td class="wl-record">${c.qWins}-${c.qLosses}</td>
        <td class="plus-minus ${pmClass(c.qDiff)}">${c.qGP>0?pmStr(c.qDiff):'—'}</td>
        <td>${c.gdSets||'—'}</td>
        <td class="plus-minus ${pmClass(c.gdDiff)}">${c.gdSets>0?pmStr(c.gdDiff):'—'}</td>
        <td class="plus-minus ${pmClass(c.totalDiff)}" style="font-weight:700;">${c.totalGames>0?pmStr(c.totalDiff):'—'}</td></tr>`;}).join('');
  }
  // Update sort arrows
  thead.querySelectorAll('th[data-psort]').forEach(th=>{
    th.classList.toggle('sort-active',th.dataset.psort===pSort.key);
    th.querySelector('.sort-arrow').textContent=th.dataset.psort===pSort.key?(pSort.dir==='asc'?' ▲':' ▼'):'';
  });
}

// ============================================================
// QUEENS TAB (Leon vs Leon)
// ============================================================
let qCourtFilter='all';
function renderQueens(){
  fillSel(['q-a1','q-a2','q-b1','q-b2'],document.getElementById('q-court').value);
  let matches=[...D.matches];
  if(qCourtFilter!=='all')matches=matches.filter(m=>m.court===parseInt(qCourtFilter));
  matches.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id.localeCompare(a.id));
  const c=document.getElementById('queens-log');
  if(!matches.length){c.innerHTML='<div class="empty-state"><div class="emoji">👑</div><p>No Queens matches yet.</p></div>';return;}
  const grouped={};matches.forEach(m=>{if(!grouped[m.date])grouped[m.date]=[];grouped[m.date].push(m);});
  Object.keys(grouped).forEach(d=>grouped[d].sort((a,b)=>(a.court||0)-(b.court||0)));
  let html='';
  Object.keys(grouped).sort().reverse().forEach(date=>{
    html+=`<div class="section-divider">${fD(date)}</div>`;
    grouped[date].forEach(m=>{
      const t1=(m.team1||[]).map(id=>pN(id)).join(' & '),t2=(m.team2||[]).map(id=>pN(id)).join(' & ');
      const w=(m.score1||0)>(m.score2||0);
      html+=`<div class="match-card">
        <div class="match-actions"><button class="match-action-btn edit-btn" onclick="openQueensEdit('${m.id}')" title="Edit">✎</button>
          <button class="match-action-btn" onclick="delQueens('${m.id}')" title="Delete">✕</button></div>
        <div class="match-header"><span class="court-badge court-${m.court}">Court ${m.court}</span></div>
        <div class="match-body"><div class="match-team left ${w?'winner':'loser'}">${t1}</div>
          <div class="match-score">${m.score1||0} — ${m.score2||0}</div>
          <div class="match-team right ${!w?'winner':'loser'}">${t2}</div></div></div>`;
    });
  });
  c.innerHTML=html;
}
function delQueens(id){
  // Find which court idx owns this match before deleting
  const m=D.matches.find(x=>x.id===id);
  const assignment=window._loadedAssignment;
  let targetIdx=-1;
  if(m&&assignment){
    (assignment.courts||[]).forEach((c,i)=>{
      if(arrEq(m.team1||[],[c.p1,c.p2].filter(Boolean))||arrEq(m.team2||[],[c.p1,c.p2].filter(Boolean)))targetIdx=i;
    });
  }
  fbRemove('matches/'+id);
  toast('Result cleared');
  const date=m?m.date:td();
  setTimeout(()=>targetIdx>=0?refreshSingleQueensCard(targetIdx,date):(
    ()=>{const a=window._loadedAssignment;const ct=document.getElementById('live-courts-container');if(a&&ct)renderLiveScoringQueens(a,date,ct);}
  )(),400);
}

// Queens Edit
let editQId=null;
function openQueensEdit(id){
  const m=D.matches.find(x=>x.id===id);if(!m)return;editQId=id;
  document.getElementById('edit-modal-body').innerHTML=`
    <div class="form-row" style="margin-bottom:14px;">
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Date</label><input type="date" class="form-input" id="eq-date" value="${m.date||''}"></div>
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Court</label>
        <select class="form-select" id="eq-court">${COURTS.map(c=>`<option value="${c}" ${m.court===c?'selected':''}>${c<=5?'Court '+c:'Court '+c+' — Exhib'}</option>`).join('')}</select></div></div>
    <div class="team-section team-a"><div class="team-label">Team A</div><div class="form-row">
      <select class="form-select" id="eq-a1"></select><select class="form-select" id="eq-a2"></select></div></div>
    <div class="vs-divider">VS</div>
    <div class="team-section team-b"><div class="team-label">Team B</div><div class="form-row">
      <select class="form-select" id="eq-b1"></select><select class="form-select" id="eq-b2"></select></div></div>
    <div class="score-row" style="margin-top:14px;">
      <div class="score-col"><div class="score-col-label label-a">Team A</div><input type="number" class="score-input" id="eq-sa" value="${m.score1||0}" min="0" max="99"></div>
      <span class="score-dash">—</span>
      <div class="score-col"><div class="score-col-label label-b">Team B</div><input type="number" class="score-input" id="eq-sb" value="${m.score2||0}" min="0" max="99"></div></div>`;
  fillSel(['eq-a1','eq-a2','eq-b1','eq-b2'],m.court);
  document.getElementById('eq-a1').value=m.team1[0]||'';document.getElementById('eq-a2').value=m.team1[1]||'';
  document.getElementById('eq-b1').value=m.team2[0]||'';document.getElementById('eq-b2').value=m.team2[1]||'';
  document.getElementById('edit-save').onclick=saveQueensEdit;
  document.querySelector('#edit-modal .modal-title').innerHTML='Edit Queens Match <button class="modal-close" onclick="closeEdit()">✕</button>';
  document.getElementById('edit-modal').classList.add('active');
}
function saveQueensEdit(){
  if(!editQId)return;
  const date=document.getElementById('eq-date').value,court=parseInt(document.getElementById('eq-court').value);
  const a1=document.getElementById('eq-a1').value,a2=document.getElementById('eq-a2').value;
  const b1=document.getElementById('eq-b1').value,b2=document.getElementById('eq-b2').value;
  const s1=parseInt(document.getElementById('eq-sa').value),s2=parseInt(document.getElementById('eq-sb').value);
  if(!date){toast('Select a date');return;}if(!a1||!a2||!b1||!b2){toast('Select all 4 players');return;}
  if(new Set([a1,a2,b1,b2]).size<4){toast('Players must be unique');return;}
  if(isNaN(s1)||isNaN(s2)){toast('Enter both scores');return;}if(s1===s2){toast('Scores cannot be tied');return;}
  fbSetResult('matches',editQId,{id:editQId,date,court,team1:[a1,a2],team2:[b1,b2],score1:s1,score2:s2});
  closeEdit();toast('Match updated!');
}
function closeEdit(){editQId=null;document.getElementById('edit-modal').classList.remove('active');}

// ============================================================
// EXTERNAL MATCHES (shared renderer for Game Day + Scrimmage)
// ============================================================
function renderExtMatches(type){
  const isGD=type==='gameday';
  const prefix=isGD?'gd':'sc';
  const fbNode=isGD?'gamedays':'scrimmages';
  const list=isGD?D.gamedays:D.scrimmages;
  const dateEl=document.getElementById(prefix+'-filter-date');
  const container=document.getElementById(prefix+'-matches-list');
  if(!dateEl||!container)return;
  fillSel([prefix+'-p1',prefix+'-p2'],document.getElementById(prefix+'-court')?.value);

  const filterDate=dateEl.value;
  let matches=[...list];
  if(filterDate)matches=matches.filter(m=>m.date===filterDate);
  matches.sort((a,b)=>(b.date||'').localeCompare(a.date||''));

  if(!matches.length){
    container.innerHTML=`<div class="empty-state"><div class="emoji">${isGD?'🏐':'⚡'}</div><p>No ${isGD?'dual':'scrimmage'} matches${filterDate?' on '+fD(filterDate):''}.</p></div>`;
    return;
  }

  const grouped={};matches.forEach(m=>{if(!grouped[m.date])grouped[m.date]=[];grouped[m.date].push(m);});
  Object.keys(grouped).forEach(d=>grouped[d].sort((a,b)=>(a.court||0)-(b.court||0)));
  let html='';
  Object.keys(grouped).sort().reverse().forEach(date=>{
    html+=`<div class="section-divider">${fD(date)}</div>`;
    grouped[date].forEach(m=>{
      const sets=m.sets||[];
      let sw=0,sl=0,pf=0,pa=0;
      sets.forEach(s=>{const su=s.scoreUs||0,st=s.scoreThem||0;pf+=su;pa+=st;su>st?sw++:sl++;});
      const diff=pf-pa;
      html+=`<div class="ext-match-card">
        <div class="match-actions">
          <button class="match-action-btn" onclick="openExtEdit('${m.id}','${type}')" title="Edit">✎</button>
          <button class="match-action-btn" onclick="delExt('${m.id}','${fbNode}')" title="Delete">✕</button></div>
        <div class="ext-header">
          <span class="court-badge court-${m.court||1}">Court ${m.court||1}</span>
          <span class="match-date">${fD(m.date)}</span></div>
        <div class="ext-matchup">
          <span class="ext-pair">${(m.pair||[]).map(id=>pN(id)).join(' & ')}</span>
          <span class="ext-vs">VS</span>
          <span class="ext-opp">${m.opponent||'TBD'}</span></div>`;
      if(sets.length){
        html+='<div style="margin-top:6px;">';
        sets.forEach((s,i)=>{
          const su=s.scoreUs||0,st=s.scoreThem||0,win=su>st;
          const statsArr=[];
          (m.pair||[]).forEach(pid=>{const ps=s.stats?.[pid]||{};
            const parts=[];if(ps.k)parts.push(ps.k+'K');if(ps.b)parts.push(ps.b+'B');if(ps.a)parts.push(ps.a+'A');if(ps.d)parts.push(ps.d+'D');if(ps.e)parts.push(ps.e+'E');
            if(parts.length)statsArr.push(pN(pid)+': '+parts.join(', '));
          });
          const enterer=s.enteredBy?gP(s.enteredBy):null;
          const editer=s.editedBy?(s.editedBy==='coach'?'coach':gP(s.editedBy)):null;
          html+=`<div class="set-row" style="flex-wrap:wrap;gap:4px;">
            <span class="set-label">S${i+1}</span>
            <span class="set-score ${win?'win':'loss'}">${su}-${st}</span>
            ${statsArr.length?'<span class="set-stats-mini">'+statsArr.join(' | ')+'</span>':''}
            <div style="margin-left:auto;display:flex;align-items:center;gap:4px;">
              ${enterer?`<span style="font-size:9px;color:var(--gray);font-style:italic;">by ${enterer.firstName}</span>`:''}
              ${editer?`<span style="font-size:9px;color:var(--gray);font-style:italic;">(edited)</span>`:''}
              <button class="match-action-btn" style="font-size:11px;padding:2px 6px;" onclick="coachToggleEditSet('coach-edit-${m.id}-${i}')" title="Edit set">✎</button>
              <button class="match-action-btn" style="font-size:12px;" onclick="delSet('${m.id}','${fbNode}',${i})" title="Delete set">✕</button>
            </div>
          </div>
          <div id="coach-edit-${m.id}-${i}" style="display:none;margin-bottom:6px;">
            ${pgdEditSetFormHTML(m.id,i,s,m.pair||[],'coach','coach-'+m.id)}
          </div>`;
        });
        html+='</div>';
        html+=`<div class="ext-summary">
          <span class="ext-summary-item">Sets: <strong>${sw}-${sl}</strong></span>
          <span class="ext-summary-item plus-minus ${pmClass(diff)}">${pmStr(diff)}</span></div>`;
      }else{
        html+='<div style="font-size:12px;color:var(--gray);font-style:italic;margin-top:4px;">No sets recorded yet</div>';
      }
      html+=`<button class="btn ${isGD?'btn-blue':'btn-purple'} btn-small" style="margin-top:10px;" onclick="openAddSet('${m.id}','${type}')">+ Add Set</button>`;
      html+='</div>';
    });
  });
  container.innerHTML=html;
}

function coachToggleEditSet(id){pgdToggleEditSet(id);}
function delExt(id,fbNode){fbRemove(fbNode+'/'+id);toast('Match deleted');}
function delSet(matchId,fbNode,setIdx){
  const list=fbNode==='gamedays'?D.gamedays:D.scrimmages;
  const m=list.find(x=>x.id===matchId);if(!m)return;
  const sets=(m.sets||[]).filter((_,i)=>i!==setIdx);
  fbSet(fbNode+'/'+matchId+'/sets',sets.length?sets:null);toast('Set deleted');
}

// Add Set Modal
let addSetMatchId=null,addSetType=null;
function openAddSet(matchId,type){
  addSetMatchId=matchId;addSetType=type;
  const fbNode=type==='gameday'?'gamedays':'scrimmages';
  const list=type==='gameday'?D.gamedays:D.scrimmages;
  const m=list.find(x=>x.id===matchId);if(!m)return;
  const isGD=type==='gameday';
  const setNum=(m.sets||[]).length+1;
  document.getElementById('set-modal-title').innerHTML=`Add Set ${setNum} <button class="modal-close" onclick="closeSetModal()">✕</button>`;
  document.querySelector('#set-modal .modal-title').style.color=isGD?'var(--blue)':'var(--purple)';
  document.getElementById('set-modal-save').className='btn '+(isGD?'btn-blue':'btn-purple');
  let html=`
    <div style="font-size:13px;font-weight:700;margin-bottom:10px;">${(m.pair||[]).map(id=>pN(id)).join(' & ')} vs ${m.opponent||'TBD'}</div>
    <div class="form-row" style="margin-bottom:12px;">
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Our Score</label><input type="number" class="form-input" id="as-us" placeholder="0" min="0"></div>
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Their Score</label><input type="number" class="form-input" id="as-them" placeholder="0" min="0"></div></div>`;
  (m.pair||[]).forEach((pid,i)=>{
    html+=`<div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin:8px 0 4px;">${pFull(pid)} Stats</div>
      <div class="stat-input-row">
        <div><label>K</label><input type="number" id="as-k${i}" value="0" min="0"></div>
        <div><label>B</label><input type="number" id="as-b${i}" value="0" min="0"></div>
        <div><label>A</label><input type="number" id="as-a${i}" value="0" min="0"></div>
        <div><label>SE</label><input type="number" id="as-se${i}" value="0" min="0"></div>
        <div><label>RE</label><input type="number" id="as-re${i}" value="0" min="0"></div>
        <div><label>HE</label><input type="number" id="as-he${i}" value="0" min="0"></div>
        <div><label>DE</label><input type="number" id="as-de${i}" value="0" min="0"></div></div>`;
  });
  document.getElementById('set-modal-body').innerHTML=html;
  document.getElementById('set-modal-save').onclick=saveAddSet;
  document.getElementById('set-modal').classList.add('active');
}
function saveAddSet(){
  if(!addSetMatchId||!addSetType)return;
  const fbNode=addSetType==='gameday'?'gamedays':'scrimmages';
  const list=addSetType==='gameday'?D.gamedays:D.scrimmages;
  const m=list.find(x=>x.id===addSetMatchId);if(!m)return;
  const su=parseInt(document.getElementById('as-us').value),st=parseInt(document.getElementById('as-them').value);
  if(isNaN(su)||isNaN(st)){toast('Enter both scores');return;}
  if(su===st){toast('Scores cannot be tied');return;}
  const stats={};
  (m.pair||[]).forEach((pid,i)=>{
    stats[pid]={k:parseInt(document.getElementById('as-k'+i).value)||0,
      b:parseInt(document.getElementById('as-b'+i).value)||0,
      a:parseInt(document.getElementById('as-a'+i).value)||0,
      se:parseInt(document.getElementById('as-se'+i).value)||0,
      re:parseInt(document.getElementById('as-re'+i).value)||0,
      he:parseInt(document.getElementById('as-he'+i).value)||0,
      de:parseInt(document.getElementById('as-de'+i).value)||0};
  });
  const sets=m.sets?[...m.sets]:[];
  sets.push({scoreUs:su,scoreThem:st,stats});
  fbSet(fbNode+'/'+addSetMatchId+'/sets',sets);
  closeSetModal();toast('Set saved!');
}
function closeSetModal(){addSetMatchId=null;addSetType=null;document.getElementById('set-modal').classList.remove('active');}

// Edit external match details
function openExtEdit(id,type){
  const fbNode=type==='gameday'?'gamedays':'scrimmages';
  const list=type==='gameday'?D.gamedays:D.scrimmages;
  const m=list.find(x=>x.id===id);if(!m)return;
  const isGD=type==='gameday';
  editQId=null; // clear queens edit
  document.querySelector('#edit-modal .modal-title').innerHTML=`Edit ${isGD?'Dual':'Scrimmage'} Match <button class="modal-close" onclick="closeEdit()">✕</button>`;
  document.querySelector('#edit-modal .modal-title').style.color=isGD?'var(--blue)':'var(--purple)';
  document.getElementById('edit-modal-body').innerHTML=`
    <div class="form-row" style="margin-bottom:10px;">
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Date</label><input type="date" class="form-input" id="ee-date" value="${m.date||''}"></div>
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Court</label>
        <select class="form-select" id="ee-court">${COURTS.map(c=>`<option value="${c}" ${(m.court||1)===c?'selected':''}>${c<=5?'Court '+c:'Court '+c+' — Exhib'}</option>`).join('')}</select></div></div>
    <div class="form-row" style="margin-bottom:10px;">
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Player 1</label><select class="form-select" id="ee-p1"></select></div>
      <div class="form-group" style="margin-bottom:0;"><label class="form-label">Player 2</label><select class="form-select" id="ee-p2"></select></div></div>
    <div class="form-group"><label class="form-label">Opponent</label><input type="text" class="form-input" id="ee-opp" value="${m.opponent||''}"></div>`;
  fillSel(['ee-p1','ee-p2'],m.court);
  if(m.pair&&m.pair[0])document.getElementById('ee-p1').value=m.pair[0];
  if(m.pair&&m.pair[1])document.getElementById('ee-p2').value=m.pair[1];
  document.getElementById('edit-save').onclick=function(){
    const date=document.getElementById('ee-date').value;
    const court=parseInt(document.getElementById('ee-court').value);
    const p1=document.getElementById('ee-p1').value,p2=document.getElementById('ee-p2').value;
    const opp=document.getElementById('ee-opp').value.trim();
    if(!date||!p1||!p2||!opp){toast('Fill in all fields');return;}
    if(p1===p2){toast('Select two different players');return;}
    const updated={...m,date,court,pair:[p1,p2],opponent:opp};
    fbSet(fbNode+'/'+id,updated);
    closeEdit();toast('Match updated!');
  };
  document.getElementById('edit-modal').classList.add('active');
}

// ============================================================
// ROSTER
// ============================================================

// ── Edit player name inline ──
function editPlayerName(pid){
  const p=gP(pid);if(!p)return;
  const nameEl=document.getElementById('rname-'+pid);
  if(!nameEl)return;
  // Replace name span with inline edit inputs
  nameEl.innerHTML=`
    <input type="text" id="efn-${pid}" value="${p.firstName}" placeholder="First" style="width:80px;padding:3px 6px;border:2px solid var(--blue);border-radius:5px;font-family:'Barlow',sans-serif;font-size:13px;margin-right:4px;">
    <input type="text" id="eln-${pid}" value="${p.lastName}" placeholder="Last" style="width:90px;padding:3px 6px;border:2px solid var(--blue);border-radius:5px;font-family:'Barlow',sans-serif;font-size:13px;margin-right:4px;">
    <button onclick="savePlayerName('${pid}')" style="padding:3px 8px;background:var(--green);color:var(--white);border:none;border-radius:5px;font-size:12px;cursor:pointer;">✓</button>
    <button onclick="cancelEditName('${pid}','${p.firstName}','${p.lastName}')" style="padding:3px 6px;background:var(--gray-lighter);color:var(--gray);border:none;border-radius:5px;font-size:12px;cursor:pointer;">✕</button>
  `;
  document.getElementById('efn-'+pid)?.focus();
}
function savePlayerName(pid){
  const fn=document.getElementById('efn-'+pid)?.value.trim();
  const ln=document.getElementById('eln-'+pid)?.value.trim();
  if(!fn||!ln){toast('First and last name required');return;}
  const p=gP(pid);if(!p)return;
  fbSet('players/'+pid,{...p,firstName:fn,lastName:ln});
  toast('Name updated: '+fn+' '+ln);
}
// Exec tier setter (Grass Club only). Mirrors savePlayerName's whole-object spread write so no other field is disturbed.
// Also mutates the in-memory player so the change reflects immediately in demo mode, where fbSet is a no-op.
function coachSetTier(pid,newTier){
  const p=gP(pid);if(!p)return;
  const oldTier=p.tier||'unassigned';
  const wasProspect=(p.status==='prospect');
  // A genuine squad placement (club only): onto Gold or Garnet from a prospect or an unassigned
  // member, or a move between the two squads. It is NOT a no-op (same tier on an already placed
  // member) and never applies to HS tiers. Such a placement clears prospect status (so the record
  // becomes a regular member) and notifies the member via the shared placement path, so wherever an
  // exec does it the result is the same.
  const isPlacement = SC.tiersEnabled && (newTier==='gold'||newTier==='garnet') && (wasProspect || newTier!==oldTier);
  if(isPlacement && wasProspect) delete p.status;
  p.tier=newTier;
  fbSet('players/'+pid,{...p,tier:newTier});
  // Clear any pending tier request now that the coach has acted, closing the loop. Removes from the separate node only.
  fbRemove('tier_requests/'+pid);
  if(D.tierRequests)delete D.tierRequests[pid];
  const rq=document.getElementById('cpm-tier-req');if(rq)rq.remove();
  const TIER_LABELS={unassigned:'Unassigned',gold:'Gold',garnet:'Garnet',roster:'Roster',development:'Development'};
  const b=document.getElementById('cpm-tier-badge');
  if(b){b.className='tier-badge tier-'+newTier;b.textContent=TIER_LABELS[newTier];}
  toast('Tier set: '+TIER_LABELS[newTier]);
  if(isPlacement) rcSendPlacementNotice(pid,newTier);
  // Refresh the roster behind the modal so a filtered view stays in sync (a player whose new tier no longer matches the active filter drops out immediately). Club and HS both.
  if(typeof renderRoster==='function') renderRoster();
}
// Exec leadership setter (Grass Club only). Mirrors coachSetTier's whole-object spread write so no other field is disturbed.
// leadership is 'exec' or 'faculty' or none. An empty selection clears it to null so absent means none. The chat layers read p.leadership later.
function coachSetLeadership(pid,newVal){
  const p=gP(pid);if(!p)return;
  const val=newVal||null;
  p.leadership=val;
  fbSet('players/'+pid,{...p,leadership:val});
  const LEADER_LABELS={'':'None',exec:'Exec',faculty:'Faculty Advisor'};
  const b=document.getElementById('cpm-leader-badge');
  if(b)b.textContent=LEADER_LABELS[val||''];
  toast('Leadership set: '+LEADER_LABELS[val||'']);
  // Keep the roster in sync, same as coachSetTier. Grass Club only.
  if(SC.tiersEnabled && typeof renderRoster==='function') renderRoster();
}
function cancelEditName(pid,fn,ln){
  const nameEl=document.getElementById('rname-'+pid);
  if(nameEl)nameEl.innerHTML=fn+' '+ln;
}

// Badge for the roster (Grass Club), reused by the chat layers later. The tier badge is
// the base; a leadership role (exec or faculty) renders its badge alongside the tier badge,
// role first, rather than replacing it. No leadership means the tier badge only.
function playerBadge(p){
  if(!p) return '';
  const t=p.tier||'unassigned';
  const L={unassigned:'Unassigned',gold:'Gold',garnet:'Garnet',roster:'Roster',development:'Development'};
  const tierSpan='<span class="tier-badge tier-'+t+'">'+L[t]+'</span>';
  if(SC.tiersEnabled && p.leadership==='exec')    return '<span class="tier-badge badge-exec">Exec</span> '+tierSpan;
  if(SC.tiersEnabled && p.leadership==='faculty') return '<span class="tier-badge badge-faculty">Faculty Advisor</span> '+tierSpan;
  return tierSpan;
}

// Defensive sort helpers so one incomplete record cannot crash a roster view.
// A record missing court or lastName sorts last instead of throwing; healthy
// records (all six fields) compare exactly as before.
function _cmpCourt(a,b){
  const ca=Number.isFinite(a.court)?a.court:Infinity;
  const cb=Number.isFinite(b.court)?b.court:Infinity;
  return ca-cb;
}
function _cmpLast(a,b){
  const la=a.lastName, lb=b.lastName;
  if(!la&&!lb)return 0;
  if(!la)return 1;   // a has no last name -> sort a after b
  if(!lb)return -1;  // b has no last name -> sort b after a
  return la.localeCompare(lb);
}
function renderRoster(){
  let sorted=[...D.players].sort((a,b)=>_cmpCourt(a,b)||CO[a.classYear]-CO[b.classYear]||_cmpLast(a,b));
  // Tier filter (Grass Club only). Applied before court grouping; default 'all' shows everyone.
  if(rosterTierFilter!=='all'){
    sorted=sorted.filter(p=>(p.tier||'unassigned')===rosterTierFilter);
  }
  let html='',last=null;
  // Tier filter pills: club shows Gold/Garnet, HS shows Roster/Development. Same rosterTierFilter state and setter.
  html+=`<div style="display:flex;gap:8px;margin-bottom:10px;" id="roster-tier-toggle">`+
    (SC.tiersEnabled?[['all','All'],['gold','Gold'],['garnet','Garnet'],['unassigned','Unassigned']]:[['all','All'],['roster','Roster'],['development','Development'],['unassigned','Unassigned']]).map(([v,lbl])=>
      `<button class="filter-btn${rosterTierFilter===v?' active':''}" onclick="setRosterTierFilter('${v}',this)" style="flex:1;text-align:center;">${lbl}</button>`).join('')+
    `</div>`;
  sorted.forEach(p=>{if(p.court!==last){
    html+=`<div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1.5px;color:var(--red);margin:12px 0 6px;padding-top:8px;${last!==null?'border-top:2px solid var(--gray-lighter);':''}">
      ${courtBadge(p.court,'PG')}</div>`;last=p.court;}
    html+=`<div class="roster-item" id="ritem-${p.id}"><span class="class-badge class-${p.classYear}">${p.classYear}</span>${' '+playerBadge(p)}
      <span class="roster-name" id="rname-${p.id}">${SC.tiersEnabled&&currentRole==='coach'?`<button class="player-name" style="background:none;border:none;padding:0;cursor:pointer;text-decoration:underline dotted;color:var(--red);font-family:inherit;font-size:inherit;font-weight:700;text-align:left;-webkit-tap-highlight-color:transparent;" onclick="coachOpenPlayer('${p.id}')">${p.firstName} ${p.lastName}</button>`:`${p.firstName} ${p.lastName}`}${SC.tiersEnabled&&p.csRank?` <span class="cs-rank">${p.csRank}</span>`:''}</span>
      ${!SC.tiersEnabled?`<input type="number" min="0" max="99" placeholder="#" title="Jersey #" value="${p.jersey||''}" style="width:52px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:15px;text-align:center;color:var(--charcoal);" onchange="updJersey('${p.id}',this.value)">`:''}
      <select class="court-select" onchange="updCt('${p.id}',this.value)">${COURTS.map(c=>`<option value="${c}" ${p.court===c?'selected':''}>PG ${c}</option>`).join('')}</select>
      <button class="btn btn-small" onclick="editPlayerName('${p.id}')" style="padding:4px 8px;font-size:10px;background:var(--blue);color:var(--white);">✎</button>
      <button class="btn btn-danger btn-small" onclick="remPlayer('${p.id}')" style="padding:4px 8px;font-size:10px;">✕</button></div>`;});
  document.getElementById('roster-list').innerHTML=html;
}
function updCt(id,v){const p=gP(id);if(p){p.court=parseInt(v);fbSet('players/'+id,p);}}
function updJersey(id,v){const p=gP(id);if(p){p.jersey=v?parseInt(v):null;fbSet('players/'+id,p);}}
function remPlayer(id){
  const p=gP(id);if(!p)return;
  const nm=((p.firstName||'')+' '+(p.lastName||'')).trim()||'this player';
  if(!window.confirm('Remove '+nm+' from the roster? Their match history stays, but their profile, skills, goals, and notes are deleted. This cannot be undone.'))return;
  // Demo mode (no db): drop the roster record in memory and stop.
  if(!db){fbRemove('players/'+id);toast('Player removed');return;}
  const M=DB_ROOT, P=SC.dbRoots.profiles;
  // Direct deletes keyed by player id, matches node + profiles node.
  const u={};
  u[M+'/players/'+id]=null;
  u[M+'/goals/'+id]=null;
  u[M+'/tier_requests/'+id]=null;
  u[P+'/players/'+id]=null;
  u[P+'/skills/'+id]=null;
  u[P+'/quizScores/'+id]=null;
  // starDrills/jumpTests are keyed by their own id with playerId pointing at the player;
  // player_notes/coach_notes are keyed by date then player id. Read each, add only this
  // player's entries to the same atomic update (never a whole date). History nodes
  // (matches, gamedays, scrimmages, duals, planned, assignments, liveScoring) are left alone.
  Promise.all([
    db.ref(P+'/starDrills').once('value'),
    db.ref(P+'/jumpTests').once('value'),
    db.ref(M+'/player_notes').once('value'),
    db.ref(M+'/coach_notes').once('value'),
    db.ref(P+'/verticals').once('value')
  ]).then(function(snaps){
    const sd=snaps[0].val()||{}, jt=snaps[1].val()||{}, pn=snaps[2].val()||{}, cn=snaps[3].val()||{}, vt=snaps[4].val()||{};
    Object.keys(sd).forEach(function(k){ if(sd[k]&&sd[k].playerId===id) u[P+'/starDrills/'+k]=null; });
    Object.keys(jt).forEach(function(k){ if(jt[k]&&jt[k].playerId===id) u[P+'/jumpTests/'+k]=null; });
    Object.keys(vt).forEach(function(k){ if(vt[k]&&vt[k].playerId===id) u[P+'/verticals/'+k]=null; }); // legacy jump-data node
    Object.keys(pn).forEach(function(date){ if(pn[date]&&pn[date][id]!==undefined) u[M+'/player_notes/'+date+'/'+id]=null; });
    Object.keys(cn).forEach(function(date){ if(cn[date]&&cn[date].players&&cn[date].players[id]!==undefined) u[M+'/coach_notes/'+date+'/players/'+id]=null; });
    db.ref().update(u,function(err){ if(err){toast('Could not remove player, try again');return;} toast('Player removed'); });
  }).catch(function(){ toast('Could not remove player, try again'); });
}

// ============================================================
// REFRESH / NAVIGATION
// ============================================================
function refreshCurrent(){
  if(currentRole==='player'){renderPlayerPortal();return;}
  const t=document.querySelector('.tab.active');if(t)refreshTab(t.dataset.tab);
  // Always refresh past lineups regardless of active tab
  if(typeof renderPastLineups==='function')renderPastLineups();
  // Also update player login dropdown if on login screen
  if(!currentRole)populatePlayerLogin();
}
function refreshTab(id){
  switch(id){
    case'dashboard':renderDash();break;
    case'players':renderPlayers();break;
    case'queens':renderQueens();break;
    case'gameday':buildAssignSlots();renderAssignments();break;
    case'duals':if(typeof renderLiveAssignmentList==='function')renderLiveAssignmentList();break;
    case'dualhistory':renderDuals();renderPastLineups();break;
    case'scrimmage':renderExtMatches('scrimmage');break;
    case'goals':renderCoachGoals();break;
    case'scouts':renderScouts();break;
    case'settings':renderRoster();break;
    case'broadcast':renderExecBroadcast();break;
    case'inbox':renderExecInbox();break;
    case'communicate':renderHsCommunicate();break;
    case'teamanalysis':renderTeamAnalysis();break;
    case'practice':renderTeamAnalysis();break;
    case'practicegroups':renderPracticeGroups();break;
    case'recruiting':renderRecruiting();break;
    case'accounting':renderAccounting();break;
    case'travel':renderTravel();break;
    case'logistics':renderAccounting();renderTravel();break;
  }
}

// ============================================================
// MODE SWITCHING (Game Day / Manage)
// ============================================================
function switchMode(mode){
  const gdBar=document.getElementById('sub-tabs-gameday');
  const mgBar=document.getElementById('sub-tabs-manage');
  const gdBtn=document.getElementById('mode-gameday');
  const mgBtn=document.getElementById('mode-manage');
  if(!gdBar||!mgBar)return;
  if(mode==='gameday'){
    gdBar.style.display='flex';mgBar.style.display='none';
    if(gdBtn)gdBtn.classList.add('active');
    if(mgBtn)mgBtn.classList.remove('active');
    // Fire the now-visible bar's active (or first) tab via the existing click handler so the content
    // pane follows the mode switch, not just refreshTab (which renders without swapping the visible pane).
    const t=gdBar.querySelector('.tab.active')||gdBar.querySelector('.tab');
    if(t)t.click();
  }else{
    gdBar.style.display='none';mgBar.style.display='flex';
    if(mgBtn)mgBtn.classList.add('active');
    if(gdBtn)gdBtn.classList.remove('active');
    // Same as the gameday branch: click the now-visible bar's active (or first) tab so the pane follows.
    const t=mgBar.querySelector('.tab.active')||mgBar.querySelector('.tab');
    if(t)t.click();
  }
}

// HS-only flat five-destination nav. Additive and guarded on !SC.tiersEnabled so the club keeps switchMode
// untouched. Reuses the existing .tab click handler and refreshTab: for Game Day and Stats it reveals a
// secondary .tab row (sub-tabs-gameday, and sub-tabs-manage repurposed as the Stats row in HS) and clicks its
// first tab, the same pattern switchMode uses; the three single-pane destinations activate their pane directly.
// A single active .tab is kept across both secondary rows so refreshCurrent (which reads the first .tab.active)
// always matches the visible pane. No changes to the shared switching machinery.
function hsGo(dest, btn){
  if(SC.tiersEnabled) return;
  document.querySelectorAll('#mode-bar .mode-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const gd=document.getElementById('sub-tabs-gameday'); // Game Day secondary row
  const st=document.getElementById('sub-tabs-manage');  // Stats secondary row in HS
  if(gd) gd.style.display='none';
  if(st) st.style.display='none';
  document.querySelectorAll('#sub-tabs-gameday .tab, #sub-tabs-manage .tab').forEach(x=>x.classList.remove('active'));
  if(dest==='gameday' || dest==='stats'){
    const row = dest==='gameday' ? gd : st;
    if(row){ row.style.display='flex'; const t=row.querySelector('.tab'); if(t) t.click(); }
    return;
  }
  // Single-pane destinations: activate the pane exactly the way the .tab click handler does.
  const key = dest==='roster' ? 'settings' : dest;
  document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));
  const tc=document.getElementById('tab-'+key); if(tc) tc.classList.add('active');
  refreshTab(key);
}

// HS four-tab coach nav (Stage 1). Guarded on !SC.tiersEnabled so the club keeps switchMode untouched.
// Top tabs: Players | Practice | Duals | Manage. Reuses the existing .tab click handler and refreshTab
// for wired sub-tabs; placeholder sub-tabs point at inert tab-hs* panels that call no render fn.
// Row mapping: Players -> sub-tabs-manage, Duals -> sub-tabs-gameday, Manage -> sub-tabs-hsmanage.
// Practice is a single pane (tab-hspractice) with no sub-tab row.
function hsNav(dest, btn){
  if(SC.tiersEnabled) return;
  document.querySelectorAll('#mode-bar .mode-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const rows=['sub-tabs-gameday','sub-tabs-manage','sub-tabs-hsmanage'];
  rows.forEach(id=>{const r=document.getElementById(id); if(r) r.style.display='none';});
  document.querySelectorAll('#sub-tabs-gameday .tab, #sub-tabs-manage .tab, #sub-tabs-hsmanage .tab').forEach(x=>x.classList.remove('active'));
  if(dest==='practice'){
    document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));
    // Stage 2a: route the Practice tab to the real Team Analysis renderer (HS pane = tab-practice).
    const tc=document.getElementById('tab-practice'); if(tc) tc.classList.add('active');
    refreshTab('practice');
    return;
  }
  const rowId = dest==='players' ? 'sub-tabs-manage' : dest==='manage' ? 'sub-tabs-hsmanage' : 'sub-tabs-gameday';
  const row=document.getElementById(rowId);
  if(row){ row.style.display='flex'; const t=row.querySelector('.tab'); if(t) t.click(); }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
// Tab navigation
document.querySelectorAll('.tab').forEach(t=>{t.addEventListener('click',()=>{
  // Only deactivate tabs in the same sub-tabs group
  const parent=t.closest('.sub-tabs')||document.getElementById('tabs');
  (parent?parent.querySelectorAll('.tab'):document.querySelectorAll('.tab')).forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  const tc=document.getElementById('tab-'+t.dataset.tab);
  if(tc)tc.classList.add('active');
  refreshTab(t.dataset.tab);});});

// Players tab filters. Club (SC.tiersEnabled) replaces the stat-view pills with a tier/gender filter, so the
// stat-view listener is wired only for non-club configs where the pills exist.
if(!SC.tiersEnabled){
document.querySelectorAll('#type-filter-players [data-ptype]').forEach(b=>{b.addEventListener('click',()=>{
  document.querySelectorAll('#type-filter-players [data-ptype]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  pType=b.dataset.ptype;pSort={key:'court',dir:'asc'};renderPlayers();});});
}
document.querySelectorAll('#court-filter-players [data-court]').forEach(b=>{b.addEventListener('click',()=>{
  document.querySelectorAll('#court-filter-players [data-court]').forEach(x=>x.classList.remove('active'));b.classList.add('active');pCourt=b.dataset.court;renderPlayers();});});

// Queens tab
function updateQSplitToggle(){
  const c=parseInt(document.getElementById('q-court').value);
  const isExhib=EXHIBITION_COURTS.has(c);
  document.getElementById('q-split-toggle').style.display=isExhib?'block':'none';
  if(!isExhib){document.getElementById('q-is-split').checked=false;toggleSplitQ();}
}
function toggleSplitQ(){
  const on=document.getElementById('q-is-split').checked;
  document.getElementById('q-split-extra').style.display=on?'block':'none';
  if(on)fillSel(['q-s2a1','q-s2a2','q-s2b1','q-s2b2'],document.getElementById('q-court').value);
}
const _elq_court=document.getElementById('q-court');if(_elq_court)_elq_court.addEventListener('change',()=>{
  fillSel(['q-a1','q-a2','q-b1','q-b2'],document.getElementById('q-court').value);
  updateQSplitToggle();
});
const _elsave_queens=document.getElementById('save-queens');if(_elsave_queens)_elsave_queens.addEventListener('click',()=>{
  const date=document.getElementById('q-date').value,court=parseInt(document.getElementById('q-court').value);
  const a1=document.getElementById('q-a1').value,a2=document.getElementById('q-a2').value,b1=document.getElementById('q-b1').value,b2=document.getElementById('q-b2').value;
  const s1=parseInt(document.getElementById('q-sa').value),s2=parseInt(document.getElementById('q-sb').value);
  if(!date){toast('Select a date');return;}if(!a1||!a2||!b1||!b2){toast('Select all 4 players');return;}
  if(new Set([a1,a2,b1,b2]).size<4){toast('Players must be unique');return;}
  if(isNaN(s1)||isNaN(s2)){toast('Enter both scores');return;}if(s1===s2){toast('Scores cannot be tied');return;}
  const isSplit=document.getElementById('q-is-split').checked&&EXHIBITION_COURTS.has(court);
  const matchData={id:gi('m'),date,court,team1:[a1,a2],team2:[b1,b2],score1:s1,score2:s2};
  if(isSplit){
    const s2a1=document.getElementById('q-s2a1').value,s2a2=document.getElementById('q-s2a2').value;
    const s2b1=document.getElementById('q-s2b1').value,s2b2=document.getElementById('q-s2b2').value;
    if(s2a1&&s2a2&&s2b1&&s2b2)matchData.splitPairs={set1:[a1,a2,b1,b2],set2:[s2a1,s2a2,s2b1,s2b2]};
    matchData.isExhibition=true;
  }
  fbSetResult('matches',matchData.id,matchData);
  toast(isSplit?'Split exhibition match saved!':'Queens match saved!');
  document.getElementById('q-sa').value='';document.getElementById('q-sb').value='';
  ['q-a1','q-a2','q-b1','q-b2','q-s2a1','q-s2a2','q-s2b1','q-s2b2'].forEach(x=>{const el=document.getElementById(x);if(el)el.value='';});
  document.getElementById('q-is-split').checked=false;toggleSplitQ();
});
document.querySelectorAll('#court-filter-queens [data-qcourt]').forEach(b=>{b.addEventListener('click',()=>{
  document.querySelectorAll('#court-filter-queens [data-qcourt]').forEach(x=>x.classList.remove('active'));b.classList.add('active');qCourtFilter=b.dataset.qcourt;renderQueens();});});

// Game Day tab
function updateGDSplitToggle(){
  const c=parseInt(document.getElementById('gd-court').value);
  const isExhib=EXHIBITION_COURTS.has(c);
  document.getElementById('gd-split-toggle').style.display=isExhib?'block':'none';
  if(!isExhib){document.getElementById('gd-is-split').checked=false;toggleSplitGD();}
}
function toggleSplitGD(){
  const on=document.getElementById('gd-is-split').checked;
  document.getElementById('gd-split-extra').style.display=on?'block':'none';
  if(on)fillSel(['gd-s2p1','gd-s2p2'],document.getElementById('gd-court').value);
}
// gd-court removed from HTML

// gd-filter-date removed from HTML

// save-gd-match removed from HTML
;

// Scrimmage tab
const _elsc_court=document.getElementById('sc-court');if(_elsc_court)_elsc_court.addEventListener('change',()=>fillSel(['sc-p1','sc-p2'],document.getElementById('sc-court').value));
const _elsc_filter_date=document.getElementById('sc-filter-date');if(_elsc_filter_date)_elsc_filter_date.addEventListener('change',()=>renderExtMatches('scrimmage'));
const _elsave_sc_match=document.getElementById('save-sc-match');if(_elsave_sc_match)_elsave_sc_match.addEventListener('click',()=>{
  const date=document.getElementById('sc-date').value,court=parseInt(document.getElementById('sc-court').value);
  const p1=document.getElementById('sc-p1').value,p2=document.getElementById('sc-p2').value;
  const opp=document.getElementById('sc-opp').value.trim();
  if(!date){toast('Select a date');return;}if(!p1||!p2){toast('Select both players');return;}
  if(p1===p2){toast('Select two different players');return;}if(!opp){toast('Enter opponent name');return;}
  const id=gi('sc');fbSetResult('scrimmages',id,{id,date,court,pair:[p1,p2],opponent:opp,sets:[]});
  toast('Scrimmage match created!');document.getElementById('sc-opp').value='';
  document.getElementById('sc-p1').value='';document.getElementById('sc-p2').value='';
  document.getElementById('sc-filter-date').value=date;
});

// Roster
const _addP=document.getElementById('add-player'); if(_addP) _addP.addEventListener('click',()=>{
  const f=document.getElementById('new-first').value.trim(),l=document.getElementById('new-last').value.trim();
  if(!f||!l){toast('Enter first and last name');return;}
  const jersey=document.getElementById('new-jersey').value;
  const id=gi('p');fbSet('players/'+id,{id,firstName:f,lastName:l,classYear:document.getElementById('new-class').value,court:parseInt(document.getElementById('new-court').value),jersey:jersey?parseInt(jersey):null});
  // Recruiting identity fields live on the profiles node (existing model: pp.height/position/preferredSide/dominantHand),
  // written with merge semantics so skills/notes/jumpTests under this player are never clobbered. gradYear/reach are new keys.
  const _pv=elId=>document.getElementById(elId)?.value.trim()||'';
  const _mkParent=(n,e,ph)=>{if(!n&&!e&&!ph)return null;const o={};if(n)o.name=n;if(e)o.email=e;if(ph)o.phone=ph;return o;};
  const prof={height:document.getElementById('new-height').value.trim()||null,reach:document.getElementById('new-reach').value.trim()||null,gradYear:parseInt(document.getElementById('new-gradyear').value)||null,position:document.getElementById('new-role').value||null,preferredSide:document.getElementById('new-side').value||null,dominantHand:document.getElementById('new-hand').value||null};
  const _tv=parseFloat(document.getElementById('new-truvolley').value);
  if(!isNaN(_tv))prof.truvolley=_tv;                                  // only write TruVolley when entered
  const _p1=_mkParent(_pv('new-p1-name'),_pv('new-p1-email'),_pv('new-p1-phone'));
  const _p2=_mkParent(_pv('new-p2-name'),_pv('new-p2-email'),_pv('new-p2-phone'));
  if(_p1)prof.parent1=_p1;                                           // only write a parent with at least one field
  if(_p2)prof.parent2=_p2;
  if(db)db.ref(SC.dbRoots.profiles+'/players/'+id).update(prof);
  ['new-first','new-last','new-jersey','new-truvolley','new-gradyear','new-height','new-reach','new-hand','new-side','new-role','new-p1-name','new-p1-email','new-p1-phone','new-p2-name','new-p2-email','new-p2-phone'].forEach(eid=>{const el=document.getElementById(eid);if(el)el.value='';});
  toast('Player added!');});

// Data export (JSON). Named so the Manage Import/Export card can call it directly. Excel export is exportExcel().
function exportJSON(){
  const b=new Blob([JSON.stringify(D,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);
  a.download=SC.exportPrefix+td()+'.json';a.click();URL.revokeObjectURL(a.href);toast('Exported!');
}

// Modal clicks
document.getElementById('edit-modal').addEventListener('click',function(e){if(e.target===this)closeEdit();});
document.getElementById('set-modal').addEventListener('click',function(e){if(e.target===this)closeSetModal();});

// ============================================================
// LOGIN SYSTEM
// ============================================================
const DEFAULT_PW=SC.defaultPw;
let passwords={};
let currentRole=null; // 'coach' or 'player'
let currentPlayerId=null;
let pinEntry='';
let _pinChecking=false;

function switchLogin(mode){
  document.querySelectorAll('.login-toggle-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.login-section').forEach(s=>s.classList.remove('active'));
  if(mode==='coach'){
    document.querySelector('.login-toggle-btn:nth-child(1)').classList.add('active');
    document.getElementById('login-coach').classList.add('active');
  }else{
    document.querySelector('.login-toggle-btn:nth-child(2)').classList.add('active');
    document.getElementById('login-player').classList.add('active');
    populatePlayerLogin();
  }
}
function populatePlayerLogin(){
  const sel=document.getElementById('login-player-select');
  if(!sel)return; // email-login mode (SC.emailLogin) has no name dropdown
  const cur=sel.value;
  sel.innerHTML='<option value="">— Choose Player —</option>';
  const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
  sorted.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.firstName+' '+p.lastName;sel.appendChild(o);});
  if(cur)sel.value=cur;
}
async function pinPress(n){
  if(_pinChecking)return;                       // ignore digit presses while a request is in flight
  if(pinEntry.length>=4)return;
  pinEntry+=n;
  updatePinDots();
  if(pinEntry.length===4){
    _pinChecking=true;
    const errEl=document.getElementById('pin-error');
    if(errEl)errEl.textContent='Checking...';
    let j=null, netErr=false;
    try{
      const r=await fetch(AUTH_WORKER+'/auth/coach-verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbRoot:DB_ROOT,pin:pinEntry})});
      j=await r.json().catch(()=>null);
    }catch(e){netErr=true;}
    if(j&&j.ok){
      sessionStorage.setItem('csCoachSession',JSON.stringify({token:j.token,dbRoot:DB_ROOT,expiresAt:j.expiresAt}));
      if(errEl)errEl.textContent='';
      _pinChecking=false;
      loginAsCoach();
      return;
    }
    if(netErr){
      if(errEl)errEl.textContent='Could not reach the server. Try again.';
      pinEntry='';updatePinDots();_pinChecking=false;
    }else if(j&&j.code==='not_set'){
      if(errEl)errEl.textContent='No PIN set for this school. Contact support.';
      pinEntry='';updatePinDots();_pinChecking=false;
    }else{
      if(errEl)errEl.textContent='Incorrect PIN';
      setTimeout(()=>{pinEntry='';updatePinDots();const e2=document.getElementById('pin-error');if(e2)e2.textContent='';_pinChecking=false;},800);
    }
  }
}
function pinBack(){pinEntry=pinEntry.slice(0,-1);updatePinDots();document.getElementById('pin-error').textContent='';}
function updatePinDots(){document.querySelectorAll('.login-pin-dot').forEach((d,i)=>{d.classList.toggle('filled',i<pinEntry.length);});}

function loginAsCoach(){
  currentRole='coach';currentPlayerId=null;
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('app-wrapper').style.display='block';
  document.getElementById('coach-content').style.display='block';
  document.getElementById('player-portal').style.display='none';
  document.getElementById('header-username').textContent=COACH_LABEL;
  document.querySelector('.tabs').style.display='flex';
  refreshCurrent();
  // Club only: the Broadcast tab is active on entry but the statically-active pane is
  // tab-duals, so content and tab disagree on first paint. Fire the existing tab handler
  // on the active button inside the VISIBLE manage bar (Broadcast) so it activates
  // tab-broadcast and deactivates tab-duals. Manage-bar-scoped selector avoids the hidden
  // recruiting tab. HS configs (chatEnabled false) are untouched and keep gameday/duals.
  if(SC.chatEnabled){
    const bc=document.querySelector('#sub-tabs-manage .tab.active');
    if(bc)bc.click();
  }
  else if(!SC.tiersEnabled){
    // HS four-tab nav lands on Duals with Dashboard active, but the statically-active pane is
    // tab-duals. Click the active tab (Dashboard) so the pane and the tab agree on first paint.
    const hd=document.querySelector('.tab.active');
    if(hd)hd.click();
  }
}

// Admin cross-school entry: store a worker-issued coach session token (from
// /auth/admin-coach-session) and enter coach mode. Driven by the ?csadmin=<token> boot
// path in initFB. The token is a real, expiring, server-validated session, not a flag.
function adminEnterSchool(token, expiresAt){
  sessionStorage.setItem('csCoachSession',JSON.stringify({token:token,dbRoot:DB_ROOT,expiresAt:expiresAt||null}));
  loginAsCoach();
}
function playerLogin(){
  const pid=document.getElementById('login-player-select').value;
  const pw=document.getElementById('login-pw').value;
  if(!pid){document.getElementById('pw-error').textContent='Select your name';return;}
  if(!pw){document.getElementById('pw-error').textContent='Enter your password';return;}
  const storedPw=passwords[pid]||DEFAULT_PW;
  if(pw!==storedPw){document.getElementById('pw-error').textContent='Incorrect password';return;}
  document.getElementById('pw-error').textContent='';
  currentRole='player';currentPlayerId=pid;
  sessionStorage.setItem('leonAuth',JSON.stringify({role:'player',pid}));
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('app-wrapper').style.display='block';
  document.getElementById('coach-content').style.display='none';
  document.getElementById('player-portal').style.display='block';
  document.getElementById('player-portal').classList.add('active');
  document.querySelector('.tabs').style.display='none';
  const p=gP(pid);
  document.getElementById('header-username').textContent=p?p.firstName+' '+p.lastName:'Player';
  renderPlayerPortal();
}
// Email + password player login (SC.emailLogin schools only, e.g. FSU Grass). Verifies
// the CourtSense account server-side via the worker (same fetch/error convention as the
// coach PIN path), then resolves the club roster record by matching accountId. Sets
// currentPlayerId to the CLUB record id so every downstream consumer is unchanged.
let _emailLoginBusy=false;
async function playerLoginEmail(){
  if(_emailLoginBusy)return;
  const emailEl=document.getElementById('login-email');
  const pwEl=document.getElementById('login-pw');
  const errEl=document.getElementById('pw-error');
  const email=(emailEl?emailEl.value:'').trim().toLowerCase();
  const pw=pwEl?pwEl.value:'';
  if(!email){if(errEl)errEl.textContent='Enter your email';return;}
  if(!pw){if(errEl)errEl.textContent='Enter your password';return;}
  _emailLoginBusy=true;
  const btn=document.getElementById('player-login-btn');
  if(btn)btn.disabled=true;
  if(errEl)errEl.textContent='Checking...';
  let j=null, netErr=false;
  try{
    const r=await fetch(AUTH_WORKER+'/auth/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rosterPath:'tally_kotb_pickup/players',email:email,password:pw})});
    j=await r.json().catch(()=>null);
  }catch(e){netErr=true;}
  const done=()=>{_emailLoginBusy=false;if(btn)btn.disabled=false;};
  if(netErr){if(errEl)errEl.textContent='Could not reach the server. Try again.';done();return;}
  if(!j||j.ok!==true){
    if(errEl)errEl.textContent=(j&&j.code==='rate_limited')?'Too many attempts. Try again in a few minutes.':'Incorrect email or password';
    done();return;
  }
  // Verified. Resolve the club roster record by matching accountId to the account id.
  const accountId=j.player&&j.player.id;
  const rec=accountId?D.players.find(p=>p.accountId===accountId):null;
  if(!rec){if(errEl)errEl.textContent='This account is not on the FSU Grass roster yet. Contact the exec team.';done();return;}
  if(errEl)errEl.textContent='';
  done();
  // Session + portal entry mirror playerLogin. currentPlayerId is the CLUB record id, not the account id.
  currentRole='player';currentPlayerId=rec.id;
  sessionStorage.setItem('leonAuth',JSON.stringify({role:'player',pid:rec.id}));
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('app-wrapper').style.display='block';
  document.getElementById('coach-content').style.display='none';
  document.getElementById('player-portal').style.display='block';
  document.getElementById('player-portal').classList.add('active');
  document.querySelector('.tabs').style.display='none';
  document.getElementById('header-username').textContent=rec.firstName+' '+rec.lastName;
  renderPlayerPortal();
}
function logout(){
  currentRole=null;currentPlayerId=null;pinEntry='';
  sessionStorage.removeItem('leonAuth');
  sessionStorage.removeItem('csCoachSession');
  updatePinDots();
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('app-wrapper').style.display='none';
  document.getElementById('coach-content').style.display='none';
  document.getElementById('player-portal').style.display='none';
  document.getElementById('player-portal').classList.remove('active');
  document.getElementById('pin-error').textContent='';
  document.getElementById('pw-error').textContent='';
  document.getElementById('login-pw').value='';
}
async function autoLogin(){
  // Coach: validate the stored session token server-side before entering coach mode.
  // Never trust a bare flag; a forged sessionStorage entry fails the worker check.
  try{
    const cs=JSON.parse(sessionStorage.getItem('csCoachSession'));
    if(cs&&cs.token&&cs.dbRoot===DB_ROOT&&(!cs.expiresAt||cs.expiresAt>Date.now())){
      const r=await fetch(AUTH_WORKER+'/auth/coach-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbRoot:DB_ROOT,token:cs.token})});
      const j=await r.json().catch(()=>null);
      if(j&&j.ok){loginAsCoach();return;}
      sessionStorage.removeItem('csCoachSession');
    }
  }catch(e){sessionStorage.removeItem('csCoachSession');}
  // Player: unchanged, restored from leonAuth.
  try{
    const auth=JSON.parse(sessionStorage.getItem('leonAuth'));
    if(!auth)return;
    if(auth.role==='player'&&auth.pid){currentPlayerId=auth.pid;currentRole='player';
      document.getElementById('login-overlay').classList.add('hidden');
      document.getElementById('app-wrapper').style.display='block';
      document.getElementById('coach-content').style.display='none';
      document.getElementById('player-portal').style.display='block';
      document.getElementById('player-portal').classList.add('active');
      document.querySelector('.tabs').style.display='none';
      const p=gP(auth.pid);
      document.getElementById('header-username').textContent=p?p.firstName+' '+p.lastName:'Player';
      renderPlayerPortal();
    }
  }catch(e){}
}

function changePassword(){
  if(!currentPlayerId)return;
  const cur=document.getElementById('t-pw-current').value;
  const newPw=document.getElementById('t-pw-new').value;
  const confirm=document.getElementById('t-pw-confirm').value;
  const storedPw=passwords[currentPlayerId]||DEFAULT_PW;
  if(cur!==storedPw){toast('Current password is incorrect');return;}
  if(!newPw||newPw.length<4){toast('New password must be at least 4 characters');return;}
  if(newPw!==confirm){toast('Passwords do not match');return;}
  if(db)db.ref(SC.dbRoots.passwords+'/'+currentPlayerId).set(newPw);
  toast('Password updated!');
  document.getElementById('t-pw-current').value='';document.getElementById('t-pw-new').value='';document.getElementById('t-pw-confirm').value='';
}

// ============================================================
// PLAYER PORTAL RENDERING
// ============================================================
let ppStatView='official';
function ppSetStatView(view,btn){
  ppStatView=view;
  document.querySelectorAll('#pp-stat-toggle .filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderPlayerPortal();
}
// Roster tier filter state (Grass Club only). Mirrors ppStatView: module-level selection, toggle .active, re-render.
let rosterTierFilter='all';
function setRosterTierFilter(v,btn){
  rosterTierFilter=v;
  document.querySelectorAll('#roster-tier-toggle .filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderRoster();
}
// Player-side tier request (Grass Club only). Writes to the SEPARATE tier_requests node; never touches players/{id}.tier.
// Mutates the in-memory copy so it reflects immediately in demo mode, where fbSet is a no-op.
function playerRequestTier(choice){
  if(!currentPlayerId)return;
  const rec={tier:choice,ts:Date.now()};
  fbSet('tier_requests/'+currentPlayerId,rec);
  if(!D.tierRequests)D.tierRequests={};
  D.tierRequests[currentPlayerId]=rec;
  const TIER_LABELS={gold:'Gold',garnet:'Garnet'};
  toast('Requested '+(TIER_LABELS[choice]||choice)+'. Your coach will review it.');
  renderPlayerPortal();
}
function renderPlayerPortal(){
  if(!currentPlayerId)return;
  const p=gP(currentPlayerId);
  if(!p)return;
  const pid=currentPlayerId;
  processPendingTryout(); // record a pending door check-in once the member is logged in
  renderPlayerBroadcasts();
  if(SC.tiersEnabled&&typeof updateMemberMsgBadge==='function')updateMemberMsgBadge();

  document.getElementById('pp-name').textContent=p.firstName+' '+p.lastName;
  document.getElementById('pp-meta').innerHTML=`${p.jersey!=null?'<span style="font-family:\'Bebas Neue\',sans-serif;font-size:16px;color:var(--red);margin-right:6px;">#'+p.jersey+'</span>':''}<span class="class-badge class-${p.classYear}">${p.classYear}</span>`;

  // Player tier request (Grass Club only, gated on SC.tiersEnabled). Tier placement is set by the coach;
  // the player may ask to be considered for one. Writes to the SEPARATE tier_requests node, never to the player record.
  const tierReqEl=document.getElementById('pp-tier-request');
  if(tierReqEl){
    if(SC.tiersEnabled){
      const TIER_LABELS={gold:'Gold',garnet:'Garnet'};
      const req=(D.tierRequests||{})[pid];
      let rh=`<div class="card" style="padding:12px 14px;margin-top:10px;">
        <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:4px;">Tier Placement</div>
        <div style="font-size:12px;color:var(--gray);margin-bottom:10px;line-height:1.5;">Your coach sets your tier. You can ask to be considered for one below. This is a request, not a final placement.</div>
        <div style="font-size:12px;color:var(--charcoal);margin-bottom:10px;line-height:1.5;">Gold is our entry level squad, a great place to start and grow. Garnet is for experienced players ready for a higher level of play.</div>`;
      if(req&&req.tier){
        rh+=`<div style="font-size:13px;margin-bottom:10px;">You requested: <span class="tier-badge tier-${req.tier}">${TIER_LABELS[req.tier]||req.tier}</span> <span style="color:var(--gray);font-size:12px;">Your coach will review it.</span></div>`;
      }
      rh+=`<div style="display:flex;gap:8px;">
        <button class="btn btn-small" style="flex:1;background:#CEB888;color:#2d2d2d;border:none;" onclick="playerRequestTier('gold')">Request Gold (entry level)</button>
        <button class="btn btn-small" style="flex:1;background:#782F40;color:#ffffff;border:none;" onclick="playerRequestTier('garnet')">Request Garnet (experienced)</button>
      </div></div>`;
      tierReqEl.innerHTML=rh;
    } else {
      tierReqEl.innerHTML='';
    }
  }
  const _ppPr=document.getElementById('pp-practice'); if(_ppPr) _ppPr.innerHTML=memberPracticeHtml(p);

  // Summary stats — filtered by ppStatView
  const qs=queensStats(pid,D.matches);
  const _gdFiltered=ppStatView==='exhibition'?(D.gamedays||[]).filter(m=>(m.court||0)>5):(D.gamedays||[]).filter(m=>(m.court||0)<=5||!(m.court));
  const gs=extStats(pid,_gdFiltered);
  const ss=extStats(pid,D.scrimmages);
  const _psum=document.getElementById('pp-summary');if(_psum)_psum.innerHTML=`
    <div style="grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:4px;">
      <div class="stat-box"><div class="stat-number green">${gs.matchesWon}-${gs.matchesLost}</div><div class="stat-label">Match W-L</div></div>
      <div class="stat-box"><div class="stat-number green">${gs.setsWon}-${gs.setsLost}</div><div class="stat-label">Set W-L</div></div>
      <div class="stat-box"><div class="stat-number ${pmClass(gs.diff)}">${gs.sets>0?pmStr(gs.diff):'—'}</div><div class="stat-label">Pts +/-</div></div>
    </div>
    <div style="grid-column:1/-1;display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.k}</div><div class="stat-label">Kills</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.a}</div><div class="stat-label">Aces</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.b}</div><div class="stat-label">Blocks</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.se}</div><div class="stat-label">Srv Err</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.re}</div><div class="stat-label">Rcv Err</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.he}</div><div class="stat-label">Hit Err</div></div>
      <div class="stat-box"><div class="stat-number" style="font-size:22px;">${gs.de}</div><div class="stat-label">Dig Err</div></div>
    </div>
    <div style="grid-column:1/-1;font-size:10px;color:var(--gray);text-align:center;margin-top:6px;letter-spacing:0.5px;">${ppStatView==="exhibition"?"EXHIBITION MATCHES (CT 6+)":"OFFICIAL DUAL MATCHES (CT 1-5)"}</div>`;

  // ===== TEAM RANKINGS =====
  // Build stats for all players
  const allPlayers=D.players.filter(pl=>pl.id);
  const rankings=[];
  // Queens +/-
  const qRanks=allPlayers.map(pl=>{const s=queensStats(pl.id,D.matches);return{id:pl.id,val:s.diff,gp:s.gp};}).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  // Queens Win %
  const qWinRanks=allPlayers.map(pl=>{const s=queensStats(pl.id,D.matches);return{id:pl.id,val:s.pct,gp:s.gp};}).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  // Game Day +/-
  const gdRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.diff,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  // Game Day Kills
  const gdKillRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.k,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  // Game Day Aces
  const gdAceRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.a,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  // Combined +/-
  const totalRanks=allPlayers.map(pl=>{
    const q=queensStats(pl.id,D.matches),g=extStats(pl.id,D.gamedays),s=extStats(pl.id,D.scrimmages);
    const total=q.diff+g.diff+s.diff,gp=q.gp+g.matches+s.matches;
    return{id:pl.id,val:total,gp};
  }).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);

  function ordinal(n){const s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);}
  function rankHTML(label,ranksArr,pid,formatVal){
    const pos=ranksArr.findIndex(r=>r.id===pid);
    if(pos===-1)return'';
    const total=ranksArr.length;
    const rank=pos+1;
    const pct=total>1?((total-rank)/(total-1))*100:100;
    const myVal=ranksArr[pos].val;
    const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
    const valStr=formatVal?formatVal(myVal):(myVal>0?'+'+myVal:''+myVal);
    return`<div class="rank-row">
      <span class="rank-label">${label}</span>
      <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
      <span class="rank-value">${valStr}</span>
      <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span>
    </div>`;
  }

  let rHTML='';
  rHTML+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:4px 0 8px;">Match Stats</div>';
  rHTML+=rankHTML('Queens +/-',qRanks,pid);
  rHTML+=rankHTML('Queens Win%',qWinRanks,pid,v=>Math.round(v)+'%');
  rHTML+=rankHTML('Game Day +/-',gdRanks,pid);
  rHTML+=rankHTML('GD Kills',gdKillRanks,pid,v=>''+v);
  rHTML+=rankHTML('GD Aces',gdAceRanks,pid,v=>''+v);
  rHTML+=rankHTML('Overall +/-',totalRanks,pid);

  rHTML+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:16px 0 8px;">Athleticism</div>';

  // Star Drill ranking (lower is better — reverse sort)
  const drillData2=profilesData?.starDrills||{};
  const drillBests={};
  Object.values(drillData2).forEach(d=>{
    const did=d.playerId||d.player;if(!did)return;
    if(!drillBests[did]||d.time<drillBests[did])drillBests[did]=d.time;
  });
  console.log('Drill bests:',Object.keys(drillBests).length,'players, pid='+pid,'has data:',!!drillBests[pid]);
  const drillRanks=Object.entries(drillBests).map(([id,best])=>({id,val:best})).sort((a,b)=>a.val-b.val); // lower is better
  if(drillRanks.length>=1){
    // For drill, rank 1 = fastest, so we reverse the bar percentage
    const drillPos=drillRanks.findIndex(r=>r.id===pid);
    if(drillPos>=0){
      const total=drillRanks.length,rank=drillPos+1;
      const pct=total>1?((total-rank)/(total-1))*100:100;
      const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
      rHTML+=`<div class="rank-row"><span class="rank-label">Star Drill</span>
        <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
        <span class="rank-value">${drillBests[pid].toFixed(1)}s</span>
        <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
    }
  }

  // Vertical ranking (approach jump, higher is better)
  const vertData2=profilesData?.jumpTests||profilesData?.verticals||{};
  console.log('Vert data entries:',Object.keys(vertData2).length,'profilesData keys:',Object.keys(profilesData||{}).join(','));
  const vertBests={};
  Object.values(vertData2).forEach(v=>{
    const vid=v.playerId||v.player;if(!vid)return;
    const approach=v.approachJump||v.approach||v.approachJumpTouch||'';
    if(approach){
      // Convert to inches for comparison: parse "8'6" format
      const inches=parseHeight(approach);
      if(inches&&(!vertBests[vid]||inches>vertBests[vid].inches)){vertBests[vid]={inches,display:approach};}
    }
  });
  function parseHeight(s){if(!s)return 0;s=String(s);const m=s.match(/(\d+)\D+(\d+)/);if(!m)return 0;return parseInt(m[1])*12+(parseInt(m[2])||0);}
  const vertRanks=Object.entries(vertBests).map(([id,v])=>({id,val:v.inches,display:v.display})).sort((a,b)=>b.val-a.val);
  if(vertRanks.length>=1){
    const vertPos=vertRanks.findIndex(r=>r.id===pid);
    if(vertPos>=0){
      const total=vertRanks.length,rank=vertPos+1;
      const pct=total>1?((total-rank)/(total-1))*100:100;
      const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
      rHTML+=`<div class="rank-row"><span class="rank-label">Approach Jump</span>
        <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
        <span class="rank-value">${vertRanks[vertPos].display}</span>
        <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
    }
  }

  // Block jump ranking
  const blockBests={};
  Object.values(vertData2).forEach(v=>{
    const vid=v.playerId||v.player;if(!vid)return;
    const block=v.blockJump||v.block||v.blockJumpTouch||'';
    if(block){const inches=parseHeight(block);if(inches&&(!blockBests[vid]||inches>blockBests[vid].inches)){blockBests[vid]={inches,display:block};}}
  });
  const blockRanks=Object.entries(blockBests).map(([id,v])=>({id,val:v.inches,display:v.display})).sort((a,b)=>b.val-a.val);
  if(blockRanks.length>=1){
    const blockPos=blockRanks.findIndex(r=>r.id===pid);
    if(blockPos>=0){
      const total=blockRanks.length,rank=blockPos+1;
      const pct=total>1?((total-rank)/(total-1))*100:100;
      const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
      rHTML+=`<div class="rank-row"><span class="rank-label">Block Jump</span>
        <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
        <span class="rank-value">${blockRanks[blockPos].display}</span>
        <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
    }
  }

  // Standing reach ranking (higher is better)
  const reachBests={};
  Object.values(vertData2).forEach(v=>{
    const vid=v.playerId||v.player;if(!vid)return;
    const reach=v.standingReach||v.reach||'';
    if(reach){const inches=parseHeight(reach);if(inches&&(!reachBests[vid]||inches>reachBests[vid].inches)){reachBests[vid]={inches,display:reach};}}
  });
  const reachRanks=Object.entries(reachBests).map(([id,v])=>({id,val:v.inches,display:v.display})).sort((a,b)=>b.val-a.val);
  if(reachRanks.length>=1){
    const reachPos=reachRanks.findIndex(r=>r.id===pid);
    if(reachPos>=0){
      const total=reachRanks.length,rank=reachPos+1;
      const pct=total>1?((total-rank)/(total-1))*100:100;
      const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
      rHTML+=`<div class="rank-row"><span class="rank-label">Standing Reach</span>
        <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
        <span class="rank-value">${reachRanks[reachPos].display}</span>
        <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
    }
  }

  // Height ranking (higher is better)
  const heightData={};
  allPlayers.forEach(pl=>{
    const pp=profilesData?.players?.[pl.id]||{};
    const h=pp.height||'';
    if(h){const inches=parseHeight(h);if(inches)heightData[pl.id]={inches,display:h};}
  });
  const heightRanks=Object.entries(heightData).map(([id,v])=>({id,val:v.inches,display:v.display})).sort((a,b)=>b.val-a.val);
  if(heightRanks.length>=1){
    const heightPos=heightRanks.findIndex(r=>r.id===pid);
    if(heightPos>=0){
      const total=heightRanks.length,rank=heightPos+1;
      const pct=total>1?((total-rank)/(total-1))*100:100;
      const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
      rHTML+=`<div class="rank-row"><span class="rank-label">Height</span>
        <div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div>
        <span class="rank-value">${heightRanks[heightPos].display}</span>
        <span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
    }
  }

  // Skill rankings — average and individual
  rHTML+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:16px 0 8px;">Skills</div>';
  const skillNames=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const skillLabels={serving:'Serving',passing:'Passing',setting:'Setting',hitting:'Hitting',blocking:'Blocking',defense:'Defense',courtSense:'Court Sense',communication:'Communication'};
  const playerSkills={};
  allPlayers.forEach(pl=>{
    const sk=profilesData?.skills?.[pl.id]||profilesData?.players?.[pl.id]?.skills||{};
    const hasSkills=skillNames.some(k=>sk[k]>0);
    if(hasSkills)playerSkills[pl.id]=sk;
  });

  // Average skill ranking
  const avgSkillRanks=Object.entries(playerSkills).map(([id,sk])=>{
    const avg=skillNames.reduce((s,k)=>s+(sk[k]||0),0)/skillNames.length;
    return{id,val:avg};
  }).sort((a,b)=>b.val-a.val);
  rHTML+=rankHTML('Avg Skill Rating',avgSkillRanks,pid,v=>v.toFixed(1));

  // Individual skill rankings
  skillNames.forEach(sk=>{
    const skRanks=Object.entries(playerSkills).map(([id,skills])=>({id,val:skills[sk]||0})).filter(r=>r.val>0).sort((a,b)=>b.val-a.val);
    if(skRanks.length>1)rHTML+=rankHTML(skillLabels[sk],skRanks,pid,v=>''+v);
  });

  document.getElementById('pp-rankings').innerHTML=rHTML||'<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;"><div style="font-size:28px;margin-bottom:8px;">📊</div>Rankings will appear here as match data is recorded.</div>';

  // Queens matches
  const myQ=D.matches.filter(m=>(m.team1||[]).includes(pid)||(m.team2||[]).includes(pid))
    .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(myQ.length){
    let h='';
    myQ.forEach(m=>{
      const onT1=(m.team1||[]).includes(pid);
      const partner=onT1?(m.team1||[]).find(x=>x!==pid):(m.team2||[]).find(x=>x!==pid);
      const opps=onT1?(m.team2||[]):(m.team1||[]);
      const myScore=onT1?(m.score1||0):(m.score2||0);
      const theirScore=onT1?(m.score2||0):(m.score1||0);
      const win=myScore>theirScore;
      const diff=myScore-theirScore;
      h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
        <div><div style="font-size:12px;color:var(--gray);">${fD(m.date)} · Court ${m.court}</div>
          <div style="font-size:13px;font-weight:700;">w/ ${pN(partner)} vs ${opps.map(id=>pN(id)).join(' & ')}</div></div>
        <div style="text-align:right;">
          <div class="set-score ${win?'win':'loss'}" style="font-size:20px;">${myScore}-${theirScore}</div>
          <div class="plus-minus ${pmClass(diff)}" style="font-size:13px;">${pmStr(diff)}</div></div></div>`;
    });
    document.getElementById('pp-queens').innerHTML=h;
  }else{
    document.getElementById('pp-queens').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No Queens matches yet</div>';
  }

  // Schedule, standings, goals, assignment for player
  renderPlayerSchedule();
  renderPlayerGoals();
  renderPlayerAssignment(pid);
  // Profile data (skills, drills, verticals, notes)
  renderPlayerProfileData(pid);
  // Always refresh scouts so data shows without needing a tab click
  renderPlayerScouts();
  // If matches tab is active, render it too
  const activeTab=document.querySelector('.pp-tab-btn.active');
  if(activeTab&&activeTab.textContent.includes('My Matches'))renderPlayerMatches();
  if(activeTab&&activeTab.textContent.includes('Live Dual'))renderPlayerLiveScoring();
}

function renderPlayerSchedule(){
  const games=[...D.schedule.filter(inSeason)].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(!games.length){const _pe=document.getElementById('pp-schedule');if(_pe)_pe.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No schedule yet.</div>';return;}
  const today=td();
  let h='';
  games.forEach(g=>{
    const played=g.scoreUs!=null&&g.scoreThem!=null&&g.scoreUs!==''&&g.scoreThem!=='';
    const win=played&&g.scoreUs>g.scoreThem;
    const upcoming=!played&&g.date>=today;
    const loc=g.location==='away'?'@':'vs';
    h+=`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);">
      <div style="min-width:55px;font-size:12px;color:var(--gray);font-weight:600;">${fD(g.date)}</div>
      <div style="flex:1;"><span style="font-size:11px;color:var(--gray);">${loc}</span> <span style="font-weight:700;font-size:13px;">${g.opponent||'TBD'}</span>
        ${g.time&&upcoming?'<span style="font-size:11px;color:var(--gray);margin-left:4px;">'+g.time+'</span>':''}</div>
      <div style="min-width:40px;text-align:right;">`;
    if(played){h+=`<span style="font-family:'Bebas Neue';font-size:16px;color:${win?'var(--green)':'var(--loss-red)'};">${g.scoreUs}-${g.scoreThem}</span>`;}
    else if(upcoming){h+='<span style="font-size:11px;color:var(--gray);">TBD</span>';}
    h+='</div></div>';
  });
  const _pe2=document.getElementById('pp-schedule');if(_pe2)_pe2.innerHTML=h;
  // Player standings view
  renderPlayerStandings();
}

function renderPlayerStandings(){
  const games=[...D.schedule.filter(inSeason)];
  let leonW=0,leonL=0;
  const oppFromSchedule={};
  games.forEach(g=>{
    if(g.scoreUs!=null&&g.scoreThem!=null){
      g.scoreUs>g.scoreThem?leonW++:leonL++;
      const opp=g.opponent||'';
      if(opp){if(!oppFromSchedule[opp])oppFromSchedule[opp]={w:0,l:0};g.scoreUs>g.scoreThem?oppFromSchedule[opp].l++:oppFromSchedule[opp].w++;}
    }
  });
  const teams={};
  Object.entries(oppFromSchedule).forEach(([name,rec])=>{teams[name]={w:rec.w,l:rec.l,auto:true};});
  Object.entries(D.standings).forEach(([name,s])=>{teams[name]={w:s.w||0,l:s.l||0,auto:false};});
  teams[SC.myStandingsKey]={w:leonW,l:leonL,auto:true};
  const sorted=Object.entries(teams).sort((a,b)=>{
    const pctA=(a[1].w+a[1].l)>0?a[1].w/(a[1].w+a[1].l):0;
    const pctB=(b[1].w+b[1].l)>0?b[1].w/(b[1].w+b[1].l):0;
    return pctB-pctA||b[1].w-a[1].w;
  });
  if(!sorted.length){const _pst=document.getElementById('pp-standings');if(_pst)_pst.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No standings data yet.</div>';return;}
  let h='<table class="player-table"><thead><tr><th>#</th><th>Team</th><th>W</th><th>L</th><th>Pct</th></tr></thead><tbody>';
  sorted.forEach(([name,s],i)=>{
    const pct=(s.w+s.l)>0?((s.w/(s.w+s.l))*100).toFixed(0)+'%':'—';
    const isMine=_isOwnStanding(name);
    h+=`<tr style="${isMine?'background:var(--red-bg);font-weight:700;':''}">
      <td style="font-family:'Bebas Neue';font-size:14px;color:var(--gray);">${i+1}</td>
      <td style="${isMine?'color:var(--red);':''}font-weight:700;">${name}${isMine?' '+(SC.teamEmoji||''):''}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--green);">${s.w}</td>
      <td style="font-family:'Bebas Neue';font-size:16px;color:var(--loss-red);">${s.l}</td>
      <td style="font-family:'Bebas Neue';font-size:14px;">${pct}</td></tr>`;
  });
  h+='</tbody></table>';
  const _pst2=document.getElementById('pp-standings');if(_pst2)_pst2.innerHTML=h;
}

function renderPlayerExtMatches(pid,matchList,containerId){
  const myM=matchList.filter(m=>(m.pair||[]).includes(pid)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(!myM.length){
    document.getElementById(containerId).innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No matches yet</div>';
    return;
  }
  let h='';
  myM.forEach(m=>{
    const partner=(m.pair||[]).find(x=>x!==pid);
    const sets=m.sets||[];
    let sw=0,sl=0,mDiff=0;
    h+=`<div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div><div style="font-size:12px;color:var(--gray);">${fD(m.date)} · Court ${m.court||1}</div>
          <div style="font-size:13px;font-weight:700;">w/ ${pN(partner)} vs ${m.opponent||'TBD'}</div></div></div>`;
    if(sets.length){
      sets.forEach((s,i)=>{
        const su=s.scoreUs||0,st=s.scoreThem||0,win=su>st;
        su>st?sw++:sl++;mDiff+=(su-st);
        const ps=s.stats?.[pid]||{};
        const statParts=[];if(ps.k)statParts.push(ps.k+'K');if(ps.b)statParts.push(ps.b+'B');if(ps.a)statParts.push(ps.a+'A');if(ps.d)statParts.push(ps.d+'D');if(ps.e)statParts.push(ps.e+'E');
        h+=`<div class="set-row"><span class="set-label">S${i+1}</span><span class="set-score ${win?'win':'loss'}">${su}-${st}</span>
          ${statParts.length?'<span class="set-stats-mini">'+statParts.join(', ')+'</span>':''}</div>`;
      });
      h+=`<div style="display:flex;gap:12px;margin-top:6px;font-family:'Bebas Neue';font-size:14px;">
        <span>Sets: <strong>${sw}-${sl}</strong></span>
        <span class="plus-minus ${pmClass(mDiff)}">${pmStr(mDiff)}</span></div>`;
    }else{
      h+='<div style="font-size:12px;color:var(--gray);font-style:italic;">No sets recorded</div>';
    }
    h+='</div>';
  });
  document.getElementById(containerId).innerHTML=h;
}

// ============================================================
// GOALS & AI DEVELOPMENT PLANS
// ============================================================
const GOAL_LABELS={
  court1:'Move up to Court 1',court2:'Move up to Court 2',court3:'Earn starting spot on Court 3',hold_court:'Hold my current court assignment',
  d1:'Play D1 college beach volleyball',d2:'Play D2 college beach volleyball',naia:'Play NAIA/JUCO beach volleyball',college_any:'Play college beach volleyball (any level)',
  skill_serving:'Improve my serving',skill_passing:'Improve my passing',skill_setting:'Improve my setting',skill_hitting:'Improve my hitting',
  skill_blocking:'Improve my blocking',skill_defense:'Improve my defense',skill_court_sense:'Improve court sense & IQ',skill_communication:'Improve on-court communication',
  star_drill:'Improve star drill time',vertical:'Increase my vertical jump',jump_serve:'Develop a jump serve',consistency:'Become more consistent',
  both_sides:'Learn to play both sides',versatile:'Be more versatile (hitter + defender)',
  captain:'Become team captain',leader:'Be a vocal leader on court',teammate:'Be a better teammate & communicator',mentor:'Mentor younger players',
  starter:'Earn a starting position',most_improved:'Be most improved player',win_pct:'Improve my win percentage',positive_diff:'Finish season with positive +/-'
};

function addPlayerGoal(){
  if(!currentPlayerId)return;
  const sel=document.getElementById('pp-goal-select');
  const goalType=sel.value;if(!goalType){toast('Select a goal');return;}
  const pid=currentPlayerId;
  const existing=D.goals[pid]||{};
  if(Object.values(existing).some(g=>g.goalType===goalType)){toast('You already have this goal');return;}
  const gid=gi('goal');
  const goalLabel=GOAL_LABELS[goalType]||goalType;
  fbSet('goals/'+pid+'/'+gid,{goalType,label:goalLabel,selectedAt:td(),aiFeedback:null});
  sel.value='';toast('Goal added!');
  try{
    const p=gP(pid);const pname=p?p.firstName+' '+p.lastName:pid;
    const subj=encodeURIComponent('SC.schoolName — New Goal: '+pname);
    const body=encodeURIComponent('Player: '+pname+'\nGoal: '+goalLabel+'\nDate: '+td()+'\n\nLog in to create an AI development plan.');
    const a=document.createElement('a');a.href='mailto:<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="94f9f5e6fff9f7faf1f1e7d4f3f9f5fdf8baf7fbf9">[email&#160;protected]</a>?subject='+subj+'&body='+body;a.style.display='none';document.body.appendChild(a);a.click();document.body.removeChild(a);
  }catch(e){}
}

function removeGoal(pid,gid){
  fbRemove('goals/'+pid+'/'+gid);toast('Goal removed');
}

function getPlayerDataSummary(pid){
  const p=gP(pid);if(!p)return'No data';
  const qs=queensStats(pid,D.matches);
  const gs=extStats(pid,D.gamedays);
  const ss=extStats(pid,D.scrimmages);
  let summary=`Player: ${p.firstName} ${p.lastName}\n`;
  summary+=`Class: ${p.classYear}, Court: ${p.court} (${CL[p.court]||''})\n`;
  summary+=`Queens record: ${qs.wins}-${qs.losses}, +/- ${qs.diff}\n`;
  if(gs.sets>0)summary+=`Game Day: ${gs.setsWon}-${gs.setsLost} sets, +/- ${gs.diff}, ${gs.k}K ${gs.b}B ${gs.a}A ${gs.se}SE ${gs.re}RE ${gs.he}HE ${gs.de}DE\n`;
  if(ss.sets>0)summary+=`Scrimmage: ${ss.setsWon}-${ss.setsLost} sets, +/- ${ss.diff}\n`;
  // Rankings
  const allP=D.players.filter(x=>x.id);
  const qRanks=allP.map(x=>({id:x.id,val:queensStats(x.id,D.matches).diff,gp:queensStats(x.id,D.matches).gp})).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  const qPos=qRanks.findIndex(r=>r.id===pid);
  if(qPos>=0)summary+=`Queens +/- rank: ${qPos+1} of ${qRanks.length}\n`;
  // Skills from profiles data
  const skills=profilesData?.skills?.[pid]||profilesData?.players?.[pid]?.skills||{};
  const skillNames=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const hasSkills=skillNames.some(k=>skills[k]>0);
  if(hasSkills){
    summary+='Skills (1-10): '+skillNames.map(k=>k+': '+(skills[k]||0)).join(', ')+'\n';
    const avg=skillNames.reduce((s,k)=>s+(skills[k]||0),0)/skillNames.length;
    summary+=`Average skill rating: ${avg.toFixed(1)}\n`;
  }
  // Star drill from profiles data
  const drills=Object.values(profilesData?.starDrills||{}).filter(d=>d.playerId===pid||d.player===pid);
  if(drills.length){
    const best=Math.min(...drills.map(d=>d.time));
    const latest=drills.sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0].time;
    summary+=`Star drill: best ${best.toFixed(1)}s, latest ${latest.toFixed(1)}s (${drills.length} attempts)\n`;
  }
  // Verticals from profiles data
  const verts=Object.values(profilesData?.jumpTests||profilesData?.verticals||{}).filter(v=>(v.playerId===pid||v.player===pid)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(verts.length){
    const v=verts[0];
    const reach=v.standingReach||v.reach||'';const block=v.blockJump||v.block||v.blockJumpTouch||'';const approach=v.approachJump||v.approach||v.approachJumpTouch||'';
    if(reach)summary+=`Standing reach: ${reach}\n`;
    if(block)summary+=`Block jump touch: ${block}\n`;
    if(approach)summary+=`Approach jump touch: ${approach}\n`;
  }
  // Height
  const pp=profilesData?.players?.[pid]||{};
  if(pp.height)summary+=`Height: ${pp.height}\n`;
  if(pp.position)summary+=`Position: ${pp.position}\n`;
  if(pp.preferredSide)summary+=`Preferred side: ${pp.preferredSide}\n`;
  // All goals
  const goals=D.goals[pid]||{};
  const goalList=Object.values(goals).map(g=>g.label).join(', ');
  if(goalList)summary+=`Goals: ${goalList}\n`;
  summary+=`Team has ${D.players.length} players across 5 courts. Court 1 = top, Court 3 = development.\n`;
  return summary;
}

async function generateAIPlan(pid,gid){
  const goal=D.goals?.[pid]?.[gid];if(!goal)return;
  const p=gP(pid);if(!p)return;
  if(SC.demoMode){
    // Demo: no live worker call and no Firebase write. Drop a canned draft plan
    // straight into the in-memory goal and re-render, mirroring the success path.
    // When tiers are enabled, vary the canned text by tier so the framing is
    // visible in the Grass Club demo: Garnet aims up to Gold, Gold holds the top.
    let plan;
    if(SC.tiersEnabled && p.tier==='garnet'){
      plan=`${p.firstName}, you have put in honest work toward this goal and it shows in your recent numbers. Your court awareness and competitiveness are exactly the traits that earn a move up to the Gold team.\n\nThe path up is built on consistency. Pick two specific habits, a tighter serve target and a faster transition off the net, and rep them every practice until they hold up under pressure the way the Gold players do.\n\nAdd ten focused minutes to each session on those two habits and track your clean reps against your errors so your progress toward that next level is visible. Check in every two weeks and we will adjust as your numbers climb.\n\nKeep competing for that spot. ${COACH_SIGNOFF}.`;
    }else if(SC.tiersEnabled && p.tier==='gold'){
      plan=`${p.firstName}, you have earned your place on the Gold team and your recent numbers back it up. Your court awareness and competitiveness are real strengths, and now the work is holding that level and excelling.\n\nStaying at the top means sharpening what already works and closing the last small gaps. Pick two specific habits, a tighter serve target and a faster transition off the net, and rep them every practice so your strengths stay strengths against the best competition.\n\nAdd ten focused minutes to each session on those two habits and track your clean reps against your errors so you keep refining at the margins. Check in every two weeks and we will adjust as your numbers move.\n\nKeep setting the standard. ${COACH_SIGNOFF}.`;
    }else{
      plan=`${p.firstName}, you have put in honest work toward this goal and it shows in your recent numbers. Your court awareness and competitiveness are real strengths to build on.\n\nThe next step is turning that foundation into more consistent finishing. Pick two specific habits, a tighter serve target and a faster transition off the net, and rep them every practice.\n\nAdd ten focused minutes to each session on those two habits and track your clean reps against your errors so the progress is visible. Check in every two weeks and we will adjust as your numbers move.\n\nStay patient and keep competing. ${COACH_SIGNOFF}.`;
    }
    if(D.goals[pid]&&D.goals[pid][gid]) D.goals[pid][gid].aiFeedback={text:plan,generatedAt:td(),status:'draft',editedBy:null,approvedAt:null};
    renderCoachGoals();
    toast('AI plan generated — review and approve');
    return;
  }
  const dataSummary=getPlayerDataSummary(pid);
  // Tier framing: only when tiers are enabled and the player is on a named team.
  // Garnet aims to earn a move up to Gold; Gold aims to hold the top and excel.
  let tierFraming='';
  if(SC.tiersEnabled && (p.tier==='gold'||p.tier==='garnet')){
    if(p.tier==='garnet'){
      tierFraming=`\n\nTEAM CONTEXT: This player is on the Garnet (development) team. Frame the plan around the specific skills and habits that would help them earn a move up to the Gold team, treating reaching that next level as the target.`;
    }else{
      tierFraming=`\n\nTEAM CONTEXT: This player is on the Gold (top) team. Frame the plan around holding that level and excelling, refining their strengths and closing remaining gaps so they stay competitive at the top.`;
    }
  }
  const loadingId='ai-loading-'+gid;
  document.getElementById(loadingId).innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is analyzing performance data...</div></div>';

  try{
    const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{role:'user',content:`You are an experienced high school girls beach volleyball coach creating a personalized development plan. Be encouraging but honest. Use beach volleyball terminology only, never indoor volleyball terms.

Formatting rules you must follow without exception: no markdown of any kind, no hashtags, no double asterisks, no em dashes, no bullet point symbols. Use plain sentences and paragraphs only. Add a blank line between every paragraph. End every plan with the sign-off: ${COACH_SIGNOFF}.

PLAYER DATA:
${dataSummary}

GOAL: ${goal.label}${tierFraming}

Write a personalized development plan in 4 to 6 paragraphs. Include:
1. An honest assessment of where the player currently stands relative to this goal, referencing their actual stats and ratings.
2. Three or four specific beach volleyball skills or habits to develop, with real numbers from their data.
3. Specific beach volleyball drills or on-court actions to take.
4. A realistic timeline.

Speak directly to the player using "you" language. Be motivating but realistic. Reference their actual data points.`}]
      })
    });
    const data=await response.json();
    const text=data.content?.map(c=>c.text||'').join('')||'Unable to generate plan. Please try again.';
    fbSet('goals/'+pid+'/'+gid+'/aiFeedback',{text,generatedAt:td(),status:'draft',editedBy:null,approvedAt:null});
    toast('AI plan generated — review and approve');
  }catch(err){
    console.error('AI error:',err);
    document.getElementById(loadingId).innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error generating plan. Check connection and try again.</div>';
  }
}

function openEditFeedback(pid,gid){
  const goal=D.goals?.[pid]?.[gid];if(!goal||!goal.aiFeedback)return;
  const p=gP(pid);
  document.getElementById('edit-modal-body').innerHTML=`
    <div style="font-family:'Bebas Neue';font-size:16px;margin-bottom:4px;">${p?p.firstName+' '+p.lastName:pid}</div>
    <div style="font-size:13px;color:var(--gray);margin-bottom:14px;">Goal: ${goal.label}</div>
    <div class="form-group"><label class="form-label">AI Feedback (edit as needed)</label>
      <textarea class="form-input" id="edit-feedback-text" rows="12" style="font-size:13px;line-height:1.7;">${goal.aiFeedback.text||''}</textarea></div>`;
  document.querySelector('#edit-modal .modal-title').innerHTML='Edit AI Feedback <button class="modal-close" onclick="closeEdit()">✕</button>';
  document.getElementById('edit-save').onclick=function(){
    const text=document.getElementById('edit-feedback-text').value.trim();
    if(!text){toast('Feedback cannot be empty');return;}
    fbSet('goals/'+pid+'/'+gid+'/aiFeedback/text',text);
    fbSet('goals/'+pid+'/'+gid+'/aiFeedback/editedBy','Coach');
    closeEdit();toast('Feedback updated');
  };
  document.getElementById('edit-modal').classList.add('active');
}

function approveGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/aiFeedback/status','approved');
  fbSet('goals/'+pid+'/'+gid+'/aiFeedback/approvedAt',td());
  toast('Goal feedback approved — player can now see it');
  const _ap=gP(pid);
  const _ag=D.goals?.[pid]?.[gid];
  notifyPlayer(pid,'plan',
    'SC.schoolName — Your Training Plan is Ready',
    'Hi '+(_ap?_ap.firstName:'there')+',\n\n'+COACH_LABEL+' has approved your AI training plan for: '+(_ag?_ag.label||_ag.goalType:'your goal')+'.\n\nLog in to the app to view your personalized feedback and next steps.'
  );
}

function unapproveGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/aiFeedback/status','draft');
  fbSet('goals/'+pid+'/'+gid+'/aiFeedback/approvedAt',null);
  toast('Feedback moved back to draft');
}

// Read-only identity glance line (Position / Side / Hand / Class of gradYear), shared by the profile modal and the athlete card so the two cannot diverge. Returns a plain text string; missing fields are omitted exactly as before, and an empty record yields the same placeholder.
function athleteGlanceLine(pid){
  const _idp=profilesData?.players?.[pid]||{};
  const _cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
  const _sideL={L:'Left',R:'Right'},_handL={R:'Right',L:'Left'};
  const _pieces=[];
  if(_idp.position)_pieces.push('Position: '+_cap(_idp.position));
  if(_idp.preferredSide)_pieces.push('Side: '+(_sideL[_idp.preferredSide]||_idp.preferredSide));
  if(_idp.dominantHand)_pieces.push('Hand: '+(_handL[_idp.dominantHand]||_idp.dominantHand));
  if(_idp.gradYear)_pieces.push('Class of '+_idp.gradYear);
  return _pieces.length?_pieces.join('  ·  '):'No identity details set yet';
}

// Player portal goals rendering
function renderPlayerProfileData(pid){
  const skillNames=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const skillLabels={serving:'Serving',passing:'Passing',setting:'Setting',hitting:'Hitting',blocking:'Blocking',defense:'Defense',courtSense:'Court Sense',communication:'Communication'};
  function skillColor(v){return v>=8?'var(--green)':v>=6?'var(--gold)':'var(--red)';}

  // Skills
  const sk=profilesData?.skills?.[pid]||profilesData?.players?.[pid]?.skills||{};
  if(skillNames.some(k=>sk[k]>0)){
    let h='';skillNames.forEach(k=>{const v=sk[k]||0;
      h+=`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;">
        <span style="font-size:12px;font-weight:600;min-width:100px;text-transform:capitalize;">${skillLabels[k]}</span>
        <div style="flex:1;height:8px;border-radius:4px;background:var(--gray-lighter);overflow:hidden;">
          <div style="height:100%;border-radius:4px;width:${v*10}%;background:${skillColor(v)};"></div></div>
        <span style="font-family:'Bebas Neue';font-size:14px;min-width:24px;text-align:right;color:${skillColor(v)}">${v}</span></div>`;});
    const avg=skillNames.reduce((s,k)=>s+(sk[k]||0),0)/skillNames.length;
    h+=`<div style="text-align:right;font-size:12px;color:var(--gray);margin-top:6px;">Average: <strong>${avg.toFixed(1)}</strong>/10</div>`;
    document.getElementById('pp-skills').innerHTML=h;
  }else{document.getElementById('pp-skills').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No skill ratings yet.</div>';}

  // Star Drill
  const allDrills=Object.values(profilesData?.starDrills||{});
  const myDrills=allDrills.filter(d=>(d.playerId===pid||d.player===pid)).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(myDrills.length){
    const best=Math.min(...myDrills.map(d=>d.time));
    const latest=myDrills[myDrills.length-1].time;
    let h=`<div style="display:flex;gap:20px;margin-bottom:12px;">
      <div><span style="font-size:12px;color:var(--gray);font-weight:600;">Best</span><div style="font-family:'Bebas Neue';font-size:24px;color:var(--green);">${best.toFixed(1)}s</div></div>
      <div><span style="font-size:12px;color:var(--gray);font-weight:600;">Latest</span><div style="font-family:'Bebas Neue';font-size:24px;">${latest.toFixed(1)}s</div></div>
      <div><span style="font-size:12px;color:var(--gray);font-weight:600;">Attempts</span><div style="font-family:'Bebas Neue';font-size:24px;">${myDrills.length}</div></div></div>`;
    // Sparkline
    h+='<div style="display:flex;align-items:end;gap:2px;height:30px;margin-bottom:8px;">';
    const maxT=Math.max(...myDrills.map(d=>d.time)),minT=best;
    myDrills.slice(-12).forEach(d=>{const pct=maxT===minT?50:((maxT-d.time)/(maxT-minT))*100;
      h+=`<div style="width:6px;border-radius:2px;background:${d.time===best?'var(--green)':'var(--red)'};height:${Math.max(10,pct)}%;" title="${d.date}: ${d.time}s"></div>`;});
    h+='</div>';
    // History
    myDrills.slice().reverse().forEach(d=>{
      h+=`<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-bottom:1px solid rgba(0,0,0,0.04);">
        <span style="color:var(--gray);">${fD(d.date)}</span>
        <span style="font-family:'Bebas Neue';font-size:16px;color:${d.time===best?'var(--green)':'var(--black)'}">${d.time.toFixed(1)}s</span></div>`;});
    document.getElementById('pp-drills').innerHTML=h;
  }else{document.getElementById('pp-drills').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No drill times recorded yet.</div>';}

  // Verticals
  const allVerts=Object.values(profilesData?.jumpTests||profilesData?.verticals||{});
  const myVerts=allVerts.filter(v=>(v.playerId===pid||v.player===pid)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(myVerts.length){
    const v=myVerts[0];
    const sr=v.standingReach||v.reach||'';const bj=v.blockJump||v.block||v.blockJumpTouch||'';const aj=v.approachJump||v.approach||v.approachJumpTouch||'';
    let h='';
    if(sr)h+=`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:13px;"><span style="color:var(--gray);font-weight:600;">Standing Reach</span><span style="font-weight:700;">${sr}</span></div>`;
    if(bj)h+=`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:13px;"><span style="color:var(--gray);font-weight:600;">Block Jump</span><span style="font-weight:700;">${bj}</span></div>`;
    if(aj)h+=`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:13px;"><span style="color:var(--gray);font-weight:600;">Approach Jump</span><span style="font-weight:700;">${aj}</span></div>`;
    h+=`<div style="font-size:11px;color:var(--gray);margin-top:6px;">Measured ${fD(v.date)}</div>`;
    if(myVerts.length>1){h+=`<div style="font-size:11px;color:var(--gray);">${myVerts.length} measurements on record</div>`;}
    document.getElementById('pp-verts').innerHTML=h;
  }else{document.getElementById('pp-verts').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No vertical measurements yet.</div>';}

  // Coach Notes
  const allNotes=Object.values(profilesData?.notes||{});
  const myNotes=allNotes.filter(n=>(n.player===pid||n.playerId===pid)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  // Also check embedded notes in player object
  const playerObj=profilesData?.players?.[pid]||{};
  if(playerObj.notes&&typeof playerObj.notes==='object'){
    Object.values(playerObj.notes).forEach(n=>{if(n&&n.text&&!myNotes.find(x=>x.text===n.text)){myNotes.push({date:n.date||'',text:n.text});}});
    myNotes.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  }
  if(myNotes.length){
    document.getElementById('pp-notes').innerHTML=myNotes.map(n=>
      `<div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
        <div style="font-size:11px;color:var(--gray);font-weight:600;">${fD(n.date)}</div>
        <div style="font-size:13px;margin-top:2px;line-height:1.5;">${n.text}</div></div>`).join('');
  }else{document.getElementById('pp-notes').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No coach notes yet.</div>';}
}

// ============================================================
// COACH PLAYER PROFILE MODAL
// ============================================================
function coachOpenPlayer(pid){
  const p=gP(pid);if(!p)return;
  const CL_LABELS={1:'Top',2:'Mid',3:'Dev',4:'Court 4',5:'Court 5'};
  const modal=document.getElementById('coach-player-modal');
  const overlay=document.getElementById('coach-player-overlay');
  if(!modal||!overlay)return;
  // Header
  document.getElementById('cpm-name').textContent=p.firstName+' '+p.lastName;
  // Photo avatar (club only, null-safe): the cpm-photo mount exists only in the club header, so HS is
  // untouched. Promoted prospects may carry a photo; existing players have none and fall back to initials.
  const _cpmPhoto=document.getElementById('cpm-photo'); if(SC.tiersEnabled&&_cpmPhoto)_cpmPhoto.innerHTML=avatarHtml(p,56);
  document.getElementById('cpm-meta').innerHTML=`<span class="class-badge class-${p.classYear}">${p.classYear}</span> <span class="court-badge court-${p.court}">PG ${p.court} — ${CL_LABELS[p.court]||''}</span>`;
  // Tier control (Grass Club only, gated on SC.tiersEnabled so Leon, South Walton, and the demo never see it).
  // Badge shows the current tier; the coach role additionally gets a setter that writes onto the player record.
  if(SC.tiersEnabled){
    const TIER_LABELS={unassigned:'Unassigned',gold:'Gold',garnet:'Garnet'};
    const curTier=p.tier||'unassigned';
    let tierHtml=` <span class="tier-badge tier-${curTier}" id="cpm-tier-badge">${TIER_LABELS[curTier]}</span>`;
    if(currentRole==='coach'){
      tierHtml+=`<select class="tier-select" onchange="coachSetTier('${pid}',this.value)">`+
        ['unassigned','gold','garnet'].map(t=>`<option value="${t}" ${t===curTier?'selected':''}>${TIER_LABELS[t]}</option>`).join('')+
        `</select>`;
    }
    // Player request flag: if this player has a pending tier request, surface it so the coach can act via the select above.
    const tierReq=(D.tierRequests||{})[pid];
    if(tierReq&&tierReq.tier){
      tierHtml+=` <span class="tier-badge tier-${tierReq.tier}" id="cpm-tier-req" title="Player requested this tier">Requested: ${TIER_LABELS[tierReq.tier]||tierReq.tier}</span>`;
    }
    document.getElementById('cpm-meta').innerHTML+=tierHtml;
    // Leadership marker control (Grass Club only, coach role only). Sets p.leadership = exec | faculty | none. The chat layers read this later.
    if(currentRole==='coach'){
      const LEADER_LABELS={'':'None',exec:'Exec',faculty:'Faculty Advisor'};
      const curLead=p.leadership||'';
      let leaderHtml=` <span id="cpm-leader-badge" style="font-size:11px;font-weight:700;color:var(--gray);margin-left:4px;">${LEADER_LABELS[curLead]}</span>`;
      leaderHtml+=`<select class="tier-select" onchange="coachSetLeadership('${pid}',this.value)">`+
        ['','exec','faculty'].map(v=>`<option value="${v}" ${v===curLead?'selected':''}>${LEADER_LABELS[v]}</option>`).join('')+
        `</select>`;
      document.getElementById('cpm-meta').innerHTML+=leaderHtml;
    }
    // Good-standing control (exec/coach role only). Not-in-good-standing carries a short note the
    // member sees and blocks them from joining travel; clearing it returns them to good standing.
    if(currentRole==='coach'){
      const sb=document.getElementById('cpm-standing-block');
      if(sb) sb.innerHTML=standingEditorHtml(pid);
    }
  }
  else{
    // HS tier control: Roster / Development, the Team-pillar analog of the club Gold / Garnet.
    // Coach-only setter, same coachSetTier write. No player-side tier request or leadership roles here.
    const HS_TIER_LABELS={unassigned:'Unassigned',roster:'Roster',development:'Development'};
    const curTier=p.tier||'unassigned';
    let tierHtml=` <span class="tier-badge tier-${curTier}" id="cpm-tier-badge">${HS_TIER_LABELS[curTier]||'Unassigned'}</span>`;
    if(currentRole==='coach'){
      tierHtml+=`<select class="tier-select" onchange="coachSetTier('${pid}',this.value)">`+
        ['unassigned','roster','development'].map(t=>`<option value="${t}" ${t===curTier?'selected':''}>${HS_TIER_LABELS[t]}</option>`).join('')+
        `</select>`;
    }
    document.getElementById('cpm-meta').innerHTML+=tierHtml;
  }
  // Skills sliders
  const SKILL_KEYS=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const SKILL_LABELS={serving:'Serving',passing:'Passing',setting:'Setting',hitting:'Hitting',blocking:'Blocking',defense:'Defense',courtSense:'Court Sense',communication:'Communication'};
  const sk=profilesData?.skills?.[pid]||profilesData?.players?.[pid]?.skills||{};
  let skillsHtml='';
  SKILL_KEYS.forEach(k=>{
    const v=sk[k]||0;
    skillsHtml+=`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;">
      <span style="font-size:12px;font-weight:600;min-width:105px;">${SKILL_LABELS[k]}</span>
      <input type="range" id="cpm-skill-${k}" min="0" max="10" step="1" value="${v}" style="flex:1;" oninput="document.getElementById('cpm-sv-${k}').textContent=this.value">
      <span id="cpm-sv-${k}" style="font-family:'Bebas Neue';font-size:16px;min-width:20px;text-align:right;">${v||'—'}</span>
    </div>`;
  });
  document.getElementById('cpm-skills').innerHTML=skillsHtml;
  // Date defaults
  const t=td();
  const drillDateEl=document.getElementById('cpm-drill-date');
  const vertDateEl=document.getElementById('cpm-vert-date');
  const noteDateEl=document.getElementById('cpm-note-date');
  if(drillDateEl)drillDateEl.value=t;
  if(vertDateEl)vertDateEl.value=t;
  if(noteDateEl)noteDateEl.value=t;
  // Prefill the identity card from the durable profiles record (empty when unset).
  const _idp=profilesData?.players?.[pid]||{};
  const _setIdV=(elId,val)=>{const el=document.getElementById(elId);if(el)el.value=(val==null?'':val);};
  _setIdV('cpm-id-height',_idp.height);
  _setIdV('cpm-id-reach',_idp.reach);
  _setIdV('cpm-id-gradyear',_idp.gradYear);
  _setIdV('cpm-id-position',_idp.position);
  _setIdV('cpm-id-side',_idp.preferredSide);
  _setIdV('cpm-id-hand',_idp.dominantHand);
  _setIdV('cpm-id-truvolley',_idp.truvolley);
  const _pp1=_idp.parent1||{},_pp2=_idp.parent2||{};
  _setIdV('cpm-p1-name',_pp1.name); _setIdV('cpm-p1-email',_pp1.email); _setIdV('cpm-p1-phone',_pp1.phone);
  _setIdV('cpm-p2-name',_pp2.name); _setIdV('cpm-p2-email',_pp2.email); _setIdV('cpm-p2-phone',_pp2.phone);
  // Athlete info demo editor: prefill from the in-memory demo dataset (demo only; unseeded ids leave inputs empty).
  if(SC.demoMode){
    const _aiEdit=_demoAthleteInfo[pid]||{};
    _setIdV('cpm-ai-gpa',_aiEdit.gpa); _setIdV('cpm-ai-sat',_aiEdit.sat); _setIdV('cpm-ai-act',_aiEdit.act);
    _setIdV('cpm-ai-major',_aiEdit.major); _setIdV('cpm-ai-club',_aiEdit.club); _setIdV('cpm-ai-years',_aiEdit.years);
    _setIdV('cpm-ai-tourney',_aiEdit.tourney);
  }
  // Read-only glance line summarizing the durable identity record (shared helper, also used by the athlete card).
  const _idSum=document.getElementById('cpm-id-summary');
  if(_idSum)_idSum.textContent=athleteGlanceLine(pid);
  // Render existing data
  coachRenderDrillHistory(pid);
  coachRenderVertHistory(pid);
  coachRenderNoteHistory(pid);
  coachRenderRankings(pid);
  // Store current pid
  overlay.dataset.pid=pid;
  overlay.classList.add('active');
}

function coachClosePlayer(){
  const overlay=document.getElementById('coach-player-overlay');
  if(overlay)overlay.classList.remove('active');
}

function coachSaveSkills(){
  const overlay=document.getElementById('coach-player-overlay');
  const pid=overlay?.dataset.pid;if(!pid)return;
  const SKILL_KEYS=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const skills={};
  SKILL_KEYS.forEach(k=>{skills[k]=parseInt(document.getElementById('cpm-skill-'+k)?.value)||0;});
  // Demo mode (db null) persists in-memory to profilesData, mirroring the profiles listener.
  if(db){db.ref(SC.dbRoots.profiles+'/skills/'+pid).set(skills);}
  else{profilesData.skills=profilesData.skills||{};profilesData.skills[pid]=skills;}
  toast('Skills saved!');
}

function coachSaveIdentity(){
  const overlay=document.getElementById('coach-player-overlay');
  const pid=overlay?.dataset.pid;if(!pid)return;
  const gv=elId=>document.getElementById(elId)?.value.trim()||null;
  const _mkParent=(n,e,ph)=>{if(!n&&!e&&!ph)return null;const o={};if(n)o.name=n;if(e)o.email=e;if(ph)o.phone=ph;return o;};
  const _tvRaw=document.getElementById('cpm-id-truvolley')?.value.trim();
  const _tv=_tvRaw?parseFloat(_tvRaw):NaN;
  // Merge-write to profiles/players so skills/notes/jumpTests under this player are never clobbered.
  // truvolley/parent1/parent2 write null when cleared (update() removes the key).
  if(db)db.ref(SC.dbRoots.profiles+'/players/'+pid).update({
    height:gv('cpm-id-height'),
    reach:gv('cpm-id-reach'),
    gradYear:parseInt(document.getElementById('cpm-id-gradyear')?.value)||null,
    position:document.getElementById('cpm-id-position')?.value||null,
    preferredSide:document.getElementById('cpm-id-side')?.value||null,
    dominantHand:document.getElementById('cpm-id-hand')?.value||null,
    truvolley:isNaN(_tv)?null:_tv,
    parent1:_mkParent(gv('cpm-p1-name'),gv('cpm-p1-email'),gv('cpm-p1-phone')),
    parent2:_mkParent(gv('cpm-p2-name'),gv('cpm-p2-email'),gv('cpm-p2-phone'))
  });
  toast('Identity saved');
  setTimeout(()=>renderPlayerProfileData(pid),600);
}

function coachAddDrill(){
  const overlay=document.getElementById('coach-player-overlay');
  const pid=overlay?.dataset.pid;if(!pid)return;
  const date=document.getElementById('cpm-drill-date')?.value;
  const timeVal=parseFloat(document.getElementById('cpm-drill-time')?.value);
  if(!date||isNaN(timeVal)||timeVal<=0){toast('Enter date and time');return;}
  const id='sd-'+pid+'-'+Date.now();
  if(db){db.ref(SC.dbRoots.profiles+'/starDrills/'+id).set({id,playerId:pid,player:pid,date,time:timeVal});}
  else{profilesData.starDrills=profilesData.starDrills||{};profilesData.starDrills[id]={id,playerId:pid,player:pid,date,time:timeVal};}
  document.getElementById('cpm-drill-time').value='';
  toast('Drill time added!');
  setTimeout(()=>coachRenderDrillHistory(pid),600);
}

function coachRenderDrillHistory(pid){
  const el=document.getElementById('cpm-drill-history');if(!el)return;
  const drills=Object.values(profilesData?.starDrills||{}).filter(d=>d.playerId===pid||d.player===pid).sort((a,b)=>b.date.localeCompare(a.date));
  if(!drills.length){el.innerHTML='<div style="color:var(--gray);font-size:12px;text-align:center;padding:8px;">No times yet</div>';return;}
  const best=Math.min(...drills.map(d=>d.time));
  el.innerHTML=drills.map(d=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.05);font-size:13px;">
    <span style="color:var(--gray);">${fD(d.date)}</span>
    <span style="font-family:'Bebas Neue';font-size:15px;color:${d.time===best?'var(--green)':'inherit'};">${d.time.toFixed(1)}s${d.time===best?' ★':''}</span>
  </div>`).join('');
}

function coachAddVertical(){
  const overlay=document.getElementById('coach-player-overlay');
  const pid=overlay?.dataset.pid;if(!pid)return;
  const date=document.getElementById('cpm-vert-date')?.value;
  const bj=document.getElementById('cpm-vert-bj')?.value.trim();
  const aj=document.getElementById('cpm-vert-aj')?.value.trim();
  if(!date||(!bj&&!aj)){toast('Enter date and at least one measurement');return;}
  const id='jt-'+pid+'-'+Date.now();
  // Standing reach is now a durable identity field (profiles/players), not a per-test value.
  if(db){db.ref(SC.dbRoots.profiles+'/jumpTests/'+id).set({id,playerId:pid,player:pid,date,blockJump:bj||null,approachJump:aj||null});}
  else{profilesData.jumpTests=profilesData.jumpTests||{};profilesData.jumpTests[id]={id,playerId:pid,player:pid,date,blockJump:bj||null,approachJump:aj||null};}
  ['cpm-vert-bj','cpm-vert-aj'].forEach(i=>{const el=document.getElementById(i);if(el)el.value='';});
  toast('Vertical added!');
  setTimeout(()=>coachRenderVertHistory(pid),600);
}

function coachRenderVertHistory(pid){
  const el=document.getElementById('cpm-vert-history');if(!el)return;
  const pp=profilesData?.players?.[pid]||{};
  const verts=Object.values(profilesData?.jumpTests||profilesData?.verticals||{}).filter(v=>v.playerId===pid||v.player===pid).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const row=(lbl,val)=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:13px;"><span style="color:var(--gray);font-weight:600;">${lbl}</span><span style="font-weight:700;">${val}</span></div>`;
  let h='';
  // Height and standing reach are durable identity fields (profiles/players), not per-test values.
  if(pp.height)h+=row('Height',pp.height);
  if(pp.reach)h+=row('Standing Reach',pp.reach);
  if(verts.length){
    const v=verts[0];
    const bj=v.blockJump||v.block||v.blockJumpTouch||'';
    const aj=v.approachJump||v.approach||v.approachJumpTouch||'';
    if(bj)h+=row('Block Jump',bj);
    if(aj)h+=row('Approach Jump',aj);
    h+=`<div style="font-size:11px;color:var(--gray);margin-top:4px;">Measured ${fD(v.date)}${verts.length>1?' · '+verts.length+' measurements on record':''}</div>`;
    if(verts.length>1){
      h+='<details style="margin-top:8px;"><summary style="font-size:11px;color:var(--gray);cursor:pointer;">Show all measurements</summary>';
      // Existing records keep their historical standing-reach so past measurements stay readable.
      h+=verts.map(v=>`<div style="padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.04);font-size:12px;">
        <div style="color:var(--gray);font-weight:600;">${fD(v.date)}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">${v.standingReach?`<span>Reach: <strong>${v.standingReach}</strong></span>`:''}${v.blockJump?`<span>Block: <strong>${v.blockJump}</strong></span>`:''}${v.approachJump?`<span>App: <strong>${v.approachJump}</strong></span>`:''}</div>
      </div>`).join('');
      h+='</details>';
    }
  }
  if(!h)h='<div style="color:var(--gray);font-size:12px;text-align:center;padding:8px;">No measurements yet</div>';
  el.innerHTML=h;
}

function coachAddNote(){
  const overlay=document.getElementById('coach-player-overlay');
  const pid=overlay?.dataset.pid;if(!pid)return;
  const date=document.getElementById('cpm-note-date')?.value;
  const text=document.getElementById('cpm-note-text')?.value.trim();
  if(!date||!text){toast('Enter date and note');return;}
  const id='note-'+pid+'-'+Date.now();
  if(db){db.ref(SC.dbRoots.profiles+'/notes/'+id).set({id,playerId:pid,player:pid,date,text,coachName:'Coach'});}
  else{profilesData.notes=profilesData.notes||{};profilesData.notes[id]={id,playerId:pid,player:pid,date,text,coachName:'Coach'};}
  document.getElementById('cpm-note-text').value='';
  toast('Note saved!');
  setTimeout(()=>coachRenderNoteHistory(pid),600);
}

function coachRenderNoteHistory(pid){
  const el=document.getElementById('cpm-note-history');if(!el)return;
  const notes=Object.values(profilesData?.notes||{}).filter(n=>n.playerId===pid||n.player===pid).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(!notes.length){el.innerHTML='<div style="color:var(--gray);font-size:12px;text-align:center;padding:8px;">No notes yet</div>';return;}
  el.innerHTML=notes.map(n=>`<div style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
    <div style="font-size:11px;color:var(--gray);font-weight:600;">${fD(n.date)}</div>
    <div style="font-size:13px;margin-top:2px;line-height:1.5;">${n.text}</div>
  </div>`).join('');
}

function coachRenderRankings(pid){
  const el=document.getElementById('cpm-rankings');if(!el)return;
  const allPlayers=D.players.filter(pl=>pl.id);
  function ordinal(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);}
  function rankHTML(label,arr,pid,fmt){
    const pos=arr.findIndex(r=>r.id===pid);if(pos===-1)return'';
    const total=arr.length,rank=pos+1;
    const pct=total>1?((total-rank)/(total-1))*100:100;
    const myVal=arr[pos].val;
    const barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
    const valStr=fmt?fmt(myVal):(myVal>0?'+'+myVal:''+myVal);
    return`<div class="rank-row"><span class="rank-label">${label}</span><div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div><span class="rank-value">${valStr}</span><span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;
  }
  function parseHeight(s){if(!s)return 0;s=String(s);const m=s.match(/(\d+)\D+(\d+)/);if(!m)return 0;return parseInt(m[1])*12+(parseInt(m[2])||0);}
  const qRanks=allPlayers.map(pl=>{const s=queensStats(pl.id,D.matches);return{id:pl.id,val:s.diff,gp:s.gp};}).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  const qWinRanks=allPlayers.map(pl=>{const s=queensStats(pl.id,D.matches);return{id:pl.id,val:s.pct,gp:s.gp};}).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  const gdRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.diff,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  const gdKillRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.k,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  const gdAceRanks=allPlayers.map(pl=>{const s=extStats(pl.id,D.gamedays);return{id:pl.id,val:s.a,sets:s.sets};}).filter(r=>r.sets>0).sort((a,b)=>b.val-a.val);
  const totalRanks=allPlayers.map(pl=>{const q=queensStats(pl.id,D.matches),g=extStats(pl.id,D.gamedays),s=extStats(pl.id,D.scrimmages);return{id:pl.id,val:q.diff+g.diff+s.diff,gp:q.gp+g.matches+s.matches};}).filter(r=>r.gp>0).sort((a,b)=>b.val-a.val);
  let h='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:4px 0 8px;">Match Stats</div>';
  h+=rankHTML('Queens +/-',qRanks,pid);h+=rankHTML('Queens Win%',qWinRanks,pid,v=>Math.round(v)+'%');
  h+=rankHTML('Game Day +/-',gdRanks,pid);h+=rankHTML('GD Kills',gdKillRanks,pid,v=>''+v);h+=rankHTML('GD Aces',gdAceRanks,pid,v=>''+v);h+=rankHTML('Overall +/-',totalRanks,pid);
  // Athleticism
  h+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:16px 0 8px;">Athleticism</div>';
  const drillBests={};Object.values(profilesData?.starDrills||{}).forEach(d=>{const id=d.playerId||d.player;if(id&&(!drillBests[id]||d.time<drillBests[id]))drillBests[id]=d.time;});
  const drillRanks=Object.entries(drillBests).map(([id,val])=>({id,val})).sort((a,b)=>a.val-b.val);
  const drillPos=drillRanks.findIndex(r=>r.id===pid);
  if(drillPos>=0){const total=drillRanks.length,rank=drillPos+1,pct=total>1?((total-rank)/(total-1))*100:100,barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';
    h+=`<div class="rank-row"><span class="rank-label">Star Drill</span><div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div><span class="rank-value">${drillBests[pid].toFixed(1)}s</span><span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;}
  const vertData=profilesData?.jumpTests||profilesData?.verticals||{};
  const vertBests={},blockBests={},reachBests={};
  Object.values(vertData).forEach(v=>{const id=v.playerId||v.player;if(!id)return;
    const ai=parseHeight(v.approachJump||v.approach||v.approachJumpTouch||'');if(ai&&(!vertBests[id]||ai>vertBests[id].inches))vertBests[id]={inches:ai,display:v.approachJump||v.approach||v.approachJumpTouch};
    const bi=parseHeight(v.blockJump||v.block||v.blockJumpTouch||'');if(bi&&(!blockBests[id]||bi>blockBests[id].inches))blockBests[id]={inches:bi,display:v.blockJump||v.block||v.blockJumpTouch};
    const ri=parseHeight(v.standingReach||v.reach||'');if(ri&&(!reachBests[id]||ri>reachBests[id].inches))reachBests[id]={inches:ri,display:v.standingReach||v.reach};});
  function jumpRankHTML(label,bests){const arr=Object.entries(bests).map(([id,v])=>({id,val:v.inches,display:v.display})).sort((a,b)=>b.val-a.val);const pos=arr.findIndex(r=>r.id===pid);if(pos<0)return'';const total=arr.length,rank=pos+1,pct=total>1?((total-rank)/(total-1))*100:100,barClass=rank<=3?'top3':rank<=Math.ceil(total/2)?'mid':'low';return`<div class="rank-row"><span class="rank-label">${label}</span><div class="rank-bar-wrap"><div class="rank-bar-fill ${barClass}" style="width:${Math.max(8,pct)}%"></div></div><span class="rank-value">${arr[pos].display}</span><span class="rank-position">${ordinal(rank)} <span class="ordinal">of ${total}</span></span></div>`;}
  h+=jumpRankHTML('Approach Jump',vertBests);h+=jumpRankHTML('Block Jump',blockBests);h+=jumpRankHTML('Standing Reach',reachBests);
  const heightData={};allPlayers.forEach(pl=>{const pp=profilesData?.players?.[pl.id]||{};const hi=parseHeight(pp.height||'');if(hi)heightData[pl.id]={inches:hi,display:pp.height};});
  h+=jumpRankHTML('Height',heightData);
  // Skills
  h+='<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--gray);margin:16px 0 8px;">Skills</div>';
  const SKILL_KEYS=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const SKILL_LABELS={serving:'Serving',passing:'Passing',setting:'Setting',hitting:'Hitting',blocking:'Blocking',defense:'Defense',courtSense:'Court Sense',communication:'Communication'};
  const playerSkills={};
  allPlayers.forEach(pl=>{const sk=profilesData?.skills?.[pl.id]||profilesData?.players?.[pl.id]?.skills||{};if(SKILL_KEYS.some(k=>sk[k]>0))playerSkills[pl.id]=sk;});
  const avgSkillRanks=Object.entries(playerSkills).map(([id,sk])=>({id,val:SKILL_KEYS.reduce((s,k)=>s+(sk[k]||0),0)/SKILL_KEYS.length})).sort((a,b)=>b.val-a.val);
  h+=rankHTML('Avg Skill Rating',avgSkillRanks,pid,v=>v.toFixed(1));
  SKILL_KEYS.forEach(sk=>{const arr=Object.entries(playerSkills).map(([id,skills])=>({id,val:skills[sk]||0})).filter(r=>r.val>0).sort((a,b)=>b.val-a.val);if(arr.length>1)h+=rankHTML(SKILL_LABELS[sk],arr,pid,v=>''+v);});
  el.innerHTML=h||'<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">Rankings will appear as data is recorded.</div>';
}

function playerGoalCollapse(gid){
  const el=document.getElementById('pgfb-'+gid);
  const btn=document.getElementById('pgcol-'+gid);
  if(!el||!btn)return;
  const hidden=el.style.display==='none';
  el.style.display=hidden?'':'none';
  btn.textContent=hidden?'\u25b2 Collapse':'\u25bc Show Plan';
}
function archivePlayerGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/archivedPlayer',true);
  toast('Goal archived \u2014 find it in Past Goals any time');
}
function unarchivePlayerGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/archivedPlayer',false);
}
function renderPlayerGoals(){
  if(!currentPlayerId)return;
  const pid=currentPlayerId;
  const goals=D.goals[pid]||{};
  const entries=Object.entries(goals);
  if(!entries.length){
    document.getElementById('pp-goals-list').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;"><div style="font-size:28px;margin-bottom:8px;">\ud83c\udfaf</div>No goals set yet \u2014 choose one from the dropdown below!</div>';
    return;
  }
  const active=entries.filter(([,g])=>!(g.archivedPlayer??g.archived));
  const archived=entries.filter(([,g])=>!!(g.archivedPlayer??g.archived));
  let h='';
  if(!active.length){
    h+='<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;"><div style="font-size:24px;margin-bottom:6px;">\ud83c\udfaf</div>All goals responded to \u2014 add a new one below or check Past Goals!</div>';
  }
  active.forEach(([gid,g])=>{
    const fb=g.aiFeedback;
    const approved=fb&&fb.status==='approved';
    const hasDraft=fb&&fb.status==='draft';
    h+=`<div class="goal-card ${approved?'approved':hasDraft?'draft':''}">
      <div class="goal-header">
        <span class="goal-label">${g.label||g.goalType}</span>
        ${approved?'<span class="goal-status approved">\u2713 Plan Ready</span>':
          hasDraft?'<span class="goal-status ai-ready">Pending '+COACH_LABEL+' Review</span>':
          '<span class="goal-status pending">Awaiting '+COACH_LABEL+'\'s Plan</span>'}
      </div>
      <div style="font-size:11px;color:var(--gray);">Set on ${fD(g.selectedAt)}</div>`;
    if(approved&&fb){
      h+=`<div id="pgfb-${gid}" class="goal-feedback">${fb.text}
        <div class="coach-stamp">Approved by coach on ${fD(fb.approvedAt)}</div></div>
        <div class="goal-actions">
          <button id="pgcol-${gid}" class="btn btn-secondary btn-small" onclick="playerGoalCollapse('${gid}')">\u25b2 Collapse</button>
          <button class="btn btn-small" style="background:var(--green);color:#fff;border:none;" onclick="archivePlayerGoal('${pid}','${gid}')">\u2713 Archive</button>
        </div>`;
    }else if(hasDraft){
      h+='<div style="font-size:12px;color:var(--gray);margin-top:8px;font-style:italic;">Your coach is reviewing your development plan. Check back soon!</div>';
      h+=`<div class="goal-actions"><button class="btn btn-danger btn-small" onclick="removeGoal('${pid}','${gid}')">Remove Goal</button></div>`;
    }else{
      h+='<div style="font-size:12px;color:var(--gray);margin-top:8px;font-style:italic;">Your coach will create a personalized development plan for this goal.</div>';
      h+=`<div class="goal-actions"><button class="btn btn-danger btn-small" onclick="removeGoal('${pid}','${gid}')">Remove Goal</button></div>`;
    }
    h+='</div>';
  });
  if(archived.length){
    const showId='past-goals-section';
    h+=`<div style="margin-top:16px;">
      <button class="btn btn-secondary btn-small" style="width:100%;margin-bottom:8px;" onclick="(function(b){const el=document.getElementById('${showId}');const hidden=el.style.display==='none';el.style.display=hidden?'':'none';b.textContent=hidden?'\u25b2 Hide Past Goals':'\u25bc Past Goals (${archived.length})';}).call(this,this)">\u25bc Past Goals (${archived.length})</button>
      <div id="${showId}" style="display:none;">`;
    archived.forEach(([gid,g])=>{
      const fb=g.aiFeedback;
      h+=`<div class="goal-card approved" style="opacity:0.7;">
        <div class="goal-header">
          <span class="goal-label">${g.label||g.goalType}</span>
          <span class="goal-status approved">\u2713 Archived</span>
        </div>
        <div style="font-size:11px;color:var(--gray);">Set on ${fD(g.selectedAt)}</div>`;
      if(fb&&fb.text){
        h+=`<div class="goal-feedback" style="margin-top:8px;">${fb.text}
          <div class="coach-stamp">Approved on ${fD(fb.approvedAt)}</div></div>`;
      }
      h+=`<div class="goal-actions">
        <button class="btn btn-secondary btn-small" onclick="unarchivePlayerGoal('${pid}','${gid}')">\u21a9 Restore</button>
      </div></div>`;
    });
    h+='</div></div>';
  }
  document.getElementById('pp-goals-list').innerHTML=h;
}

// Coach goals rendering
let _showArchivedGoals=false;
let _selectedGoals={};

function toggleArchivedGoals(){
  _showArchivedGoals=!_showArchivedGoals;
  renderCoachGoals();
}
function toggleGoalCheck(pid,gid){
  if(!_selectedGoals[pid])_selectedGoals[pid]=new Set();
  if(_selectedGoals[pid].has(gid))_selectedGoals[pid].delete(gid);
  else _selectedGoals[pid].add(gid);
  const btn=document.getElementById('combine-btn-'+pid);
  if(btn)btn.style.display=(_selectedGoals[pid]&&_selectedGoals[pid].size>=2)?'inline-block':'none';
}
function combineGoals(pid){
  const sel=_selectedGoals[pid];
  if(!sel||sel.size<2){toast('Select at least 2 goals to combine');return;}
  const goals=D.goals[pid]||{};
  const gids=[...sel];
  const labels=gids.map(gid=>(goals[gid]?.label||goals[gid]?.goalType||gid));
  const combinedLabel=labels.join(' + ');
  const combinedFrom=gids.map(gid=>({gid,label:goals[gid]?.label||goals[gid]?.goalType||gid}));
  const newGid=gi('goal');
  fbSet('goals/'+pid+'/'+newGid,{goalType:'combined',label:combinedLabel,selectedAt:td(),aiFeedback:null,combinedFrom});
  gids.forEach(gid=>fbRemove('goals/'+pid+'/'+gid));
  _selectedGoals[pid]=new Set();
  toast('Goals combined \u2713');
}
function archiveCoachGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/archivedCoach',true);
  toast('Goal archived from your view — player can still see it');
}
function unarchiveCoachGoal(pid,gid){
  fbSet('goals/'+pid+'/'+gid+'/archivedCoach',false);
  toast('Goal restored to coach view');
}
function renderCoachGoals(){
  const filter=document.getElementById('goals-player-filter');
  const curFilter=filter.value;
  filter.innerHTML='<option value="all">All Players</option>';
  const sorted=[...D.players].sort((a,b)=>_cmpCourt(a,b)||_cmpLast(a,b));
  sorted.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.firstName+' '+p.lastName;filter.appendChild(o);});
  filter.value=curFilter||'all';

  const container=document.getElementById('coach-goals-list');
  let h='';
  const playerIds=curFilter==='all'?D.players.map(p=>p.id):[curFilter];

  h+=`<div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
    <button class="btn btn-secondary btn-small" onclick="toggleArchivedGoals()">
      ${_showArchivedGoals?'\ud83d\udd12 Hide Archived':'\ud83d\udcc2 Show Archived'}
    </button>
  </div>`;

  let anyGoals=false;
  playerIds.forEach(pid=>{
    const p=gP(pid);if(!p)return;
    const goals=D.goals[pid]||{};
    const allEntries=Object.entries(goals);
    const active=allEntries.filter(([,g])=>!(g.archivedCoach??g.archived));
    const archiveCount=allEntries.filter(([,g])=>!!(g.archivedCoach??g.archived)).length;
    const entries=_showArchivedGoals?allEntries:active;
    if(!entries.length&&!archiveCount)return;
    if(!entries.length&&archiveCount&&!_showArchivedGoals)return;
    if(!entries.length)return;
    anyGoals=true;
    if(!_selectedGoals[pid])_selectedGoals[pid]=new Set();

    h+=`<div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--charcoal);margin:16px 0 8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      ${p.firstName} ${p.lastName} <span class="court-badge court-${p.court}">CT${p.court}</span><span class="class-badge class-${p.classYear}">${p.classYear}</span>
      <button id="combine-btn-${pid}" class="btn btn-small" style="display:none;background:var(--blue);color:#fff;border:none;font-size:11px;padding:3px 10px;" onclick="combineGoals('${pid}')">\ud83d\udd17 Combine Selected</button>
    </div>`;

    entries.forEach(([gid,g])=>{
      const fb=g.aiFeedback;
      const approved=fb&&fb.status==='approved';
      const hasDraft=fb&&fb.status==='draft';
      const hasFeedback=!!fb;
      const isArchived=!!(g.archivedCoach??g.archived);
      const canCombine=!approved&&!isArchived;

      h+=`<div class="goal-card ${approved?'approved':hasDraft?'draft':''}" style="${isArchived?'opacity:0.55;':''}">
        <div class="goal-header">
          <div style="display:flex;align-items:center;gap:8px;">
            ${canCombine?`<input type="checkbox" style="width:15px;height:15px;accent-color:var(--blue);cursor:pointer;" onchange="toggleGoalCheck('${pid}','${gid}')" ${_selectedGoals[pid]&&_selectedGoals[pid].has(gid)?'checked':''}>`:''}
            <span class="goal-label">${g.label||g.goalType}</span>
            ${g.combinedFrom?'<span style="font-size:10px;color:var(--gray);font-style:italic;">combined</span>':''}
          </div>
          ${isArchived?'<span class="goal-status pending">Archived</span>':
            approved?'<span class="goal-status approved">\u2713 Approved</span>':
            hasDraft?'<span class="goal-status ai-ready">Draft \u2014 Review</span>':
            '<span class="goal-status pending">No Plan Yet</span>'}
        </div>
        ${g.combinedFrom?`<div style="font-size:11px;color:var(--gray);margin-bottom:4px;">Combined from: ${g.combinedFrom.map(x=>x.label).join(' \u00b7 ')}</div>`:''}
        <div style="font-size:11px;color:var(--gray);">Set on ${fD(g.selectedAt)}</div>`;

      if(hasFeedback){
        h+=`<div class="goal-feedback">${fb.text}
          ${fb.editedBy?'<div class="coach-stamp">Edited by '+fb.editedBy+'</div>':''}
          ${approved?'<div class="coach-stamp">Approved on '+fD(fb.approvedAt)+'</div>':''}</div>`;
      }
      h+='<div id="ai-loading-'+gid+'"></div>';
      h+='<div class="goal-actions">';
      if(isArchived){
        h+=`<button class="btn btn-secondary btn-small" onclick="unarchiveCoachGoal('${pid}','${gid}')">\u21a9 Restore</button>`;
        h+=`<button class="btn btn-danger btn-small" onclick="removeGoal('${pid}','${gid}')">\u2715 Delete</button>`;
      }else{
        if(!hasFeedback){
          h+=`<button class="btn btn-small" style="background:var(--gold);color:var(--black);" onclick="generateAIPlan('${pid}','${gid}')">\ud83e\udd16 Generate AI Plan</button>`;
        }else{
          h+=`<button class="btn btn-small" style="background:var(--gold);color:var(--black);" onclick="generateAIPlan('${pid}','${gid}')">\ud83d\udd04 Regenerate</button>`;
          h+=`<button class="btn btn-secondary btn-small" onclick="openEditFeedback('${pid}','${gid}')">\u270e Edit</button>`;
          if(!approved)h+=`<button class="btn btn-success btn-small" onclick="approveGoal('${pid}','${gid}')">\u2713 Approve</button>`;
          else{
            h+=`<button class="btn btn-secondary btn-small" onclick="unapproveGoal('${pid}','${gid}')">\u21a9 Unapprove</button>`;
            h+=`<button class="btn btn-small" style="background:var(--green);color:#fff;border:none;" onclick="archiveCoachGoal('${pid}','${gid}')">\ud83d\udcc2 Archive</button>`;
          }
        }
        h+=`<button class="btn btn-danger btn-small" onclick="removeGoal('${pid}','${gid}')">\u2715</button>`;
      }
      h+='</div></div>';
    });
    if(!_showArchivedGoals&&archiveCount){
      h+=`<div style="font-size:11px;color:var(--gray);font-style:italic;margin-bottom:8px;">\ud83d\udcc2 ${archiveCount} archived goal${archiveCount>1?'s':''} hidden</div>`;
    }
  });

  if(!anyGoals)h+='<div class="empty-state"><div class="emoji">\ud83c\udfaf</div><p>No player goals set yet. Players can set goals from their portal.</p></div>';
  container.innerHTML=h;
}

// Goals filter listener
document.getElementById('goals-player-filter').addEventListener('change',renderCoachGoals);

// ============================================================
// AI PAIRING RECOMMENDATIONS
// ============================================================
function buildTeamDataForPairings(){
  const allP=D.players.filter(p=>p.id);
  const allDrillsAI=Object.values(profilesData?.starDrills||{});
  const allVertsAI=Object.values(profilesData?.jumpTests||profilesData?.verticals||{});
  let data='TEAM ROSTER & DATA:\n';
  data+='Practice Groups: 1=strongest, 5=developing. Used for internal grouping only.\n\n';
  allP.forEach(p=>{
    const sk=profilesData?.skills?.[p.id]||profilesData?.players?.[p.id]?.skills||{};
    const qs=queensStats(p.id,D.matches);
    const gs=extStats(p.id,D.gamedays);
    const ss=extStats(p.id,D.scrimmages);
    const pp=profilesData?.players?.[p.id]||{};
    data+=`${p.firstName} ${p.lastName} (${p.id}): ${p.classYear}, PG ${p.court}`;
    data+=`, Position: ${pp.position||'unknown'}, Side: ${pp.preferredSide||'unknown'}, Hand: ${pp.dominantHand||'right'}`;
    if(pp.height)data+=`, Height: ${pp.height}`;
    const skillNames=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
    const hasSkills=skillNames.some(k=>sk[k]>0);
    if(hasSkills)data+=`, Skills: ${skillNames.map(k=>k.charAt(0).toUpperCase()+':'+((sk[k]||0))).join(' ')}`;
    // Star drill
    const myDrills=allDrillsAI.filter(d=>(d.playerId===p.id||d.player===p.id));
    if(myDrills.length){const best=Math.min(...myDrills.map(d=>d.time));data+=`, Star Drill: ${best.toFixed(1)}s (${myDrills.length} attempts)`;}
    // Verticals
    const myVerts=allVertsAI.filter(v=>(v.playerId===p.id||v.player===p.id)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    if(myVerts.length){
      const v=myVerts[0];
      const reach=v.standingReach||v.reach||'';const block=v.blockJump||v.block||v.blockJumpTouch||'';const approach=v.approachJump||v.approach||v.approachJumpTouch||'';
      if(reach)data+=`, Reach: ${reach}`;
      if(block)data+=`, Block Jump: ${block}`;
      if(approach)data+=`, Approach Jump: ${approach}`;
    }
    // Match stats
    if(qs.gp>0)data+=`, Queens: ${qs.wins}-${qs.losses} (${qs.diff>=0?'+':''}${qs.diff})`;
    if(gs.sets>0)data+=`, GD: ${gs.setsWon}-${gs.setsLost} sets (${gs.diff>=0?'+':''}${gs.diff}), K:${gs.k} B:${gs.b} A:${gs.a} SE:${gs.se} RE:${gs.re} HE:${gs.he} DE:${gs.de}`;
    if(ss.sets>0)data+=`, Scrim: ${ss.setsWon}-${ss.setsLost} sets`;
    data+='\n';
  });
  // Add pair history from Queens
  data+='\nPAIR HISTORY (Queens matches — who paired together and their combined record):\n';
  const pairHist={};
  D.matches.filter(inSeason).forEach(m=>{
    const t1=(m.team1||[]).sort().join('+'),t2=(m.team2||[]).sort().join('+');
    [t1,t2].forEach((key,i)=>{
      if(!pairHist[key])pairHist[key]={w:0,l:0,diff:0};
      const won=i===0?(m.score1>m.score2):(m.score2>m.score1);
      const myScore=i===0?m.score1:m.score2, oppScore=i===0?m.score2:m.score1;
      won?pairHist[key].w++:pairHist[key].l++;
      pairHist[key].diff+=(myScore-oppScore);
    });
  });
  Object.entries(pairHist).forEach(([key,rec])=>{
    const ids=key.split('+');
    const names=ids.map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName.charAt(0)+'.':id;}).join(' & ');
    data+=`${names}: ${rec.w}-${rec.l}, +/-${rec.diff>=0?'+':''}${rec.diff}\n`;
  });
  // Add Game Day pair history
  data+='\nGAME DAY PAIR HISTORY:\n';
  D.gamedays.filter(inSeason).forEach(m=>{
    if(!m.pair||m.pair.length<2)return;
    const names=m.pair.map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName.charAt(0)+'.':id;}).join(' & ');
    const sets=m.sets||[];let sw=0,sl=0;
    sets.forEach(s=>{(s.scoreUs||0)>(s.scoreThem||0)?sw++:sl++;});
    if(sets.length)data+=`${names} vs ${m.opponent}: ${sw}-${sl} sets\n`;
  });
  return data;
}

async function generateAIPairings(){
  const numCourts=parseInt(document.getElementById('ai-pair-courts').value)||3;
  const context=document.getElementById('ai-pair-context').value;
  const numRounds=context==='queens'?parseInt(document.getElementById('ai-pair-rounds')?.value||1):1;
  const aiDate=document.getElementById('ai-pair-date')?.value||td();
  const aiLocation=document.getElementById('ai-pair-location')?.value||SC.homeVenue||'Tom Brown';
  const aiTime=document.getElementById('ai-pair-time')?.value||'';
  const container=document.getElementById('ai-pairings-result');
  const btn=document.getElementById('ai-pair-btn');

  const contextDesc={
    gameday:'This is for a GAME DAY match against an external opponent. Prioritize the strongest possible pairings on each court. Court 1 gets the best pair, Court 2 next best, etc.',
    scrimmage:'This is for a SCRIMMAGE (non-season match). Mix up the pairings a bit to develop players and try new combinations, while still being competitive.',
    queens:`This is QUEENS PRACTICE, internal ${SCHOOL_NAME} vs ${SCHOOL_NAME}. Generate ${numRounds} round${numRounds>1?'s':''} of matchups. ALL 16 players must be assigned every round, 4 per court (2 vs 2). In each round every player appears exactly once. ${numRounds>1?'Across rounds, vary the pairings so players get new partners and opponents each round, avoid repeating the same pair twice if possible.':''} Make each matchup competitive and balanced.`
  };

  const isQueens=context==='queens';
  container.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is analyzing team data and generating pairings...</div></div>';
  btn.disabled=true;

  const teamData=buildTeamDataForPairings();

  try{
    let text;
    if(SC.demoMode){
      // Demo: build a canned result in the exact text format the parser expects,
      // then fall through to the same render/editAIPairings path. No worker call.
      if(isQueens){
        const mkRound=(r)=>`${numRounds>1?'ROUND '+r+':\n':''}COURT 1: Suzie Spiker & Penny Passer VS Debby Digger & Sandy Server | Balanced power and defense
COURT 2: Bonnie Blocker & Riley Receiver VS Sammy Setter & Olivia Option | Block paired with young legs
COURT 3: Sarah Sandbagger & Wendy Wave VS Holly Hitter & Dana Dune | Even developing matchup
COURT 4: Tara Tide & Marina Mist VS Cora Coral & Shelly Shoal | Exhibition group reps`;
        text=Array.from({length:numRounds},(_,i)=>mkRound(i+1)).join('\n')+'\nANALYSIS: All sixteen players go every round, strong and developing players split evenly for competitive games.';
      }else{
        text=['COURT 1: Suzie Spiker + Debby Digger | Top pair, balanced hitter and defender',
          'COURT 2: Bonnie Blocker + Sammy Setter | Big block with a steady setter',
          'COURT 3: Penny Passer + Sandy Server | Consistent serve and serve receive',
          'COURT 4: Sarah Sandbagger + Holly Hitter | Developing pair with strong effort',
          'COURT 5: Riley Receiver + Olivia Option | Young pair earning reps',
          'COURT 6: Wendy Wave + Dana Dune | Exhibition court, building chemistry',
          'COURT 7: Tara Tide + Cora Coral | Exhibition reps for development',
          'COURT 8: Marina Mist + Shelly Shoal | Exhibition court, learning the system'].slice(0,numCourts).join('\n')+'\nANALYSIS: Strongest pairs up top, development players get exhibition reps on courts six through eight.';
      }
    } else {
    const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{role:'user',content:`You are an expert high school beach volleyball coach. Recommend pairings for ${numCourts} courts.

${contextDesc[context]}

${teamData}

${isQueens?`QUEENS RULES:
- Assign ALL 16 players — 4 per court (2 vs 2), no subs
- Balance each matchup: mix strong with developing players on each side
- Each player appears exactly once
- Consider Queens match history to avoid repeated lopsided matchups`:`PAIRING RULES:
- Each pair needs a hitter and a defender (or at least one versatile player)
- Left side + right side preference is ideal
- Consider their actual skills, match history together, and pair level
- For game day, put the strongest pair on Court 1
- Each player can only be in ONE pair
- You have 16 players total, assign the top ${numCourts*2} players to courts`}

${isQueens?`Respond with EXACTLY this format. ${numRounds>1?`Generate all ${numRounds} rounds, each labeled ROUND 1, ROUND 2 etc. Use all 16 players each round with new partners.`:''}
${numRounds>1?Array.from({length:numRounds},(_,ri)=>`ROUND ${ri+1}:\nCOURT 1: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [reason 8 words max]\nCOURT 2: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [reason 8 words max]\n${numCourts>=3?'COURT 3: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [reason 8 words max]':''}\n${numCourts>=4?'COURT 4: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [reason 8 words max]':''}`).join('\n'):`COURT 1: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [Brief reason - 8 words max]
COURT 2: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [Brief reason - 8 words max]
${numCourts>=3?'COURT 3: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [Brief reason - 8 words max]':''}
${numCourts>=4?'COURT 4: [P1 Full Name] & [P2 Full Name] VS [P3 Full Name] & [P4 Full Name] | [Brief reason - 8 words max]':''}`}
ANALYSIS: [2-3 sentences about balance strategy]`:`Respond with EXACTLY this format (no extra text before or after):
COURT 1: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]
COURT 2: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]
${numCourts>=3?'COURT 3: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
${numCourts>=4?'COURT 4: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
${numCourts>=5?'COURT 5: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
${numCourts>=6?'COURT 6: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
${numCourts>=7?'COURT 7: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
${numCourts>=8?'COURT 8: [Player1 Full Name] + [Player2 Full Name] | [Brief reason - 10 words max]':''}
SUBS: [Remaining players not assigned]
ANALYSIS: [2-3 sentences explaining overall strategy]`}`}]
      })
    });
    const data=await response.json();
    text=data.content?.map(c=>c.text||'').join('')||'Unable to generate pairings.';
    }

    // Parse and display nicely
    let h='';
    const lines=text.split('\n').filter(l=>l.trim());
    lines.forEach(line=>{
      // Round header: ROUND 1:
      const roundMatch=line.match(/^ROUND\s*(\d+):/i);
      // Queens format: COURT 1: A & B VS C & D | reason
      const queensMatch=!roundMatch&&line.match(/^COURT\s*(\d+):\s*(.+?)\s+VS\s+(.+?)\s*\|\s*(.+)/i);
      // Standard format: COURT 1: A + B | reason
      const courtMatch=!queensMatch&&line.match(/^COURT\s*(\d+):\s*(.+?)\s*\|\s*(.+)/i);
      const subsMatch=line.match(/^SUBS?:\s*(.+)/i);
      const analysisMatch=line.match(/^ANALYSIS:\s*(.+)/i);
      if(roundMatch){
        const rn=roundMatch[1];
        h+=`<div style="font-family:'Bebas Neue';font-size:15px;letter-spacing:2px;color:var(--red);margin:14px 0 6px;padding-top:10px;${rn!=='1'?'border-top:2px solid var(--gray-lighter);':''}">⚡ Round ${rn}</div>`;
      }else if(queensMatch){
        const ct=queensMatch[1],teamA=queensMatch[2].trim(),teamB=queensMatch[3].trim(),reason=queensMatch[4].trim();
        h+=`<div style="padding:12px;margin-bottom:6px;background:var(--off-white);border-radius:8px;border-left:4px solid var(--red);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="court-badge court-${ct}" style="font-size:13px;min-width:50px;text-align:center;">CT ${ct}</span>
            <div style="font-size:11px;color:var(--gray);">${reason}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;">
            <div style="font-weight:700;font-size:13px;color:var(--red);">${teamA}</div>
            <div style="font-family:'Bebas Neue';font-size:16px;color:var(--gray-light);">VS</div>
            <div style="font-weight:700;font-size:13px;color:var(--blue);text-align:right;">${teamB}</div>
          </div>
        </div>`;
      }else if(courtMatch){
        const ct=courtMatch[1],players=courtMatch[2].trim(),reason=courtMatch[3].trim();
        h+=`<div style="display:flex;align-items:center;gap:10px;padding:12px;margin-bottom:6px;background:var(--off-white);border-radius:8px;border-left:4px solid var(--blue);">
          <span class="court-badge court-${ct}" style="font-size:13px;min-width:50px;text-align:center;">CT ${ct}</span>
          <div style="flex:1;"><div style="font-weight:700;font-size:14px;">${players}</div>
            <div style="font-size:11px;color:var(--gray);">${reason}</div></div></div>`;
      }else if(subsMatch){
        h+=`<div style="padding:8px 12px;margin-bottom:6px;background:var(--gray-lighter);border-radius:8px;font-size:12px;color:var(--gray);">
          <strong>Subs/Bench:</strong> ${subsMatch[1]}</div>`;
      }else if(analysisMatch){
        h+=`<div style="padding:10px 12px;margin-top:8px;background:#e0e7ff;border-radius:8px;font-size:13px;color:var(--blue);line-height:1.6;">
          💡 ${analysisMatch[1]}</div>`;
      }else if(line.trim()){
        h+=`<div style="font-size:13px;line-height:1.6;padding:4px 0;">${line}</div>`;
      }
    });
    container.innerHTML=h||'<div style="font-size:13px;line-height:1.7;white-space:pre-wrap;">'+text+'</div>';
    // Store parsed data for editing
    window._aiPairingData={text,context,numCourts,numRounds:numRounds||1,aiDate,aiLocation,aiTime,parsed:[]};
    // Parse into structured data for editing
    lines.forEach(line=>{
      const rMatch=line.match(/^ROUND\s*(\d+):/i);
      const qMatch=line.match(/^COURT\s*(\d+):\s*(.+?)\s+VS\s+(.+?)\s*\|\s*(.+)/i);
      const sMatch=!qMatch&&line.match(/^COURT\s*(\d+):\s*(.+?)\s*\|\s*(.+)/i);
      if(rMatch)window._aiPairingData.parsed.push({type:'round',num:rMatch[1]});
      else if(qMatch)window._aiPairingData.parsed.push({type:'queens',court:parseInt(qMatch[1]),teamA:qMatch[2].trim(),teamB:qMatch[3].trim(),reason:qMatch[4].trim()});
      else if(sMatch)window._aiPairingData.parsed.push({type:'pair',court:parseInt(sMatch[1]),players:sMatch[2].trim(),reason:sMatch[3].trim()});
    });
    // Auto-open edit form so coach goes straight to review + single save
    const hasCourts=window._aiPairingData.parsed.some(p=>p.type==='pair'||p.type==='queens');
    if(hasCourts){editAIPairings();}
  }catch(err){
    console.error('AI pairing error:',err);
    container.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error generating pairings. Check connection and try again.</div>';
  }
  btn.disabled=false;
}

// ============================================================
// EXCEL EXPORT
// ============================================================
function exportExcel(){
  if(typeof XLSX==='undefined'){toast('XLSX library not loaded');return;}
  const wb=XLSX.utils.book_new();
  // Export scope: default is all seasons (all data). OK = current season only.
  const _xAllSeasons = !confirm('Export the current season only?\n\nOK = current season\nCancel = all seasons (all data)');
  const _xM = _xAllSeasons ? D.matches : D.matches.filter(inSeason);
  const _xG = _xAllSeasons ? D.gamedays : D.gamedays.filter(inSeason);
  const _xS = _xAllSeasons ? D.scrimmages : D.scrimmages.filter(inSeason);
  const _xOpts = {allSeasons:_xAllSeasons};

  // Sheet 1: Roster (comprehensive — all available data per player)
  const allDrillsX=Object.values(profilesData?.starDrills||{});
  const allVertsX=Object.values(profilesData?.jumpTests||profilesData?.verticals||{});
  const rosterData=D.players.map(p=>{
    const pp=profilesData?.players?.[p.id]||{};
    const sk=profilesData?.skills?.[p.id]||{};
    const qs=queensStats(p.id,_xM,_xOpts);
    const gs=extStats(p.id,_xG,_xOpts);
    const ss=extStats(p.id,_xS,_xOpts);
    // Best star drill
    const myDrills=allDrillsX.filter(d=>(d.playerId===p.id||d.player===p.id));
    const bestDrill=myDrills.length?Math.min(...myDrills.map(d=>d.time)):'';
    const latestDrill=myDrills.length?myDrills.sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0].time:'';
    const drillCount=myDrills.length;
    // Best verticals
    const myVerts=allVertsX.filter(v=>(v.playerId===p.id||v.player===p.id)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const bestReach=myVerts.length?(myVerts[0].standingReach||myVerts[0].reach||''):'';
    const bestBlock=myVerts.length?(myVerts[0].blockJump||myVerts[0].block||''):'';
    const bestApproach=myVerts.length?(myVerts[0].approachJump||myVerts[0].approach||''):'';
    const vertDate=myVerts.length?myVerts[0].date:'';
    return{
      Name:p.firstName+' '+p.lastName,Class:p.classYear,Court:p.court,
      Height:pp.height||'',Position:pp.position||'',Side:pp.preferredSide||'',Hand:pp.dominantHand||'',
      // Skills
      Serving:sk.serving||'',Passing:sk.passing||'',Setting:sk.setting||'',Hitting:sk.hitting||'',
      Blocking:sk.blocking||'',Defense:sk.defense||'','Court Sense':sk.courtSense||'',Communication:sk.communication||'',
      // Star Drill
      'Best Drill':bestDrill?bestDrill.toFixed(1):'','Latest Drill':latestDrill?latestDrill.toFixed(1):'','Drill Attempts':drillCount||'',
      // Verticals
      'Standing Reach':bestReach,'Block Jump':bestBlock,'Approach Jump':bestApproach,'Vert Date':vertDate,
      // Match Stats
      'Queens W':qs.wins,'Queens L':qs.losses,'Queens +/-':qs.diff||'',
      'GD Sets W':gs.setsWon||'','GD Sets L':gs.setsLost||'','GD +/-':gs.diff||'',
      'GD Kills':gs.k||'','GD Blocks':gs.b||'','GD Aces':gs.a||'','GD Srv Err':gs.se||'','GD Rcv Err':gs.re||'','GD Hit Err':gs.he||'','GD Dig Err':gs.de||'',
      'Scrim Sets W':ss.setsWon||'','Scrim Sets L':ss.setsLost||''
    };
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rosterData),'Roster');

  // Sheet 2: Queens Matches
  const qData=_xM.map(m=>{
    const t1=(m.team1||[]).map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName:id;}).join(' & ');
    const t2=(m.team2||[]).map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName:id;}).join(' & ');
    return{Date:m.date,Court:m.court,'Team A':t1,'Team B':t2,'Score A':m.score1,'Score B':m.score2,Winner:m.score1>m.score2?'Team A':'Team B'};
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(qData),'Queens Matches');

  // Sheet 3: Queens Player Stats
  const qStats=D.players.map(p=>{const s=queensStats(p.id,_xM,_xOpts);
    return{Player:p.firstName+' '+p.lastName,Court:p.court,Class:p.classYear,W:s.wins,L:s.losses,'Win%':s.gp>0?Math.round(s.pct)+'%':'','+/-':s.diff,GP:s.gp};
  }).filter(r=>r.GP>0).sort((a,b)=>b['+/-']-a['+/-']);
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(qStats),'Queens Stats');

  // Sheet 4: Game Day Matches
  const gdData=[];
  _xG.forEach(m=>{
    const pair=(m.pair||[]).map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName:id;}).join(' & ');
    (m.sets||[]).forEach((s,i)=>{
      const row={Date:m.date,Court:m.court,Pair:pair,Opponent:m.opponent||'',Set:i+1,[SCHOOL_NAME]:s.scoreUs,Opp:s.scoreThem,
        Result:(s.scoreUs||0)>(s.scoreThem||0)?'W':'L'};
      (m.pair||[]).forEach(pid=>{const p=gP(pid);const st=s.stats?.[pid]||{};
        const name=p?p.firstName:'';row[name+' K']=st.k||0;row[name+' B']=st.b||0;row[name+' A']=st.a||0;row[name+' D']=st.d||0;row[name+' E']=st.e||0;});
      gdData.push(row);
    });
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(gdData),'Game Day');

  // Sheet 5: Game Day Player Stats
  const gdStats=D.players.map(p=>{const s=extStats(p.id,_xG,_xOpts);
    return{Player:p.firstName+' '+p.lastName,Court:p.court,Sets:s.sets,'Sets W':s.setsWon,'Sets L':s.setsLost,'+/-':s.diff,K:s.k,B:s.b,A:s.a,D:s.d,E:s.e};
  }).filter(r=>r.Sets>0).sort((a,b)=>b['+/-']-a['+/-']);
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(gdStats),'GD Player Stats');

  // Sheet 6: Scrimmage Matches
  const scData=[];
  _xS.forEach(m=>{
    const pair=(m.pair||[]).map(id=>{const p=gP(id);return p?p.firstName+' '+p.lastName:id;}).join(' & ');
    (m.sets||[]).forEach((s,i)=>{
      scData.push({Date:m.date,Court:m.court,Pair:pair,Opponent:m.opponent||'',Set:i+1,[SCHOOL_NAME]:s.scoreUs,Opp:s.scoreThem,Result:(s.scoreUs||0)>(s.scoreThem||0)?'W':'L'});
    });
  });
  if(scData.length)XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(scData),'Scrimmages');

  // Sheet 7: Star Drill
  const drillData=[];
  Object.values(profilesData?.starDrills||{}).forEach(d=>{
    const pid=d.playerId||d.player;const p=gP(pid);
    drillData.push({Player:p?p.firstName+' '+p.lastName:pid,Date:d.date,Time:d.time});
  });
  if(drillData.length){drillData.sort((a,b)=>a.Time-b.Time);XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(drillData),'Star Drill');}

  // Sheet 8: Verticals
  const vertData=[];
  Object.values(profilesData?.jumpTests||profilesData?.verticals||{}).forEach(v=>{
    const pid=v.playerId||v.player;const p=gP(pid);
    vertData.push({Player:p?p.firstName+' '+p.lastName:pid,Date:v.date,'Standing Reach':v.standingReach||v.reach||'','Block Jump':v.blockJump||v.block||'','Approach Jump':v.approachJump||v.approach||''});
  });
  if(vertData.length)XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(vertData),'Verticals');

  // Sheet 9: Schedule
  const schedData=[...D.schedule].sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(g=>({
    Date:g.date,Opponent:g.opponent||'',Location:g.location||'',[SCHOOL_NAME+' Score']:g.scoreUs??'','Opp Score':g.scoreThem??'',
    Result:g.scoreUs!=null&&g.scoreThem!=null?(g.scoreUs>g.scoreThem?'W':'L'):'',Time:g.time||''}));
  XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(schedData),'Schedule');

  const _xfPrefix=(SC&&SC.exportPrefix)||(SCHOOL_NAME.replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'export')+'_';
  XLSX.writeFile(wb,_xfPrefix+td()+'.xlsx');
  toast('Excel exported!');
}

// ============================================================
// Excel roster import. A coach uploads the CourtSense roster template; players
// are matched to the existing roster by name and either updated or created,
// mirroring addPlayer's two-node write (matches node + profiles node). Columns
// are matched by header NAME (case-insensitive), so reordered/added columns
// still import. Nothing is written until the coach confirms.
// ============================================================
function triggerRosterImport(){
  if(typeof XLSX==='undefined'){toast('Spreadsheet library not loaded');return;}
  const inp=document.getElementById('roster-import-input');
  if(inp){inp.value='';inp.click();}
}
function handleRosterImportFile(inp){
  const f=inp&&inp.files&&inp.files[0];
  if(f)importRoster(f);
}
function importRoster(file){
  if(typeof XLSX==='undefined'){toast('Spreadsheet library not loaded');return;}
  const reader=new FileReader();
  reader.onload=function(ev){
    let wb;
    try{wb=XLSX.read(new Uint8Array(ev.target.result),{type:'array'});}
    catch(err){toast('Could not read that spreadsheet');return;}
    // Roster is required and must be named 'Roster'. Skills, Star Drill, and Verticals
    // are each optional; a coach who only fills in Roster imports fine.
    const rowsOf=name=>{const s=wb.Sheets[name];return s?XLSX.utils.sheet_to_json(s,{header:1,defval:''}):null;};
    const rosterRows=rowsOf('Roster');
    if(!rosterRows){toast('That file has no sheet named "Roster".');return;}
    const parsed=_importParseRows(rosterRows);
    if(parsed.error){toast(parsed.error);return;}
    // Name map that includes this import's new/updated players, so Skills/Star Drill/
    // Verticals rows can match a player the SAME file is adding (empty starting roster).
    const byName=_importNameMap(parsed.plan);
    const skillsRows=rowsOf('Skills'), drillRows=rowsOf('Star Drill'), vertRows=rowsOf('Verticals');
    const skills=skillsRows?_importParseSkills(skillsRows, byName):{plan:[],errors:[]};
    const drills=drillRows?_importParseDrills(drillRows, byName):{plan:[],errors:[]};
    const verts=vertRows?_importParseVerts(vertRows, byName):{plan:[],errors:[]};
    if(!parsed.plan.length && !parsed.errors.length && !skills.plan.length && !drills.plan.length && !verts.plan.length){toast('No player rows found');return;}
    _importShowConfirm(parsed.plan, parsed.errors, skills, drills, verts);
  };
  reader.onerror=function(){toast('Could not read that file');};
  reader.readAsArrayBuffer(file);
}

// Parse raw rows: find the header row (the one containing 'First Name'), map
// columns by header name, validate, and match each row to an existing player.
function _importParseRows(rows){
  const errors=[];
  let hIdx=-1;
  for(let i=0;i<rows.length;i++){
    const norm=(rows[i]||[]).map(c=>String(c==null?'':c).trim().toLowerCase());
    if(norm.indexOf('first name')!==-1){hIdx=i;break;}
  }
  if(hIdx===-1)return{error:'Could not find a header row with First Name.'};
  const hdr=(rows[hIdx]||[]).map(c=>String(c==null?'':c).trim().toLowerCase());
  const col=aliases=>{for(const a of aliases){const idx=hdr.indexOf(a);if(idx!==-1)return idx;}return -1;};
  const C={
    first:col(['first name']), last:col(['last name']), grad:col(['grad year']),
    jersey:col(['jersey #','jersey','jersey number']),
    truv:col(['truvolley rating','vl rating','truvolley']),
    height:col(['height']), reach:col(['standing reach']),
    position:col(['position']), side:col(['side']), hand:col(['hand']),
    p1n:col(['parent 1 name']), p1e:col(['parent 1 email']), p1p:col(['parent 1 phone']),
    p2n:col(['parent 2 name']), p2e:col(['parent 2 email']), p2p:col(['parent 2 phone'])
  };
  const cell=(r,i)=>(i>=0&&r[i]!=null)?String(r[i]).trim():'';
  const nameKey=s=>s.trim().toLowerCase();
  const byName={};
  (D.players||[]).forEach(p=>{byName[nameKey(p.firstName||'')+' '+nameKey(p.lastName||'')]=p;});
  const plan=[];
  for(let i=hIdx+1;i<rows.length;i++){
    const r=rows[i]||[];
    const first=cell(r,C.first), last=cell(r,C.last), gradRaw=cell(r,C.grad);
    if(!first&&!last&&!gradRaw)continue;                                   // blank row
    if(first.toLowerCase()==='suzie'&&last.toLowerCase()==='spiker')continue; // example row
    const rowNum=i+1;                                                      // 1-based spreadsheet row
    if(!first||!last){errors.push({row:rowNum,why:'missing first or last name'});continue;}
    const gradYear=parseInt(gradRaw,10);
    if(isNaN(gradYear)||!/^\d{4}$/.test(String(gradYear))){errors.push({row:rowNum,why:'missing or invalid Grad Year'});continue;}
    const jerseyRaw=cell(r,C.jersey), jerseyNum=parseInt(jerseyRaw,10);
    const jersey=(jerseyRaw!==''&&!isNaN(jerseyNum))?jerseyNum:null;
    const truvRaw=cell(r,C.truv), truvNum=parseFloat(truvRaw);
    const truvolley=(truvRaw!==''&&!isNaN(truvNum))?truvNum:null;
    const parent1=_importParent(cell(r,C.p1n),cell(r,C.p1e),cell(r,C.p1p));
    const parent2=_importParent(cell(r,C.p2n),cell(r,C.p2e),cell(r,C.p2p));
    const existing=byName[nameKey(first)+' '+nameKey(last)]||null;
    const height=cell(r,C.height), reach=cell(r,C.reach);
    // Position/Side/Hand come from dropdown words; normalize to the app's stored values.
    // An unrecognized value is skipped for that field (never written raw) and reported.
    const posRaw=cell(r,C.position), sideRaw=cell(r,C.side), handRaw=cell(r,C.hand);
    const _pos=_importEnum(posRaw,_IMPORT_POSITION_MAP), _side=_importEnum(sideRaw,_IMPORT_SIDE_MAP), _hand=_importEnum(handRaw,_IMPORT_HAND_MAP);
    if(_pos.bad)errors.push({row:rowNum,why:'Position "'+posRaw+'" not recognized (use Blocker, Defender, or Split), field skipped'});
    if(_side.bad)errors.push({row:rowNum,why:'Side "'+sideRaw+'" not recognized (use Left or Right), field skipped'});
    if(_hand.bad)errors.push({row:rowNum,why:'Hand "'+handRaw+'" not recognized (use Left or Right), field skipped'});
    const position=_pos.v||'', side=_side.v||'', hand=_hand.v||'';
    // Pre-assign the id a NEW player will get, so Skills/Star Drill/Verticals rows in the
    // same file can point at it before the roster commit runs. _importCommit reuses it.
    const newId=existing?null:gi('p');
    plan.push({row:rowNum, existing, newId, data:{first,last,gradYear,jersey,truvolley,height,reach,position,side,hand,parent1,parent2}});
  }
  return {plan, errors};
}
function _importParent(name,email,phone){
  if(!name&&!email&&!phone)return null;
  const o={};
  if(name)o.name=name;
  if(email)o.email=email;
  if(phone)o.phone=phone;
  return o;
}
// classYear from Grad Year vs the active season year: this year or earlier = SR,
// +1 = JR, +2 = SO, +3 or later = FR.
function _importClassYear(gradYear){
  const seasonYear=parseInt(_activeSeason(),10)||(new Date()).getFullYear();
  const diff=gradYear-seasonYear;
  if(diff<=0)return 'SR';
  if(diff===1)return 'JR';
  if(diff===2)return 'SO';
  if(diff>=3)return 'FR';
  return '';
}
// ---- Shared helpers for the multi-sheet import ----------------------------------
// Find the header row on a sheet (the one containing 'First Name') and return a
// column-by-name resolver, mirroring how _importParseRows locates its header.
function _importHeader(rows){
  let hIdx=-1;
  for(let i=0;i<rows.length;i++){
    const norm=(rows[i]||[]).map(c=>String(c==null?'':c).trim().toLowerCase());
    if(norm.indexOf('first name')!==-1){hIdx=i;break;}
  }
  if(hIdx===-1)return null;
  const hdr=(rows[hIdx]||[]).map(c=>String(c==null?'':c).trim().toLowerCase());
  const col=aliases=>{for(const a of aliases){const idx=hdr.indexOf(a);if(idx!==-1)return idx;}return -1;};
  return {hIdx, col};
}
function _importCell(r,i){return (i>=0&&r[i]!=null)?String(r[i]).trim():'';}
// Coach-facing dropdown words normalized to the codes/words the app stores. Case-insensitive.
// Side/Hand store 'L'/'R'; Position stores 'block'/'defense'/'split'.
const _IMPORT_SIDE_MAP={l:'L',left:'L',r:'R',right:'R'};
const _IMPORT_HAND_MAP={l:'L',left:'L',r:'R',right:'R'};
const _IMPORT_POSITION_MAP={block:'block',blocker:'block',defense:'defense',defender:'defense',split:'split'};
// Normalize a cell against a value map. {v:''} = blank (write nothing), {v:code} = valid,
// {bad:true} = unrecognized (the caller skips that field and reports it).
function _importEnum(raw, map){
  const s=String(raw==null?'':raw).trim().toLowerCase();
  if(!s)return {v:''};
  if(Object.prototype.hasOwnProperty.call(map,s))return {v:map[s]};
  return {bad:true};
}
function _importYmd(d){return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');}
// Normalize a spreadsheet date cell to YYYY-MM-DD. Handles an Excel serial number
// (raw cell value), an ISO string, M/D/YYYY, or falls back to the coach's text.
function _importDate(raw){
  if(raw==null||raw==='')return '';
  if(raw instanceof Date && !isNaN(raw))return _importYmd(raw);
  if(typeof raw==='number' && isFinite(raw)){
    const d=new Date(Math.round((raw-25569)*86400000)); // Excel epoch 1899-12-30, UTC
    return isNaN(d)?'':_importYmd(d);
  }
  const s=String(raw).trim();
  if(!s)return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if(m)return m[3]+'-'+m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0');
  const d=new Date(s);
  return isNaN(d)?s:_importYmd(d);
}
// Name -> {id} map for cross-sheet matching. Includes the current roster PLUS the
// players this import is adding/updating (using the id pre-assigned in _importParseRows),
// so a Skills/Drill/Vertical row can match a player the same file is creating.
function _importNameMap(rosterPlan){
  const nameKey=s=>String(s||'').trim().toLowerCase();
  const map={};
  (D.players||[]).forEach(p=>{map[nameKey(p.firstName)+' '+nameKey(p.lastName)]={id:p.id};});
  (rosterPlan||[]).forEach(e=>{
    const id=e.existing?e.existing.id:e.newId;
    if(id)map[nameKey(e.data.first)+' '+nameKey(e.data.last)]={id};
  });
  return map;
}

// Skills sheet -> [{playerId, skills:{...}}]. Keys match saveSkills exactly. Each value
// is kept only when it is 1-10; blanks (and out-of-range) are omitted so the commit's
// .update() leaves the existing rating alone.
function _importParseSkills(rows, byName){
  const h=_importHeader(rows);
  if(!h)return{plan:[],errors:[]};
  const cFirst=h.col(['first name']), cLast=h.col(['last name']);
  const SK=[['serving',['serving']],['passing',['passing']],['setting',['setting']],['hitting',['hitting']],
    ['blocking',['blocking']],['defense',['defense']],['courtSense',['court sense']],['communication',['communication']]];
  const cols=SK.map(([key,al])=>[key,h.col(al)]);
  const nameKey=s=>s.trim().toLowerCase();
  const plan=[], errors=[];
  for(let i=h.hIdx+1;i<rows.length;i++){
    const r=rows[i]||[];
    const first=_importCell(r,cFirst), last=_importCell(r,cLast);
    if(!first&&!last)continue;
    const rowNum=i+1;
    const p=byName[nameKey(first)+' '+nameKey(last)];
    if(!p){errors.push({row:rowNum,why:'no player named '+(first+' '+last).trim()+' on the roster'});continue;}
    const skills={};
    cols.forEach(([key,idx])=>{const raw=_importCell(r,idx);if(raw==='')return;const n=parseInt(raw,10);if(!isNaN(n)&&n>=1&&n<=10)skills[key]=n;});
    if(!Object.keys(skills).length)continue;
    plan.push({playerId:p.id, skills});
  }
  return {plan, errors};
}

// Star Drill sheet -> [{playerId, date, time}]. Each row is a NEW attempt. Deduped on
// player + date + time against the existing starDrills AND within this file.
function _importParseDrills(rows, byName){
  const h=_importHeader(rows);
  if(!h)return{plan:[],errors:[]};
  const cFirst=h.col(['first name']), cLast=h.col(['last name']), cDate=h.col(['date']), cTime=h.col(['time (seconds)','time']);
  const nameKey=s=>s.trim().toLowerCase();
  const seen=new Set();
  Object.values(profilesData?.starDrills||{}).forEach(d=>{const pid=d.playerId||d.player;if(pid)seen.add(pid+'|'+d.date+'|'+d.time);});
  const plan=[], errors=[];
  for(let i=h.hIdx+1;i<rows.length;i++){
    const r=rows[i]||[];
    const first=_importCell(r,cFirst), last=_importCell(r,cLast), timeRaw=_importCell(r,cTime), dateRaw=(cDate>=0?r[cDate]:'');
    if(!first&&!last&&!timeRaw&&(dateRaw==null||dateRaw===''))continue;
    const rowNum=i+1;
    const p=byName[nameKey(first)+' '+nameKey(last)];
    if(!p){errors.push({row:rowNum,why:'no player named '+(first+' '+last).trim()+' on the roster'});continue;}
    const date=_importDate(dateRaw), time=parseFloat(timeRaw);
    if(!date||isNaN(time)||time<=0){errors.push({row:rowNum,why:'needs a date and a time'});continue;}
    const key=p.id+'|'+date+'|'+time;
    if(seen.has(key))continue;                        // dedupe: already recorded, skip silently
    seen.add(key);
    plan.push({playerId:p.id, date, time});
  }
  return {plan, errors};
}

// Verticals sheet -> [{playerId, date, blockJump, approachJump}]. Matches the jumpTests
// write exactly. New entries only, deduped on player + date + block + approach.
function _importParseVerts(rows, byName){
  const h=_importHeader(rows);
  if(!h)return{plan:[],errors:[]};
  const cFirst=h.col(['first name']), cLast=h.col(['last name']), cDate=h.col(['date']), cBj=h.col(['block jump']), cAj=h.col(['approach jump']);
  const nameKey=s=>s.trim().toLowerCase();
  const seen=new Set();
  Object.values(profilesData?.jumpTests||{}).forEach(v=>{const pid=v.playerId||v.player;if(pid)seen.add(pid+'|'+v.date+'|'+(v.blockJump||'')+'|'+(v.approachJump||''));});
  const plan=[], errors=[];
  for(let i=h.hIdx+1;i<rows.length;i++){
    const r=rows[i]||[];
    const first=_importCell(r,cFirst), last=_importCell(r,cLast), bj=_importCell(r,cBj), aj=_importCell(r,cAj), dateRaw=(cDate>=0?r[cDate]:'');
    if(!first&&!last&&!bj&&!aj&&(dateRaw==null||dateRaw===''))continue;
    const rowNum=i+1;
    const p=byName[nameKey(first)+' '+nameKey(last)];
    if(!p){errors.push({row:rowNum,why:'no player named '+(first+' '+last).trim()+' on the roster'});continue;}
    const date=_importDate(dateRaw);
    if(!date||(!bj&&!aj)){errors.push({row:rowNum,why:'needs a date and at least one jump'});continue;}
    const key=p.id+'|'+date+'|'+bj+'|'+aj;
    if(seen.has(key))continue;
    seen.add(key);
    plan.push({playerId:p.id, date, blockJump:bj||null, approachJump:aj||null});
  }
  return {plan, errors};
}

// Write the plan: matches node (fbSet, full record) + profiles node (merge update).
function _importCommit(plan){
  let nNew=0,nUpd=0;
  plan.forEach(e=>{
    const d=e.data;
    let id, rec;
    if(e.existing){
      id=e.existing.id;
      rec=Object.assign({}, e.existing);          // keep court, csRank, and everything else untouched
      rec.classYear=_importClassYear(d.gradYear)||'FR'; // grad years in the import are the source of truth
      if(d.jersey!=null)rec.jersey=d.jersey;        // overwrite jersey only when the import supplies one
      nUpd++;
    }else{
      id=e.newId||gi('p');                          // reuse the id pre-assigned at parse time
      // court defaults to 1 (a real value the coach reassigns), never null, which Firebase drops.
      rec={id, firstName:d.first, lastName:d.last, classYear:_importClassYear(d.gradYear)||'FR', court:1, jersey:(d.jersey!=null?d.jersey:null)};
      nNew++;
    }
    // Enforce the same six-field contract addPlayer writes: id/firstName/lastName/
    // classYear/court must be real values; jersey may be null. This also repairs an
    // existing record that was previously stored without a court.
    rec.id=id;
    rec.firstName=rec.firstName||d.first||'';
    rec.lastName=rec.lastName||d.last||'';
    rec.classYear=rec.classYear||'FR';
    if(!Number.isFinite(rec.court))rec.court=1;
    if(rec.jersey===undefined)rec.jersey=null;
    fbSet('players/'+id, rec);
    if(db){
      const prof={gradYear:d.gradYear};
      if(d.truvolley!=null)prof.truvolley=d.truvolley;
      // Identity fields: write only what the coach entered so a blank never nulls an existing value.
      if(d.height)prof.height=d.height;
      if(d.reach)prof.reach=d.reach;
      if(d.position)prof.position=d.position;
      if(d.side)prof.preferredSide=d.side;   // app reads preferredSide, not side
      if(d.hand)prof.dominantHand=d.hand;     // app reads dominantHand, not hand
      if(d.parent1)prof.parent1=d.parent1;
      if(d.parent2)prof.parent2=d.parent2;
      db.ref(SC.dbRoots.profiles+'/players/'+id).update(prof);
    }
  });
  return {nNew,nUpd};
}
// Skills commit: merge-update the player's skills leaf so a blank leaves the existing
// rating alone. Live schools only (db); mirrors saveSkills' path and keys.
function _importCommitSkills(plan){
  if(!db)return 0;
  let n=0;
  plan.forEach(e=>{db.ref(SC.dbRoots.profiles+'/skills/'+e.playerId).update(e.skills);n++;});
  return n;
}
// Star Drill commit: one NEW record per attempt, keyed by its own id with a playerId
// pointer, exactly like coachAddDrill. The batch index keeps ids unique within one import.
function _importCommitDrills(plan){
  if(!db)return 0;
  let n=0;
  plan.forEach((e,idx)=>{
    const id='sd-'+e.playerId+'-'+Date.now()+'-'+idx;
    db.ref(SC.dbRoots.profiles+'/starDrills/'+id).set({id,playerId:e.playerId,player:e.playerId,date:e.date,time:e.time});
    n++;
  });
  return n;
}
// Verticals commit: one NEW jumpTests record per test, mirroring coachAddVertical's shape.
function _importCommitVerts(plan){
  if(!db)return 0;
  let n=0;
  plan.forEach((e,idx)=>{
    const id='jt-'+e.playerId+'-'+Date.now()+'-'+idx;
    db.ref(SC.dbRoots.profiles+'/jumpTests/'+id).set({id,playerId:e.playerId,player:e.playerId,date:e.date,blockJump:e.blockJump,approachJump:e.approachJump});
    n++;
  });
  return n;
}
// Group skipped rows by sheet so a coach can see exactly what to fix and where.
function _importErrGroups(errs){
  if(!errs.length)return '';
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const bySheet={};
  errs.forEach(e=>{(bySheet[e.sheet]=bySheet[e.sheet]||[]).push(e);});
  let h='<div style="margin-top:12px;font-size:12px;color:var(--gray);">';
  Object.keys(bySheet).forEach(sheet=>{
    const list=bySheet[sheet];
    h+='<div style="font-weight:700;margin-bottom:4px;">'+esc(sheet)+': '+list.length+' issue'+(list.length===1?'':'s')+'</div>'+
      '<ul style="margin:0 0 8px;padding-left:18px;max-height:120px;overflow-y:auto;">'+
      list.map(e=>'<li>Row '+e.row+': '+esc(e.why)+'</li>').join('')+'</ul>';
  });
  return h+'</div>';
}
function _importErrList(errors){
  if(!errors.length)return '';
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return '<div style="margin-top:12px;font-size:12px;color:var(--gray);">'+
    '<div style="font-weight:700;margin-bottom:4px;">Skipped '+errors.length+' row'+(errors.length===1?'':'s')+':</div>'+
    '<ul style="margin:0;padding-left:18px;max-height:120px;overflow-y:auto;">'+
    errors.map(e=>'<li>Row '+e.row+': '+esc(e.why)+'</li>').join('')+'</ul></div>';
}
function _importModal(title, bodyHtml, footerHtml){
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;';
  ov.innerHTML='<div style="background:var(--white);border-radius:12px;max-width:440px;width:100%;padding:20px;box-shadow:0 10px 40px rgba(0,0,0,0.3);">'+
    '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:1px;margin-bottom:10px;">'+esc(title)+'</div>'+
    '<div>'+bodyHtml+'</div>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">'+footerHtml+'</div></div>';
  document.body.appendChild(ov);
  return ov;
}
// Collect skipped rows from every sheet into one sheet-tagged list for the report.
function _importAllErrors(errors, skills, drills, verts){
  return [].concat(
    (errors||[]).map(e=>({sheet:'Roster',row:e.row,why:e.why})),
    (skills.errors||[]).map(e=>({sheet:'Skills',row:e.row,why:e.why})),
    (drills.errors||[]).map(e=>({sheet:'Star Drill',row:e.row,why:e.why})),
    (verts.errors||[]).map(e=>({sheet:'Verticals',row:e.row,why:e.why}))
  );
}
function _importShowConfirm(plan, errors, skills, drills, verts){
  const nNew=plan.filter(e=>!e.existing).length, nUpd=plan.length-nNew;
  // Only mention a sheet that actually has rows.
  const parts=[];
  if(plan.length)parts.push('<b>'+plan.length+'</b> player'+(plan.length===1?'':'s')+' (<b>'+nNew+'</b> new, <b>'+nUpd+'</b> to update)');
  if(skills.plan.length)parts.push('<b>'+skills.plan.length+'</b> skill row'+(skills.plan.length===1?'':'s'));
  if(drills.plan.length)parts.push('<b>'+drills.plan.length+'</b> star drill time'+(drills.plan.length===1?'':'s'));
  if(verts.plan.length)parts.push('<b>'+verts.plan.length+'</b> vertical test'+(verts.plan.length===1?'':'s'));
  const anything=plan.length||skills.plan.length||drills.plan.length||verts.plan.length;
  const allErrors=_importAllErrors(errors, skills, drills, verts);
  const body='<div style="font-size:14px;line-height:1.5;">'+(parts.length?'Found '+parts.join(', ')+'.':'Nothing to import.')+(anything?' Import?':'')+'</div>'+_importErrGroups(allErrors);
  const footer=anything
    ? '<button class="btn btn-small btn-secondary" id="_imp-cancel">Cancel</button><button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;" id="_imp-go">Import</button>'
    : '<button class="btn btn-small btn-secondary" id="_imp-cancel">Close</button>';
  const ov=_importModal('Import program', body, footer);
  const cancel=ov.querySelector('#_imp-cancel'); if(cancel)cancel.onclick=()=>ov.remove();
  const go=ov.querySelector('#_imp-go');
  if(go)go.onclick=()=>{
    const res=_importCommit(plan);
    const nSk=_importCommitSkills(skills.plan);
    const nDr=_importCommitDrills(drills.plan);
    const nVt=_importCommitVerts(verts.plan);
    ov.remove();
    _importShowResult(res.nNew, res.nUpd, nSk, nDr, nVt, allErrors);
    toast('Imported: '+res.nNew+' new, '+res.nUpd+' updated');
  };
}
function _importShowResult(nNew, nUpd, nSk, nDr, nVt, allErrors){
  const extra=[];
  if(nSk)extra.push('<b>'+nSk+'</b> skill row'+(nSk===1?'':'s'));
  if(nDr)extra.push('<b>'+nDr+'</b> star drill time'+(nDr===1?'':'s'));
  if(nVt)extra.push('<b>'+nVt+'</b> vertical test'+(nVt===1?'':'s'));
  const body='<div style="font-size:14px;">Imported <b>'+nNew+'</b> new, <b>'+nUpd+'</b> updated'+(extra.length?', '+extra.join(', '):'')+'.</div>'+_importErrGroups(allErrors);
  const ov=_importModal('Import complete', body, '<button class="btn btn-small btn-secondary" id="_imp-close">Close</button>');
  const close=ov.querySelector('#_imp-close'); if(close)close.onclick=()=>ov.remove();
}

// ============================================================
// COURT ASSIGNMENT SCANNER
// ============================================================
const _cad=document.getElementById('ca-date');if(_cad)_cad.value=td();
document.getElementById('ca-file').addEventListener('change',async function(e){
  const file=e.target.files[0];if(!file)return;
  const preview=document.getElementById('ca-preview');
  const result=document.getElementById('ca-result');
  const reader=new FileReader();
  reader.onload=async function(ev){
    const base64=ev.target.result.split(',')[1];
    const mediaType=file.type||'image/jpeg';
    preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);">`;
    result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is reading your court assignment sheet...</div></div>';
    const isOpponent=document.getElementById('ca-team').value==='opponent';
    const playerList=D.players.map(p=>p.firstName+' '+p.lastName+' ('+p.id+')').join(', ');
    try{
      let promptText;
      if(isOpponent){
        promptText=`TASK: Extract data from an FHSAA Beach Volleyball Dual Match Lineup Form image.

OUTPUT: Return ONLY a single JSON object. No explanation, no markdown, no code fences. Just the raw JSON.

JSON FORMAT:
{"school":"Lincoln HS","starters":[{"court":1,"p1":{"first":"Kenzie","last":"Poppell","jersey":"4"},"p2":{"first":"Londyn","last":"Dickey","jersey":"11"}}],"alternates":[{"first":"Jenny","last":"Heimbach","jersey":"7"}]}

READING THE FORM:
- SCHOOL field at top = school name
- Each row No.1 through No.5 = one court (No.1=court 1, No.5=court 5)
- Each row has TWO players: left-side player = p1, right-side player = p2
- Columns per player: First Name, Last Name, Jersey No.
- ALTERNATES table at bottom = alternates array
- jersey field: jersey number as a string (e.g. "4"), or "" if not visible

Return the JSON object only. Start your response with { and end with }`;
      }else{
        promptText=`You are reading a handwritten beach volleyball court assignment sheet for a high school team.
Extract the court assignments. Each court has two players (a pair) assigned to it.
Courts 6, 7, 8 may optionally have a second pair listed (for split/exhibition courts).

PLAYER ROSTER (use these exact IDs — match names to IDs even if spelling varies):
${playerList}

Return ONLY a JSON array like this:
[{"court":1,"pair":["p01","p02"]},{"court":2,"pair":["p03","p04"]},{"court":6,"pair":["p05","p06"],"splitPair":["p07","p08"]}]

Rules:
- court: integer 1-8
- pair: array of 2 player IDs from the roster
- splitPair: (courts 6-8 only) optional second pair for split/exhibition match
- If a name is unclear, use best match from roster
- Respond with ONLY the JSON array, no other text`;
      }
      const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',max_tokens:2500,
          messages:[{role:'user',content:[
            {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
            {type:'text',text:promptText}
          ]}]
        })
      });
      const data=await response.json();
      const text=data.content?.map(c=>c.text||'').join('')||'';
      // Robust JSON extraction — strip fences, then find outermost { } or [ ]
      let parsed;
      (function(){
        let clean=text.replace(/```json|```/gi,'').trim();
        // Try direct parse first
        try{parsed=JSON.parse(clean);return;}catch(e){}
        // Try extracting outermost JSON object
        const objStart=clean.indexOf('{');const objEnd=clean.lastIndexOf('}');
        if(objStart>=0&&objEnd>objStart){
          try{parsed=JSON.parse(clean.slice(objStart,objEnd+1));return;}catch(e){}
        }
        // Try extracting outermost JSON array
        const arrStart=clean.indexOf('[');const arrEnd=clean.lastIndexOf(']');
        if(arrStart>=0&&arrEnd>arrStart){
          try{parsed=JSON.parse(clean.slice(arrStart,arrEnd+1));return;}catch(e){}
        }
        // All parsing failed — show manual entry fallback
        result.innerHTML=`<div style="background:#fef3c7;border:1px solid var(--gold);border-radius:10px;padding:14px;">
          <div style="font-family:'Bebas Neue';font-size:14px;color:var(--gold);margin-bottom:8px;">⚠ AI couldn't read the image automatically</div>
          <div style="font-size:12px;color:var(--gray);margin-bottom:10px;">The image may be angled or low-contrast. Enter the lineup manually below:</div>
          ${isOpponent?renderManualOppEntry():''}
          <details style="margin-top:10px;"><summary style="font-size:11px;color:var(--gray);cursor:pointer;">Show AI raw response</summary><pre style="font-size:10px;background:var(--off-white);padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;margin-top:6px;">${(text||'No response').slice(0,800)}</pre></details>
        </div>`;
      })();
      if(!parsed)return;
      if(isOpponent){
        // New schema: {school, starters:[{court,p1,p2}], alternates:[{first,last,jersey}]}
        const starters=parsed.starters||parsed; // fallback if old format
        const alternates=parsed.alternates||[];
        const schoolName=parsed.school||document.getElementById('ca-opp').value.trim()||'Opponent';
        let h=`<div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;margin-bottom:8px;color:var(--green);">✓ Found ${starters.length} court(s) + ${alternates.length} alternate(s) — edit if needed</div>`;
        h+=`<div style="font-size:12px;color:var(--gray);margin-bottom:8px;">Confirm names and jersey numbers, then save to Scouting database.</div>`;
        starters.forEach((m,i)=>{
          const p1=m.p1||{first:m.player1||'',last:'',jersey:''};
          const p2=m.p2||{first:m.player2||'',last:'',jersey:''};
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
            <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin-bottom:8px;color:var(--charcoal);">COURT ${m.court}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 1</div>
                <input type="text" id="ca-opp-${i}-p1f" value="${p1.first||''}" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                <input type="text" id="ca-opp-${i}-p1l" value="${p1.last||''}" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                <input type="text" id="ca-opp-${i}-p1j" value="${p1.jersey||''}" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
              </div>
              <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 2</div>
                <input type="text" id="ca-opp-${i}-p2f" value="${p2.first||''}" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                <input type="text" id="ca-opp-${i}-p2l" value="${p2.last||''}" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                <input type="text" id="ca-opp-${i}-p2j" value="${p2.jersey||''}" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
              </div>
            </div>
            <input type="hidden" id="ca-opp-${i}-court" value="${m.court}">
          </div>`;
        });
        if(alternates.length){
          h+=`<div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin:10px 0 6px;color:var(--purple);">ALTERNATES / SUBS</div>`;
          alternates.forEach((alt,i)=>{
            h+=`<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
              <input type="text" id="ca-alt-${i}-f" value="${alt.first||''}" placeholder="First" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
              <input type="text" id="ca-alt-${i}-l" value="${alt.last||''}" placeholder="Last" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
              <input type="text" id="ca-alt-${i}-j" value="${alt.jersey||''}" placeholder="#" style="width:50px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
            </div>`;
          });
        }
        h+=`<div style="margin-top:12px;display:flex;gap:8px;">
          <button class="btn btn-primary btn-small" style="flex:1;" onclick="confirmOppLineup()">✓ Save to Scouts + Lineup</button>
          <button class="btn btn-secondary btn-small" onclick="document.getElementById('ca-result').innerHTML='';document.getElementById('ca-preview').innerHTML='';">✕ Cancel</button></div>`;
        result.innerHTML=h;
        window._caData={starters,alternates,count:starters.length,altCount:alternates.length,schoolName,isOpponent:true,source:'scanner'};
      }else{
        // Leon's lineup
        const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
        function caPlayerOpts(selId){return '<option value="">Select</option>'+sorted.map(pl=>`<option value="${pl.id}" ${pl.id===selId?'selected':''}>${pl.firstName} ${pl.lastName.charAt(0)}. (CT${pl.court})</option>`).join('');}
        // Check if assignment already exists for this date
        const caDate=document.getElementById('ca-date').value||td();
        const existingAssign=Object.values(D.assignments).find(a=>a.date===caDate);
        let h=`<div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;margin-bottom:8px;color:var(--green);">✓ Found ${parsed.length} court(s) — edit if needed</div>`;
        parsed.forEach((m,i)=>{
          const isExhib=EXHIBITION_COURTS.has(m.court);
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:6px;margin-bottom:8px;">
            <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;margin-bottom:6px;color:var(--charcoal);">
              COURT <input type="number" id="ca-${i}-court" value="${m.court||1}" min="1" max="8" style="width:50px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
              ${isExhib?'<span style="font-size:10px;color:var(--purple);margin-left:4px;">EXHIBITION</span>':''}
            </div>
            <div style="font-size:11px;color:var(--gray);margin-bottom:4px;">Set 1 Pair</div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="ca-${i}-p1" style="padding:6px;font-size:12px;">${caPlayerOpts((m.pair||[])[0])}</select>
              <select class="form-select" id="ca-${i}-p2" style="padding:6px;font-size:12px;">${caPlayerOpts((m.pair||[])[1])}</select>
            </div>`;
          if(isExhib||m.splitPair){
            h+=`<div style="font-size:11px;color:var(--purple);margin-bottom:4px;">Set 2 Pair (Split — optional)</div>
            <div class="form-row">
              <select class="form-select" id="ca-${i}-sp1" style="padding:6px;font-size:12px;">${caPlayerOpts((m.splitPair||[])[0])}</select>
              <select class="form-select" id="ca-${i}-sp2" style="padding:6px;font-size:12px;">${caPlayerOpts((m.splitPair||[])[1])}</select>
            </div>`;
          }
          h+='</div>';
        });
        h+=`<div style="margin-top:10px;display:flex;gap:8px;">
          <button class="btn btn-primary btn-small" onclick="confirmCAAssignment()">✓ Save Assignment</button>
          <button class="btn btn-secondary btn-small" onclick="document.getElementById('ca-result').innerHTML='';document.getElementById('ca-preview').innerHTML='';">✕ Cancel</button></div>`;
        result.innerHTML=h;
        window._caData={parsed,count:parsed.length,isOpponent:false,existingAssign};
      }
    }catch(err){
      console.error('CA scan error:',err);
      result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error reading photo. Try a clearer image.</div>';
    }
  };
  reader.readAsDataURL(file);
  e.target.value='';
});

function confirmCAAssignment(){
  const{count,existingAssign}=window._caData||{};
  if(!count){toast('No data to save');return;}
  const date=document.getElementById('ca-date').value||td();
  const type=document.getElementById('ca-type').value;
  const opp=document.getElementById('ca-opp').value.trim();
  const slots=[];
  for(let i=0;i<count;i++){
    const court=parseInt(document.getElementById(`ca-${i}-court`)?.value)||1;
    const p1=document.getElementById(`ca-${i}-p1`)?.value;
    const p2=document.getElementById(`ca-${i}-p2`)?.value;
    const sp1=document.getElementById(`ca-${i}-sp1`)?.value;
    const sp2=document.getElementById(`ca-${i}-sp2`)?.value;
    if(!p1||!p2)continue;
    const slot={court,p1,p2};
    if(sp1&&sp2&&EXHIBITION_COURTS.has(court))slot.splitPair=[sp1,sp2];
    slots.push(slot);
  }
  if(!slots.length){toast('No valid courts to save');return;}
  // If existing assignment for this date, delete it first then save updated version
  // ── MOVEMENT RESTRICTION (duals only) ──────────────────────
  if(type==='gameday'){
    const pastDuals=Object.values(D.assignments||{})
      .filter(a=>a.type==='gameday'&&a.date<date&&(a.courts||[]).length>0)
      .sort((a,b)=>b.date.localeCompare(a.date));
    const prevAssign=pastDuals[0];
    if(prevAssign){
      const violations=[];
      slots.forEach(slot=>{
        [slot.p1,slot.p2].filter(Boolean).forEach(pid=>{
          const prevCourt=(prevAssign.courts||[]).findIndex(c=>c.p1===pid||c.p2===pid)+1;
          if(prevCourt>0&&Math.abs(slot.court-prevCourt)>1){
            const p=gP(pid);
            violations.push({pid,name:p?p.firstName+' '+p.lastName:'Player',from:prevCourt,to:slot.court});
          }
        });
      });
      if(violations.length>0){
        window._pendingAssignment={id:gi('asgn'),date,type,opp,slots};
        window._pendingViolations=violations;
        showMovementModal(violations);
        return;
      }
    }
  }
  // ── SAVE ────────────────────────────────────────────────────
  const id=gi('asgn');
  const assignData={id,date,type,opponent:opp||null,courts:slots,notes:null,createdAt:new Date().toISOString()};
  fbSet('assignments/'+id,assignData);
  notifyLineup(assignData);
  toast(`Assignment saved! ${slots.length} court(s) for ${date}`);
  if(type==='gameday'&&opp)setTimeout(()=>promptLineupRelease(date,opp),600);
  document.getElementById('ca-result').innerHTML='';
  document.getElementById('ca-preview').innerHTML='';
  document.getElementById('ca-opp').value='';
  renderAssignments();
}

function renderManualOppEntry(){
  const courts=[1,2,3,4,5];
  let h='<div style="margin-top:8px;">';
  courts.forEach(ct=>{
    h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
      <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin-bottom:8px;">COURT ${ct}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 1</div>
          <input type="text" id="ca-opp-${ct-1}-p1f" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
          <input type="text" id="ca-opp-${ct-1}-p1l" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
          <input type="text" id="ca-opp-${ct-1}-p1j" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
        </div>
        <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 2</div>
          <input type="text" id="ca-opp-${ct-1}-p2f" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
          <input type="text" id="ca-opp-${ct-1}-p2l" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
          <input type="text" id="ca-opp-${ct-1}-p2j" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
        </div>
      </div>
      <input type="hidden" id="ca-opp-${ct-1}-court" value="${ct}">
    </div>`;
  });
  h+=`<div style="margin-top:8px;padding:10px;background:var(--off-white);border-radius:8px;">
    <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;color:var(--purple);margin-bottom:8px;">ALTERNATES (optional)</div>
    ${[0,1,2,3,4,5].map(i=>`<div style="display:flex;gap:6px;margin-bottom:6px;">
      <input type="text" id="ca-alt-${i}-f" placeholder="First" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
      <input type="text" id="ca-alt-${i}-l" placeholder="Last" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
      <input type="text" id="ca-alt-${i}-j" placeholder="#" style="width:50px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
    </div>`).join('')}
  </div>`;
  h+=`<button class="btn btn-primary btn-small" style="width:100%;margin-top:10px;" onclick="(function(){
    const starters=[1,2,3,4,5].map(ct=>({court:ct,p1:{first:document.getElementById('ca-opp-'+(ct-1)+'-p1f')?.value||'',last:document.getElementById('ca-opp-'+(ct-1)+'-p1l')?.value||'',jersey:document.getElementById('ca-opp-'+(ct-1)+'-p1j')?.value||''},p2:{first:document.getElementById('ca-opp-'+(ct-1)+'-p2f')?.value||'',last:document.getElementById('ca-opp-'+(ct-1)+'-p2l')?.value||'',jersey:document.getElementById('ca-opp-'+(ct-1)+'-p2j')?.value||''}}));
    const alts=[0,1,2,3,4,5].map(i=>({first:document.getElementById('ca-alt-'+i+'-f')?.value||'',last:document.getElementById('ca-alt-'+i+'-l')?.value||'',jersey:document.getElementById('ca-alt-'+i+'-j')?.value||''})).filter(a=>a.first||a.last);
    const schoolName=document.getElementById('ca-opp')?.value.trim()||'Opponent';
    window._caData={starters,alternates:alts,count:5,altCount:alts.length,schoolName,isOpponent:true,source:'manual'};
    confirmOppLineup();
  })()">&#x2713; Save Manual Entry</button>`;
  h+='</div>';
  return h;
}

// ── OPPONENT INTEL — shared cross-school scouting node ──────────────────────
// Alias map: normalized variants that should collapse to a canonical school id.
// Add entries here whenever the scanner or a user picks up an abbreviation or
// nickname that should file under an existing school.
const OPPONENT_ID_ALIASES={
  'leap_bk':'bishop_kelly',
  'bk':'bishop_kelly',
  'bishop_k':'bishop_kelly',
  'wakalla':'wakulla'
};

// Normalizes a school name to a stable Firebase key.
// "Chiles HS", "W.T. Chiles", "Chiles High School" → "chiles"
// "Lincoln HS" → "lincoln_hs", "Rickards High" → "rickards"
// "Leap BK", "BK", "Bishop K" → "bishop_kelly" (via OPPONENT_ID_ALIASES)
function normalizeOpponentId(name){
  if(!name)return'unknown';
  const id=name
    .toLowerCase()
    .replace(/\bw\.?t\.?\b/g,'wt')           // W.T. → wt
    .replace(/\bhigh school\b/g,'')           // remove "high school"
    .replace(/\bhigh\b/g,'')                  // remove "high"
    .replace(/\bh\.?s\.?\b/g,'hs')            // H.S. / HS → hs
    .replace(/[^a-z0-9]+/g,'_')              // non-alphanum → underscore
    .replace(/^_+|_+$/g,'')                  // trim leading/trailing underscores
    .replace(/_+/g,'_')                      // collapse repeated underscores
    ||'unknown';
  return OPPONENT_ID_ALIASES[id]||id;
}

// Writes one appearance record to the shared top-level opponent_intel node.
// Uses db.ref() directly (not fbSet) so it is NOT scoped to DB_ROOT.
// Called from confirmOppLineup() after the school-scoped opponents/ write.
function writeOpponentIntel(date, oppName, oppCourts, alternates, source){
  if(!db||!oppName||!date)return;
  const opponentId=normalizeOpponentId(oppName);
  const reportingSchool=MY_SCHOOL_KEY.replace('_matches',''); // e.g. 'leon_queens'
  const appearanceId=date.replace(/-/g,'')+'_'+reportingSchool; // e.g. '20250315_leon_queens'

  // Build pairs map keyed by court number
  const pairs={};
  (oppCourts||[]).forEach(function(c){
    if(c.court)pairs[c.court]={p1:c.player1||'',p2:c.player2||''};
  });

  // Build alternates array (first names only for privacy)
  const altNames=(alternates||[])
    .map(function(a){return(a.firstName||a.first||'').trim();})
    .filter(Boolean);

  // Confidence: scanner reads can have OCR errors; manual is coach-verified
  const confidence=source==='scanner'?'high':'medium';

  // Write appearance record (fire-and-forget, same pattern as fbSet)
  db.ref('opponent_intel/'+opponentId+'/appearances/'+appearanceId).set({
    date:date,
    reportingSchool:reportingSchool,
    source:source||'manual',
    pairs:pairs,
    alternates:altNames,
    confidence:confidence,
    ts:new Date().toISOString()
  });

  // Upsert meta (lastSeen and seenBy always update; displayName only if not set)
  var metaRef=db.ref('opponent_intel/'+opponentId+'/meta');
  metaRef.once('value',function(snap){
    var existing=snap.val()||{};
    var seenBy=existing.seenBy||{};
    seenBy[reportingSchool]=true;
    metaRef.set({
      displayName:existing.displayName||oppName,
      firstSeen:existing.firstSeen||date,
      lastSeen:date,
      seenBy:seenBy
    });
  });
}
// ── END OPPONENT INTEL ────────────────────────────────────────────────────────

function confirmOppLineup(){
  const{count,altCount,starters,alternates,schoolName}=window._caData||{};
  if(!count){toast('No data to save');return;}
  const date=document.getElementById('ca-date').value||td();
  const opp=document.getElementById('ca-opp').value.trim()||schoolName||'Opponent';
  const schoolKey=opp.toLowerCase().replace(/[^a-z0-9]+/g,'_');

  // Build oppCourts for the assignment (backward compat)
  const oppCourts=[];
  for(let i=0;i<count;i++){
    const court=parseInt(document.getElementById(`ca-opp-${i}-court`)?.value)||i+1;
    const p1f=document.getElementById(`ca-opp-${i}-p1f`)?.value.trim()||'';
    const p1l=document.getElementById(`ca-opp-${i}-p1l`)?.value.trim()||'';
    const p1j=document.getElementById(`ca-opp-${i}-p1j`)?.value.trim()||'';
    const p2f=document.getElementById(`ca-opp-${i}-p2f`)?.value.trim()||'';
    const p2l=document.getElementById(`ca-opp-${i}-p2l`)?.value.trim()||'';
    const p2j=document.getElementById(`ca-opp-${i}-p2j`)?.value.trim()||'';
    const p1Name=(p1f+' '+p1l).trim();
    const p2Name=(p2f+' '+p2l).trim();
    if(p1Name||p2Name)oppCourts.push({court,player1:p1Name,jersey1:p1j,player2:p2Name,jersey2:p2j});
  }

  // Save to opponents scouting database
  const existingSchool=D.opponents[schoolKey]||{};
  fbSet('opponents/'+schoolKey+'/info',{displayName:opp,lastDual:date});

  // Upsert each starter player
  oppCourts.forEach((c)=>{
    const upsertPlayer=(name,jersey,court,isAlt)=>{
      if(!name)return;
      const pKey=name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
      const existing=(existingSchool.players||{})[pKey]||{};
      fbSet('opponents/'+schoolKey+'/players/'+pKey,{
        ...existing,
        firstName:name.split(' ')[0]||name,
        lastName:name.split(' ').slice(1).join(' ')||'',
        fullName:name,
        jersey:jersey||existing.jersey||'',
        typicalCourt:court||existing.typicalCourt||null,
        isAlternate:isAlt||false,
        firstSeen:existing.firstSeen||date,
        lastSeen:date
      });
    };
    upsertPlayer(c.player1,c.jersey1,c.court,false);
    upsertPlayer(c.player2,c.jersey2,c.court,false);
    // Save pairing
    if(c.player1&&c.player2){
      const pairKey=[c.player1,c.player2].map(n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'_')).sort().join('__');
      const existingPair=(existingSchool.pairs||{})[pairKey]||{};
      fbSet('opponents/'+schoolKey+'/pairs/'+pairKey,{
        ...existingPair,
        player1:c.player1,player2:c.player2,court:c.court,
        firstSeen:existingPair.firstSeen||date,lastSeen:date
      });
    }
  });

  // Upsert alternates
  const altC=altCount||0;
  for(let i=0;i<altC;i++){
    const af=document.getElementById(`ca-alt-${i}-f`)?.value.trim()||'';
    const al=document.getElementById(`ca-alt-${i}-l`)?.value.trim()||'';
    const aj=document.getElementById(`ca-alt-${i}-j`)?.value.trim()||'';
    const aName=(af+' '+al).trim();
    if(aName){
      const pKey=aName.toLowerCase().replace(/[^a-z0-9]+/g,'_');
      const existing=(existingSchool.players||{})[pKey]||{};
      fbSet('opponents/'+schoolKey+'/players/'+pKey,{
        ...existing,
        firstName:af||aName,lastName:al||'',fullName:aName,
        jersey:aj||existing.jersey||'',
        typicalCourt:existing.typicalCourt||null,
        isAlternate:true,
        firstSeen:existing.firstSeen||date,lastSeen:date
      });
    }
  }

  // Save oppLineup to assignment (for Live Score Entry display)
  const existingAssign=Object.values(D.assignments).find(a=>a.date===date);
  if(existingAssign){
    fbSet('assignments/'+existingAssign.id+'/oppLineup',oppCourts);
  }else{
    const id=gi('asgn');
    fbSet('assignments/'+id,{id,date,type:'gameday',opponent:opp,courts:[],oppLineup:oppCourts,notes:null,createdAt:new Date().toISOString()});
  }


  // Write to shared cross-school opponent intel node
  writeOpponentIntel(date,opp,oppCourts,(window._caData&&window._caData.alternates)||[],window._caData&&window._caData.source||'manual');

  toast('Saved '+oppCourts.length+' courts + '+(altC)+' alternates to Scouts!');
  document.getElementById('ca-result').innerHTML='';
  document.getElementById('ca-preview').innerHTML='';
  renderAssignments();
}

// ============================================================
// SCORESHEET SCANNER
// ============================================================
const _scanDateEl=document.getElementById('scan-date');if(_scanDateEl)_scanDateEl.value=td();
const _scanFileEl=document.getElementById('scan-file');if(_scanFileEl)_scanFileEl.addEventListener('change',async function(e){
  const file=e.target.files[0];if(!file)return;
  const preview=document.getElementById('scan-preview');
  const result=document.getElementById('scan-result');

  // Show preview
  const reader=new FileReader();
  reader.onload=async function(ev){
    const base64=ev.target.result.split(',')[1];
    const mediaType=file.type||'image/jpeg';
    preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);">`;
    result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is reading your scoresheet...</div></div>';

    const matchType=document.getElementById('scan-type').value;
    const date=document.getElementById('scan-date').value||td();
    const playerList=D.players.map(p=>p.firstName+' '+p.lastName+' ('+p.id+')').join(', ');

    let typeInstructions='';
    if(matchType==='queens'){
      typeInstructions=`These are Queens matches (${SCHOOL_NAME} vs ${SCHOOL_NAME} practice). Each match has:
- Court number (1-8; courts 6-8 are exhibition and may have split pairs noted)
- Team A: two ${SCHOOL_NAME} players
- Team B: two ${SCHOOL_NAME} players
- Score for each team
- For split/exhibition courts, separate pairs may play Set 1 vs Set 2
Return JSON array: [{"court":1,"team1":["p01","p02"],"team2":["p03","p04"],"score1":21,"score2":15},{"court":6,"team1":["p05","p06"],"team2":["p07","p08"],"score1":21,"score2":18,"isSplit":true,"splitSet2":{"team1":["p09","p10"],"team2":["p11","p12"]}}]`;
    }else{
      typeInstructions=`These are ${matchType==='gameday'?'Game Day':'Scrimmage'} matches (${SCHOOL_NAME} vs external opponent). Each match has:
- Court number
- ${SCHOOL_NAME} pair: two ${SCHOOL_NAME} players
- Opponent name (team + court)
- Set scores (could be 2-3 sets)
Return JSON array: [{"court":1,"pair":["p01","p02"],"opponent":"Chiles CT1","sets":[{"scoreUs":21,"scoreThem":15},{"scoreUs":21,"scoreThem":18}]}]`;
    }

    try{
      const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:[
            {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
            {type:'text',text:`You are reading a handwritten beach volleyball scoresheet. Extract all match results.

PLAYER ROSTER (use these exact IDs):
${playerList}

Match the handwritten names to these players. Use the player IDs (p01, p02, etc.) in your response.

${typeInstructions}

IMPORTANT: Respond with ONLY the JSON array, no other text. If you can't read something, use your best guess based on the roster.`}
          ]}]
        })
      });
      const data=await response.json();
      const text=data.content?.map(c=>c.text||'').join('')||'';
      const clean=text.replace(/```json|```/g,'').trim();
      let parsed;
      try{parsed=JSON.parse(clean);}catch(pe){
        result.innerHTML=`<div style="color:var(--loss-red);font-size:13px;">Couldn't parse AI response. Raw output:</div><pre style="font-size:11px;background:var(--off-white);padding:10px;border-radius:6px;overflow-x:auto;white-space:pre-wrap;">${text}</pre>`;
        return;
      }

      // Show parsed results for review — EDITABLE
      const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
      function playerOpts(selId){return sorted.map(pl=>`<option value="${pl.id}" ${pl.id===selId?'selected':''}>${pl.firstName} ${pl.lastName.charAt(0)}. (CT${pl.court})</option>`).join('');}

      let h='<div style="font-family:\'Bebas Neue\';font-size:14px;letter-spacing:1px;margin-bottom:8px;color:var(--green);">✓ Found '+parsed.length+' match(es) — edit if needed</div>';
      parsed.forEach((m,i)=>{
        if(matchType==='queens'){
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:6px;margin-bottom:8px;">
            <div class="form-row" style="margin-bottom:6px;align-items:center;">
              <span style="font-family:'Bebas Neue';font-size:13px;min-width:38px;">CT</span>
              <input type="number" id="scan-${i}-court" value="${m.court||1}" min="1" max="8" style="width:50px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;">
            </div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="scan-${i}-t1a" style="padding:6px;font-size:12px;"><option value="">P1</option>${playerOpts((m.team1||[])[0])}</select>
              <select class="form-select" id="scan-${i}-t1b" style="padding:6px;font-size:12px;"><option value="">P2</option>${playerOpts((m.team1||[])[1])}</select>
            </div>
            <div class="form-row" style="margin-bottom:6px;align-items:center;">
              <input type="number" id="scan-${i}-s1" value="${m.score1||0}" min="0" style="width:60px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:14px;font-weight:700;text-align:center;">
              <span style="font-family:'Bebas Neue';font-size:14px;color:var(--gray);">vs</span>
              <input type="number" id="scan-${i}-s2" value="${m.score2||0}" min="0" style="width:60px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:14px;font-weight:700;text-align:center;">
            </div>
            <div class="form-row">
              <select class="form-select" id="scan-${i}-t2a" style="padding:6px;font-size:12px;"><option value="">P1</option>${playerOpts((m.team2||[])[0])}</select>
              <select class="form-select" id="scan-${i}-t2b" style="padding:6px;font-size:12px;"><option value="">P2</option>${playerOpts((m.team2||[])[1])}</select>
            </div>
          </div>`;
        }else{
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:6px;margin-bottom:8px;">
            <div class="form-row" style="margin-bottom:6px;align-items:center;">
              <span style="font-family:'Bebas Neue';font-size:13px;min-width:38px;">CT</span>
              <input type="number" id="scan-${i}-court" value="${m.court||1}" min="1" max="8" style="width:50px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;">
              <input type="text" id="scan-${i}-opp" value="${m.opponent||''}" placeholder="Opponent" style="flex:1;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
            </div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="scan-${i}-p1" style="padding:6px;font-size:12px;"><option value="">P1</option>${playerOpts((m.pair||[])[0])}</select>
              <select class="form-select" id="scan-${i}-p2" style="padding:6px;font-size:12px;"><option value="">P2</option>${playerOpts((m.pair||[])[1])}</select>
            </div>`;
          (m.sets||[]).forEach((s,si)=>{
            h+=`<div class="form-row" style="margin-bottom:4px;align-items:center;">
              <span style="font-size:11px;color:var(--gray);min-width:38px;">Set ${si+1}</span>
              <input type="number" id="scan-${i}-set${si}-us" value="${s.scoreUs||0}" min="0" style="width:55px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;text-align:center;">
              <span style="color:var(--gray);">-</span>
              <input type="number" id="scan-${i}-set${si}-them" value="${s.scoreThem||0}" min="0" style="width:55px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;text-align:center;">
            </div>`;
          });
          h+='</div>';
        }
      });
      h+=`<div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-primary btn-small" onclick="confirmScan()">✓ Save These Matches</button>
        <button class="btn btn-secondary btn-small" onclick="document.getElementById('scan-result').innerHTML='';document.getElementById('scan-preview').innerHTML='';">✕ Cancel</button></div>`;
      result.innerHTML=h;
      // Store parsed data for confirmation
      window._scanData={parsed,matchType,date,count:parsed.length};
    }catch(err){
      console.error('Scan error:',err);
      result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error reading scoresheet. Try a clearer photo.</div>';
    }
  };
  reader.readAsDataURL(file);
  e.target.value='';// Reset file input
});

function confirmScan(){
  const{matchType,date,count}=window._scanData||{};
  if(!count){toast('No data to save');return;}

  if(matchType==='queens'){
    for(let i=0;i<count;i++){
      const court=parseInt(document.getElementById('scan-'+i+'-court')?.value)||1;
      const t1a=document.getElementById('scan-'+i+'-t1a')?.value||'';
      const t1b=document.getElementById('scan-'+i+'-t1b')?.value||'';
      const t2a=document.getElementById('scan-'+i+'-t2a')?.value||'';
      const t2b=document.getElementById('scan-'+i+'-t2b')?.value||'';
      const s1=parseInt(document.getElementById('scan-'+i+'-s1')?.value)||0;
      const s2=parseInt(document.getElementById('scan-'+i+'-s2')?.value)||0;
      const team1=[t1a,t1b].filter(Boolean);
      const team2=[t2a,t2b].filter(Boolean);
      if(team1.length<2||team2.length<2){toast('Match '+(i+1)+': select all 4 players');return;}
      const id=gi('q');
      fbSetResult('matches',id,{id,date,court,team1,team2,score1:s1,score2:s2});
    }
  }else{
    const node=matchType==='gameday'?'gamedays':'scrimmages';
    for(let i=0;i<count;i++){
      const court=parseInt(document.getElementById('scan-'+i+'-court')?.value)||1;
      const p1=document.getElementById('scan-'+i+'-p1')?.value||'';
      const p2=document.getElementById('scan-'+i+'-p2')?.value||'';
      const opp=document.getElementById('scan-'+i+'-opp')?.value||'';
      const pair=[p1,p2].filter(Boolean);
      if(pair.length<2){toast('Match '+(i+1)+': select both players');return;}
      // Read sets
      const sets=[];
      for(let si=0;si<10;si++){
        const usEl=document.getElementById('scan-'+i+'-set'+si+'-us');
        const themEl=document.getElementById('scan-'+i+'-set'+si+'-them');
        if(!usEl)break;
        const scoreUs=parseInt(usEl.value)||0;
        const scoreThem=parseInt(themEl.value)||0;
        const stats={};pair.forEach(pid=>{stats[pid]={k:0,b:0,a:0,se:0,re:0,he:0,de:0};});
        sets.push({scoreUs,scoreThem,stats});
      }
      const id=gi(matchType==='gameday'?'gd':'sc');
      fbSetResult(node,id,{id,date,court,pair,opponent:opp,sets});
    }
  }
  toast(count+' match(es) saved!');
  document.getElementById('scan-result').innerHTML='<div style="color:var(--green);font-size:13px;font-weight:700;">✓ Saved successfully!</div>';
  document.getElementById('scan-preview').innerHTML='';
  window._scanData=null;
}

// ============================================================
// COACH SCHEDULING & ASSIGNMENTS
// ============================================================
function buildAssignSlots(){
  const courtsEl=document.getElementById('assign-courts');if(!courtsEl)return;
  const n=parseInt(courtsEl.value)||3;
  let h='';
  for(let c=1;c<=n;c++){
    h+=`<div style="margin-bottom:10px;background:var(--off-white);border-radius:8px;padding:8px 10px;">
      <div style="font-family:'Bebas Neue';font-size:13px;color:var(--blue);letter-spacing:1px;margin-bottom:6px;">PAIR ${c}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <select class="form-select" id="assign-c${c}-p1" style="padding:6px;font-size:12px;text-align:center;"><option value="">Player 1</option></select>
        <select class="form-select" id="assign-c${c}-p2" style="padding:6px;font-size:12px;text-align:center;"><option value="">Player 2</option></select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
        <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Scorer</label>
          <select class="form-select" id="assign-c${c}-scorer1" style="padding:6px;font-size:12px;"><option value="">Scorer</option></select></div>
        <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Backup</label>
          <select class="form-select" id="assign-c${c}-scorer2" style="padding:6px;font-size:12px;"><option value="">Backup</option></select></div>
      </div>
    </div>`;
  }
  document.getElementById('assign-court-slots').innerHTML=h;
  // Populate selects
  const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
  for(let c=1;c<=n;c++){
    ['p1','p2','scorer1','scorer2'].forEach(p=>{
      const sel=document.getElementById('assign-c'+c+'-'+p);
      if(!sel)return;
      sorted.forEach(pl=>{const o=document.createElement('option');o.value=pl.id;o.textContent=pl.firstName+' '+pl.lastName.charAt(0)+'. (PG'+pl.court+')';sel.appendChild(o);});
    });
  }
  // Notes section
  let nh='<div style="margin-top:8px;"><div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:4px;">Player Notes (optional)</div>';
  nh+='<textarea class="form-input" id="assign-notes" rows="2" style="font-size:12px;" placeholder="e.g. Riley K — focus on serving. Bentley — work on left side."></textarea></div>';
  document.getElementById('assign-notes-section').innerHTML=nh;
}

function saveAssignment(){
  const date=document.getElementById('assign-date').value;
  if(!date){toast('Select a date');return;}
  const type=document.getElementById('assign-type').value;
  const opp=document.getElementById('assign-opp').value.trim();
  const numCourts=parseInt(document.getElementById('assign-courts').value)||3;
  const courts=[];
  // Scorer assignments as a parallel map keyed by court number, same shape as the edit path.
  const scorers={};
  for(let c=1;c<=numCourts;c++){
    const p1=document.getElementById('assign-c'+c+'-p1')?.value||'';
    const p2=document.getElementById('assign-c'+c+'-p2')?.value||'';
    if(p1||p2)courts.push({court:c,p1,p2});
    const s1=document.getElementById('assign-c'+c+'-scorer1')?.value||'';
    const s2=document.getElementById('assign-c'+c+'-scorer2')?.value||'';
    if(s1)scorers[c]={primary:s1,secondary:s2||null};
  }
  if(!courts.length){toast('Assign at least one court');return;}
  const notes=document.getElementById('assign-notes')?.value.trim()||'';
  const id=gi('asgn');
  fbSet('assignments/'+id,{id,date,type,opponent:opp||null,courts,scorers,notes:notes||null,createdAt:td()});
  toast('Assignment saved!');
  // Prompt lineup release for duals with opponent
  if(type==='gameday'&&opp)setTimeout(()=>promptLineupRelease(date,opp),600);
  // Clear form
  document.getElementById('assign-opp').value='';
  document.getElementById('assign-notes').value='';
  buildAssignSlots();
}

function openEditAssignment(id){
  const a=D.assignments[id];if(!a)return;
  document.getElementById('assign-date').value=a.date||td();
  document.getElementById('assign-type').value=a.type||'gameday';
  document.getElementById('assign-opp').value=a.opponent||'';
  const n=Math.max(3,(a.courts||[]).length);
  document.getElementById('assign-courts').value=n;
  buildAssignSlots();
  setTimeout(()=>{(a.courts||[]).forEach((c,i)=>{const e1=document.getElementById('assign-c'+(i+1)+'-p1');const e2=document.getElementById('assign-c'+(i+1)+'-p2');if(e1)e1.value=c.p1||'';if(e2)e2.value=c.p2||'';});},150);
  fbRemove('assignments/'+id);toast('Loaded for editing — update and re-save');
}
function deleteAssignment(id){
  // No confirm() — blocked in iframes. Use inline confirmation instead.
  const btn=document.querySelector('[data-del-assign="'+id+'"]');
  if(!btn)return;
  if(btn.dataset.confirmed==='1'){
    fbRemove('assignments/'+id);toast('Assignment deleted');
  }else{
    btn.dataset.confirmed='1';
    btn.textContent='Delete?';
    btn.style.color='var(--loss-red)';
    btn.style.fontWeight='700';
    btn.style.fontSize='11px';
    setTimeout(()=>{
      if(btn&&btn.dataset.confirmed==='1'){
        btn.dataset.confirmed='';btn.textContent='✕';
        btn.style.color='var(--gray-light)';btn.style.fontWeight='';btn.style.fontSize='14px';
      }
    },3000);
  }
}

function openAssignEditModal(id){
  const a=D.assignments[id];if(!a)return;
  window._editAssignId=id;
  const tL={gameday:'Dual',scrimmage:'Scrimmage',queens:'Queens'};
  const tC={gameday:'var(--blue)',scrimmage:'var(--purple)',queens:'var(--red)'};
  const titleEl=document.getElementById('assign-edit-title');
  titleEl.innerHTML=`Edit ${tL[a.type||'gameday']||'Assignment'} \u2014 ${fD(a.date)} <button class="modal-close" onclick="closeAssignEditModal()">&#x2715;</button>`;
  titleEl.style.color=tC[a.type||'gameday']||'var(--red)';
  const sortedP=[...D.players].sort((x,y)=>x.court-y.court||x.lastName.localeCompare(y.lastName));
  function pOpts(val){
    return'<option value="">\u2014</option>'+sortedP.map(p=>`<option value="${p.id}" ${p.id===val?'selected':''}>${p.firstName} ${p.lastName.charAt(0)}.</option>`).join('');
  }
  let h=`<div class="form-row" style="margin-bottom:10px;">
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Date</label>
      <input type="date" class="form-input" id="ae-date" value="${a.date||td()}" style="padding:8px;font-size:13px;"></div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Type</label>
      <select class="form-select" id="ae-type" style="padding:8px;font-size:13px;">
        <option value="gameday" ${(a.type||'gameday')==='gameday'?'selected':''}>Dual</option>
        <option value="scrimmage" ${a.type==='scrimmage'?'selected':''}>Scrimmage</option>
        <option value="queens" ${a.type==='queens'?'selected':''}>Queens</option>
      </select></div>
  </div>
  <div class="form-row" style="margin-bottom:10px;">
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opponent</label>
      <input type="text" class="form-input" id="ae-opp" value="${a.opponent||''}" placeholder="e.g. Chiles" style="padding:8px;font-size:13px;"></div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Location</label>
      <select class="form-select" id="ae-loc" style="padding:8px;font-size:13px;">
        <option ${(a.location===( SC.homeVenue||'Tom Brown')||!a.location)?'selected':''}>${SC.homeVenue||'Tom Brown'}</option>
        <option ${a.location==='Northside'?'selected':''}>Northside</option>
        <option ${a.location==='4 Oaks'?'selected':''}>4 Oaks</option>
        <option ${a.location==='Away'?'selected':''}>Away</option>
      </select></div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Time</label>
      <input type="time" class="form-input" id="ae-time" value="${a.time||''}" style="padding:8px;font-size:13px;"></div>
  </div>`;
  const courts=a.courts||[];
  courts.sort((x,y)=>(x.court||0)-(y.court||0)).forEach((c,i)=>{
    // Scorer assignments live in a parallel map a.scorers keyed by court number; pre-fill if present.
    const _sc=(a.scorers&&a.scorers[c.court])||{};
    h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-bottom:8px;">
      <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin-bottom:6px;">
        COURT <input type="number" id="ae-ct-${i}" value="${c.court}" min="1" max="8"
          style="width:44px;padding:3px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
      </div>
      <div class="form-row">
        <select class="form-select" id="ae-p1-${i}" style="padding:6px;font-size:12px;">${pOpts(c.p1)}</select>
        <select class="form-select" id="ae-p2-${i}" style="padding:6px;font-size:12px;">${pOpts(c.p2)}</select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
        <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Scorer</label>
          <select class="form-select" id="ae-scorer1-${i}" style="padding:6px;font-size:12px;">${pOpts(_sc.primary)}</select></div>
        <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Backup</label>
          <select class="form-select" id="ae-scorer2-${i}" style="padding:6px;font-size:12px;">${pOpts(_sc.secondary)}</select></div>
      </div></div>`;
  });
  window._editAssignCourtCount=courts.length;
  document.getElementById('assign-edit-body').innerHTML=h;
  document.getElementById('assign-edit-modal').classList.add('active');
}

// ============================================================
// LIVE SCORE ENTRY STATS (coach portal)
// ============================================================
if(!window._lseStats)window._lseStats={};

function lseStatBlock(pid, label, idx){
  if(!window._lseStats[idx])window._lseStats[idx]={};
  if(!window._lseStats[idx][pid])window._lseStats[idx][pid]={k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  const s=window._lseStats[idx][pid];
  const stats=['k','a','b','se','re','he','de'];
  const names=['Kills','Aces','Blocks','Srv Err','Rcv Err','Hit Err','Dig Err'];
  return `<div style="margin-bottom:10px;">
    <div style="font-size:11px;font-weight:700;color:var(--charcoal);margin-bottom:6px;">${label}</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
      ${stats.map((st,i)=>`<div style="text-align:center;">
        <div style="font-size:9px;font-weight:700;color:var(--gray);letter-spacing:0.5px;">${st.toUpperCase()}<br><span style="font-size:8px;font-weight:400;">${names[i]}</span></div>
        <button onclick="lseStatAdj(${idx},'${pid}','${st}',1)" style="width:100%;background:var(--blue);color:white;border:none;border-radius:4px;padding:4px;font-size:14px;cursor:pointer;margin-bottom:2px;">+</button>
        <div id="lse-${idx}-${pid}-${st}" style="font-family:'Bebas Neue';font-size:18px;line-height:1;">${s[st]||0}</div>
        <button onclick="lseStatAdj(${idx},'${pid}','${st}',-1)" style="width:100%;background:var(--gray-lighter);color:var(--charcoal);border:none;border-radius:4px;padding:4px;font-size:14px;cursor:pointer;margin-top:2px;">−</button>
      </div>`).join('')}
    </div>
  </div>`;
}

function lseStatAdj(idx,pid,stat,delta){
  if(!window._lseStats[idx])window._lseStats[idx]={};
  if(!window._lseStats[idx][pid])window._lseStats[idx][pid]={k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  window._lseStats[idx][pid][stat]=Math.max(0,(window._lseStats[idx][pid][stat]||0)+delta);
  const el=document.getElementById('lse-'+idx+'-'+pid+'-'+stat);
  if(el)el.textContent=window._lseStats[idx][pid][stat];
}

function lseToggleStats(idx){
  const sec=document.getElementById('lse-stats-'+idx);
  const btn=document.getElementById('lse-stats-toggle-'+idx);
  if(!sec||!btn)return;
  const open=sec.style.display==='none';
  sec.style.display=open?'block':'none';
  btn.textContent=open?'− Hide stats':'＋ Add set stats (optional)';
  btn.classList.toggle('open',open);
}

// ============================================================
// SCOUTS — COACH PORTAL
// ============================================================
const SCOUT_TAGS=['Strong Server','Ace Threat','Weak Passer','Hits Line','Hits Cross','Strong Blocker','Weak Blocker','Good Defense','Tall/Height Advantage','Left-Handed','Right Side Dominant','Left Side Dominant','Physical/Athletic','Smart/Strategic','Consistent','Inconsistent Under Pressure','Communicates Well'];

function schoolKey(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'_');}

function renderScouts(){
  const schoolList=document.getElementById('scouts-school-list');
  const detail=document.getElementById('scouts-detail-panel');
  if(!schoolList)return;
  const schools=Object.entries(D.opponents||{});
  if(!schools.length){
    schoolList.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">No opponents scouted yet. Scan a lineup sheet from the Planner tab.</div>';
    detail.style.display='none';
    return;
  }
  schoolList.innerHTML=schools.map(([key,sc])=>{
    const info=sc.info||{};
    const players=Object.values(sc.players||{});
    const starters=players.filter(p=>!p.isAlternate);
    const alts=players.filter(p=>p.isAlternate);
    const noteCount=Object.values(sc.notes||{}).length;
    return `<div onclick="openScoutSchool('${key}')" style="cursor:pointer;padding:14px;background:var(--white);border-radius:10px;border:1px solid var(--gray-lighter);margin-bottom:8px;transition:all 0.15s;" onmouseover="this.style.borderColor='#0369a1'" onmouseout="this.style.borderColor='var(--gray-lighter)'">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;">${info.displayName||key}</div>
          <div style="font-size:12px;color:var(--gray);margin-top:2px;">${starters.length} players · ${alts.length} alternates · ${noteCount} notes</div>
          ${info.lastDual?`<div style="font-size:11px;color:var(--gray);margin-top:2px;">Last dual: ${info.lastDual}</div>`:''}
        </div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:#0369a1;">›</div>
      </div>
    </div>`;
  }).join('');
  detail.style.display='none';
}

function openScoutSchool(key){
  const sc=D.opponents[key];if(!sc)return;
  const info=sc.info||{};
  const players=Object.values(sc.players||{}).sort((a,b)=>(a.typicalCourt||99)-(b.typicalCourt||99)||(a.fullName||'').localeCompare(b.fullName||''));
  const pairs=Object.values(sc.pairs||{}).sort((a,b)=>(a.court||0)-(b.court||0));
  const notes=sc.notes||{};
  const detail=document.getElementById('scouts-detail-panel');
  detail.style.display='block';
  document.getElementById('scouts-school-list').style.display='none';

  const starters=players.filter(p=>!p.isAlternate);
  const alts=players.filter(p=>p.isAlternate);

  let h=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
    <button onclick="closeScoutSchool()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--blue);">‹</button>
    <div style="font-family:'Bebas Neue';font-size:22px;letter-spacing:1.5px;">${info.displayName||key}</div>
  </div>`;

  // Pairs section
  if(pairs.length){
    h+=`<div class="card" style="border-left:4px solid #0369a1;">
      <div class="card-title" style="color:#0369a1;"><span class="bar" style="background:#0369a1;"></span> Court Pairs</div>`;
    pairs.forEach(pair=>{
      const pairKey=[pair.player1,pair.player2].map(n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'_')).sort().join('__');
      const pairNotes=Object.values(notes).filter(n=>n.targetType==='pair'&&n.targetId===pairKey);
      h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="court-badge court-${pair.court}" style="font-size:11px;">CT ${pair.court}</span>
            <span style="font-weight:700;font-size:13px;margin-left:8px;">${(()=>{const j=players.find(p=>(p.fullName||'')===(pair.player1||''));return (pair.player1||'')+( j&&j.jersey?' #'+j.jersey:'');})()} & ${(()=>{const j=players.find(p=>(p.fullName||'')===(pair.player2||''));return (pair.player2||'')+( j&&j.jersey?' #'+j.jersey:'');})()}</span>
            <div style="font-size:11px;color:var(--gray);margin-top:2px;">Last seen: ${pair.lastSeen||'—'}</div>
          </div>
          <button class="btn btn-small" style="background:#0369a1;color:white;border:none;" onclick="openAddScoutNote('${key}','pair','${pairKey}','${pair.player1} & ${pair.player2}')">+ Note</button>
        </div>
        ${renderScoutNotes(pairNotes)}
      </div>`;
    });
    h+='</div>';
  }

  // Individual players
  h+=`<div class="card" style="border-left:4px solid var(--blue);">
    <div class="card-title blue"><span class="bar"></span> Players</div>`;
  starters.forEach(p=>{
    const pKey=(p.fullName||'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
    const pNotes=Object.values(notes).filter(n=>n.targetType==='player'&&n.targetId===pKey);
    h+=scoutPlayerCard(key,p,pKey,pNotes,false);
  });
  if(alts.length){
    h+=`<div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1.5px;color:var(--purple);margin:12px 0 6px;">ALTERNATES / SUBS</div>`;
    alts.forEach(p=>{
      const pKey=(p.fullName||'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
      const pNotes=Object.values(notes).filter(n=>n.targetType==='player'&&n.targetId===pKey);
      h+=scoutPlayerCard(key,p,pKey,pNotes,true);
    });
  }
  h+='</div>';

  detail.innerHTML=h;
}

function scoutPlayerCard(schoolK,p,pKey,playerNotes,isAlt){
  return `<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <span style="font-weight:700;font-size:14px;">${p.fullName||''}</span>
        ${p.jersey?`<span style="font-family:'Bebas Neue';font-size:12px;color:var(--gray);margin-left:6px;">#${p.jersey}</span>`:''}
        ${p.typicalCourt&&!isAlt?`<span class="court-badge court-${p.typicalCourt}" style="font-size:10px;margin-left:6px;">CT ${p.typicalCourt}</span>`:''}
        ${isAlt?`<span style="font-size:10px;background:var(--purple-bg);color:var(--purple);padding:1px 6px;border-radius:4px;margin-left:6px;">ALT</span>`:''}
        <div style="font-size:11px;color:var(--gray);margin-top:2px;">Last seen: ${p.lastSeen||'—'}</div>
      </div>
      <button class="btn btn-small" style="background:#0369a1;color:white;border:none;" onclick="openAddScoutNote('${schoolK}','player','${pKey}','${p.fullName||''}')">+ Note</button>
    </div>
    ${renderScoutNotes(playerNotes)}
  </div>`;
}

function renderScoutNotes(notesArr){
  if(!notesArr.length)return '';
  return '<div style="margin-top:8px;">'+notesArr.sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(n=>`
    <div style="background:var(--white);border-radius:6px;padding:8px;margin-bottom:4px;border-left:3px solid #0369a1;">
      <div style="font-size:12px;line-height:1.5;">${n.text||''}</div>
      ${n.tags&&n.tags.length?`<div style="margin-top:4px;">${n.tags.map(t=>`<span style="background:#e0f2fe;color:#0369a1;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;margin-right:3px;">${t}</span>`).join('')}</div>`:''}
      <div style="font-size:10px;color:var(--gray);margin-top:4px;">${n.authorName||'Coach'} · ${n.date||''}</div>
    </div>`).join('')+'</div>';
}

function closeScoutSchool(){
  document.getElementById('scouts-detail-panel').style.display='none';
  document.getElementById('scouts-school-list').style.display='block';
}

// ============================================================
// SCOUT NOTE MODAL
// ============================================================
function openAddScoutNote(schoolK,targetType,targetId,targetLabel){
  window._scoutNoteCtx={schoolK,targetType,targetId,targetLabel};
  const isPlayer=targetType==='player';
  let h=`<div style="font-size:13px;font-weight:700;margin-bottom:12px;">${targetLabel}</div>`;
  h+=`<div style="margin-bottom:10px;">
    <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:6px;">QUICK TAGS (select all that apply)</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;" id="scout-tag-chips">
      ${SCOUT_TAGS.map(t=>`<button onclick="toggleScoutTag(this,'${t.replace(/'/g,'\\\'')}')" style="padding:4px 10px;border-radius:20px;border:1px solid var(--gray-lighter);background:var(--white);font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s;" data-tag="${t}">${t}</button>`).join('')}
    </div>
  </div>`;
  h+=`<div><label style="font-size:11px;font-weight:700;color:var(--gray);">NOTES (optional free text)</label>
    <textarea id="scout-note-text" rows="3" class="form-input" style="margin-top:4px;font-size:13px;" placeholder="e.g. Likes to tip over the block, strong serve from deuce side..."></textarea>
  </div>`;

  document.getElementById('edit-modal-body').innerHTML=h;
  document.querySelector('#edit-modal .modal-title').innerHTML=`Scout Note — ${targetType==='pair'?'Pair':'Player'} <button class="modal-close" onclick="closeEdit()">✕</button>`;
  document.querySelector('#edit-modal .modal-title').style.color='#0369a1';
  document.getElementById('edit-save').textContent='Save Scout Note';
  document.getElementById('edit-save').onclick=saveScoutNote;
  document.getElementById('edit-modal').classList.add('active');
}

function toggleScoutTag(btn,tag){
  const active=btn.dataset.active==='1';
  btn.dataset.active=active?'':'1';
  btn.style.background=active?'var(--white)':'#0369a1';
  btn.style.color=active?'var(--black)':'white';
  btn.style.borderColor=active?'var(--gray-lighter)':'#0369a1';
}

function saveScoutNote(){
  const ctx=window._scoutNoteCtx;if(!ctx)return;
  const text=(document.getElementById('scout-note-text')?.value||'').trim();
  const tags=[...document.querySelectorAll('#scout-tag-chips button[data-active="1"]')].map(b=>b.dataset.tag);
  if(!text&&!tags.length){toast('Add a note or select tags');return;}
  const id=gi('sn');
  const authorId=currentPlayerId||'coach';
  const authorName=currentPlayerId?pN(currentPlayerId):'Coach';
  fbSet('opponents/'+ctx.schoolK+'/notes/'+id,{
    id,targetType:ctx.targetType,targetId:ctx.targetId,targetLabel:ctx.targetLabel,
    text,tags,authorId,authorName,date:td(),createdAt:new Date().toISOString()
  });
  toast('Scout note saved!');
  if(currentRole==='player'){
    notifyCoaches(
      'Scout Note from '+authorName+': '+ctx.targetLabel,
      'Player '+authorName+' added a scouting note.\nAbout: '+ctx.targetLabel+'\nSchool: '+ctx.schoolK.replace(/_/g,' ')+(tags.length?'\nTags: '+tags.join(', '):'')+(text?'\nNote: '+text:'')+'\n\nLog in to view.'
    );
  }
  closeEdit();
  setTimeout(()=>{
    if(currentRole==='coach'){openScoutSchool(ctx.schoolK);}
    else{openPlayerScoutSchool(ctx.schoolK);}
  },400);
}

// ============================================================
// SCOUTS — PLAYER PORTAL
// ============================================================
function renderPlayerScouts(){
  const listEl=document.getElementById('pp-scouts-list');
  const detailEl=document.getElementById('pp-scouts-detail');
  if(!listEl)return;
  const schools=Object.entries(D.opponents||{});
  if(!schools.length){
    listEl.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">No opponents scouted yet.</div>';
    if(detailEl)detailEl.style.display='none';
    return;
  }
  listEl.innerHTML=schools.map(([key,sc])=>{
    const info=sc.info||{};
    const players=Object.values(sc.players||{});
    const noteCount=Object.values(sc.notes||{}).length;
    return `<div onclick="openPlayerScoutSchool('${key}')" style="cursor:pointer;padding:14px;background:var(--white);border-radius:10px;border:1px solid var(--gray-lighter);margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-family:'Bebas Neue';font-size:16px;">${info.displayName||key}</div>
          <div style="font-size:12px;color:var(--gray);">${players.length} players · ${noteCount} notes</div>
          ${info.lastDual?`<div style="font-size:11px;color:var(--gray);">Last dual: ${info.lastDual}</div>`:''}
        </div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:#0369a1;">›</div>
      </div>
    </div>`;
  }).join('');
  if(detailEl)detailEl.style.display='none';
}

function openPlayerScoutSchool(key){
  const sc=D.opponents[key];if(!sc)return;
  const info=sc.info||{};
  const players=Object.values(sc.players||{}).sort((a,b)=>(a.typicalCourt||99)-(b.typicalCourt||99));
  const pairs=Object.values(sc.pairs||{}).sort((a,b)=>(a.court||0)-(b.court||0));
  const notes=sc.notes||{};
  const listEl=document.getElementById('pp-scouts-list');
  const detailEl=document.getElementById('pp-scouts-detail');
  listEl.style.display='none';
  detailEl.style.display='block';

  let h=`<div class="card" style="border-left:4px solid #0369a1;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <button onclick="document.getElementById('pp-scouts-list').style.display='block';document.getElementById('pp-scouts-detail').style.display='none';" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--blue);">‹</button>
      <div style="font-family:'Bebas Neue';font-size:20px;">${info.displayName||key}</div>
    </div>`;

  // Pairs
  if(pairs.length){
    h+=`<div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1.5px;color:#0369a1;margin-bottom:8px;">COURT PAIRS</div>`;
    pairs.forEach(pair=>{
      const pairKey=[pair.player1,pair.player2].map(n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'_')).sort().join('__');
      const pairNotes=Object.values(notes).filter(n=>n.targetType==='pair'&&n.targetId===pairKey);
      h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span class="court-badge court-${pair.court}" style="font-size:11px;">CT ${pair.court}</span>
            <span style="font-weight:700;font-size:13px;margin-left:8px;">${(()=>{const j=players.find(p=>(p.fullName||'')===(pair.player1||''));return (pair.player1||'')+( j&&j.jersey?' #'+j.jersey:'');})()} & ${(()=>{const j=players.find(p=>(p.fullName||'')===(pair.player2||''));return (pair.player2||'')+( j&&j.jersey?' #'+j.jersey:'');})()}</span>
          </div>
          <button class="btn btn-small" style="background:#0369a1;color:white;border:none;" onclick="openAddScoutNote('${key}','pair','${pairKey}','${pair.player1} & ${pair.player2}')">+ Note</button>
        </div>
        ${renderScoutNotes(pairNotes)}
      </div>`;
    });
  }

  // Players
  h+=`<div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1.5px;color:var(--blue);margin:12px 0 8px;">PLAYERS</div>`;
  players.forEach(p=>{
    const pKey=(p.fullName||'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
    const pNotes=Object.values(notes).filter(n=>n.targetType==='player'&&n.targetId===pKey);
    h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <span style="font-weight:700;font-size:14px;">${p.fullName||''}</span>
          ${p.jersey?`<span style="font-family:'Bebas Neue';font-size:12px;color:var(--gray);margin-left:6px;">#${p.jersey}</span>`:''}
          ${p.typicalCourt&&!p.isAlternate?`<span class="court-badge court-${p.typicalCourt}" style="font-size:10px;margin-left:6px;">CT ${p.typicalCourt}</span>`:''}
          ${p.isAlternate?`<span style="font-size:10px;background:var(--purple-bg);color:var(--purple);padding:1px 6px;border-radius:4px;margin-left:6px;">ALT</span>`:''}
        </div>
        <button class="btn btn-small" style="background:#0369a1;color:white;border:none;" onclick="openAddScoutNote('${key}','player','${pKey}','${p.fullName||''}')">+ Note</button>
      </div>
      ${renderScoutNotes(pNotes)}
    </div>`;
  });
  h+='</div>';
  detailEl.innerHTML=h;
}


// ============================================================
// EMAIL NOTIFICATION HELPERS
// ============================================================
// Recipient list for player-triggered coach notifications, per-school via
// SC.coachEmails. When a school has none configured, notifyCoaches is a no-op
// (no mailto, no draft), so one school never drafts a note to another's staff.
function notifyCoaches(subject,body){
  const emails=(Array.isArray(SC.coachEmails)&&SC.coachEmails.length)?SC.coachEmails:null;
  if(!emails)return;
  try{
    const a=document.createElement('a');
    a.href='mailto:'+emails.join(',')+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    a.style.display='none';document.body.appendChild(a);a.click();document.body.removeChild(a);
  }catch(e){}
}

// Real server-side email notification to a player. Only a logged-in coach for THIS
// school can trigger it: we pass the coach session token and the worker resolves the
// player's on-file email and checks their per-type preference server-side. Fire and
// forget; never blocks the UI.
function notifyPlayer(pid,notifType,subject,body){
  try{
    let session=null; try{session=JSON.parse(sessionStorage.getItem('csCoachSession'));}catch(e){}
    if(!session||!session.token||session.dbRoot!==DB_ROOT)return; // a player cannot send these
    // coachLabel lets the worker sign the email with the school's own word (Exec for the club). It
    // is absent for high schools, where the worker falls back to today's "your coach" wording.
    fetch(AUTH_WORKER+'/hs/notify-player',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({dbRoot:DB_ROOT,token:session.token,playerId:pid,notifType:notifType,subject:subject,body:body,coachLabel:SC.coachLabel})
    }).catch(function(e){console.warn('notifyPlayer failed',e);});
  }catch(e){console.warn('notifyPlayer failed',e);}
}
// Notify every player in a saved dual (gameday) lineup that their court assignment is up.
function notifyLineup(assignData){
  if(!assignData||assignData.type!=='gameday')return;
  const opp=assignData.opponent||'your dual';
  const date=assignData.date||td();
  (assignData.courts||[]).forEach(c=>{
    [c.p1,c.p2].filter(Boolean).forEach(pid=>{
      const p=gP(pid);
      notifyPlayer(pid,'assign','Your court assignment is posted',
        'Hi '+(p?p.firstName:'there')+',\n\nYour court assignment for '+opp+' on '+date+' is posted. You are on Court '+c.court+'.\n\nLog in to the app to see the full lineup.');
    });
  });
}

function loadEmailPrefs(pid){
  if(!db||!pid)return;
  db.ref(SC.dbRoots.passwords+'/'+pid+'/emailPrefs').once('value',function(snap){
    const prefs=snap.val()||{};
    const el=document.getElementById('pp-email-addr');if(el)el.value=prefs.email||'';
    const m={'pp-notif-assign':'notifAssign','pp-notif-plan':'notifPlan','pp-notif-cnote':'notifCnote','pp-notif-score':'notifScore'};
    Object.entries(m).forEach(function(_ref){const elId=_ref[0],key=_ref[1];const e=document.getElementById(elId);if(e)e.checked=!!prefs[key];});
  });
}

function saveEmailPrefs(){
  const pid=currentPlayerId;if(!pid){toast('Not logged in');return;}
  const email=(document.getElementById('pp-email-addr')?document.getElementById('pp-email-addr').value:'').trim();
  if(email&&!email.includes('@')){toast('Enter a valid email address');return;}
  const prefs={
    email:email||null,
    notifAssign:!!(document.getElementById('pp-notif-assign')?document.getElementById('pp-notif-assign').checked:false),
    notifPlan:!!(document.getElementById('pp-notif-plan')?document.getElementById('pp-notif-plan').checked:false),
    notifCnote:!!(document.getElementById('pp-notif-cnote')?document.getElementById('pp-notif-cnote').checked:false),
    notifScore:!!(document.getElementById('pp-notif-score')?document.getElementById('pp-notif-score').checked:false),
    updatedAt:td()
  };
  if(db)db.ref(SC.dbRoots.passwords+'/'+pid+'/emailPrefs').set(prefs);
  toast('Email preferences saved!');
  const savedEl=document.getElementById('pp-email-saved');
  if(savedEl){savedEl.style.opacity='1';setTimeout(function(){savedEl.style.opacity='0';},2500);}
}

function closeAssignEditModal(){document.getElementById('assign-edit-modal').classList.remove('active');}
function addAssignEditCourt(){
  const i=window._editAssignCourtCount||0;
  const nextCt=i+1;
  const sortedP=[...D.players].sort((x,y)=>x.court-y.court||x.lastName.localeCompare(y.lastName));
  function pOpts(){
    return'<option value="">\u2014</option>'+sortedP.map(p=>`<option value="${p.id}">${p.firstName} ${p.lastName.charAt(0)}. (CT${p.court})</option>`).join('');
  }
  const div=document.createElement('div');
  div.style.cssText='background:var(--off-white);border-radius:8px;padding:10px;margin-bottom:8px;';
  div.innerHTML=`<div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin-bottom:6px;">
    COURT <input type="number" id="ae-ct-${i}" value="${nextCt}" min="1" max="8"
      style="width:44px;padding:3px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
  </div>
  <div class="form-row">
    <select class="form-select" id="ae-p1-${i}" style="padding:6px;font-size:12px;">${pOpts()}</select>
    <select class="form-select" id="ae-p2-${i}" style="padding:6px;font-size:12px;">${pOpts()}</select>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
    <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Scorer</label>
      <select class="form-select" id="ae-scorer1-${i}" style="padding:6px;font-size:12px;">${pOpts()}</select></div>
    <div><label style="font-size:10px;font-weight:700;color:var(--gray);">Backup</label>
      <select class="form-select" id="ae-scorer2-${i}" style="padding:6px;font-size:12px;">${pOpts()}</select></div>
  </div>`;
  document.getElementById('assign-edit-body').appendChild(div);
  window._editAssignCourtCount=i+1;
  toast('Court '+nextCt+' added');
}
function saveAssignEdit(){
  const id=window._editAssignId;if(!id)return;
  const a=D.assignments[id];if(!a)return;
  const date=document.getElementById('ae-date')?.value;
  if(!date){toast('Select a date');return;}
  const type=document.getElementById('ae-type')?.value||'gameday';
  const opp=document.getElementById('ae-opp')?.value.trim()||null;
  const loc=document.getElementById('ae-loc')?.value||SC.homeVenue||'Tom Brown';
  const atime=document.getElementById('ae-time')?.value||'';
  const n=window._editAssignCourtCount||0;
  const courts=[];
  // Scorer assignments as a parallel map keyed by court number, kept separate from the rebuilt
  // courts array so it survives lineup edits. Only courts with a primary scorer are recorded.
  const scorers={};
  for(let i=0;i<n;i++){
    const ct=parseInt(document.getElementById('ae-ct-'+i)?.value)||1;
    const p1=document.getElementById('ae-p1-'+i)?.value||'';
    const p2=document.getElementById('ae-p2-'+i)?.value||'';
    if(p1||p2)courts.push({court:ct,p1,p2});
    const s1=document.getElementById('ae-scorer1-'+i)?.value||'';
    const s2=document.getElementById('ae-scorer2-'+i)?.value||'';
    if(s1)scorers[ct]={primary:s1,secondary:s2||null};
  }
  if(!courts.length){toast('At least one court required');return;}
  fbSet('assignments/'+id,{...a,date,type,opponent:opp,location:loc,time:atime,courts,scorers});
  closeAssignEditModal();
  toast('Assignment updated!');
  renderLiveAssignmentList();
  renderAssignments();
}
function deleteLiveAssignment(id,btn){
  if(btn.dataset.confirmed==='1'){
    fbRemove('assignments/'+id);
    toast('Assignment deleted');
  }else{
    btn.dataset.confirmed='1';
    const orig=btn.innerHTML;
    btn.innerHTML='Sure?';
    btn.style.fontWeight='800';
    setTimeout(()=>{
      if(btn&&btn.dataset.confirmed==='1'){
        btn.dataset.confirmed='';btn.innerHTML=orig;btn.style.fontWeight='';
      }
    },3000);
  }
}

function renderAssignments(){
  const container=document.getElementById('assignments-list');if(!container)return;
  const entries=Object.values(D.assignments).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(!entries.length){container.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No upcoming assignments.</div>';return;}
  const today=td();
  let h='';
  entries.forEach(a=>{
    const isPast=a.date<today;
    const typeLabel=a.type==='gameday'?'🏐 Dual':a.type==='scrimmage'?'🤝 Scrimmage':'👑 Queens';
    const typeColor=a.type==='gameday'?'var(--blue)':a.type==='scrimmage'?'var(--purple)':'var(--red)';
    h+=`<div style="border-left:4px solid ${typeColor};background:${isPast?'var(--gray-lighter)':'var(--off-white)'};border-radius:8px;padding:12px;margin-bottom:10px;${isPast?'opacity:0.6;':''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div><span style="font-family:'Bebas Neue';font-size:16px;">${fD(a.date)}</span>
          <span style="font-size:12px;margin-left:6px;color:${typeColor};font-weight:700;">${typeLabel}</span>
          ${a.opponent?'<span style="font-size:12px;margin-left:4px;color:var(--gray);">vs '+a.opponent+'</span>':''}</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button style="background:none;border:none;color:var(--gray);cursor:pointer;font-size:14px;padding:4px;" onclick="openAssignEditModal('${a.id}')" title="Edit">✎</button>
          <button data-del-assign="${a.id}" style="background:none;border:none;color:var(--gray-light);cursor:pointer;font-size:14px;padding:4px;" onclick="deleteAssignment('${a.id}')" title="Delete — tap once to arm, again to confirm">✕</button>
        </div>
      </div>`;
    (a.courts||[]).sort((a,b)=>(a.court||0)-(b.court||0)).forEach(c=>{
      const p1=gP(c.p1),p2=gP(c.p2);
      h+=`<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;">
        <span class="court-badge court-${c.court}" style="font-size:11px;min-width:40px;text-align:center;">CT ${c.court}</span>
        <span style="font-weight:700;">${p1?p1.firstName+' '+p1.lastName.charAt(0)+'.':'TBD'}</span>
        <span style="color:var(--gray);">&</span>
        <span style="font-weight:700;">${p2?p2.firstName+' '+p2.lastName.charAt(0)+'.':'TBD'}</span></div>`;
    });
    if(a.notes){h+=`<div style="font-size:12px;color:var(--gray);margin-top:6px;font-style:italic;background:var(--white);padding:8px;border-radius:6px;">📝 ${a.notes}</div>`;}
    // Generate Matches button
    h+=`<button class="btn btn-small" style="width:100%;margin-top:10px;background:${typeColor};color:var(--white);border:none;" onclick="generateMatchesFromLineup('${a.id}')">⚡ Generate Matches from Lineup</button>`;
    h+='</div>';
  });
  container.innerHTML=h;
}

// ── Past Court Lineups (from gamedays + scrimmages) ──────────────────────────
function renderPastLineups(filterDate, filterOpp, filterPlayer){
  const container=document.getElementById('past-lineups-list');
  if(!container)return;
  const today=td();

  // Collect all past matches from gamedays + scrimmages
  const allMatches=[
    ...D.gamedays.map(m=>({...m,_src:'gameday'})),
    ...(D.scrimmages||[]).map(m=>({...m,_src:'scrimmage'}))
  ].filter(m=>m.date&&m.date<today);

  if(!allMatches.length){
    container.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No past lineups found.</div>';
    return;
  }

  // Clean opponent name helper
  function cleanOpp(raw){
    if(!raw)return'Unknown';
    return raw.replace(/\s*(CT\s*\d+|Court\s*\d+|Exhibition|\s+\d+).*$/i,'').trim()||'Unknown';
  }

  // Group by date + cleaned opponent
  const groups={};
  allMatches.forEach(m=>{
    const opp=cleanOpp(m.opponent);
    const key=m.date+'||'+opp+'||'+m._src;
    if(!groups[key])groups[key]={date:m.date,opponent:opp,type:m._src,courts:[]};
    // Only add if court not already present
    if(!groups[key].courts.find(c=>c.court===m.court)){
      groups[key].courts.push({court:m.court||1,pair:m.pair||[]});
    }
  });

  // Sort newest first
  let sorted=Object.values(groups).sort((a,b)=>b.date.localeCompare(a.date));
  // Apply search filters
  if(filterDate)sorted=sorted.filter(g=>g.date===filterDate);
  if(filterOpp)sorted=sorted.filter(g=>(g.opponent||'').toLowerCase().includes(filterOpp));
  if(filterPlayer)sorted=sorted.filter(g=>g.courts.some(c=>{
    const _fp=c.pair||c.team1||[];const p1=gP(_fp[0]),p2=gP(_fp[1]);
    const names=[(p1?p1.firstName+' '+p1.lastName:''),(p2?p2.firstName+' '+p2.lastName:'')].join(' ').toLowerCase();
    return names.includes(filterPlayer);
  }));

  let h='';
  sorted.forEach(g=>{
    const typeLabel=g.type==='scrimmage'?'🤝 Scrimmage':'🏐 Dual';
    const typeColor=g.type==='scrimmage'?'var(--purple)':'var(--blue)';
    const courtsOrdered=[...g.courts].sort((a,b)=>(a.court||0)-(b.court||0));
    const id='plid-'+g.date+g.opponent.replace(/\s+/g,'');
    h+=`<div style="border-left:4px solid ${typeColor};background:var(--gray-lighter);border-radius:8px;padding:12px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="const b=document.getElementById('${id}');b.style.display=b.style.display==='none'?'block':'none';">
        <div>
          <span style="font-family:'Bebas Neue';font-size:16px;">${fD(g.date)}</span>
          <span style="font-size:12px;margin-left:6px;color:${typeColor};font-weight:700;">${typeLabel}</span>
          <span style="font-size:12px;margin-left:4px;color:var(--gray);">vs ${g.opponent}</span>
        </div>
        <span style="color:var(--gray);font-size:12px;">${courtsOrdered.length} court${courtsOrdered.length!==1?'s':''} ▾</span>
      </div>
      <div id="${id}" style="display:none;margin-top:8px;">
        ${courtsOrdered.map(c=>{
          const _ep=c.pair||c.team1||[];const p1=gP(_ep[0]),p2=gP(_ep[1]);
          const n1=p1?p1.firstName+' '+p1.lastName.charAt(0)+'.':'TBD';
          const n2=p2?p2.firstName+' '+p2.lastName.charAt(0)+'.':'TBD';
          return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;">
            <span class="court-badge court-${c.court}" style="font-size:11px;min-width:40px;text-align:center;">CT ${c.court}</span>
            <span style="font-weight:700;">${n1}</span>
            <span style="color:var(--gray);">&amp;</span>
            <span style="font-weight:700;">${n2}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  container.innerHTML=h||'<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No past lineups found.</div>';
}


// Render player assignment in their schedule section.
// Player team-board: which same-day dual is selected in the switcher. Module-level so it
// persists across the chip re-render (renderPlayerAssignment runs on every portal render).
let ppSelectedDualId=null;
function ppSelectDual(id){ppSelectedDualId=id;if(currentPlayerId)renderPlayerAssignment(currentPlayerId);}
function renderPlayerAssignment(pid){
  const container=document.getElementById('pp-assignment');
  if(!container)return;
  const today=td();
  // Selection: every today dual the player is involved in, by PLAYING (a court p1/p2) or
  // SCORING (a.scorers primary or secondary). Fixes the scorer-only gap.
  const playsIn=a=>(a.courts||[]).some(c=>c.p1===pid||c.p2===pid);
  const scoresIn=a=>Object.values(a.scorers||{}).some(s=>s&&(s.primary===pid||s.secondary===pid));
  const myDuals=Object.values(D.assignments||{})
    .filter(a=>a.date===today&&(a.courts||[]).length>0&&(playsIn(a)||scoresIn(a)))
    .sort((a,b)=>((a.time||'').localeCompare(b.time||''))||((a.opponent||'').localeCompare(b.opponent||'')));
  if(!myDuals.length){container.innerHTML='';return;}
  // Selected dual persists across chip taps; fall back to the first if the stored one is not today.
  const sel=myDuals.find(a=>a.id===ppSelectedDualId)||myDuals[0];
  ppSelectedDualId=sel.id;
  const tLabels={gameday:'🏐 Dual',scrimmage:'🤝 Scrimmage',queens:'👑 Queens'};
  const tColors={gameday:'var(--blue)',scrimmage:'var(--purple)',queens:'var(--red)'};
  const typeLabel=tLabels[sel.type||'gameday'];
  const typeColor=tColors[sel.type||'gameday'];
  const nm=id2=>{const p=gP(id2);return p?p.firstName+' '+p.lastName.charAt(0)+'.':'TBD';};
  const dash='<span style="color:var(--gray-light);">-</span>';
  let h=`<div style="border:2px solid ${typeColor};border-radius:10px;padding:14px;background:var(--white);">`;
  // Same-day dual switcher (only when the player is in more than one today).
  if(myDuals.length>1){
    h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">';
    myDuals.forEach(d=>{
      const lbl=d.opponent||((tLabels[d.type||'gameday']||'Dual')+(d.time?' '+d.time:''));
      h+=`<button class="filter-btn blue${d.id===sel.id?' active':''}" style="font-size:11px;padding:4px 10px;" onclick="ppSelectDual('${d.id}')">${lbl}</button>`;
    });
    h+='</div>';
  }
  h+=`<div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1.5px;color:${typeColor};margin-bottom:4px;">YOUR DUAL</div>
    <div style="font-family:'Bebas Neue';font-size:20px;margin-bottom:4px;">${fD(sel.date)} · ${typeLabel}</div>
    ${sel.opponent?'<div style="font-size:13px;color:var(--gray);margin-bottom:8px;">vs '+sel.opponent+'</div>':''}`;
  // Personal role banner: playing and/or scoring, both lines when both apply.
  const myCourt=(sel.courts||[]).find(c=>c.p1===pid||c.p2===pid);
  const scoreCourts=Object.entries(sel.scorers||{}).filter(([ct,s])=>s&&s.primary===pid).sort((a,b)=>(+a[0])-(+b[0]));
  const backupCourts=Object.entries(sel.scorers||{}).filter(([ct,s])=>s&&s.secondary===pid).sort((a,b)=>(+a[0])-(+b[0]));
  h+='<div style="background:var(--blue-bg);border-radius:8px;padding:10px 12px;margin-bottom:10px;">'
    +'<div style="font-family:\'Bebas Neue\';font-size:12px;letter-spacing:1px;color:var(--blue);margin-bottom:6px;">YOUR ROLE</div>';
  const lines=[];
  if(myCourt){
    const partner=myCourt.p1===pid?myCourt.p2:myCourt.p1;
    lines.push(`<div style="font-size:14px;font-weight:700;margin-bottom:3px;">🏐 You play Court ${myCourt.court} with ${nm(partner)}</div>`);
  }
  scoreCourts.forEach(([ct,s])=>{lines.push(`<div style="font-size:14px;font-weight:700;margin-bottom:3px;">✎ You score Court ${ct}${s.secondary?' (backup: '+nm(s.secondary)+')':''}</div>`);});
  backupCourts.forEach(([ct,s])=>{lines.push(`<div style="font-size:14px;font-weight:700;margin-bottom:3px;">✎ You are backup scorer for Court ${ct}${s.primary?' (scorer: '+nm(s.primary)+')':''}</div>`);});
  if(!lines.length)lines.push('<div style="font-size:13px;color:var(--gray);">You are on the roster for this dual.</div>');
  h+=lines.join('')+'</div>';
  // Full team board: every court, pair, scorer, backup. Highlight rows where this player appears.
  h+='<div style="font-family:\'Bebas Neue\';font-size:12px;letter-spacing:1px;color:var(--charcoal);margin-bottom:6px;">TEAM BOARD</div>';
  h+='<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;">'
    +'<thead><tr style="text-align:left;color:var(--gray);font-size:10px;letter-spacing:0.5px;">'
    +'<th style="padding:4px 6px;">CT</th><th style="padding:4px 6px;">PLAYERS</th><th style="padding:4px 6px;">SCORER</th><th style="padding:4px 6px;">BACKUP</th></tr></thead><tbody>';
  [...(sel.courts||[])].sort((a,b)=>(a.court||0)-(b.court||0)).forEach(c=>{
    const sc=(sel.scorers||{})[c.court]||{};
    const mine=(c.p1===pid||c.p2===pid||sc.primary===pid||sc.secondary===pid);
    const pairName=[c.p1,c.p2].map(x=>x?nm(x):'TBD').join(' & ');
    h+=`<tr style="border-top:1px solid var(--gray-lighter);${mine?'background:var(--blue-bg);font-weight:700;':''}">`
      +`<td style="padding:5px 6px;"><span class="court-badge court-${c.court}">CT ${c.court}</span></td>`
      +`<td style="padding:5px 6px;">${pairName}</td>`
      +`<td style="padding:5px 6px;">${sc.primary?nm(sc.primary):dash}</td>`
      +`<td style="padding:5px 6px;">${sc.secondary?nm(sc.secondary):dash}</td></tr>`;
  });
  h+='</tbody></table></div>';
  // Existing behavior: show coach notes if they mention this player.
  if(sel.notes){
    const p=gP(pid);
    const fn=p?p.firstName.toLowerCase():'';
    const ln=p?p.lastName.toLowerCase():'';
    const nl=sel.notes.toLowerCase();
    if((fn&&nl.includes(fn))||(ln&&nl.includes(ln))){
      h+=`<div style="font-size:12px;color:var(--gray);margin-top:8px;font-style:italic;padding:8px;background:var(--off-white);border-radius:6px;">📝 ${COACH_LABEL} notes: ${sel.notes}</div>`;
    }
  }
  h+='</div>';
  container.innerHTML=h;
}

// Init assignment slots when courts dropdown changes
const _elassign_courts=document.getElementById('assign-courts');if(_elassign_courts)_elassign_courts.addEventListener('change',buildAssignSlots);
const _elassign_type=document.getElementById('assign-type');if(_elassign_type)_elassign_type.addEventListener('change',function(){
  const showOpp=this.value==='gameday'||this.value==='scrimmage';
  document.getElementById('assign-opp').closest('.form-group').style.display=showOpp?'':'none';
});

// ============================================================
// ONE-TIME MIGRATION (Leon only)
// ============================================================
function runMigration(){
  if(!SC.legacyMigration)return;
  if(!db)return;
  db.ref(DB_ROOT+'/_migrated_gamedays').once('value',snap=>{
    if(snap.val())return;
    db.ref((SC.dbRoots.profiles+'_gamedays')).once('value',gdSnap=>{
      const gdData=gdSnap.val();
      const updates={};
      // Migrate old gameday node data
      if(gdData){
        Object.entries(gdData).forEach(([gdKey,gd])=>{
          if(!gd||!gd.courts)return;
          const date=gd.date||'';
          const opponent=gd.opponent||'Unknown';
          const isScrimmage=(date==='2026-02-19');
          // Everything else from old node goes to gamedays
          const node=isScrimmage?'scrimmages':'gamedays';
          Object.entries(gd.courts).forEach(([courtNum,ct])=>{
            if(!ct)return;
            const pair=[ct.pairA,ct.pairB].filter(Boolean);
            if(pair.length<2)return;
            const oppLabel=ct.opponent||opponent+' CT'+courtNum;
            const sets=(ct.sets||[]).map(s=>{
              const newStats={};
              pair.forEach(pid=>{
                const old=s.stats?.[pid]||{};
                newStats[pid]={k:old.kills||0,b:old.blocks||0,a:old.aces||0,d:old.digs||0,e:old.errors||0};
              });
              return{scoreUs:s.scoreUs||0,scoreThem:s.scoreThem||0,stats:newStats};
            });
            const id=gi(isScrimmage?'sc':'gd');
            updates[DB_ROOT+'/'+node+'/'+id]={id,date,court:parseInt(courtNum),pair,opponent:oppLabel,sets};
          });
        });
      }
      // Seed 2/24/2026 — Leon vs Community Christian School (Game Day)
      const ccs='Community Christian';
      const gd24=[
        {court:1,pair:['p01','p10'],opp:ccs+' CT1',sets:[{scoreUs:21,scoreThem:19},{scoreUs:16,scoreThem:21},{scoreUs:21,scoreThem:7}]},
        {court:2,pair:['p16','p08'],opp:ccs+' CT2',sets:[{scoreUs:21,scoreThem:15},{scoreUs:21,scoreThem:19}]},
        {court:3,pair:['p13','p06'],opp:ccs+' CT3',sets:[{scoreUs:21,scoreThem:9},{scoreUs:21,scoreThem:7}]},
        {court:4,pair:['p02','p09'],opp:ccs+' CT4',sets:[{scoreUs:16,scoreThem:21},{scoreUs:22,scoreThem:20},{scoreUs:13,scoreThem:15}]},
        {court:5,pair:['p11','p15'],opp:ccs+' CT5',sets:[{scoreUs:21,scoreThem:0},{scoreUs:21,scoreThem:7}]},
        {court:5,pair:['p05','p03'],opp:ccs+' Exhibition',sets:[{scoreUs:21,scoreThem:10},{scoreUs:21,scoreThem:9}]}
      ];
      gd24.forEach(m=>{
        const id=gi('gd');
        const sets=m.sets.map(s=>{
          const stats={};m.pair.forEach(pid=>{stats[pid]={k:0,b:0,a:0,se:0,re:0,he:0,de:0};});
          return{scoreUs:s.scoreUs,scoreThem:s.scoreThem,stats};
        });
        updates[DB_ROOT+'/gamedays/'+id]={id,date:'2026-02-24',court:m.court,pair:m.pair,opponent:m.opp,sets};
      });
      updates[DB_ROOT+'/_migrated_gamedays']=true;
      db.ref().update(updates,err=>{
        if(!err)toast('Game day data migrated!');
        else console.error('Migration error:',err);
      });
    });
  });
}

// ============================================================
// LIVE SCORE ENTRY (Coach)
// ============================================================
function renderLiveAssignmentList(){
  if(_dualCloseInProgress)return;
  const el=document.getElementById('live-assignment-list');if(!el)return;
  const today=td();
  const sorted=Object.values(D.assignments||{}).filter(a=>a.courts&&a.courts.length>0&&(a.date||'')>=today).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(!sorted.length){el.innerHTML='<div style="color:var(--gray);font-size:13px;padding:8px 0;">No assignments yet. Use the Planner tab to create one.</div>';return;}
  const tL={gameday:'Dual',scrimmage:'Scrimmage',queens:'Queens'};
  const tC={gameday:'var(--blue)',scrimmage:'var(--purple)',queens:'var(--red)'};
  el.innerHTML=sorted.map(a=>{
    const isToday=a.date===today;
    const locStr=a.location?' · '+a.location:'';
    const timeStr=a.time?' · '+a.time:'';
    const roundBadge=a.totalRounds>1?'<span style="background:var(--red-bg);color:var(--red);font-weight:700;padding:1px 6px;border-radius:4px;font-size:10px;margin-left:4px;">RD '+a.round+'/'+a.totalRounds+'</span>':'';
    const todayBadge=isToday?'<strong style="color:var(--blue);margin-left:4px;">TODAY</strong>':'';
    const notesStr=a.notes&&!a.totalRounds?' · <em>'+a.notes+'</em>':'';
    return`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:6px;border-radius:8px;border:1px solid ${isToday?'var(--blue)':'var(--gray-lighter)'};background:${isToday?'var(--blue-bg)':'var(--white)'};">
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;">${fD(a.date)} — ${a.opponent||'Practice'}${locStr}${timeStr}</div>
        <div style="font-size:11px;color:var(--gray);margin-top:2px;"><span style="font-weight:700;color:${tC[a.type||'gameday']}">${tL[a.type||'gameday']||'Dual'}</span> · ${(a.courts||[]).length} courts${notesStr}${roundBadge}${todayBadge}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <button class="btn btn-blue btn-small" onclick="loadLiveCourts('${a.id}')" style="white-space:nowrap;padding:6px 12px;">Load</button>
        <button class="btn btn-secondary btn-small" onclick="openAssignEditModal('${a.id}')" style="padding:6px 10px;" title="Edit">&#9998;</button>
        <button class="btn btn-danger btn-small" data-del-live="${a.id}" onclick="deleteLiveAssignment('${a.id}',this)" style="padding:6px 10px;" title="Delete">&#x2715;</button>
      </div>
    </div>`;
  }).join('');
}
function loadLiveCourts(id){
  const a=Object.values(D.assignments||{}).find(x=>x.id===id);
  if(!a){toast('Assignment not found');return;}
  window._loadedAssignment=a;
  renderLiveScoring(a.date,a);
  // Start shared lineup listener if opponent is on platform
  if(a.opponent&&SCHOOL_KEY_MAP[a.opponent]){
    listenSharedLineup(a.date, a.opponent);
  }
}


// Match a result record to a court. New records carry assignmentId so two same-day duals
// no longer fuse. When both the record and the current context have an assignmentId they must
// agree; legacy records with no assignmentId (existing live data plus the Sand Sharks fixture)
// fall back to date+pair matching exactly as before, so nothing existing breaks.
function resMatchesCourt(m,date,pair,aid){
  if(!m||m.date!==date||!arrEq(m.pair||[],pair))return false;
  if(aid&&m.assignmentId&&m.assignmentId!==aid)return false;
  return true;
}
// Queens variant: pair can be on either side (team1/team2). Same assignmentId discriminator + fallback.
function queensMatchesCourt(m,date,pair,aid){
  if(!m||m.date!==date)return false;
  if(!(arrEq(m.team1||[],pair)||arrEq(m.team2||[],pair)))return false;
  if(aid&&m.assignmentId&&m.assignmentId!==aid)return false;
  return true;
}
// live_scoring is now nested under assignmentId (live_scoring/{assignmentId}/{idx}) so same-day
// duals cannot overwrite each other on shared court indexes. Readers use this resolver to get an
// idx-keyed view. If a specific assignment is known (coach) return its slice; otherwise (player /
// fans, no loaded assignment) flatten nested groups plus any legacy flat entries into one idx map.
function lsView(aid){
  const all=D.liveScoring||{};
  aid=aid||(window._loadedAssignment||{}).id;
  if(aid&&all[aid])return all[aid];
  const out={};
  Object.entries(all).forEach(([k,v])=>{
    if(!v||typeof v!=='object')return;
    if(v.date!==undefined){out[k]=v;} // legacy flat entry keyed by court idx
    else{Object.entries(v).forEach(([idx,rec])=>{out[idx]=rec;});} // nested assignment group
  });
  return out;
}
function closeDual(){
  const a=window._loadedAssignment||Object.values(D.assignments||{}).find(x=>x.type==='gameday');
  const btn=document.getElementById('close-dual-btn');
  const resultDiv=document.getElementById('close-dual-result');

  function showResult(msg,isError){
    if(resultDiv){
      resultDiv.style.display='block';
      resultDiv.style.background=isError?'#fee2e2':'var(--green-bg)';
      resultDiv.style.color=isError?'var(--loss-red)':'var(--green)';
      resultDiv.style.border='2px solid '+(isError?'var(--loss-red)':'var(--green)');
      resultDiv.textContent=msg;
    }
    toast(msg);
    if(btn&&isError){btn.disabled=false;btn.textContent='\u2713 Close Dual & Save Result';btn.style.background='';}
  }

  if(!a){showResult('\u26a0 No assignment loaded',true);return;}
  const date=a.date||td();
  const opponent=a.opponent||'Opponent';
  const aType=a.type||'gameday';
  if(aType==='scrimmage'||aType==='queens'){showResult('\u26a0 Official duals only',true);return;}
  if(!db){showResult('\u26a0 Not connected',true);return;}

  if(btn){btn.disabled=true;btn.textContent='Saving...';}

  let leonCourts=0,oppCourts=0;
  const courts=(a.courts||[]).filter(c=>(c.court||0)<=5);
  courts.forEach(c=>{
    const m=D.gamedays.find(gd=>resMatchesCourt(gd,date,[c.p1,c.p2].filter(Boolean),a.id));
    if(!m||(m.sets||[]).length===0)return;
    const sets=m.sets||[];
    const sw=sets.filter(s=>(s.scoreUs||0)>(s.scoreThem||0)).length;
    const sl=sets.length-sw;
    if(sw>sl)leonCourts++;else if(sl>sw)oppCourts++;
  });

  const dualWin=leonCourts>oppCourts;
  const loc=a.location||'home';
  const dualId='dual-'+date+'-'+opponent.toLowerCase().replace(/[^a-z0-9]/g,'');
  const existing=D.duals.find(d=>d.date===date&&(d.opponent||'').toLowerCase()===opponent.toLowerCase());
  const id=existing?existing.id:dualId;

  fbSetResult('duals',id,{id,date,opponent,location:loc,leonCourts,oppCourts,dualWin,createdAt:existing?existing.createdAt:td()});
  const _normOpp=s=>(s||'').toLowerCase().replace(/^[@\s]+/,'').replace(/[^a-z0-9]/g,'');
  const _oppNorm=_normOpp(opponent);
  let schedMatch=(D.schedule||[]).find(g=>g.date===date&&_normOpp(g.opponent)===_oppNorm);
  if(!schedMatch){const byDate=(D.schedule||[]).filter(g=>g.date===date&&g.scoreUs==null);if(byDate.length===1)schedMatch=byDate[0];}
  if(schedMatch){
    fbSet('schedule/'+schedMatch.id+'/scoreUs',leonCourts);
    fbSet('schedule/'+schedMatch.id+'/scoreThem',oppCourts);
  }
  if(db){if(a.id)db.ref(DB_ROOT+'/live_scoring/'+a.id).remove();else db.ref(DB_ROOT+'/live_scoring').remove();}

  const winner=dualWin?(SC.shortName||'Us'):opponent;
  const resultMsg=winner+' wins '+leonCourts+'-'+oppCourts;
  if(btn){btn.textContent='\u2713 Saved!';btn.style.background='var(--green)';}
  showResult('\u2713 '+resultMsg+' saved!',false);

  // Notify every player who played that the dual result is posted.
  const _played=new Set();
  courts.forEach(c=>{[c.p1,c.p2].filter(Boolean).forEach(pid=>_played.add(pid));});
  _played.forEach(pid=>{
    const p=gP(pid);
    notifyPlayer(pid,'score','Dual results are posted',
      'Hi '+(p?p.firstName:'there')+',\n\nThe dual vs '+opponent+' on '+date+' is final: '+resultMsg+'.\n\nLog in to the app for the court-by-court breakdown.');
  });

  _dualCloseInProgress=true;
  setTimeout(()=>{
    _dualCloseInProgress=false;
    const today=td();
    const nextToday=Object.values(D.assignments||{})
      .filter(x=>x.date===today&&x.type==='gameday'&&x.id!==id&&(x.courts||[]).length>0)
      .sort((a,b)=>(a.time||'').localeCompare(b.time||''));
    const dualsTab=document.querySelector('.tab[data-tab="duals"]');
    if(dualsTab)dualsTab.click();
    if(nextToday.length){
      setTimeout(()=>{
        const next=nextToday[0];
        const banner=document.getElementById('next-match-banner');
        if(banner){
          banner.style.display='block';
          banner.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 16px;background:var(--blue-bg);border:2px solid var(--blue);border-radius:10px;margin-bottom:12px;">
            <span style="font-weight:600;">📋 Next match ready: <strong>${next.opponent||'Opponent'}</strong>${next.time?' at '+next.time:''}</span>
            <button class="btn btn-blue btn-small" onclick="loadLiveCourts('${next.id}');document.getElementById('next-match-banner').style.display='none';">▶ Load ${next.opponent||'Next Match'}</button>
          </div>`;
        }
      },300);
    }
  },1800);
}

function applyLiveScoringToCounters(){
  const today=td();
  Object.entries(lsView()).forEach(([idx,live])=>{
    if(!live||live.date!==today)return;
    // Coach counters
    const cUs=document.getElementById('ls-us-'+idx);
    const cThem=document.getElementById('ls-them-'+idx);
    if(cUs&&cThem){
      if(cUs.tagName==='INPUT'){cUs.value=live.us;}else{cUs.textContent=live.us;}
      if(cThem.tagName==='INPUT'){cThem.value=live.them;}else{cThem.textContent=live.them;}
      if(live.scoredBy){
        const card=document.getElementById('lc-card-'+idx);
        if(card){
          let lbl=card.querySelector('.live-scored-by');
          if(!lbl){lbl=document.createElement('div');lbl.className='live-scored-by';lbl.style.cssText='font-size:10px;color:var(--gray);font-style:italic;text-align:center;margin-top:4px;';card.querySelector('.live-score-row')?.after(lbl);}
          lbl.textContent='✎ '+live.scoredBy+' keeping score';
        }
      }
    }
    // Player counters
    const pUs=document.getElementById('pp-us-'+idx);
    const pThem=document.getElementById('pp-them-'+idx);
    if(pUs&&pThem){
      if(pUs.tagName==='INPUT'){pUs.value=live.us;}else{pUs.textContent=live.us;}
      if(pThem.tagName==='INPUT'){pThem.value=live.them;}else{pThem.textContent=live.them;}
      if(live.scoredBy){
        const card=document.getElementById('pp-lc-'+idx);
        if(card){
          let lbl=card.querySelector('.live-scored-by');
          if(!lbl){lbl=document.createElement('div');lbl.className='live-scored-by';lbl.style.cssText='font-size:10px;color:var(--gray);font-style:italic;text-align:center;margin-top:4px;';card.querySelector('.live-score-row')?.after(lbl);}
          lbl.textContent='✎ '+live.scoredBy+' keeping score';
        }
      }
    }
  });
}
function renderLiveScoring(dateOverride,assignOverride){
  if(_dualCloseInProgress)return;
  const date=dateOverride||td();
  const container=document.getElementById('live-courts-container');
  const assignment=assignOverride||Object.values(D.assignments).find(a=>a.date===date);
  if(assignment)window._loadedAssignment=assignment;

  if(!assignment||!(assignment.courts||[]).length){
    container.innerHTML=`<div style="text-align:center;color:var(--gray);font-size:13px;padding:16px;">No assignment found for ${fD(date)}.<br><span style="font-size:12px;">Create an assignment in the Upcoming Assignments section first.</span></div>`;
    return;
  }

  const aType=assignment.type||'gameday';

  // Queens: show pair-vs-pair score entry
  if(aType==='queens'){
    renderLiveScoringQueens(assignment,date,container);
    return;
  }

  // Build a card per court entry
  const matchList=aType==='scrimmage'?D.scrimmages:D.gamedays;
  const fbNode=aType==='scrimmage'?'scrimmages':'gamedays';
  let h='';
  (assignment.courts||[]).sort((a,b)=>(a.court||0)-(b.court||0)).forEach((c,idx)=>{
    const p1=gP(c.p1),p2=gP(c.p2);
    const pairKey=[c.p1,c.p2].filter(Boolean).sort().join('_');
    const courtLabel='Court '+c.court+(c.subCourt?c.subCourt.toUpperCase():'');
    const partnerLabel=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
    // Try to get actual opponent player names from oppLineup
    let opp=assignment.opponent?assignment.opponent+' CT'+c.court:'Opponent CT'+c.court;
    const oppLineup=assignment.oppLineup||[];
    const oppCourt=oppLineup.find(ol=>ol.court===c.court);
    if(oppCourt&&(oppCourt.player1||oppCourt.player2)){
      const p1name=oppCourt.player1+(oppCourt.jersey1?' #'+oppCourt.jersey1:'');
      const p2name=oppCourt.player2+(oppCourt.jersey2?' #'+oppCourt.jersey2:'');
      opp=[p1name,p2name].filter(Boolean).join(' & ');
    }

    // Find existing match for this pair/date
    const existingMatch=matchList.find(m=>resMatchesCourt(m,date,[c.p1,c.p2].filter(Boolean),assignment.id));
    const matchId=existingMatch?existingMatch.id:null;
    const sets=existingMatch?existingMatch.sets||[]:[];
    let sw=0,sl=0,ptDiff=0;
    sets.forEach(s=>{
      const us=s.scoreUs||0,them=s.scoreThem||0;
      (us>them?sw++:sl++);
      ptDiff+=(us-them);
    });
    const diffStr=ptDiff>0?'+'+ptDiff:String(ptDiff);
    const diffColor=ptDiff>0?'var(--green)':ptDiff<0?'var(--loss-red)':'var(--gray)';

    h+=`<div class="live-court-card" id="lc-card-${idx}">
      <div class="live-court-header">
        <div>
          <span class="court-badge court-${c.court}" style="font-size:12px;">${courtLabel}</span>
          <div class="live-pair-name" style="margin-top:4px;">${partnerLabel||'TBD'}</div>
          <div class="live-opp-name">vs ${opp}</div>
        </div>
        <div style="text-align:right;">
          ${sets.length?`<div style="font-family:'Bebas Neue';font-size:18px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</div><div style="font-size:10px;color:var(--gray);">Match</div><div style="font-family:'Bebas Neue';font-size:15px;color:${diffColor};margin-top:2px;">${diffStr}</div><div style="font-size:10px;color:var(--gray);">Pts</div>`:'<div style="font-size:12px;color:var(--gray);">No sets yet</div>'}
        </div>
      </div>`;

    // Show existing sets as chips
    if(sets.length){
      h+='<div style="margin-bottom:8px;">';
      sets.forEach((s,si)=>{
        const win=(s.scoreUs||0)>(s.scoreThem||0);
        h+=`<span class="live-set-chip ${win?'win':'loss'}">S${si+1}: ${s.scoreUs}-${s.scoreThem} <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:11px;padding:0 0 0 4px;" onclick="delLiveSet('${matchId}',${si},'${fbNode}')" title="Delete">✕</button></span>`;
      });
      h+='</div>';
    }

    // Score entry row, gated by best-of-3 completion: once a pair wins 2 sets the
    // court match is decided, so show Match Complete instead of offering another set.
    if(sw>=2||sl>=2){
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">MATCH COMPLETE</div>
        <div style="font-size:12px;color:var(--gray);margin-top:4px;">${sw>sl?(partnerLabel||'Our pair'):(assignment.opponent||'Opponent')} won ${Math.max(sw,sl)}-${Math.min(sw,sl)}</div>
      </div>`;
    }else{
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;">
      <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:10px;letter-spacing:1px;">SET ${sets.length+1}</div>
      <span id="ls-setnum-${idx}" style="display:none;">${sets.length+1}</span>
      <div class="live-score-row">
        <div class="live-score-col">
          <div class="live-score-label">${SC.abbrev}</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('ls-us-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="ls-us-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('ls-us-${idx}',0)" style="">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('ls-us-${idx}',-1)">−</button>
          </div>
        </div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
        <div class="live-score-col">
          <div class="live-score-label">OPP</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('ls-them-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="ls-them-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('ls-them-${idx}',0)" style="">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('ls-them-${idx}',-1)">−</button>
          </div>
        </div>
      </div>
      <button class="pgd-stats-toggle" id="lse-stats-toggle-${idx}" onclick="lseToggleStats(${idx})" style="width:100%;margin-top:8px;">＋ Add set stats (optional)</button>
    <div id="lse-stats-${idx}" style="display:none;margin-top:8px;">
      <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">Tap +/− to count stats (optional)</div>
      ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const po=gP(pid2);return lseStatBlock(pid2,po?po.firstName:'P',idx);}).join('')}
    </div>
    <button class="btn btn-blue btn-small" style="width:100%;margin-top:6px;" onclick="saveLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${date}',${c.court},'${c.subCourt||''}','${existingMatch?existingMatch.id:''}','${assignment.opponent||''}','${fbNode}')">✓ Save Set</button>
    </div>`;
    }
    h+='</div>';
  });

  // Add Close Dual button at bottom
  h+=`<div style="margin-top:16px;padding:0 4px;">
    <button class="btn btn-red" id="close-dual-btn" style="width:100%;padding:12px;font-size:15px;font-family:'Bebas Neue',sans-serif;letter-spacing:1px;" onclick="closeDual()">&#10003; Close Dual &amp; Save Result</button>
  <div id="close-dual-result" style="display:none;margin-top:10px;padding:12px;border-radius:8px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;"></div>
  </div>`;
  container.innerHTML=h;
  applyLiveScoringToCounters();
}

if(!window._lsLiveDebounce)window._lsLiveDebounce={};
// ── Side switch alert ──────────────────────────────────────
function setCaTeam(mode){
  const sel=document.getElementById('ca-team');
  if(sel)sel.value=mode;
  const wrap=document.getElementById('ca-opp-wrap');
  if(wrap)wrap.style.display=mode==='opponent'?'block':'none';
  const btnMine=document.getElementById('ca-toggle-mine');
  const btnOpp=document.getElementById('ca-toggle-opp');
  if(btnMine)btnMine.className='btn btn-'+(mode==='mine'?'primary':'secondary')+' btn-small';
  if(btnOpp)btnOpp.className='btn btn-'+(mode==='opponent'?'primary':'secondary')+' btn-small';
}
function checkSideSwitch(usId,themId,setnumId){
  const usEl=document.getElementById(usId);
  const themEl=document.getElementById(themId);
  if(!usEl||!themEl)return;
  const us=parseInt(usEl.tagName==='INPUT'?usEl.value:usEl.textContent)||0;
  const them=parseInt(themEl.tagName==='INPUT'?themEl.value:themEl.textContent)||0;
  const total=us+them;
  if(total===0)return;
  const setnumEl=document.getElementById(setnumId);
  const setNum=setnumEl?parseInt(setnumEl.textContent)||1:1;
  const interval=setNum>=3?5:7;
  if(total%interval===0){switchSidesAlert(total,setNum,interval);}
}
function switchSidesAlert(total,setNum,interval){
  const existing=document.getElementById('switch-sides-alert');
  if(existing)existing.remove();
  const div=document.createElement('div');
  div.id='switch-sides-alert';
  div.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#1e40af;color:#fff;text-align:center;padding:14px 16px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.35);animation:switchSlideIn 0.25s ease;cursor:pointer;';
  const isTechTO=total===21&&setNum<3;
  div.innerHTML='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:3px;margin-bottom:2px;">\u21c4 SWITCH SIDES'+(isTechTO?' + TECH TIMEOUT':'')+' </div>'
    +'<div style="font-size:12px;font-weight:600;opacity:0.88;">Set '+setNum+' \u00b7 '+total+' total points (switch every '+interval+')'+(isTechTO?' \u00b7 Technical Timeout':'')+'</div>';
  div.onclick=()=>div.remove();
  document.body.appendChild(div);
  setTimeout(()=>{if(div.parentNode)div.remove();},6000);
}
function lsAdj(id,delta){
  const el=document.getElementById(id);
  if(!el)return;
  const isInput=el.tagName==='INPUT';
  const cur=isInput?parseInt(el.value)||0:parseInt(el.textContent)||0;
  const next=Math.max(0,cur+delta);
  if(isInput){el.value=next;}else{el.textContent=next;}
  const inp=document.getElementById(id+'-inp');
  if(inp)inp.value=next;
  // Side-switch check
  {const mx=id.match(/^(ls|pp)-(us|them)-(\d+)$/);
  if(mx){const pfx=mx[1],idx2=mx[3],partner=pfx+'-'+(mx[2]==='us'?'them':'us')+'-'+idx2;
  checkSideSwitch(id,partner,pfx+'-setnum-'+idx2);}}
  if(db&&(window._loadedAssignment||currentRole==='player')){
    const m=id.match(/(?:ls-us-|ls-them-|qls-a-|qls-b-|pp-us-|pp-them-)(\d+)/);
    if(m){const idx=parseInt(m[1]);if(window._lsLiveDebounce[idx])clearTimeout(window._lsLiveDebounce[idx]);window._lsLiveDebounce[idx]=setTimeout(()=>pushLiveScore(idx),600);}
  }
}
function pushLiveScore(idx){
  if(!db)return;
  const a=window._loadedAssignment||Object.values(D.assignments).find(x=>x.date===td());
  if(!a)return;
  const date=a.date||td(),aType=a.type||'gameday';
  const c=(a.courts||[])[idx];if(!c)return;
  let usEl=document.getElementById('ls-us-'+idx)||document.getElementById('qls-a-'+idx)||document.getElementById('pp-us-'+idx);
  let themEl=document.getElementById('ls-them-'+idx)||document.getElementById('qls-b-'+idx)||document.getElementById('pp-them-'+idx);
  if(!usEl||!themEl)return;
  const us=parseInt(usEl.tagName==='INPUT'?usEl.value:usEl.textContent)||0;
  const them=parseInt(themEl.tagName==='INPUT'?themEl.value:themEl.textContent)||0;
  const p1=gP(c.p1),p2=gP(c.p2);
  const pairLabel=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
  const matchList=aType==='scrimmage'?D.scrimmages:aType==='queens'?D.matches:D.gamedays;
  const existing=aType==='queens'
    ?D.matches.find(m=>m.date===date&&(arrEq(m.team1||[],[c.p1,c.p2].filter(Boolean))||arrEq(m.team2||[],[c.p1,c.p2].filter(Boolean))))
    :matchList.find(m=>resMatchesCourt(m,date,[c.p1,c.p2].filter(Boolean),a.id));
  const setNum=existing?(existing.sets||[]).length+1:1;
  const scoredBy=currentPlayerId?((gP(currentPlayerId)||{}).firstName||'Player'):'Coach';
  const _lsKey=(a.id?a.id+'/':'')+idx;
  db.ref(DB_ROOT+'/live_scoring/'+_lsKey).set({us,them,setNum,pairLabel,court:c.court,date,ts:Date.now(),scoredBy,assignmentId:a.id||null});
}
function lsInpChange(id){
  const inp=document.getElementById(id+'-inp');
  const el=document.getElementById(id);
  if(!inp||!el)return;
  const val=Math.max(0,parseInt(inp.value)||0);
  inp.value=val;
  el.textContent=val;
  // Side-switch check
  {const mx=id.match(/^(ls|pp)-(us|them)-(\d+)$/);
  if(mx){const pfx=mx[1],idx2=mx[3],partner=pfx+'-'+(mx[2]==='us'?'them':'us')+'-'+idx2;
  checkSideSwitch(id,partner,pfx+'-setnum-'+idx2);}}
}

function saveLiveSet(idx,p1,p2,date,court,subCourt,existingId,opponent,fbNode){
  const usEl=document.getElementById('ls-us-'+idx);
  const themEl=document.getElementById('ls-them-'+idx);
  const us=parseInt(usEl?.tagName==='INPUT'?usEl.value:usEl?.textContent);
  const them=parseInt(themEl?.tagName==='INPUT'?themEl.value:themEl?.textContent);
  if(isNaN(us)||isNaN(them)){toast('Enter both scores');return;}
  if(us===them){toast('Scores cannot be tied');return;}

  const node=fbNode||'gamedays';
  const matchList=node==='scrimmages'?D.scrimmages:D.gamedays;
  const idPrefix=node==='scrimmages'?'sc':'gd';
  const pair=[p1,p2].filter(Boolean);
  const statsOpen=document.getElementById('lse-stats-'+idx)?.style.display!=='none';
  const stats={};
  pair.forEach(pid=>{stats[pid]=statsOpen&&window._lseStats&&window._lseStats[idx]&&window._lseStats[idx][pid]
    ?{...window._lseStats[idx][pid]}:{k:0,b:0,a:0,se:0,re:0,he:0,de:0};});
  const newSet={scoreUs:us,scoreThem:them,stats};
  const courtLabel=court+(subCourt?subCourt:'');
  const opp=(opponent||'Opponent')+' CT'+courtLabel;

  if(existingId){
    const m=matchList.find(x=>x.id===existingId);
    const sets=m?[...(m.sets||[])]:[];
    sets.push(newSet);
    fbSet(node+'/'+existingId+'/sets',sets);
  }else{
    const id=gi(idPrefix);
    const _aid=(window._loadedAssignment||{}).id||null;
    fbSetResult(node,id,{id,date,court:parseInt(court),pair,opponent:opp,sets:[newSet],...(_aid?{assignmentId:_aid}:{})});
  }
  toast((us>them?'\u2713 Win':'\u2717 Loss')+' — '+us+'-'+them+' saved');
  // Immediately zero scores so user sees 0-0 right away (no need to hit minus)
  {const usR=document.getElementById('ls-us-'+idx);const themR=document.getElementById('ls-them-'+idx);
  if(usR)usR.value='0';if(themR)themR.value='0';}
  if(db){const _aid=(window._loadedAssignment||{}).id;db.ref(DB_ROOT+'/live_scoring/'+((_aid?_aid+'/':'')+idx)).remove();}
  setTimeout(()=>refreshSingleCourtCard(idx,date,node),600);
}

function delLiveSet(matchId,setIdx,fbNode){
  if(!matchId)return;
  const node=fbNode||'gamedays';
  const matchList=node==='scrimmages'?D.scrimmages:D.gamedays;
  const m=matchList.find(x=>x.id===matchId);if(!m)return;
  const sets=(m.sets||[]).filter((_,i)=>i!==setIdx);
  fbSet(node+'/'+matchId+'/sets',sets.length?sets:null);
  toast('Set deleted');
  // Only refresh the specific court card — leave other courts alone
  const delNode=fbNode||'gamedays';
  const delDate=(function(){const m=(delNode==='scrimmages'?D.scrimmages:D.gamedays).find(x=>x.id===matchId);return m?m.date:td();})();
  // find the court idx by matchId so we know which card to refresh
  const delIdx=(function(){
    const container=document.getElementById('live-courts-container');
    if(!container)return -1;
    const cards=[...container.querySelectorAll('.live-court-card')];
    for(let i=0;i<cards.length;i++){if(cards[i].querySelector('[onclick*="'+matchId+'"]'))return i;}
    return -1;
  })();
  setTimeout(()=>{if(delIdx>=0)refreshSingleCourtCard(delIdx,delDate,delNode);else renderLiveScoring();},400);
}

// ============================================================
// ============================================================
// QUEENS LIVE SCORING (Leon vs Leon from assignment)
// ============================================================
function refreshSingleCourtCard(idx, date, fbNode){
  // Re-render only the one court card that just saved — never touches other courts
  const container=document.getElementById('live-courts-container');
  if(!container)return;
  const cardEl=document.getElementById('lc-card-'+idx);
  if(!cardEl)return;

  const node=fbNode||'gamedays';
  const matchList=node==='scrimmages'?D.scrimmages:D.gamedays;
  // Find the assignment that's currently loaded
  const assignment=window._loadedAssignment;
  if(!assignment)return;
  const c=(assignment.courts||[])[idx];
  if(!c)return;

  const p1=gP(c.p1),p2=gP(c.p2);
  const pairKey=[c.p1,c.p2].filter(Boolean).sort().join('_');
  const courtLabel='Court '+c.court+(c.subCourt?c.subCourt.toUpperCase():'');
  const partnerLabel=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
  const opp=assignment.opponent?assignment.opponent+' CT'+c.court:'Opponent CT'+c.court;

  const existingMatch=matchList.find(m=>resMatchesCourt(m,date,[c.p1,c.p2].filter(Boolean),assignment.id));
  const matchId=existingMatch?existingMatch.id:null;
  const sets=existingMatch?existingMatch.sets||[]:[];
  let sw=0,sl=0,ptDiff=0;
  sets.forEach(s=>{const us=s.scoreUs||0,them=s.scoreThem||0;(us>them?sw++:sl++);ptDiff+=(us-them);});
  const diffStr=ptDiff>0?'+'+ptDiff:String(ptDiff);
  const diffColor=ptDiff>0?'var(--green)':ptDiff<0?'var(--loss-red)':'var(--gray)';

  let inner=`<div class="live-court-header">
    <div>
      <span class="court-badge court-${c.court}" style="font-size:12px;">${courtLabel}</span>
      <div class="live-pair-name" style="margin-top:4px;">${partnerLabel||'TBD'}</div>
      <div class="live-opp-name">vs ${opp}</div>
    </div>
    <div style="text-align:right;">
      ${sets.length?`<div style="font-family:'Bebas Neue';font-size:18px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</div><div style="font-size:10px;color:var(--gray);">Match</div><div style="font-family:'Bebas Neue';font-size:15px;color:${diffColor};margin-top:2px;">${diffStr}</div><div style="font-size:10px;color:var(--gray);">Pts</div>`:'<div style="font-size:12px;color:var(--gray);">No sets yet</div>'}
    </div>
  </div>`;

  if(sets.length){
    inner+='<div style="margin-bottom:8px;">';
    sets.forEach((s,si)=>{
      const win=(s.scoreUs||0)>(s.scoreThem||0);
      inner+=`<span class="live-set-chip ${win?'win':'loss'}">S${si+1}: ${s.scoreUs}-${s.scoreThem} <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:11px;padding:0 0 0 4px;" onclick="delLiveSet('${matchId}',${si},'${node}')" title="Delete">✕</button></span>`;
    });
    inner+='</div>';
  }

  // Match-complete guard mirrors renderLiveScoring: best-of-3, stop offering sets at 2 wins.
  if(sw>=2||sl>=2){
    inner+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;text-align:center;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">MATCH COMPLETE</div>
      <div style="font-size:12px;color:var(--gray);margin-top:4px;">${sw>sl?(partnerLabel||'Our pair'):(assignment.opponent||'Opponent')} won ${Math.max(sw,sl)}-${Math.min(sw,sl)}</div>
    </div>`;
  }else{
    inner+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;">
    <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:10px;letter-spacing:1px;">SET ${sets.length+1}</div>
    <span id="ls-setnum-${idx}" style="display:none;">${sets.length+1}</span>
    <div class="live-score-row">
      <div class="live-score-col">
        <div class="live-score-label">${SC.abbrev}</div>
        <div class="ls-counter">
          <button class="ls-btn ls-btn-plus" onclick="lsAdj('ls-us-${idx}',1)">+</button>
          <input type="number" class="ls-inp" id="ls-us-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('ls-us-${idx}',0)">
          <button class="ls-btn ls-btn-minus" onclick="lsAdj('ls-us-${idx}',-1)">−</button>
        </div>
      </div>
      <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
      <div class="live-score-col">
        <div class="live-score-label">OPP</div>
        <div class="ls-counter">
          <button class="ls-btn ls-btn-plus" onclick="lsAdj('ls-them-${idx}',1)">+</button>
          <input type="number" class="ls-inp" id="ls-them-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('ls-them-${idx}',0)">
          <button class="ls-btn ls-btn-minus" onclick="lsAdj('ls-them-${idx}',-1)">−</button>
        </div>
      </div>
    </div>
    <button class="pgd-stats-toggle" id="lse-stats-toggle-${idx}" onclick="lseToggleStats(${idx})" style="width:100%;margin-top:8px;">＋ Add set stats (optional)</button>
    <div id="lse-stats-${idx}" style="display:none;margin-top:8px;">
      <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">Tap +/− to count stats (optional)</div>
      ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const po=gP(pid2);return lseStatBlock(pid2,po?po.firstName:'P',idx);}).join('')}
    </div>
    <button class="btn btn-blue btn-small" style="width:100%;margin-top:6px;" onclick="saveLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${date}',${c.court},'${c.subCourt||''}','${matchId||''}','${assignment.opponent||''}','${node}')">✓ Save Set</button>
  </div>`;
  }
  cardEl.innerHTML=inner;
}

function renderLiveScoringQueens(assignment, date, container){
  const pairs=(assignment.courts||[]).map((c,i)=>({idx:i,court:c.court,p1:c.p1,p2:c.p2,b1:c.b1||null,b2:c.b2||null}));
  if(!pairs.length){container.innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:16px;">No court assignments found.</div>';return;}
  let h=`<div style="font-size:12px;color:var(--gray);margin-bottom:10px;padding:8px;background:var(--off-white);border-radius:6px;">👑 Queens mode: each court pair plays an opposing pair. Select Team B for each court and record the final score.</div>`;
  pairs.forEach((c,idx)=>{
    const p1=gP(c.p1),p2=gP(c.p2);
    const teamALabel=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')||'TBD';
    // Existing Queens match for this pair on this date
    const existing=D.matches.find(m=>queensMatchesCourt(m,date,[c.p1,c.p2].filter(Boolean),assignment.id));
    const hasResult=!!existing;
    let resultHtml='';
    if(existing){
      const onTeam1=arrEq(existing.team1||[],[c.p1,c.p2].filter(Boolean));
      const myScore=onTeam1?existing.score1:existing.score2;
      const oppScore=onTeam1?existing.score2:existing.score1;
      const win=myScore>oppScore;
      resultHtml=`<div style="margin:6px 0;padding:8px;border-radius:6px;background:${win?'#dcfce7':'#fee2e2'};font-family:'Bebas Neue';font-size:16px;text-align:center;color:${win?'var(--green)':'var(--loss-red)'};">${win?'WIN':'LOSS'} ${myScore}–${oppScore}</div>
      <button style="background:none;border:none;font-size:12px;color:var(--gray);cursor:pointer;text-decoration:underline;" onclick="delQueens('${existing.id}')">Clear result</button>`;
    }
    // Build opponent pair options from other courts
    const otherPairs=pairs.filter((_,i2)=>i2!==idx);
    const oppOptions=otherPairs.map(op=>{const a=gP(op.p1),b=gP(op.p2);const lbl=[a,b].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')||'TBD';return`<option value="${op.p1||''}|${op.p2||''}">${lbl} (CT${op.court})</option>`;}).join('');
    h+=`<div class="live-court-card" id="lc-card-queens-${idx}" style="${hasResult?'opacity:0.8;':''}">
      <div class="live-court-header">
        <div><span class="court-badge court-${c.court}" style="font-size:12px;">Court ${c.court}</span>
          <div class="live-pair-name" style="margin-top:4px;">${teamALabel}</div>
          <div class="live-opp-name">👑 Queens Match</div>
        </div>
      </div>
      ${resultHtml}
      ${!hasResult?`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:6px;">
        <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:6px;">VS (opponent pair)</div>
        ${c.b1&&c.b2
          ?`<div id="qls-opp-${idx}" data-val="${c.b1}|${c.b2}" style="padding:8px;background:var(--off-white);border-radius:6px;font-size:13px;font-weight:600;margin-bottom:8px;">`
            +[gP(c.b1),gP(c.b2)].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')
            +` (CT${pairs.find(op=>op.p1===c.b1||op.p2===c.b2)?.court||'—'})</div>`
          :`<select class="form-select" id="qls-opp-${idx}" style="font-size:13px;padding:8px;margin-bottom:8px;"><option value="">— Pick opponent pair —</option>${oppOptions}</select>`
        }
        <div class="live-score-row">
          <div class="live-score-col">
            <div class="live-score-label">${p1?p1.firstName:'Team A'}</div>
            <div class="ls-counter">
              <button class="ls-btn ls-btn-plus" onclick="lsAdj('qls-a-${idx}',1)">+</button>
              <input type="number" class="ls-inp" id="qls-a-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('qls-a-${idx}',0)">
              <button class="ls-btn ls-btn-minus" onclick="lsAdj('qls-a-${idx}',-1)">−</button>
            </div>
          </div>
          <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
          <div class="live-score-col">
            <div class="live-score-label">OPP</div>
            <div class="ls-counter">
              <button class="ls-btn ls-btn-plus" onclick="lsAdj('qls-b-${idx}',1)">+</button>
              <input type="number" class="ls-inp" id="qls-b-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('qls-b-${idx}',0)">
              <button class="ls-btn ls-btn-minus" onclick="lsAdj('qls-b-${idx}',-1)">−</button>
            </div>
          </div>
        </div>
        
        <button class="pgd-stats-toggle" id="lse-stats-toggle-${idx}" onclick="lseToggleStats(${idx})" style="width:100%;margin-top:8px;">＋ Add set stats (optional)</button>
        <div id="lse-stats-${idx}" style="display:none;margin-top:8px;">
          <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">Tap +/− to count stats (optional)</div>
          ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const po=gP(pid2);return lseStatBlock(pid2,po?po.firstName:'P',idx);}).join('')}
        </div>
        <button class="btn btn-small" style="width:100%;background:var(--red);color:var(--white);border:none;" onclick="saveQueensLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${date}',${c.court})">Save Queens Result</button>
      </div>`:''}
    </div>`;
  });
  container.innerHTML=h;
}

function refreshSingleQueensCard(idx, date){
  const cardEl=document.getElementById('lc-card-queens-'+idx);
  if(!cardEl)return;
  const assignment=window._loadedAssignment;
  if(!assignment)return;

  const pairs=(assignment.courts||[]).map((c,i)=>({idx:i,court:c.court,p1:c.p1,p2:c.p2,b1:c.b1||null,b2:c.b2||null}));
  const c=pairs[idx];
  if(!c)return;

  const p1o=gP(c.p1),p2o=gP(c.p2);
  const teamALabel=[p1o,p2o].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')||'TBD';

  // Check for existing result
  const existing=D.matches.find(m=>queensMatchesCourt(m,date,[c.p1,c.p2].filter(Boolean),assignment.id));
  const hasResult=!!existing;

  let inner=`<div class="live-court-header">
    <div><span class="court-badge court-${c.court}" style="font-size:12px;">Court ${c.court}</span>
      <div class="live-pair-name" style="margin-top:4px;">${teamALabel}</div>
      <div class="live-opp-name">👑 Queens Match</div>
    </div>
  </div>`;

  if(existing){
    const onTeam1=arrEq(existing.team1||[],[c.p1,c.p2].filter(Boolean));
    const myScore=onTeam1?existing.score1:existing.score2;
    const oppScore=onTeam1?existing.score2:existing.score1;
    const win=myScore>oppScore;
    inner+=`<div style="margin:6px 0;padding:8px;border-radius:6px;background:${win?'#dcfce7':'#fee2e2'};font-family:'Bebas Neue';font-size:16px;text-align:center;color:${win?'var(--green)':'var(--loss-red)'};">${win?'WIN':'LOSS'} ${myScore}–${oppScore}</div>
    <button style="background:none;border:none;font-size:12px;color:var(--gray);cursor:pointer;text-decoration:underline;" onclick="delQueens('${existing.id}')">Clear result</button>`;
  } else {
    // Build opponent options
    const otherPairs=pairs.filter((_,i2)=>i2!==idx);
    const oppOptions=otherPairs.map(op=>{
      const a=gP(op.p1),b=gP(op.p2);
      const lbl=[a,b].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')||'TBD';
      return`<option value="${op.p1||''}|${op.p2||''}">${lbl} (CT${op.court})</option>`;
    }).join('');

    const oppLabel=c.b1&&c.b2
      ? `<div id="qls-opp-${idx}" data-val="${c.b1}|${c.b2}" style="padding:8px;background:var(--off-white);border-radius:6px;font-size:13px;font-weight:600;margin-bottom:8px;">`
          +[gP(c.b1),gP(c.b2)].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ')
          +` (CT${pairs.find(op=>op.p1===c.b1||op.p2===c.b2)?.court||'—'})</div>`
      : `<select class="form-select" id="qls-opp-${idx}" style="font-size:13px;padding:8px;margin-bottom:8px;"><option value="">— Pick opponent pair —</option>${oppOptions}</select>`;

    inner+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:6px;">
      <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:6px;">VS (opponent pair)</div>
      ${oppLabel}
      <div class="live-score-row">
        <div class="live-score-col">
          <div class="live-score-label">${p1o?p1o.firstName:'Team A'}</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('qls-a-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="qls-a-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('qls-a-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('qls-a-${idx}',-1)">−</button>
          </div>
        </div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
        <div class="live-score-col">
          <div class="live-score-label">OPP</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('qls-b-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="qls-b-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('qls-b-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('qls-b-${idx}',-1)">−</button>
          </div>
        </div>
      </div>
      
      <button class="pgd-stats-toggle" id="lse-stats-toggle-${idx}" onclick="lseToggleStats(${idx})" style="width:100%;margin-top:8px;">＋ Add set stats (optional)</button>
      <div id="lse-stats-${idx}" style="display:none;margin-top:8px;">
        <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">Tap +/− to count stats (optional)</div>
        ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const po=gP(pid2);return lseStatBlock(pid2,po?po.firstName:'P',idx);}).join('')}
      </div>
      <button class="btn btn-small" style="width:100%;background:var(--red);color:var(--white);border:none;" onclick="saveQueensLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${date}',${c.court})">Save Queens Result</button>
    </div>`;
  }

  cardEl.style.opacity=hasResult?'0.8':'1';
  cardEl.innerHTML=inner;
}

function saveQueensLiveSet(idx,p1,p2,date,court){
  const oppEl=document.getElementById('qls-opp-'+idx);
  const oppVal=oppEl?.dataset?.val||oppEl?.value;
  if(!oppVal){toast('Select an opponent pair');return;}
  const [op1,op2]=oppVal.split('|');
  const saEl=document.getElementById('qls-a-'+idx);
  const sbEl=document.getElementById('qls-b-'+idx);
  const sa=parseInt(saEl?.tagName==='INPUT'?saEl.value:saEl?.textContent);
  const sb=parseInt(sbEl?.tagName==='INPUT'?sbEl.value:sbEl?.textContent);
  if(isNaN(sa)||isNaN(sb)){toast('Enter both scores');return;}
  if(sa===sb){toast('Scores cannot be tied');return;}
  const statsOpen=document.getElementById('lse-stats-'+idx)?.style.display!=='none';
  const pair=[p1,p2].filter(Boolean);
  const stats={};
  pair.forEach(pid=>{stats[pid]=statsOpen&&window._lseStats&&window._lseStats[idx]&&window._lseStats[idx][pid]?{...window._lseStats[idx][pid]}:{k:0,b:0,a:0,se:0,re:0,he:0,de:0};});
  const id=gi('qm');
  fbSetResult('matches',id,{id,date,court:parseInt(court),team1:[p1,p2].filter(Boolean),team2:[op1,op2].filter(Boolean),score1:sa,score2:sb,stats});
  toast((sa>sb?'✓ Win':'✗ Loss')+' saved — '+sa+'–'+sb);
  if(db){const _aid=(window._loadedAssignment||{}).id;db.ref(DB_ROOT+'/live_scoring/'+((_aid?_aid+'/':'')+idx)).remove();}
  setTimeout(()=>refreshSingleQueensCard(idx,date),600);
}

// ============================================================
// GENERATE MATCHES FROM LINEUP
// ============================================================
function generateMatchesFromLineup(assignId){
  const a=D.assignments[assignId];
  if(!a){toast('Assignment not found');return;}
  const aType=a.type||'gameday';
  const node=aType==='scrimmage'?'scrimmages':'gamedays';
  const matchList=aType==='scrimmage'?D.scrimmages:D.gamedays;
  if(aType==='queens'){toast('For Queens, use Live Score Entry to record pair matchups');return;}
  const courts=a.courts||[];
  if(!courts.length){toast('No courts assigned');return;}
  let created=0;
  courts.forEach(c=>{
    const pair=[c.p1,c.p2].filter(Boolean);
    if(pair.length<2)return;
    const already=matchList.find(m=>m.date===a.date&&arrEq(m.pair||[],pair));
    if(already)return; // skip if match already exists
    const courtLabel=c.court+(c.subCourt?c.subCourt:'');
    const opp=(a.opponent?a.opponent:'Opponent')+' CT'+courtLabel;
    const id=gi(aType==='scrimmage'?'sc':'gd');
    fbSetResult(node,id,{id,date:a.date,court:parseInt(c.court),pair,opponent:opp,sets:[]});
    created++;
  });
  toast(created>0?'Created '+created+' match record'+(created>1?'s':'')+'! Load them in Live Score Entry.':'All matches already exist for this lineup.');
}

// COACH PRIVATE NOTES
// ============================================================
let coachNotesDate=null;
let coachNotesData={};

function switchCnote(tab,btn){
  document.querySelectorAll('.cnote-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.cnote-section').forEach(s=>s.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.getElementById('cnote-'+tab).classList.add('active');
}

function loadCoachNotes(){
  const date=document.getElementById('cnote-date').value;
  if(!date){toast('Select a date first');return;}
  coachNotesDate=date;
  if(!db)return;
  db.ref(DB_ROOT+'/coach_notes/'+date).once('value',snap=>{
    coachNotesData=snap.val()||{};
    // Game notes
    document.getElementById('cnote-game-text').value=coachNotesData.game||'';
    // Player notes
    buildPlayerNotesUI();
    // Pair notes - based on assignment for that date
    buildPairNotesUI(date);
    toast('Notes loaded for '+fD(date));
  });
}

function buildPlayerNotesUI(){
  const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
  let h='';
  sorted.forEach(p=>{
    const val=(coachNotesData.players||{})[p.id]||'';
    h+=`<div class="cnote-player-row">
      <div class="cnote-player-label">${p.firstName}<br><span style="font-weight:400;color:var(--gray);font-size:10px;">${p.classYear} · CT${p.court}</span></div>
      <textarea class="cnote-textarea" id="cnpn-${p.id}" rows="2" placeholder="Notes on ${p.firstName}..." onblur="autoSavePlayerNote('${p.id}')">${val}</textarea>
    </div>`;
  });
  document.getElementById('cnote-players-list').innerHTML=h||'<div style="color:var(--gray);font-size:13px;">No players found.</div>';
}

function buildPairNotesUI(date){
  // Find all pairs for this date (from assignment + gamedays)
  const pairsSet={};
  const assignment=Object.values(D.assignments).find(a=>a.date===date);
  if(assignment){
    (assignment.courts||[]).forEach(c=>{
      if(c.p1&&c.p2){const key=[c.p1,c.p2].sort().join('_');pairsSet[key]=[c.p1,c.p2];}
    });
  }
  D.gamedays.filter(m=>m.date===date&&m.pair&&m.pair.length===2).forEach(m=>{
    const key=[...m.pair].sort().join('_');pairsSet[key]=m.pair;
  });
  const pairs=Object.entries(pairsSet);
  if(!pairs.length){
    document.getElementById('cnote-pairs-list').innerHTML='<div style="color:var(--gray);font-size:13px;">No pairs found for this date. Load a date with assignments or game results.</div>';
    return;
  }
  let h='';
  pairs.forEach(([key,pair])=>{
    const p1=gP(pair[0]),p2=gP(pair[1]);
    const label=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
    const val=(coachNotesData.pairs||{})[key]||'';
    h+=`<div class="cnote-player-row">
      <div class="cnote-player-label" style="min-width:90px;">${label}</div>
      <textarea class="cnote-textarea" id="cnpair-${key}" rows="2" placeholder="Notes on this pair..." onblur="autoSavePairNote('${key}')">${val}</textarea>
    </div>`;
  });
  document.getElementById('cnote-pairs-list').innerHTML=h;
}

function saveCoachNote(type){
  if(!coachNotesDate){toast('Load a date first');return;}
  if(type==='game'){
    const text=document.getElementById('cnote-game-text').value;
    if(db)db.ref(DB_ROOT+'/coach_notes/'+coachNotesDate+'/game').set(text||null);
    const saved=document.getElementById('cnote-game-saved');
    if(saved){saved.style.opacity='1';setTimeout(()=>saved.style.opacity='0',2000);}
    toast('Game notes saved!');
  }
}

function autoSavePlayerNote(pid){
  if(!coachNotesDate)return;
  const el=document.getElementById('cnpn-'+pid);if(!el)return;
  const val=el.value||null;
  if(db)db.ref(DB_ROOT+'/coach_notes/'+coachNotesDate+'/players/'+pid).set(val);
  if(val){const p=gP(pid);notifyPlayer(pid,'cnote','New note from your coach',
    'Hi '+(p?p.firstName:'there')+',\n\nYour coach added a note for '+coachNotesDate+':\n\n'+val+'\n\nLog in to the app to read it.');}
}

function autoSavePairNote(key){
  if(!coachNotesDate)return;
  const el=document.getElementById('cnpair-'+key);if(!el)return;
  if(db)db.ref(DB_ROOT+'/coach_notes/'+coachNotesDate+'/pairs/'+key).set(el.value||null);
}

// ============================================================
// PLAYER PORTAL TAB SWITCHING
// ============================================================
function switchPPTab(tab,btn){
  document.querySelectorAll('.pp-tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.pp-panel').forEach(p=>p.classList.remove('active'));
  if(tab==='scouts'){if(btn)btn.classList.add('active');document.getElementById('pp-panel-scouts').classList.add('active');renderPlayerScouts();return;}
  if(tab==='learn'){if(btn)btn.classList.add('active');document.getElementById('pp-panel-learn').classList.add('active');renderPPQuizHistory();return;}
  if(tab==='chat'){if(btn)btn.classList.add('active');document.getElementById('pp-panel-chat').classList.add('active');renderClubChat();return;}
  if(tab==='messages'){if(btn)btn.classList.add('active');document.getElementById('pp-panel-messages').classList.add('active');renderMemberMessages();return;}
  if(tab==='travel'){if(btn)btn.classList.add('active');document.getElementById('pp-panel-travel').classList.add('active');renderMemberTravel();return;}
  if(btn)btn.classList.add('active');
  document.getElementById('pp-panel-'+tab).classList.add('active');
  if(tab==='live')renderPlayerLiveScoring();
  if(tab==='matches')renderPlayerMatches();
}

// ── CLUB CHAT (Grass Club, player portal) ───────────────────────────────────
// Three channels under DB_ROOT/chat/{channel}, loaded into D.chat[channel] by the main
// listener and mirrored in memory on post so the demo (db null, fbSet no-op) still
// shows messages. Author is the logged-in player (currentPlayerId); name and badge
// derive from gP(authorId) at render time, so nothing is denormalized onto the message.
// Layer 4: which post currently has its inline comment composer open (null = none). One at a time; preserved across re-renders.
let openCommentPostId=null;
// Layer 5a: three channels keyed under D.chat[channel]. allclub first = default landing channel. No visibility or posting rules yet; all three are visible and postable to everyone.
const CHAT_CHANNELS=[['allclub','All Club'],['gold','Gold'],['garnet','Garnet']];
let activeChatChannel='allclub';
function setChatChannel(ch){ if(visibleChatChannels().indexOf(ch)<0)return; activeChatChannel=ch; openCommentPostId=null; renderClubChat(); }
// Layer 5b visibility: which channels the current player can SEE, in CHAT_CHANNELS display order.
// Everyone sees allclub; leadership (exec or faculty) sees all three; a gold or garnet player additionally
// sees their own team channel; an unassigned-tier non-leadership player sees allclub only (read-only spectator).
function visibleChatChannels(){
  const me=gP(currentPlayerId);
  const lead = me && (me.leadership==='exec' || me.leadership==='faculty');
  const tier = me ? (me.tier||'unassigned') : 'unassigned';
  const out=['allclub'];
  if(lead){ out.push('gold','garnet'); }
  else if(tier==='gold'){ out.push('gold'); }
  else if(tier==='garnet'){ out.push('garnet'); }
  return out;
}
// Keep the active channel valid for the current player; if it is not visible, fall back to allclub (always visible).
function ensureVisibleChannel(){ if(visibleChatChannels().indexOf(activeChatChannel)<0) activeChatChannel='allclub'; }
// Layer 5c posting rule: who may CREATE A POST in a channel. gold needs tier gold or leadership; garnet needs tier garnet or leadership; allclub is leadership only. Commenting is not gated by this.
function canPostInChannel(ch){
  const me=gP(currentPlayerId);
  if(!me) return false;
  const lead = me.leadership==='exec' || me.leadership==='faculty';
  if(ch==='allclub') return lead;
  if(ch==='gold')    return lead || me.tier==='gold';
  if(ch==='garnet')  return lead || me.tier==='garnet';
  return false;
}
// Layer 5d: is the current player leadership (exec or faculty)? Drives the as-Exec toggle and exec-voice delete rights.
function isCurrentLeader(){ const me=gP(currentPlayerId); return !!(me && (me.leadership==='exec' || me.leadership==='faculty')); }
function toggleCommentComposer(postId){
  openCommentPostId = (openCommentPostId===postId) ? null : postId;
  renderClubChat();
}
function renderClubChat(){
  const panel=document.getElementById('pp-panel-chat');
  if(!panel)return;
  ensureVisibleChannel();
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Layer 5d author rendering: an exec-voice item (authorRole 'exec', no authorId) shows as Exec with the Exec badge; otherwise resolve the person via gP. Applies to posts and comments.
  const EXEC_BADGE='<span class="tier-badge badge-exec">Exec</span>';
  const authorName=o=>{ if(o&&o.authorRole==='exec')return 'Exec'; const a=gP(o&&o.authorId); return a?a.firstName+' '+a.lastName:'Player'; };
  const authorBadge=o=>{ if(o&&o.authorRole==='exec')return EXEC_BADGE; return playerBadge(gP(o&&o.authorId)); };
  const msgs=(D.chat&&D.chat[activeChatChannel])||{};
  const rows=Object.keys(msgs)
    .map(id=>({id,m:msgs[id]}))
    .filter(x=>x.m&&typeof x.m==='object')
    .sort((a,b)=>(a.m.createdAt||0)-(b.m.createdAt||0));
  let list;
  if(!rows.length){
    list='<p style="color:var(--gray);font-size:13px;padding:8px 0;">No messages yet. Start the conversation.</p>';
  }else{
    list=rows.map(({id,m})=>{
      const name=authorName(m);
      const badge=authorBadge(m);
      const when=m.createdAt?new Date(m.createdAt).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
      const canDelPost=m.authorId===currentPlayerId || (m.authorRole==='exec' && isCurrentLeader());
      const del=canDelPost?`<button class="btn btn-danger btn-small" style="margin-top:6px;padding:3px 8px;font-size:10px;" onclick="delClubChat('${id}')">Delete</button>`:'';
      // Comments (Layer 4): flat list nested under the post, oldest first, read from the post node's comments child.
      const cmts=m.comments||{};
      const crows=Object.keys(cmts)
        .map(cid=>({cid,c:cmts[cid]}))
        .filter(x=>x.c&&typeof x.c==='object')
        .sort((a,b)=>(a.c.createdAt||0)-(b.c.createdAt||0));
      const commentsHtml=crows.map(({cid,c})=>{
        const cname=authorName(c);
        const cbadge=authorBadge(c);
        const cwhen=c.createdAt?new Date(c.createdAt).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
        const cdel=c.authorId===currentPlayerId?`<button class="btn btn-danger btn-small" style="margin-top:4px;padding:2px 7px;font-size:10px;" onclick="delClubComment('${id}','${cid}')">Delete</button>`:'';
        return `<div style="padding:6px 0 6px 14px;border-left:2px solid var(--gray-lighter);margin-top:6px;">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;">
            <span style="font-weight:700;color:var(--charcoal);font-size:13px;">${esc(cname)} ${cbadge}</span>
            <span style="font-size:10px;color:var(--gray);white-space:nowrap;">${cwhen}</span>
          </div>
          <div style="font-size:13px;color:var(--black);white-space:pre-wrap;word-break:break-word;margin-top:2px;">${esc(c.text)}</div>
          ${cdel}
        </div>`;
      }).join('');
      const composerHtml=openCommentPostId===id?`<div style="margin-top:8px;padding-left:14px;">
        <textarea id="cc-comment-text-${id}" maxlength="2000" placeholder="Add a comment" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:8px 10px;font-family:inherit;font-size:13px;resize:vertical;min-height:48px;box-sizing:border-box;"></textarea>
        <button class="btn btn-primary btn-small" style="margin-top:6px;padding:3px 10px;font-size:10px;" onclick="postClubComment('${id}')">Post Comment</button>
      </div>`:'';
      return `<div style="padding:8px 0;border-bottom:1px solid var(--gray-lighter);">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;">
          <span style="font-weight:700;color:var(--charcoal);font-size:14px;">${esc(name)} ${badge}</span>
          <span style="font-size:11px;color:var(--gray);white-space:nowrap;">${when}</span>
        </div>
        <div style="font-size:14px;color:var(--black);white-space:pre-wrap;word-break:break-word;margin-top:2px;">${esc(m.text)}</div>
        ${del}
        ${commentsHtml}
        <div style="margin-top:6px;"><button class="btn btn-secondary btn-small" style="padding:3px 8px;font-size:10px;" onclick="toggleCommentComposer('${id}')">${openCommentPostId===id?'Close':'Comment'}</button></div>
        ${composerHtml}
      </div>`;
    }).join('');
  }
  // Channel switcher (Layer 5a markup, Layer 5b filtered to visible channels). Mirrors the roster tier-filter filter-btn pattern; active button tracks activeChatChannel.
  const vis=visibleChatChannels();
  const channelToggle=`<div style="display:flex;gap:8px;margin-bottom:10px;" id="cc-channel-toggle">`+
    CHAT_CHANNELS.filter(([ch])=>vis.indexOf(ch)>=0).map(([ch,lbl])=>`<button class="filter-btn${activeChatChannel===ch?' active':''}" onclick="setChatChannel('${ch}')" style="flex:1;text-align:center;">${lbl}</button>`).join('')+
    `</div>`;
  // Posting gate (Layer 5c): show the composer only when the current player may post in the active channel; otherwise a muted note. Commenting stays open to viewers.
  // Layer 5d: leadership players get a toggle to post under the generic Exec club voice instead of their own name. Default unchecked; non-leaders never see it.
  const asExecToggle=isCurrentLeader()?`<label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;color:var(--gray);"><input type="checkbox" id="cc-as-exec"> Post as Exec (club voice)</label>`:'';
  const composer=canPostInChannel(activeChatChannel)
    ? `<textarea id="cc-text" maxlength="2000" placeholder="Message the club" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px;resize:vertical;min-height:64px;box-sizing:border-box;margin-top:10px;"></textarea>
      ${asExecToggle}
      <button class="btn btn-primary btn-small" style="margin-top:8px;" onclick="postClubChat()">Post</button>`
    : `<p style="color:var(--gray);font-size:13px;padding:8px 0;margin-top:10px;">Only club leadership can post here. You can still comment on posts below.</p>`;
  panel.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 💬 Club Chat</div>
    ${channelToggle}
    <div id="cc-list">${list}</div>
    ${composer}
  </div>`;
}
// Post a club-chat message as the logged-in player into the active channel. Writes under
// DB_ROOT/chat/{channel} and mirrors into memory so the demo reflects it immediately. No eligibility checks this sub-step.
function postClubChat(){
  if(!currentPlayerId)return;
  if(!canPostInChannel(activeChatChannel))return;
  const ta=document.getElementById('cc-text');
  if(!ta)return;
  const text=(ta.value||'').trim();
  if(!text)return;
  const asExecEl=document.getElementById('cc-as-exec');
  const asExec=!!(asExecEl && asExecEl.checked && isCurrentLeader());
  const id=gi('msg');
  // Exec-voice post: generic club voice, authorRole 'exec' with no personal authorId. Otherwise normal personal authorship.
  const msg=asExec?{authorRole:'exec',text:text,createdAt:Date.now()}:{authorId:currentPlayerId,text:text,createdAt:Date.now()};
  fbSet('chat/'+activeChatChannel+'/'+id,msg);
  if(!D.chat)D.chat={};
  if(!D.chat[activeChatChannel])D.chat[activeChatChannel]={};
  D.chat[activeChatChannel][id]=msg;
  ta.value='';
  renderClubChat();
}
// Delete a club-chat message. Author can delete their own only this layer; broader moderation comes with the rules layer.
function delClubChat(id){
  const m=(D.chat&&D.chat[activeChatChannel])?D.chat[activeChatChannel][id]:null;
  if(!m)return;
  const canDel=m.authorId===currentPlayerId || (m.authorRole==='exec' && isCurrentLeader());
  if(!canDel){toast('You can only delete your own messages.');return;}
  if(!confirm('Delete this message?'))return;
  fbRemove('chat/'+activeChatChannel+'/'+id);
  if(D.chat&&D.chat[activeChatChannel])delete D.chat[activeChatChannel][id];
  renderClubChat();
}
// Post a comment under a club-chat post. Writes to the nested comments child and mirrors in memory for the demo.
// Keeps the composer open on that post after posting (openCommentPostId unchanged).
function postClubComment(postId){
  if(!currentPlayerId)return;
  if(!(D.chat&&D.chat[activeChatChannel]&&D.chat[activeChatChannel][postId]))return;
  const ta=document.getElementById('cc-comment-text-'+postId);
  if(!ta)return;
  const text=(ta.value||'').trim();
  if(!text)return;
  const cid=gi('cmt');
  const c={authorId:currentPlayerId,text:text,createdAt:Date.now()};
  fbSet('chat/'+activeChatChannel+'/'+postId+'/comments/'+cid,c);
  if(!D.chat[activeChatChannel][postId].comments)D.chat[activeChatChannel][postId].comments={};
  D.chat[activeChatChannel][postId].comments[cid]=c;
  renderClubChat();
}
// Delete a comment. Author can delete their own only this layer; broader moderation comes with the rules layer.
function delClubComment(postId,commentId){
  const post=(D.chat&&D.chat[activeChatChannel])?D.chat[activeChatChannel][postId]:null;
  const c=(post&&post.comments)?post.comments[commentId]:null;
  if(!c)return;
  if(c.authorId!==currentPlayerId){toast('You can only delete your own comments.');return;}
  if(!confirm('Delete this comment?'))return;
  fbRemove('chat/'+activeChatChannel+'/'+postId+'/comments/'+commentId);
  if(post&&post.comments)delete post.comments[commentId];
  renderClubChat();
}

// ── EXEC BROADCAST (Grass Club, coach side, Layer 5e) ───────────────────────
// The coach (PIN) login has currentPlayerId null, so a broadcast is always the generic Exec club voice: it writes the
// SAME exec-voice shape as the player-side as-Exec toggle ({authorRole:'exec', no authorId}) under chat/{channel}, and
// mirrors in memory for the demo. The exec may broadcast to any channel (the coach is club leadership).
let broadcastChannel='allclub';
function setBroadcastChannel(ch){ broadcastChannel=ch; renderExecBroadcast(); }
function renderExecBroadcast(){
  const pane=document.getElementById('tab-broadcast');
  if(!pane)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toggle=`<div style="display:flex;gap:8px;margin-bottom:10px;" id="bc-channel-toggle">`+
    CHAT_CHANNELS.map(([ch,lbl])=>`<button class="filter-btn${broadcastChannel===ch?' active':''}" onclick="setBroadcastChannel('${ch}')" style="flex:1;text-align:center;">${lbl}</button>`).join('')+
    `</div>`;
  // Read-only context: the most recent posts in the selected channel so the exec sees what is there before broadcasting.
  const msgs=(D.chat&&D.chat[broadcastChannel])||{};
  const rows=Object.keys(msgs).map(id=>({id,m:msgs[id]})).filter(x=>x.m&&typeof x.m==='object').sort((a,b)=>(a.m.createdAt||0)-(b.m.createdAt||0)).slice(-5);
  let recent;
  if(!rows.length){
    recent='<p style="color:var(--gray);font-size:13px;padding:6px 0;">No posts in this channel yet.</p>';
  }else{
    recent=rows.map(({m})=>{
      const a=gP(m.authorId);
      const who=m.authorRole==='exec'?'Exec':(a?a.firstName+' '+a.lastName:'Player');
      return `<div style="padding:6px 0;border-bottom:1px solid var(--gray-lighter);font-size:13px;"><span style="font-weight:700;color:var(--charcoal);">${esc(who)}</span> <span style="color:var(--black);white-space:pre-wrap;">${esc(m.text)}</span></div>`;
    }).join('');
  }
  pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 📣 Broadcast</div>
    <p style="font-size:12px;color:var(--gray);margin-bottom:12px;line-height:1.5;">Post to a club channel as the Exec voice. These posts show as Exec with the Exec badge, with no personal name attached.</p>
    ${toggle}
    <div style="margin-bottom:12px;">${recent}</div>
    <textarea id="bc-text" maxlength="2000" placeholder="Broadcast a message to ${esc(broadcastChannel)}" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px;resize:vertical;min-height:64px;box-sizing:border-box;"></textarea>
    <button class="btn btn-primary btn-small" style="margin-top:8px;" onclick="postExecBroadcast()">Broadcast as Exec</button>
  </div>`;
}
// Post an exec-voice broadcast into the selected channel. Identical shape to the 5d as-Exec post: authorRole 'exec', no authorId.
function postExecBroadcast(){
  const ta=document.getElementById('bc-text');
  if(!ta)return;
  const text=(ta.value||'').trim();
  if(!text)return;
  const id=gi('msg');
  const msg={authorRole:'exec',text:text,createdAt:Date.now()};
  fbSet('chat/'+broadcastChannel+'/'+id,msg);
  if(!D.chat)D.chat={};
  if(!D.chat[broadcastChannel])D.chat[broadcastChannel]={};
  D.chat[broadcastChannel][id]=msg;
  ta.value='';
  toast('Broadcast posted to '+broadcastChannel);
  renderExecBroadcast();
}

// ============================================================
// EXEC <-> MEMBER TWO-WAY MESSAGING (Grass Club only, gated on SC.tiersEnabled).
// One thread per member under DB_ROOT/threads/{memberId}, where memberId is the
// club roster id. A thread holds messages keyed by id, each { side:'exec'|'member',
// text, createdAt }. Exec messages carry no personal identity, only the exec voice.
// Unread is tracked per side with lastReadExec / lastReadMember timestamps: a side
// has unread when the newest message from the OTHER side is later than its lastRead.
// Exec sends also email the member via /hs/notify-player (notifyPlayer); member
// replies do not email, since execs see them in the inbox.
// ============================================================
let _inboxThread=null;   // memberId of the open thread, or null for the list
let _inboxCompose=false; // is the compose-new form open

function _threadMsgList(t){
  if(!t||!t.messages)return [];
  return Object.keys(t.messages).map(k=>t.messages[k]).filter(m=>m&&typeof m==='object').sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
}
function threadUnreadExec(t){ const lr=(t&&t.lastReadExec)||0; return _threadMsgList(t).some(m=>m.side==='member'&&(m.createdAt||0)>lr); }
function threadUnreadMember(t){ const lr=(t&&t.lastReadMember)||0; return _threadMsgList(t).some(m=>m.side==='exec'&&(m.createdAt||0)>lr); }

// Shared write: append an exec message to each member's thread, bump updatedAt,
// mark exec-read to now (the exec just wrote), mirror in memory, and email each member.
function execSendMessage(memberIds, text){
  const now=Date.now();
  memberIds.filter(Boolean).forEach(mid=>{
    const msgId=gi('tm');
    const msg={side:'exec',text:text,createdAt:now};
    fbSet('threads/'+mid+'/messages/'+msgId,msg);
    fbSet('threads/'+mid+'/updatedAt',now);
    fbSet('threads/'+mid+'/lastReadExec',now);
    if(!D.threads)D.threads={}; if(!D.threads[mid])D.threads[mid]={};
    if(!D.threads[mid].messages)D.threads[mid].messages={};
    D.threads[mid].messages[msgId]=msg; D.threads[mid].updatedAt=now; D.threads[mid].lastReadExec=now;
    // The worker template already greets the member by name, so send the body without a greeting.
    notifyPlayer(mid,'cnote','New message from '+(SC.schoolName||'your club'),text+'\n\nLog in to the app to reply.');
  });
  toast(memberIds.length>1?('Message sent to '+memberIds.length+' members'):'Message sent');
}

function inboxOpenThread(mid){
  _inboxThread=mid; _inboxCompose=false;
  const now=Date.now();
  fbSet('threads/'+mid+'/lastReadExec',now);
  if(D.threads&&D.threads[mid])D.threads[mid].lastReadExec=now;
  renderExecInbox();
}
function inboxBack(){ _inboxThread=null; _inboxCompose=false; renderExecInbox(); }
function inboxNewCompose(){ _inboxThread=null; _inboxCompose=true; renderExecInbox(); }
function execInboxSend(){
  const ta=document.getElementById('inbox-reply'); if(!ta||!_inboxThread)return;
  const text=(ta.value||'').trim(); if(!text)return;
  execSendMessage([_inboxThread],text); ta.value=''; renderExecInbox();
}
function execComposeSend(){
  const ta=document.getElementById('inbox-compose-text'); if(!ta)return;
  const text=(ta.value||'').trim(); if(!text){toast('Enter a message');return;}
  const ids=[...document.querySelectorAll('.inbox-compose-cb:checked')].map(c=>c.value);
  if(!ids.length){toast('Pick at least one member');return;}
  execSendMessage(ids,text); _inboxCompose=false; renderExecInbox();
}

function renderExecInbox(){
  const pane=document.getElementById('tab-inbox'); if(!pane)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const threads=D.threads||{};
  // Compose-new view: pick one or more members, one thread each.
  if(_inboxCompose){
    const opts=[...D.players].sort((a,b)=>(a.lastName||'').localeCompare(b.lastName||'')).map(p=>
      `<label style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px;"><input type="checkbox" class="inbox-compose-cb" value="${p.id}"> ${esc(p.firstName+' '+p.lastName)}</label>`).join('');
    pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> ✉️ New Message</div>
      <p style="font-size:12px;color:var(--gray);margin-bottom:10px;line-height:1.5;">Pick one or more members. Each gets their own private thread, not a group chat.</p>
      <div style="max-height:200px;overflow-y:auto;border:1px solid var(--gray-lighter);border-radius:8px;padding:8px 12px;margin-bottom:10px;">${opts||'<span style="color:var(--gray);font-size:13px;">No members yet.</span>'}</div>
      <textarea id="inbox-compose-text" maxlength="2000" placeholder="Write your message" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px;resize:vertical;min-height:72px;box-sizing:border-box;"></textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-primary btn-small" onclick="execComposeSend()">Send</button>
        <button class="btn btn-secondary btn-small" onclick="inboxBack()">Cancel</button>
      </div></div>`;
    return;
  }
  // Open-thread view: history plus a reply box, posting as the exec voice.
  if(_inboxThread){
    const mid=_inboxThread; const p=gP(mid); const t=threads[mid]||{};
    const msgs=_threadMsgList(t);
    const body=msgs.length?msgs.map(m=>{
      const who=m.side==='exec'?'Exec':(p?p.firstName+' '+p.lastName:'Member');
      const align=m.side==='exec'?'flex-end':'flex-start';
      const bg=m.side==='exec'?'var(--red)':'var(--gray-lighter)';
      const col=m.side==='exec'?'#fff':'var(--black)';
      const when=m.createdAt?new Date(m.createdAt).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
      return `<div style="display:flex;justify-content:${align};margin:4px 0;"><div style="max-width:78%;background:${bg};color:${col};border-radius:12px;padding:8px 12px;font-size:14px;white-space:pre-wrap;word-break:break-word;"><div style="font-size:10px;opacity:0.75;margin-bottom:2px;">${esc(who)} · ${when}</div>${esc(m.text)}</div></div>`;
    }).join(''):'<p style="color:var(--gray);font-size:13px;padding:8px 0;">No messages yet.</p>';
    pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> ✉️ ${esc(p?p.firstName+' '+p.lastName:'Member')}</div>
      <button class="btn btn-secondary btn-small" style="margin-bottom:10px;" onclick="inboxBack()">Back to all threads</button>
      <div style="max-height:340px;overflow-y:auto;padding:4px;">${body}</div>
      <textarea id="inbox-reply" maxlength="2000" placeholder="Reply as Exec" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px;resize:vertical;min-height:60px;box-sizing:border-box;margin-top:10px;"></textarea>
      <button class="btn btn-primary btn-small" style="margin-top:8px;" onclick="execInboxSend()">Send</button></div>`;
    return;
  }
  // Thread list: unread-for-exec first, then most recent. Unread rows are highlighted.
  const rows=Object.keys(threads).map(mid=>({mid,t:threads[mid]})).filter(x=>x.t&&typeof x.t==='object');
  rows.sort((a,b)=>{ const ua=threadUnreadExec(a.t)?1:0, ub=threadUnreadExec(b.t)?1:0; if(ua!==ub)return ub-ua; return (b.t.updatedAt||0)-(a.t.updatedAt||0); });
  const list=rows.length?rows.map(({mid,t})=>{
    const p=gP(mid); const unread=threadUnreadExec(t);
    const msgs=_threadMsgList(t); const last=msgs[msgs.length-1];
    const preview=last?((last.side==='exec'?'You: ':'')+last.text):'';
    const when=t.updatedAt?new Date(t.updatedAt).toLocaleDateString([],{month:'short',day:'numeric'}):'';
    return `<div onclick="inboxOpenThread('${mid}')" style="cursor:pointer;padding:10px;border:1px solid var(--gray-lighter);border-radius:8px;margin-bottom:6px;${unread?'background:#fff4f4;border-color:var(--red);':''}">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;">
        <span style="font-weight:700;font-size:14px;color:var(--charcoal);">${unread?'<span style="color:var(--red);">● </span>':''}${esc(p?p.firstName+' '+p.lastName:'Member')}</span>
        <span style="font-size:11px;color:var(--gray);white-space:nowrap;">${when}</span></div>
      <div style="font-size:12.5px;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">${esc(preview)}</div></div>`;
  }).join(''):'<p style="color:var(--gray);font-size:13px;padding:8px 0;">No threads yet. Start one with New Message.</p>';
  pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 📨 Inbox</div>
    <button class="btn btn-primary btn-small" style="margin-bottom:12px;" onclick="inboxNewCompose()">✉️ New Message</button>
    ${list}</div>`;
}

// Member side: their single thread with the exec team, in the player portal.
function memberSendReply(){
  const ta=document.getElementById('mm-reply'); if(!ta||!currentPlayerId)return;
  const text=(ta.value||'').trim(); if(!text)return;
  const now=Date.now(); const mid=currentPlayerId; const msgId=gi('tm');
  const msg={side:'member',text:text,createdAt:now};
  fbSet('threads/'+mid+'/messages/'+msgId,msg);
  fbSet('threads/'+mid+'/updatedAt',now);
  fbSet('threads/'+mid+'/lastReadMember',now);
  if(!D.threads)D.threads={}; if(!D.threads[mid])D.threads[mid]={};
  if(!D.threads[mid].messages)D.threads[mid].messages={};
  D.threads[mid].messages[msgId]=msg; D.threads[mid].updatedAt=now; D.threads[mid].lastReadMember=now;
  ta.value=''; renderMemberMessages();
}
function updateMemberMsgBadge(){
  const el=document.getElementById('pp-msg-unread'); if(!el||!currentPlayerId)return;
  const t=(D.threads||{})[currentPlayerId]||{};
  const lr=t.lastReadMember||0;
  const n=_threadMsgList(t).filter(m=>m.side==='exec'&&(m.createdAt||0)>lr).length;
  el.textContent=n>0?('('+n+')'):'';
}
function renderMemberMessages(){
  const panel=document.getElementById('pp-panel-messages'); if(!panel||!currentPlayerId)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mid=currentPlayerId; const t=(D.threads||{})[mid]||{};
  // Mark member-read on view.
  if(threadUnreadMember(t)){ const now=Date.now(); fbSet('threads/'+mid+'/lastReadMember',now); if(D.threads&&D.threads[mid])D.threads[mid].lastReadMember=now; }
  const msgs=_threadMsgList(t);
  const body=msgs.length?msgs.map(m=>{
    const who=m.side==='exec'?(SC.coachSignoff||'Exec'):'You';
    const align=m.side==='member'?'flex-end':'flex-start';
    const bg=m.side==='member'?'var(--red)':'var(--gray-lighter)';
    const col=m.side==='member'?'#fff':'var(--black)';
    const when=m.createdAt?new Date(m.createdAt).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    return `<div style="display:flex;justify-content:${align};margin:4px 0;"><div style="max-width:78%;background:${bg};color:${col};border-radius:12px;padding:8px 12px;font-size:14px;white-space:pre-wrap;word-break:break-word;"><div style="font-size:10px;opacity:0.75;margin-bottom:2px;">${esc(who)} · ${when}</div>${esc(m.text)}</div></div>`;
  }).join(''):'<p style="color:var(--gray);font-size:13px;padding:8px 0;">No messages yet. Your club will reach out here, and you can reply any time.</p>';
  panel.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> ✉️ Messages</div>
    <div style="max-height:360px;overflow-y:auto;padding:4px;">${body}</div>
    <textarea id="mm-reply" maxlength="2000" placeholder="Message your club" style="width:100%;border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px;resize:vertical;min-height:60px;box-sizing:border-box;margin-top:10px;"></textarea>
    <button class="btn btn-primary btn-small" style="margin-top:8px;" onclick="memberSendReply()">Send</button></div>`;
  updateMemberMsgBadge();
}

// ── HS Communicate: coach broadcast to players/parents. Sends real email via the
// worker (/hs/broadcast, coach-session gated) AND posts to the in-app broadcasts
// node so players see it without email. Separate from the club Exec Broadcast above.
let hsBcAudience='all';
// A broadcast that posted to the app but whose email send failed. Kept so a retry
// re-sends the email instead of posting a duplicate. Cleared on email success, or
// when the subject/body text changes (which makes it a new announcement).
let hsBcPending=null; // { id, subject, body }
function setHsBcAudience(a,btn){
  hsBcAudience=a;
  document.querySelectorAll('#hs-bc-audience .filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
}
function renderHsCommunicate(){ renderHsBroadcastList(); }
function renderHsBroadcastList(){
  const el=document.getElementById('hs-bc-list'); if(!el)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const AUD={all:'Everyone',players:'Players',parents:'Parents'};
  const rows=Object.values(D.broadcasts||{}).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,10);
  if(!rows.length){el.innerHTML='<div style="font-size:12px;color:var(--gray);padding:6px 0;">No announcements yet.</div>';return;}
  el.innerHTML=rows.map(m=>{
    const when=m.createdAt?new Date(m.createdAt).toLocaleDateString([],{month:'short',day:'numeric'}):'';
    return '<div style="padding:8px 0;border-bottom:1px solid var(--gray-lighter);">'+
      '<div style="display:flex;justify-content:space-between;gap:8px;"><span style="font-weight:700;font-size:13px;color:var(--charcoal);">'+esc(m.subject||'(no subject)')+'</span><span style="font-size:11px;color:var(--gray);">'+(AUD[m.audience]||esc(m.audience||''))+' · '+when+'</span></div>'+
      '<div style="font-size:12.5px;color:var(--gray);white-space:pre-wrap;margin-top:2px;">'+esc(m.body||'')+'</div></div>';
  }).join('');
}
function sendHsBroadcast(){
  const subEl=document.getElementById('hs-bc-subject'), bodyEl=document.getElementById('hs-bc-body');
  const subject=(subEl?subEl.value:'').trim(), body=(bodyEl?bodyEl.value:'').trim();
  const status=document.getElementById('hs-bc-status');
  const setStatus=(msg,ok)=>{if(status){status.textContent=msg;status.style.color=ok?'var(--green)':'var(--loss-red)';}};
  if(!subject||!body){setStatus('Enter a subject and a message.',false);return;}
  let session=null; try{session=JSON.parse(sessionStorage.getItem('csCoachSession'));}catch(e){}
  if(!session||!session.token||session.dbRoot!==DB_ROOT){setStatus('Coach session expired. Log in again.',false);return;}
  const coachName=SC.coachLabel||'Coach';
  // Post to the app first so players always see it, but only ONCE. If a previous
  // attempt already posted this exact text and only the email failed, reuse that
  // post and just retry the email. Changing subject, body, or audience makes it new.
  if(hsBcPending && (hsBcPending.subject!==subject || hsBcPending.body!==body || hsBcPending.audience!==hsBcAudience)) hsBcPending=null;
  if(!hsBcPending){
    const bcId=gi('bc');
    fbSet('broadcasts/'+bcId,{audience:hsBcAudience,subject:subject,body:body,coachName:coachName,createdAt:Date.now()});
    hsBcPending={id:bcId,subject:subject,body:body,audience:hsBcAudience};
  }
  setStatus('Sending...',true);
  fetch(AUTH_WORKER+'/hs/broadcast',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dbRoot:DB_ROOT,token:session.token,audience:hsBcAudience,subject:subject,body:body,coachName:coachName})
  }).then(r=>r.json().then(j=>({status:r.status,j:j}))).then(o=>{
    if(o.j&&o.j.ok){
      const n=o.j.recipients||0;
      setStatus('Sent to '+n+' '+(n===1?'person':'people')+'.',true);
      hsBcPending=null;
      if(subEl)subEl.value=''; if(bodyEl)bodyEl.value='';
    }else{
      setStatus('Posted in the app, but the email could not be sent. Try again to send the email.',false);
    }
  }).catch(()=>setStatus('Posted in the app, but the email could not be sent. Try again to send the email.',false));
}
// Player-facing: read-only team announcements (audience all or players).
function renderPlayerBroadcasts(){
  const el=document.getElementById('pp-broadcasts'); if(!el)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rows=Object.values(D.broadcasts||{}).filter(m=>m&&(m.audience==='all'||m.audience==='players')).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,10);
  if(!rows.length){el.innerHTML='';return;}
  el.innerHTML='<div class="card" style="padding:12px 14px;margin-top:10px;"><div style="font-family:\'Bebas Neue\';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">📣 Team Announcements</div>'+rows.map(m=>{
    const when=m.createdAt?new Date(m.createdAt).toLocaleDateString([],{month:'short',day:'numeric'}):'';
    return '<div style="padding:8px 0;border-bottom:1px solid var(--gray-lighter);"><div style="display:flex;justify-content:space-between;gap:8px;"><span style="font-weight:700;font-size:13px;color:var(--charcoal);">'+esc(m.subject||'')+'</span><span style="font-size:11px;color:var(--gray);">'+esc(m.coachName||'Coach')+' · '+when+'</span></div><div style="font-size:12.5px;color:var(--gray);white-space:pre-wrap;margin-top:2px;">'+esc(m.body||'')+'</div></div>';
  }).join('')+'</div>';
}

// ============================================================
// TEAM ANALYSIS (Exec-side, Grass Club only, gated on SC.tiersEnabled)
// Aggregate a tier's 8-skill assessments to find collective weak spots,
// then generate a practice session plan targeting them. Ephemeral: the
// generated plan is held in memory and displayed, never written to Firebase.
// ============================================================
let analysisTier=SC.tiersEnabled?'gold':'all';
let analysisPlanText='';
function setAnalysisTier(t){ analysisTier=t; analysisPlanText=''; renderTeamAnalysis(); }

// ============================================================
// PRACTICE BUILDER drill-picker mockup (Grass Club only, gated on SC.tiersEnabled).
// Pure in-memory demo preview: nothing persists, no Firebase, no fbSet, no AI worker.
// All state lives in plain JS vars and resets on refresh, consistent with demo mode.
// ============================================================
const BUILDER_DRILLS=[
  ['Serving',['Float Serve Targets','Jump Serve Reps','Serve to Zones (1-5)']],
  ['Passing',['Butterfly Passing','Serve Receive to Target','Shankproof (partner pepper)']],
  ['Setting',['Setter Footwork Ladder','Hand-Setting Accuracy','Jump Set Reps']],
  ['Hitting',['Approach Timing','Line vs Angle Shots','Roll Shot Control']],
  ['Blocking',['Block Footwork','Read & Press','Peel & Transition']],
  ['Defense',['Pursuit Digs','Coach-on-Box Down Balls','Emergency Pancake Reps']],
  ['Court Sense',['Read and React','Transition Footwork','Shot Selection Reps']],
  ['Communication',['Call It Loud','Switch and Cover','Seam Coverage Drill']]
];
let builderOpen=false;       // is the drill picker open
let builderExpanded={};      // skill index -> bool (which categories are expanded)
let builderSession=[];       // [{rid, name, minutes}]
let builderSeq=0;            // stable row id source for remove
let builderHeatBand='normal';         // FHSAA Policy 41 heat band driving auto fluid breaks
let builderSuppressedBreaks=new Set();// rids of drills after which the exec deleted an auto break
function toggleBuilder(){ builderOpen=!builderOpen; renderBuilder(); }
function toggleBuilderSkill(si){ builderExpanded[si]=!builderExpanded[si]; renderBuilder(); }
function addBuilderDrill(si,di){
  const name=(BUILDER_DRILLS[si]&&BUILDER_DRILLS[si][1][di])||'Drill';
  builderSession.push({rid:++builderSeq,name:name,minutes:20});
  renderBuilder();
}
function removeBuilderDrill(rid){ builderSession=builderSession.filter(d=>d.rid!==rid); renderBuilder(); }
function setBuilderDrillMinutes(rid,val){
  const d=builderSession.find(x=>x.rid===rid); if(!d)return;
  const m=parseInt(val,10);
  d.minutes=isNaN(m)?0:Math.max(0,m);
  // Update only the total in place so the edited input keeps focus. The total includes auto fluid breaks,
  // so it stays correct as minutes change; the break row positions settle on the next full render.
  const t=document.getElementById('ta-builder-total');
  if(t)t.textContent=pbComputeRows().total;
}
function setBuilderHeatBand(v){ builderHeatBand=v; renderBuilder(); }
// Delete an auto-inserted fluid break: remember its stable key so it stays removed on recompute.
function removeBuilderBreak(key){ builderSuppressedBreaks.add(key); renderBuilder(); }
// Derive the display rows (drills, split around fluid breaks) and the true total minutes.
// Breaks fall on an ELAPSED-TIME cadence: a break every `threshold` minutes of cumulative drilling,
// independent of where drill boundaries are. When a break boundary lands in the middle of a drill, the
// drill is shown as two (or more) parts around the break, while its stored data stays one entry with one
// total minutes. Breaks are computed, not stored, so changing drills, minutes, or the heat band recomputes
// cleanly. FHSAA Policy 41 bands: normal every ~20 min of drilling, high ~15, extreme ~12. Each break is 10 min.
// A break that would fall exactly at the end of the whole session is skipped.
function pbComputeRows(){
  const TH={normal:20,high:15,extreme:12};
  const threshold=TH[builderHeatBand]||20;
  const BREAK_MIN=10;
  const rows=[];
  const totalDrill=builderSession.reduce((s,x)=>s+Math.max(0,x.minutes||0),0);
  let elapsed=0,total=0;
  builderSession.forEach(d=>{
    let remaining=Math.max(0,d.minutes||0);
    const dMin=d.minutes||0;
    if(remaining===0){
      // A zero-minute drill still gets one editable row so it can be removed or set back up.
      rows.push({type:'drill',rid:d.rid,name:d.name,seg:0,part:0,dMin:0});
      return;
    }
    let part=0,dBreak=0;
    while(remaining>0){
      const intoBlock=elapsed%threshold;          // minutes into the current drilling block
      const toBoundary=threshold-intoBlock;        // drilling minutes until the next break boundary
      const seg=Math.min(remaining,toBoundary);    // this segment runs up to the boundary or the drill end
      rows.push({type:'drill',rid:d.rid,name:d.name,seg:seg,part:part,dMin:dMin});
      elapsed+=seg; total+=seg; remaining-=seg; part++;
      // A break falls here only when we landed exactly on a boundary AND there is more drilling to come.
      if(elapsed%threshold===0 && elapsed<totalDrill){
        dBreak++;
        const key=d.rid+':'+dBreak; // stable: owned by this drill, ordinal disambiguates multi-break drills
        if(!builderSuppressedBreaks.has(key)){
          rows.push({type:'break',breakKey:key,minutes:BREAK_MIN});
          total+=BREAK_MIN;
        }
      }
    }
  });
  // Tag each drill row with how many parts its drill split into, so render can label parts and pick the editable row.
  const partCount={};
  rows.forEach(r=>{ if(r.type==='drill') partCount[r.rid]=(partCount[r.rid]||0)+1; });
  rows.forEach(r=>{ if(r.type==='drill') r.totalParts=partCount[r.rid]||1; });
  return {rows,total};
}
function renderBuilder(){
  const el=document.getElementById('ta-builder');
  if(!el)return;
  if(!builderOpen){ el.innerHTML=''; return; }
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // LEFT: six skill categories, each expandable to reveal its drills.
  const left=BUILDER_DRILLS.map(([skill,drills],si)=>{
    const open=!!builderExpanded[si];
    const drillBtns=open?drills.map((dn,di)=>
      `<button class="btn btn-secondary btn-small" style="width:100%;text-align:left;margin:4px 0 0;font-size:12px;padding:8px 10px;" onclick="addBuilderDrill(${si},${di})">+ ${esc(dn)}</button>`).join(''):'';
    return `<div style="margin-bottom:6px;">
      <button class="btn btn-small" style="width:100%;text-align:left;background:var(--off-white);color:var(--charcoal);border:1px solid var(--gray-lighter);font-family:'Bebas Neue',sans-serif;letter-spacing:1px;font-size:14px;" onclick="toggleBuilderSkill(${si})">${open?'▼':'▶'} ${esc(skill)}</button>
      ${drillBtns}
    </div>`;
  }).join('');
  // Heat condition selector. Drives the auto fluid breaks below. Honest about being forecast based, not live WBGT.
  const HEAT_OPTS=[['normal','Normal'],['high','High heat'],['extreme','Extreme heat']];
  const heatSel=`<div style="margin-bottom:12px;">
    <label style="font-size:13px;color:var(--charcoal);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">Heat condition
      <select class="tier-select" onchange="setBuilderHeatBand(this.value)">${HEAT_OPTS.map(([v,lbl])=>`<option value="${v}" ${builderHeatBand===v?'selected':''}>${lbl}</option>`).join('')}</select>
    </label>
    <div style="font-size:11px;color:var(--gray);margin-top:6px;line-height:1.5;">Fluid breaks follow Florida heat-safety guidance (FHSAA Policy 41). This is forecast and condition based, not live WBGT monitoring. Confirm conditions on site.</div>
  </div>`;
  // RIGHT: the session being built, with auto fluid breaks interleaved, editable minutes, and a live total.
  const computed=pbComputeRows();
  let right;
  if(!builderSession.length){
    right=`<p style="color:var(--gray);font-size:12px;padding:8px 0;line-height:1.5;">Tap a skill on the left, then tap a drill to add it here.</p>`;
  }else{
    right=computed.rows.map(r=>{
      if(r.type==='break'){
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;margin:3px 0;border-radius:6px;background:#e8f0fe;border:1px dashed #1d4ed8;">
          <span style="flex:1;font-size:12px;color:#1d4ed8;font-weight:700;">💧 Fluid Break (shade)</span>
          <span style="font-size:12px;color:#1d4ed8;">${r.minutes} min</span>
          <button class="btn btn-danger btn-small" style="padding:2px 8px;font-size:11px;" title="Remove break" onclick="removeBuilderBreak('${r.breakKey}')">✕</button>
        </div>`;
      }
      const split=r.totalParts>1;
      const label=split?`${esc(r.name)} (part ${r.part+1})`:esc(r.name);
      if(!split){
        // Single, un-split drill: editable input is the whole drill total, with a remove control. As before.
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--gray-lighter);">
          <span style="flex:1;font-size:13px;color:var(--charcoal);">${label}</span>
          <input type="number" min="0" max="180" value="${r.dMin}" oninput="setBuilderDrillMinutes(${r.rid},this.value)" style="width:56px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:14px;text-align:center;color:var(--charcoal);">
          <span style="font-size:11px;color:var(--gray);">min</span>
          <button class="btn btn-danger btn-small" style="padding:2px 8px;font-size:11px;" onclick="removeBuilderDrill(${r.rid})">✕</button>
        </div>`;
      }
      if(r.part===0){
        // First part of a split drill: shows this segment's minutes as plain text, plus the editable WHOLE-drill
        // total (edits recompute the split) and the remove control. The total input appears on this row only.
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--gray-lighter);">
          <span style="flex:1;font-size:13px;color:var(--charcoal);">${label}</span>
          <span style="font-size:12px;color:var(--gray);">${r.seg} min</span>
          <input type="number" min="0" max="180" value="${r.dMin}" oninput="setBuilderDrillMinutes(${r.rid},this.value)" title="Whole drill total minutes" style="width:56px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:14px;text-align:center;color:var(--charcoal);">
          <span style="font-size:11px;color:var(--gray);">total</span>
          <button class="btn btn-danger btn-small" style="padding:2px 8px;font-size:11px;" onclick="removeBuilderDrill(${r.rid})">✕</button>
        </div>`;
      }
      // Later part of a split drill: derived segment minutes as plain text only, no input and no remove.
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--gray-lighter);">
        <span style="flex:1;font-size:13px;color:var(--charcoal);">${label}</span>
        <span style="font-size:12px;color:var(--gray);">${r.seg} min</span>
      </div>`;
    }).join('');
  }
  const total=computed.total;
  el.innerHTML=`<div class="card" style="border-top:3px solid var(--gold);">
    <div class="card-title" style="color:var(--gold);"><span class="bar" style="background:var(--gold);"></span> 🛠️ Build Practice Plan</div>
    <p style="font-size:12px;color:var(--gray);margin-bottom:12px;line-height:1.5;">Tap a skill to see its drills, tap a drill to add it to today's session, then dial in the minutes. This is a quick planning sketch and is not saved.</p>
    ${heatSel}
    <div style="display:flex;gap:14px;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">DRILLS</div>
        ${left}
      </div>
      <div style="flex:1;min-width:200px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:8px;">TODAY'S SESSION</div>
        ${right}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:2px solid var(--gray-lighter);">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;color:var(--charcoal);">TOTAL</span>
          <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--gold);"><span id="ta-builder-total">${total}</span> min</span>
        </div>
      </div>
    </div>
  </div>`;
}

// Average ONLY assessed (>0) scores per skill. A 0 means unassessed and is
// never counted. A skill with zero assessed players gets avg null and is
// excluded from weak-spot ranking.
function analyzeTierSkills(tier){
  const SKILL_KEYS=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
  const SKILL_LABELS={serving:'Serving',passing:'Passing',setting:'Setting',hitting:'Hitting',blocking:'Blocking',defense:'Defense',courtSense:'Court Sense',communication:'Communication'};
  // 'all' is the HS whole-roster sentinel: no tier filter. The club still passes 'gold'/'garnet', so its per-tier counts are unchanged.
  const players=tier==='all'?D.players.filter(p=>p.id):D.players.filter(p=>(p.tier||'unassigned')===tier);
  const perSkill=SKILL_KEYS.map(k=>{
    let sum=0,n=0;
    players.forEach(p=>{
      const sk=profilesData?.skills?.[p.id]||profilesData?.players?.[p.id]?.skills||{};
      const v=sk[k]||0;
      if(v>0){ sum+=v; n++; }
    });
    return { key:k, label:SKILL_LABELS[k], avg: n>0 ? sum/n : null, assessedCount:n };
  });
  const playerCount=players.length;
  const assessedSkills=perSkill.filter(s=>s.avg!==null);
  return { tier, playerCount, perSkill, assessedSkills };
}

// Enough data to analyze: at least 1 player in the tier and at least 3 skills
// with at least one assessed score.
function tierDataSufficient(a){ return a.playerCount>=1 && a.assessedSkills.length>=3; }

// ============================================================
// PRACTICE GROUPS engine (Grass Club only, gated on SC.tiersEnabled).
// Splits each tier into N practice groups numbered from 1 within that tier.
// Uses a NEW separate field p.pg. Never reads or writes the load-bearing court field.
// Deterministic local math only: no AI worker, no fetch, no network.
// Court counts are session state in pass one (not persisted). Group assignments
// are written via the coachSetTier whole-object + in-memory pattern (fbSet is a
// no-op in demo mode, so we also mutate in memory so the re-render reflects it).
// ============================================================
let pgGoldCourts=2, pgGarnetCourts=2, pgMinGroupSize=2, pgActiveMode=null;
const PG_SKILL_KEYS=['serving','passing','setting','hitting','blocking','defense','courtSense','communication'];
function setPgGoldCourts(v){ pgGoldCourts=Math.max(1,parseInt(v,10)||1); renderPracticeGroups(); }
function setPgGarnetCourts(v){ pgGarnetCourts=Math.max(1,parseInt(v,10)||1); renderPracticeGroups(); }
function setPgMinGroupSize(v){ pgMinGroupSize=Math.max(1,parseInt(v,10)||1); renderPracticeGroups(); }
// Per-player overall skill: average of assessed (>0) skills, zeros ignored. Same rule as Team Analysis.
function pgPlayerSkillAvg(pid){
  const sk=profilesData?.skills?.[pid]||profilesData?.players?.[pid]?.skills||{};
  let sum=0,n=0;
  PG_SKILL_KEYS.forEach(k=>{const v=sk[k]||0;if(v>0){sum+=v;n++;}});
  return n>0?sum/n:0;
}
// Generate groups for one tier and write each player's pg (1-based within tier).
function pgGenerateTier(tier,mode,courts){
  const ranked=D.players
    .filter(p=>(p.tier||'unassigned')===tier)
    .map(p=>({p,avg:pgPlayerSkillAvg(p.id)}))
    .sort((a,b)=>b.avg-a.avg); // strongest first
  const count=ranked.length;
  const minSize=Math.max(1,pgMinGroupSize);
  // Reduce the requested group count so no group falls below the minimum given this tier's player count.
  // With count players and a floor of minSize each, the most groups we can run is floor(count/minSize).
  const requested=Math.max(1,courts);
  const effN=count>0?Math.max(1,Math.min(requested,Math.floor(count/minSize))):requested;
  const groupOf={};
  if(mode==='together'){
    // Strongest-first, top-down: PG1 takes the strongest players, PG2 the next, and so on.
    // Sizes are base, with the first (count % effN) groups taking one extra, so leftover players
    // fill back into existing groups rather than forming a runt group. PG1 ends up the strongest group.
    const base=Math.floor(count/effN), rem=count%effN;
    let idx=0;
    for(let g=1;g<=effN;g++){
      const size=base+(g<=rem?1:0);
      for(let k=0;k<size&&idx<count;k++){ groupOf[ranked[idx].p.id]=g; idx++; }
    }
  }else{
    // Balanced: serpentine (snake) draft across effN groups. Sizes differ by at most one, and effN
    // respects the minimum, so no group falls below it.
    ranked.forEach((x,i)=>{
      const cycle=2*effN;
      const pos=i%cycle;
      const g=pos<effN?pos:(cycle-1-pos);
      groupOf[x.p.id]=g+1;
    });
  }
  // Write pg with the whole-object spread pattern (in memory + fbSet, no-op in demo). Never touches court.
  ranked.forEach(x=>{
    const pl=gP(x.p.id); if(!pl)return;
    pl.pg=groupOf[x.p.id];
    fbSet('players/'+pl.id,{...pl,pg:groupOf[x.p.id]});
  });
}
// Generate both tiers in the chosen mode, then repaint. Local computation, no AI worker.
function generatePracticeGroups(mode){
  pgActiveMode=mode; // remember which mode is showing so its button stays lit
  if(SC.tiersEnabled){
    pgGenerateTier('gold',mode,pgGoldCourts);
    pgGenerateTier('garnet',mode,pgGarnetCourts);
  }else{
    // HS: same engine, HS squads. The gold slot is Development, the garnet slot is Roster.
    pgGenerateTier('development',mode,pgGoldCourts);
    pgGenerateTier('roster',mode,pgGarnetCourts);
  }
  toast(mode==='together'?'Groups generated (Best Together)':'Groups generated (Balanced)');
  renderPracticeGroups();
}
// Per-player override: move a player to a different group within their current tier.
// Reuses the established in-memory + fbSet pg write (no-op in demo). Never touches court.
function pgMovePlayerGroup(pid,newGroup){
  const g=parseInt(newGroup,10);
  if(!g)return;
  const pl=gP(pid); if(!pl)return;
  pl.pg=g;
  fbSet('players/'+pid,{...pl,pg:g});
  toast('Moved to PG'+g);
  renderPracticeGroups();
}
// Per-player override: bump a player to the other tier, then land them at PG1 in that tier so they
// never dangle with a stale group number. Reuses coachSetTier for the canonical tier change. Never touches court.
function pgMovePlayerTier(pid,newTier){
  const pl=gP(pid); if(!pl)return;
  if((pl.tier||'unassigned')===newTier)return; // no change, do nothing
  coachSetTier(pid,newTier); // writes tier, clears any pending tier request, re-renders the roster
  const after=gP(pid); if(!after)return;
  after.pg=1;
  fbSet('players/'+pid,{...after,pg:1});
  const TIER_LABELS={gold:'Gold',garnet:'Garnet',development:'Development',roster:'Roster'};
  toast('Moved to '+(TIER_LABELS[newTier]||newTier)+', PG1');
  renderPracticeGroups(); // coachSetTier re-renders the roster but not this view, so repaint it here
}
function renderPracticeGroups(){
  const pane=document.getElementById('tab-practicegroups');
  if(!pane)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Build one tier column: groups 1..courts, plus any leftover (no pg yet, or pg above the current count) under Unassigned.
  const col=(tier)=>{
    // Value-aware labels/colors so one helper serves club (gold/garnet) and HS (development/roster).
    const TL={gold:'Gold',garnet:'Garnet',development:'Development',roster:'Roster'};
    const TBG={gold:'#CEB888',garnet:'#782F40',development:'#217F7F',roster:'#082A4F'};
    const label=TL[tier]||tier;
    const headBg=TBG[tier]||'#782F40';
    const headFg=tier==='gold'?'#2d2d2d':'#ffffff';
    const players=D.players
      .filter(p=>(p.tier||'unassigned')===tier)
      .map(p=>({p,avg:pgPlayerSkillAvg(p.id)}));
    // Show only the groups that actually got players from the last generate, so a reduced effective
    // group count (from the minimum) never leaves an empty trailing group on screen.
    const maxPg=players.reduce((m,x)=>Math.max(m,x.p.pg||0),0);
    // Each row shows name + skill average, plus (coach only) two inline dropdowns: move to another group
    // in this tier, and move to the other team. Same inline-select styling as the roster court/tier controls.
    const memberRow=x=>{
      const ctrls=currentRole==='coach'?`<div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap;">
        ${maxPg>=1?`<select class="tier-select" title="Move group" onchange="pgMovePlayerGroup('${x.p.id}',this.value)">`
          +(x.p.pg?'':'<option value="" selected disabled>Group</option>')
          +Array.from({length:maxPg},(_,i)=>i+1).map(g=>`<option value="${g}" ${x.p.pg===g?'selected':''}>PG${g}</option>`).join('')
          +`</select>`:''}
        <select class="tier-select" title="Move team" onchange="pgMovePlayerTier('${x.p.id}',this.value)">
          ${(SC.tiersEnabled?[['gold','Gold'],['garnet','Garnet']]:[['development','Development'],['roster','Roster']]).map(([v,lbl])=>`<option value="${v}" ${(x.p.tier||'')===v?'selected':''}>${lbl}</option>`).join('')}
        </select>
      </div>`:'';
      return `<div style="padding:5px 0;border-bottom:1px solid var(--gray-lighter);font-size:13px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--charcoal);">${esc(x.p.firstName+' '+x.p.lastName)}${SC.tiersEnabled&&x.p.csRank?` <span class="cs-rank">${x.p.csRank}</span>`:''}</span>
          <span style="color:var(--gray);font-size:12px;">${x.avg>0?x.avg.toFixed(1):'-'}</span>
        </div>
        ${ctrls}
      </div>`;
    };
    let groupsHtml='';
    for(let g=1;g<=maxPg;g++){
      const members=players.filter(x=>x.p.pg===g).sort((a,b)=>b.avg-a.avg);
      const rows=members.length?members.map(memberRow).join(''):`<div style="color:var(--gray);font-size:12px;padding:6px 0;">No players</div>`;
      groupsHtml+=`<div style="margin-bottom:10px;border:1px solid var(--gray-lighter);border-radius:8px;overflow:hidden;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;color:${headFg};background:${headBg};padding:6px 10px;">${label} PG${g}</div>
        <div style="padding:4px 10px 6px;">${rows}</div>
      </div>`;
    }
    // Players with no group yet (before the first generate) sit under Unassigned within their tier.
    const leftover=players.filter(x=>!x.p.pg).sort((a,b)=>b.avg-a.avg);
    if(leftover.length){
      groupsHtml+=`<div style="margin-bottom:10px;border:1px dashed var(--gray-light);border-radius:8px;overflow:hidden;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:var(--gray);background:var(--off-white);padding:6px 10px;">Unassigned</div>
        <div style="padding:4px 10px 6px;">${leftover.map(memberRow).join('')}</div>
      </div>`;
    }
    return `<div style="flex:1;min-width:240px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${tier==='gold'?'#9a7d2e':tier==='development'?'#217F7F':tier==='roster'?'#082A4F':'#782F40'};margin-bottom:8px;">${label}</div>
      ${groupsHtml}
    </div>`;
  };
  pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 🏐 Practice Groups</div>
    <p style="font-size:12px;color:var(--gray);margin-bottom:12px;line-height:1.5;">Set how many practice groups each team runs, then generate. Best Together clusters the strongest players, Balanced spreads skill evenly. Groups are numbered from 1 within each team. This is a planning view and does not change court or pair seeding.</p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;">
      <label style="font-size:13px;color:var(--charcoal);display:flex;align-items:center;gap:6px;">${SC.tiersEnabled?'Gold groups':'Development groups'}
        <input type="number" min="1" max="8" value="${pgGoldCourts}" onchange="setPgGoldCourts(this.value)" style="width:56px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:15px;text-align:center;color:var(--charcoal);"></label>
      <label style="font-size:13px;color:var(--charcoal);display:flex;align-items:center;gap:6px;">${SC.tiersEnabled?'Garnet groups':'Roster groups'}
        <input type="number" min="1" max="8" value="${pgGarnetCourts}" onchange="setPgGarnetCourts(this.value)" style="width:56px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:15px;text-align:center;color:var(--charcoal);"></label>
      <label style="font-size:13px;color:var(--charcoal);display:flex;align-items:center;gap:6px;">Min per group
        <input type="number" min="1" max="8" value="${pgMinGroupSize}" onchange="setPgMinGroupSize(this.value)" style="width:56px;padding:4px 6px;border:1px solid var(--gray-lighter);border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:15px;text-align:center;color:var(--charcoal);"></label>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
      <button class="filter-btn${pgActiveMode==='together'?' active':''}" style="flex:1;min-width:150px;text-align:center;" onclick="generatePracticeGroups('together')">Best Together</button>
      <button class="filter-btn${pgActiveMode==='balanced'?' active':''}" style="flex:1;min-width:150px;text-align:center;" onclick="generatePracticeGroups('balanced')">Balanced</button>
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      ${SC.tiersEnabled?col('gold'):col('development')}
      ${SC.tiersEnabled?col('garnet'):col('roster')}
    </div>
  </div>`;
}

// ============================================================
// LOGISTICS (Grass Club only, gated on SC.tiersEnabled). Recruiting below is now persisted (it has
// its own header). Accounting and Travel further down remain pure in-memory demo previews: no
// Firebase, no fbSet, no network, and their state resets on refresh.
// ============================================================
// Recruiting: tryout sessions, invitations, and attendance, persisted under the club matches node
// (DB_ROOT = SC.dbRoots.matches, which the live *_matches rule already governs; no new top-level
// node, so no rules change). Prospects are real roster records (D.players with status 'prospect'),
// not a separate in-memory list, so the roster and Recruiting stay on one model. Invitations reuse
// execSendMessage, so a prospect gets the same in-app message and email as any exec message. Door
// check-in uses a QR from a pinned CDN library loaded on demand with Subresource Integrity; if the
// library fails, the same check-in link is shown as text and the exec takes attendance by hand.
//
// Firebase paths (all under DB_ROOT):
//   tryoutSessions/{sid}                      = { name, date, time, location, createdAt }
//   tryoutSessions/{sid}/invited/{prospectId} = invitedAt (ms epoch)
//   tryoutAttendance/{sid}/{prospectId}       = { present:bool, at:ms, method:'qr'|'manual' }
// ============================================================

// Pinned QR generator. jsDelivr serves the exact npm-published file for this version, so the
// integrity hash is stable. The shell is never touched, so the tag is injected here. Any failure
// (offline, blocked, hash mismatch) leaves the state 'failed' and every QR spot falls back to the
// check-in link shown as text.
var QR_LIB_URL='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
var QR_LIB_SRI='sha384-8FWZA6BGMXhsfO+BLtrJK0We6gg5o1JyO8xQm6peWDEUs17ACA5ziE/NIAkl9z2k';
var _qrLibState='idle'; // idle | loading | ready | failed
var _qrLibWaiters=[];
function ensureQrLib(cb){
  if(_qrLibState==='ready'){ if(cb)cb(true); return; }
  if(_qrLibState==='failed'){ if(cb)cb(false); return; }
  if(cb)_qrLibWaiters.push(cb);
  if(_qrLibState==='loading') return;
  _qrLibState='loading';
  var s=document.createElement('script');
  s.src=QR_LIB_URL;
  s.integrity=QR_LIB_SRI;
  s.crossOrigin='anonymous';
  s.referrerPolicy='no-referrer';
  s.onload=function(){
    _qrLibState=(typeof window.qrcode==='function')?'ready':'failed';
    var w=_qrLibWaiters; _qrLibWaiters=[]; w.forEach(function(f){ f(_qrLibState==='ready'); });
  };
  s.onerror=function(){
    _qrLibState='failed';
    var w=_qrLibWaiters; _qrLibWaiters=[]; w.forEach(function(f){ f(false); });
  };
  document.head.appendChild(s);
}
// Draw a QR for text into the element with the given id once the lib is ready. On failure the box
// shows a short note; the readable link beside it is the real fallback.
function renderQrInto(elId, text){
  ensureQrLib(function(ok){
    var el=document.getElementById(elId); if(!el) return;
    if(ok&&typeof window.qrcode==='function'){
      try{
        var qr=window.qrcode(0,'M');
        qr.addData(text);
        qr.make();
        el.innerHTML=qr.createSvgTag(5,4);
        return;
      }catch(e){}
    }
    el.innerHTML='<div style="font-size:11px;color:var(--gray);line-height:1.4;">QR code unavailable.<br>Use the link below or take attendance by hand.</div>';
  });
}

// The URL a prospect follows to check in: this same club app with ?tryout=<sid>, read once at boot
// by captureTryoutParam and acted on by processPendingTryout.
function tryoutAttendUrl(sid){
  return location.origin+location.pathname+'?tryout='+encodeURIComponent(sid);
}
// Boot: capture ?tryout=<sid>, hold it, and strip it from the URL (same pattern as ?csadmin).
var _pendingTryout=null;
var _tryoutSessionsLoaded=false;
function captureTryoutParam(){
  try{
    var sid=new URLSearchParams(location.search).get('tryout');
    if(sid){ _pendingTryout=sid; history.replaceState(null,'',location.pathname+location.hash); }
  }catch(e){}
}
// Record attendance for a held ?tryout once a member is logged in and sessions have loaded. A member
// who is not logged in keeps the pending id until login (renderPlayerPortal re-calls this).
function processPendingTryout(){
  if(!_pendingTryout) return;
  if(currentRole!=='player'||!currentPlayerId) return;
  if(!_tryoutSessionsLoaded) return;
  var sid=_pendingTryout;
  var sess=(D.tryoutSessions||{})[sid];
  if(!sess){ _pendingTryout=null; toast('That tryout session was not found'); return; }
  _pendingTryout=null;
  fbSet('tryoutAttendance/'+sid+'/'+currentPlayerId,{present:true,at:Date.now(),method:'qr'});
  toast('Checked in to '+(sess.name||'tryout'));
}

// ---- Exec-side helpers over the persisted model --------------------------
function tsSessionsArr(){
  var o=D.tryoutSessions||{};
  return Object.keys(o).map(function(sid){ return Object.assign({sid:sid},o[sid]); })
    .sort(function(a,b){ return (a.createdAt||0)-(b.createdAt||0); });
}
function tsProspects(){
  // Active prospects only. Inactive ones (applied, never came) are held in tsInactiveProspects.
  return (Array.isArray(D.players)?D.players:[]).filter(function(p){ return p&&p.status==='prospect'&&p.active!==false; });
}
function tsInactiveProspects(){
  return (Array.isArray(D.players)?D.players:[]).filter(function(p){ return p&&p.status==='prospect'&&p.active===false; });
}
function tsInvitedTo(sid,pid){
  var sess=(D.tryoutSessions||{})[sid];
  return !!(sess&&sess.invited&&sess.invited[pid]);
}
function tsAttendance(sid,pid){
  var a=(D.tryoutAttendance||{})[sid];
  return a?(a[pid]||null):null;
}
function tsInvitesForProspect(pid){
  return tsSessionsArr().filter(function(sess){ return tsInvitedTo(sess.sid,pid); });
}
// Re-render Recruiting on a live data change, but never while the exec is typing in one of its
// fields (a Firebase echo must not clobber an edit in progress).
function _maybeRenderRecruiting(){
  if(currentRole!=='coach') return;
  var pane=document.getElementById('tab-recruiting'); if(!pane) return;
  var ae=document.activeElement;
  if(ae&&pane.contains(ae)&&(ae.tagName==='INPUT'||ae.tagName==='SELECT'||ae.tagName==='TEXTAREA')) return;
  renderRecruiting();
}

// ---- Session create / edit / delete (persisted) --------------------------
function tsAddSession(){
  var sid=gi('ts');
  fbSet('tryoutSessions/'+sid,{name:'New Tryout Session',date:'',time:'',location:'FSU Main Campus Fields',createdAt:Date.now()});
  toast('Session added');
}
// Read a session's live form values (what the exec currently sees on screen). Time is composed from
// the hour, minute, and AM/PM selects into the app's "H:MM AM/PM" string, matching how the record
// stores it; a blank hour means the time is unset. Returns null when the session is not rendered.
function tsReadSessionForm(sid){
  var nameEl=document.getElementById('ts-name-'+sid);
  var dateEl=document.getElementById('ts-date-'+sid);
  var locEl=document.getElementById('ts-loc-'+sid);
  var thEl=document.getElementById('ts-th-'+sid);
  var tmEl=document.getElementById('ts-tm-'+sid);
  var tapEl=document.getElementById('ts-tap-'+sid);
  if(!nameEl&&!dateEl&&!locEl&&!thEl) return null;
  var th=thEl?thEl.value:'';
  var time=(th==='')?'':(th+':'+((tmEl&&tmEl.value)||'00')+' '+((tapEl&&tapEl.value)||'AM'));
  return {
    name: nameEl?nameEl.value.trim():'',
    date: dateEl?dateEl.value.trim():'',
    time: time,
    location: locEl?locEl.value.trim():''
  };
}
// Persist a session's four editable fields from a form-values object.
function tsPersistSessionForm(sid,form){
  var nm=form.name||'Tryout Session';
  fbSet('tryoutSessions/'+sid+'/name', nm);
  fbSet('tryoutSessions/'+sid+'/date', form.date);
  fbSet('tryoutSessions/'+sid+'/time', form.time);
  fbSet('tryoutSessions/'+sid+'/location', form.location);
  // Mirror into D so an immediate redraw shows the saved values before the Firebase echo returns.
  // Preserves other fields on the record (invited map, createdAt).
  if(!D.tryoutSessions)D.tryoutSessions={};
  var rec=D.tryoutSessions[sid]||{};
  rec.name=nm; rec.date=form.date; rec.time=form.time; rec.location=form.location;
  D.tryoutSessions[sid]=rec;
}
function tsUpdateSession(sid){
  var sess=(D.tryoutSessions||{})[sid]; if(!sess) return;
  var form=tsReadSessionForm(sid); if(!form) return;
  tsPersistSessionForm(sid,form);
  // Redraw now so the prospect-list invite checkboxes show the new name immediately, even if a
  // checkbox is focused (which would otherwise suppress the echo-driven re-render).
  renderRecruiting();
  toast('Session saved');
}
function tsDeleteSession(sid){
  if(!window.confirm('Delete this tryout session? Its invitations and attendance will be removed.')) return;
  fbSet('tryoutSessions/'+sid,null);
  fbSet('tryoutAttendance/'+sid,null);
  toast('Session deleted');
}
// Door QR panel open/closed per session (in memory; the QR lib loads when a panel first opens).
var _tsOpenDoor={};
function tsToggleDoor(sid){
  if(_tsOpenDoor[sid]) delete _tsOpenDoor[sid]; else _tsOpenDoor[sid]=true;
  renderRecruiting();
}

// ---- Invitations (reuse execSendMessage: in-app thread + email) ----------
// Render a session's ISO date (YYYY-MM-DD) as "Weekday, Month D". Parsed as a local date so it does
// not shift a day across time zones. Returns the raw value for anything that is not ISO (legacy or
// free text), and never throws.
function tsReadableDate(iso){
  var s=String(iso==null?'':iso).trim();
  var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if(!m) return s;
  var dt=new Date(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10));
  if(isNaN(dt.getTime())) return s;
  try{ return dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}); }
  catch(e){ return s; }
}
function tsSendInvite(pid){
  var boxes=document.querySelectorAll('input.ts-inv-box[data-pid="'+pid+'"]:checked');
  if(!boxes.length){ toast('Pick at least one session first'); return; }
  var now=Date.now();
  var items=[];
  Array.prototype.forEach.call(boxes,function(b){
    var sid=b.getAttribute('data-sid');
    var sess=(D.tryoutSessions||{})[sid]; if(!sess) return;
    // Use the session's CURRENT form values, not just the saved record, so an edit the exec made
    // without clicking Save is still sent. Persist them here so the record matches what is sent.
    var form=tsReadSessionForm(sid);
    if(form) tsPersistSessionForm(sid,form);
    var cur=form||sess;
    fbSet('tryoutSessions/'+sid+'/invited/'+pid, now);
    // Time, then date, then location, each omitted if missing so there is never a stray fragment.
    var t=String(cur.time||'').trim();
    var d=tsReadableDate(cur.date);
    var loc=String(cur.location||'').trim();
    var details='';
    if(t) details+=t;
    if(d) details+=(details?' on ':'')+d;
    if(loc) details+=(details?' at ':'')+loc;
    items.push({ name:String(cur.name||'').trim(), details:details });
  });
  if(!items.length){ toast('No valid sessions'); return; }
  // Link back to this club app (same base as the door check-in link, without the tryout param).
  var appUrl=location.origin+location.pathname;
  // execSendMessage adds no greeting (the worker template greets by name) and appends its own
  // "Log in to the app to reply." for the email; this body is the content between those.
  var closing='Log in to the app for additional details, and check in with an Exec when you arrive with your phone.';
  var lead;
  if(items.length===1){
    var it=items[0];
    var subj=it.name||'tryouts'; // no session name: fall back to today's wording
    lead='You are invited to '+subj+(it.details?': '+it.details:'')+'.';
  } else {
    // Several sessions: each line carries its own name so a prospect knows which is which.
    lead='You are invited to tryouts:\n\n'+items.map(function(it){
      var label=it.name?(it.name+(it.details?': '+it.details:'')):(it.details||'a tryout');
      return '- '+label+'.';
    }).join('\n');
  }
  var body=lead+'\n\nOpen the app: '+appUrl+'\n\n'+closing;
  execSendMessage([pid], body);
}
function tsRemoveInvite(sid,pid){
  fbSet('tryoutSessions/'+sid+'/invited/'+pid, null);
  toast('Invitation removed');
}
// ---- Attendance ----------------------------------------------------------
function tsMarkAttendance(sid,pid,present){
  fbSet('tryoutAttendance/'+sid+'/'+pid,{present:!!present,at:Date.now(),method:'manual'});
  toast(present?'Marked present':'Marked absent');
}
function tsClearAttendance(sid,pid){
  fbSet('tryoutAttendance/'+sid+'/'+pid, null);
  toast('Attendance cleared');
}
// ---- Placement (prospect to squad) ---------------------------------------
var TS_SQUAD_LABELS={gold:'Gold',garnet:'Garnet'};
// The placement notice, shared so the recruiting tab and the player card word it identically. No
// greeting (the worker greets by name); execSendMessage handles the in-app thread and the email.
function rcSendPlacementNotice(pid, tier){
  var squad=TS_SQUAD_LABELS[tier]||tier;
  execSendMessage([pid], 'You made the '+squad+' squad. Welcome to '+(SC.schoolName||'the club')+', we are glad to have you here. Log in to the app any time to see your squad and what comes next.');
}
// Place a prospect on a squad from the recruiting tab. coachSetTier does the whole-object tier write,
// clears prospect status, clears any pending tier request, notifies the member, and syncs the roster,
// so this delegates to it. Every other field (rating, TruVolley, attendance, createdAt) is preserved,
// so nothing about the person or their history is lost.
function rcPlaceProspect(pid, tier){
  var p=gP(pid); if(!p) return;
  if(tier!=='gold'&&tier!=='garnet') return;
  coachSetTier(pid, tier);
  renderRecruiting();
  toast((p.firstName||'Prospect')+' placed on '+(TS_SQUAD_LABELS[tier]||tier));
}
// Mark a prospect inactive (applied but never came) or restore them. Uses the existing active field
// and touches nothing else, so the record and its history stay intact and an exec can restore it.
function rcSetProspectActive(pid, active){
  var p=gP(pid); if(!p) return;
  p.active=active;
  fbSet('players/'+pid,{...p,active:active});
  renderRecruiting();
  toast(active?'Prospect restored':'Prospect marked inactive');
}
// Shared avatar: the local-preview photo data URL if present, else an initials circle. Null-safe so
// existing players (no photo field) render fine. Used by the prospect profile and the coach modal.
function avatarHtml(person, size){
  const s=size||56;
  if(person&&person.photo){
    return '<img src="'+person.photo+'" alt="" style="height:'+s+'px;width:'+s+'px;object-fit:cover;border-radius:50%;border:2px solid rgba(255,255,255,0.5);flex:none;">';
  }
  const fi=(person&&person.firstName?person.firstName.charAt(0):'');
  const li=(person&&person.lastName?person.lastName.charAt(0):'');
  const initials=((fi+li).toUpperCase()||'?').replace(/[&<>"']/g,'');
  return '<div style="height:'+s+'px;width:'+s+'px;border-radius:50%;background:var(--gold,#CEB888);color:#2d2d2d;display:flex;align-items:center;justify-content:center;font-family:\'Bebas Neue\',sans-serif;font-size:'+Math.round(s*0.4)+'px;letter-spacing:1px;border:2px solid rgba(255,255,255,0.5);flex:none;">'+initials+'</div>';
}
// Recruiting tab: sessions with door check-in and manual attendance, and a prospect list built from
// the real roster (D.players, status 'prospect') showing name, class, tier request, TruVolley,
// invitation state, and attendance.
function renderRecruiting(){
  var pane=document.getElementById('tab-recruiting'); if(!pane) return;
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); };
  var sessions=tsSessionsArr();
  var prospects=tsProspects();
  var pName=function(p){ return ((p.firstName||'')+' '+(p.lastName||'')).trim(); };
  var tierBadge=function(t){ return t==='gold'?'<span class="tier-badge tier-gold">Gold</span>':t==='garnet'?'<span class="tier-badge tier-garnet">Garnet</span>':'<span style="font-size:11px;color:var(--gray);">No request</span>'; };
  var tvText=function(p){ return (p.truVolley!=null&&p.truVolley!=='')?('TV '+esc(p.truVolley)):'<span style="color:var(--gray);">No TruVolley</span>'; };

  var sessionsHtml=sessions.length?sessions.map(function(sess){
    var sid=sess.sid;
    var invitedIds=(sess.invited?Object.keys(sess.invited):[]);
    var attendRows=invitedIds.length?invitedIds.map(function(pid){
      var p=gP(pid); var nm=p?(p.firstName+' '+p.lastName):pid;
      var a=tsAttendance(sid,pid);
      var stateHtml=a?(a.present
          ?'<span style="font-size:11px;color:#217F7F;font-weight:700;">Present</span> <span style="font-size:10px;color:var(--gray);">('+(a.method==='qr'?'scanned':'by hand')+')</span>'
          :'<span style="font-size:11px;color:var(--red);font-weight:700;">Absent</span>')
        :'<span style="font-size:11px;color:var(--gray);">No mark</span>';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;border-top:1px solid var(--gray-lighter);flex-wrap:wrap;">'
        +'<span style="font-size:12px;color:var(--charcoal);">'+esc(nm)+'</span>'
        +'<span style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+stateHtml
        +'<button class="btn btn-small" style="padding:2px 8px;font-size:10px;background:#217F7F;color:#fff;border:none;" onclick="tsMarkAttendance(\''+esc(sid)+'\',\''+esc(pid)+'\',true)">Present</button>'
        +'<button class="btn btn-small" style="padding:2px 8px;font-size:10px;background:var(--gray-light);color:var(--charcoal);border:none;" onclick="tsMarkAttendance(\''+esc(sid)+'\',\''+esc(pid)+'\',false)">Absent</button>'
        +(a?'<button class="btn btn-small" style="padding:2px 8px;font-size:10px;" onclick="tsClearAttendance(\''+esc(sid)+'\',\''+esc(pid)+'\')">Clear</button>':'')
        +'</span></div>';
    }).join(''):'<div style="font-size:11px;color:var(--gray);padding:4px 0;">No one invited to this session yet.</div>';

    var doorHtml='';
    if(_tsOpenDoor[sid]){
      var url=tryoutAttendUrl(sid);
      doorHtml='<div style="border-top:1px dashed var(--gray-lighter);margin-top:8px;padding-top:8px;">'
        +'<div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;">'
        +'<div id="ts-qr-'+esc(sid)+'" style="min-width:130px;min-height:130px;display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid var(--gray-lighter);border-radius:8px;padding:6px;"></div>'
        +'<div style="flex:1;min-width:180px;">'
        +'<div style="font-size:11px;color:var(--gray);margin-bottom:4px;">Members open this link (logged in) or scan the code to check in.</div>'
        +'<a href="'+esc(url)+'" target="_blank" rel="noopener" style="font-size:11px;color:var(--red);word-break:break-all;">'+esc(url)+'</a>'
        +'</div></div></div>';
    }

    // Time-of-day selects, prefilled from the stored "H:MM AM/PM" string (blank when unset or legacy).
    var _tp=/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(sess.time||'').trim());
    var _th=_tp?String(parseInt(_tp[1],10)):'', _tmin=_tp?_tp[2]:'', _tap=_tp?_tp[3].toUpperCase():'';
    var hourOpts='<option value="">Hour</option>';
    for(var _h=1;_h<=12;_h++){ hourOpts+='<option value="'+_h+'"'+(_th===String(_h)?' selected':'')+'>'+_h+'</option>'; }
    var minOpts=['00','15','30','45'].map(function(mm){ return '<option value="'+mm+'"'+(_tmin===mm?' selected':'')+'>'+mm+'</option>'; }).join('');
    var apOpts=['AM','PM'].map(function(ap){ return '<option value="'+ap+'"'+(_tap===ap?' selected':'')+'>'+ap+'</option>'; }).join('');
    return '<div style="border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;margin-bottom:8px;">'
      +'<input class="form-input" id="ts-name-'+esc(sid)+'" value="'+esc(sess.name)+'" placeholder="Session name" style="font-family:\'Bebas Neue\',sans-serif;font-size:15px;letter-spacing:1px;color:var(--charcoal);padding:6px 8px;margin-bottom:6px;width:100%;box-sizing:border-box;">'
      +'<div class="form-row" style="margin-bottom:6px;">'
      +'<input type="date" class="form-input" id="ts-date-'+esc(sid)+'" value="'+esc(sess.date)+'" style="padding:6px 8px;font-size:12px;">'
      +'<div style="display:flex;gap:4px;align-items:center;flex:1;min-width:0;">'
      +'<select class="form-select" id="ts-th-'+esc(sid)+'" style="padding:6px 4px;font-size:12px;flex:1;min-width:0;">'+hourOpts+'</select>'
      +'<span style="font-size:12px;color:var(--gray);">:</span>'
      +'<select class="form-select" id="ts-tm-'+esc(sid)+'" style="padding:6px 4px;font-size:12px;flex:1;min-width:0;">'+minOpts+'</select>'
      +'<select class="form-select" id="ts-tap-'+esc(sid)+'" style="padding:6px 4px;font-size:12px;flex:1;min-width:0;">'+apOpts+'</select>'
      +'</div>'
      +'</div>'
      +'<input class="form-input" id="ts-loc-'+esc(sid)+'" value="'+esc(sess.location||'')+'" placeholder="Location" style="padding:6px 8px;font-size:12px;width:100%;box-sizing:border-box;margin-bottom:6px;">'
      +'<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">'
      +'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="tsUpdateSession(\''+esc(sid)+'\')">Save</button>'
      +'<button class="btn btn-small" style="padding:3px 10px;font-size:11px;background:#082A4F;color:#fff;border:none;" onclick="tsToggleDoor(\''+esc(sid)+'\')">'+(_tsOpenDoor[sid]?'Hide door code':'Door check-in code')+'</button>'
      +'<button class="btn btn-small btn-danger" style="padding:3px 10px;font-size:11px;" onclick="tsDeleteSession(\''+esc(sid)+'\')">Delete</button>'
      +'<span style="font-size:11px;color:var(--gray);margin-left:auto;">'+invitedIds.length+' invited</span>'
      +'</div>'
      +doorHtml
      +'<div style="margin-top:6px;">'+attendRows+'</div>'
      +'</div>';
  }).join(''):'<div style="font-size:12px;color:var(--gray);padding:6px 0;">No tryout sessions yet. Add one to start inviting prospects.</div>';

  var checkboxesFor=function(pid){
    if(!sessions.length) return '<span style="font-size:11px;color:var(--gray);">Add a session to invite.</span>';
    return sessions.map(function(sess){
      return '<label style="display:inline-flex;align-items:center;gap:3px;font-size:11px;color:var(--charcoal);margin-right:8px;">'
        +'<input type="checkbox" class="ts-inv-box" data-pid="'+esc(pid)+'" data-sid="'+esc(sess.sid)+'"> '+esc(sess.name)+'</label>';
    }).join('');
  };
  var prospectsHtml=prospects.length?prospects.map(function(p){
    var pid=p.id;
    var invites=tsInvitesForProspect(pid);
    var inviteTags=invites.length?invites.map(function(sess){
      return '<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;background:var(--gray-lighter);color:var(--charcoal);border-radius:10px;padding:2px 8px;">'+esc(sess.name)
        +'<button onclick="tsRemoveInvite(\''+esc(sess.sid)+'\',\''+esc(pid)+'\')" style="background:none;border:none;color:var(--gray);cursor:pointer;font-size:12px;line-height:1;padding:0;" title="Remove invite">&times;</button></span>';
    }).join(' '):'<span style="font-size:11px;color:var(--gray);">Not invited yet</span>';
    var attended=sessions.filter(function(sess){ var a=tsAttendance(sess.sid,pid); return a&&a.present; });
    var attendHtml=attended.length
      ?'<span style="font-size:11px;color:#217F7F;font-weight:700;">Attended:</span> <span style="font-size:11px;color:var(--charcoal);">'+attended.map(function(sess){ return esc(sess.name); }).join(', ')+'</span>'
      :'<span style="font-size:11px;color:var(--gray);">No attendance yet</span>';
    return '<div style="padding:8px 0;border-bottom:1px solid var(--gray-lighter);font-size:13px;">'
      +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
      +'<span style="font-weight:700;color:var(--charcoal);">'+esc(pName(p))+'</span>'
      +'<span class="class-badge class-'+esc(p.classYear||'')+'">'+esc(p.classYear||'')+'</span>'
      +(SC.tiersEnabled?(p.tierRequest?'<span style="font-size:10px;color:var(--gray);text-transform:uppercase;letter-spacing:0.5px;">Requested</span> '+tierBadge(p.tierRequest):tierBadge(null)):'')
      +'<span style="font-size:11px;color:var(--gray);">'+tvText(p)+'</span>'
      +'</div>'
      +'<div style="margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+inviteTags+'</div>'
      +'<div style="margin-top:5px;">'+attendHtml+'</div>'
      +'<div style="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'
      +checkboxesFor(pid)
      +(sessions.length?'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="tsSendInvite(\''+esc(pid)+'\')">Send invite</button>':'')
      +'</div>'
      // Placement and inactive controls. The prospect's requested tier is labeled above and marked
      // on the matching Place button, so an exec can honor or override it deliberately.
      +'<div style="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;border-top:1px dashed var(--gray-lighter);padding-top:6px;">'
      +(SC.tiersEnabled?(
          '<span style="font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.5px;">Place</span>'
         +'<button class="btn btn-small" style="padding:3px 10px;font-size:11px;background:#CEB888;color:#2d2d2d;border:none;'+(p.tierRequest==='gold'?'box-shadow:0 0 0 2px var(--charcoal);':'')+'" onclick="rcPlaceProspect(\''+esc(pid)+'\',\'gold\')">Gold'+(p.tierRequest==='gold'?' (requested)':'')+'</button>'
         +'<button class="btn btn-small" style="padding:3px 10px;font-size:11px;background:#782F40;color:#fff;border:none;'+(p.tierRequest==='garnet'?'box-shadow:0 0 0 2px var(--charcoal);':'')+'" onclick="rcPlaceProspect(\''+esc(pid)+'\',\'garnet\')">Garnet'+(p.tierRequest==='garnet'?' (requested)':'')+'</button>'
        ):'')
      +'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="rcSetProspectActive(\''+esc(pid)+'\',false)">Mark inactive</button>'
      +'</div>'
      +'</div>';
  }).join(''):'<div style="font-size:12px;color:var(--gray);padding:6px 0;">No prospects yet. They appear here when they sign up.</div>';

  // Inactive prospects: applied but marked inactive. Held out of the main list, restorable, not deleted.
  var inactive=tsInactiveProspects();
  var inactiveHtml=inactive.map(function(p){
    return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--gray-lighter);font-size:13px;flex-wrap:wrap;">'
      +'<span style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
      +'<span style="color:var(--gray);text-decoration:line-through;">'+esc(pName(p))+'</span>'
      +'<span class="class-badge class-'+esc(p.classYear||'')+'">'+esc(p.classYear||'')+'</span>'
      +'</span>'
      +'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="rcSetProspectActive(\''+esc(p.id)+'\',true)">Restore</button>'
      +'</div>';
  }).join('');
  pane.innerHTML='<div class="card"><div class="card-title"><span class="bar"></span> \u{1F3AF} Recruiting</div>'
    +'<p style="font-size:11px;color:var(--gray);margin-bottom:12px;">Create tryout sessions, invite prospects, and take attendance at the door.</p>'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
    +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:1px;color:var(--charcoal);">TRYOUT SESSIONS</div>'
    +'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="tsAddSession()">Add session</button>'
    +'</div>'
    +sessionsHtml
    +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:1px;color:var(--charcoal);margin:14px 0 4px;">PROSPECTS</div>'
    +prospectsHtml
    +(inactive.length?'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:1px;color:var(--gray);margin:14px 0 4px;">INACTIVE PROSPECTS</div>'+inactiveHtml:'')
    +'</div>';

  sessions.forEach(function(sess){ if(_tsOpenDoor[sess.sid]) renderQrInto('ts-qr-'+sess.sid, tryoutAttendUrl(sess.sid)); });
}
// Accounting (Grass Club): real dues tracking. One dues amount for the club, a per-member paid toggle
// (records who and when), a paid/collected summary, and a reminder that emails unpaid members. All
// persisted under DB_ROOT/dues, a sub-key of the *_matches node the live rule already governs (no new
// node, no rules change). Exec only: the player portal never renders any of this.
//   dues/amount              = number (per-member dues)
//   dues/members/{memberId}  = { paid:true, at:ms }   (absent means not paid)
//   dues/lastReminderAt      = ms (when a reminder was last sent)
function acctMembersList(){
  // Real club members: everyone on the roster who is not a prospect. Dues apply to placed members.
  return (Array.isArray(D.players)?D.players:[]).filter(function(p){ return p&&p.status!=='prospect'; })
    .slice().sort(function(a,b){ return _cmpLast(a,b); });
}
function acctAmount(){ var a=(D.dues||{}).amount; return (typeof a==='number'&&isFinite(a))?a:0; }
function acctIsPaid(pid){ var m=((D.dues||{}).members||{})[pid]; return !!(m&&m.paid); }
function acctSetAmount(){
  var el=document.getElementById('acct-amount'); if(!el) return;
  var v=parseFloat(el.value);
  if(!isFinite(v)||v<0){ toast('Enter a dues amount'); return; }
  var amt=Math.round(v*100)/100;
  fbSet('dues/amount', amt);
  if(!D.dues)D.dues={}; D.dues.amount=amt;
  renderAccounting();
  toast('Dues amount saved');
}
function acctTogglePaid(pid){
  if(!D.dues)D.dues={}; if(!D.dues.members)D.dues.members={};
  if(acctIsPaid(pid)){
    fbSet('dues/members/'+pid, null);
    delete D.dues.members[pid];
  } else {
    var rec={paid:true, at:Date.now()};
    fbSet('dues/members/'+pid, rec);
    D.dues.members[pid]=rec;
  }
  renderAccounting();
}
function acctSendReminder(){
  var amount=acctAmount();
  if(!(amount>0)){ toast('Set a dues amount first.'); return; }
  var unpaid=acctMembersList().filter(function(p){ return !acctIsPaid(p.id); });
  if(!unpaid.length){ toast('Everyone has paid. No reminder to send.'); return; }
  var names=unpaid.map(function(p){ return ((p.firstName||'')+' '+(p.lastName||'')).trim(); });
  var many=(unpaid.length!==1);
  if(!window.confirm('Send a dues reminder to '+unpaid.length+' member'+(many?'s':'')+' who '+(many?'have':'has')+' not paid?\n\n'+names.join('\n'))) return;
  var text='Just a friendly reminder that club dues of $'+amount+' are due. If you have already paid, thank you and please ignore this note. If not, please square up with an exec when you can, and reach out with any questions.';
  execSendMessage(unpaid.map(function(p){ return p.id; }), text);
  var now=Date.now();
  fbSet('dues/lastReminderAt', now);
  if(!D.dues)D.dues={}; D.dues.lastReminderAt=now;
  renderAccounting();
}
function renderAccounting(){
  const pane=document.getElementById('tab-accounting'); if(!pane)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const members=acctMembersList();
  const amount=acctAmount();
  const total=members.length;
  const paidCount=members.filter(m=>acctIsPaid(m.id)).length;
  const collected=paidCount*amount;
  const owed=total*amount;
  const lastRem=(D.dues||{}).lastReminderAt;
  const lastRemText=lastRem?('Last reminder sent '+new Date(lastRem).toLocaleString()):'No reminder sent yet.';
  const rows=members.length?members.map(m=>{
    const paid=acctIsPaid(m.id);
    const when=paid?(((D.dues||{}).members||{})[m.id]||{}).at:null;
    return `<tr>
      <td style="padding:6px 4px;border-bottom:1px solid var(--gray-lighter);font-size:13px;color:var(--charcoal);">${esc(((m.firstName||'')+' '+(m.lastName||'')).trim())}</td>
      <td style="padding:6px 4px;border-bottom:1px solid var(--gray-lighter);font-size:13px;color:var(--charcoal);text-align:right;">$${amount}</td>
      <td style="padding:6px 4px;border-bottom:1px solid var(--gray-lighter);text-align:right;white-space:nowrap;">
        ${paid&&when?`<span style="font-size:10px;color:var(--gray);margin-right:6px;">${esc(new Date(when).toLocaleDateString())}</span>`:''}
        <button class="btn btn-small ${paid?'btn-secondary':'btn-danger'}" style="padding:3px 10px;font-size:11px;" onclick="acctTogglePaid('${esc(m.id)}')">${paid?'Paid':'Not paid'}</button>
      </td>
    </tr>`;
  }).join(''):`<tr><td colspan="3" style="padding:10px 4px;font-size:12px;color:var(--gray);">No club members yet. Place prospects onto a squad and they appear here.</td></tr>`;
  pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 💵 Accounting</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
      <span style="font-size:12px;color:var(--charcoal);">Dues per member $</span>
      <input type="number" id="acct-amount" min="0" step="1" value="${amount||''}" placeholder="0" style="width:90px;padding:6px 8px;font-size:13px;border:1px solid var(--gray-lighter);border-radius:6px;">
      <button class="btn btn-small btn-secondary" style="padding:4px 12px;font-size:11px;" onclick="acctSetAmount()">Save amount</button>
    </div>
    <div style="font-size:13px;color:var(--charcoal);margin-bottom:8px;"><span style="font-weight:700;">${paidCount} of ${total} paid</span>, $${collected} collected of $${owed}</div>
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr>
        <th style="text-align:left;font-size:11px;letter-spacing:1px;color:var(--gray);padding:4px;">MEMBER</th>
        <th style="text-align:right;font-size:11px;letter-spacing:1px;color:var(--gray);padding:4px;">DUES</th>
        <th style="text-align:right;font-size:11px;letter-spacing:1px;color:var(--gray);padding:4px;">STATUS</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px;">
      <button class="btn btn-small" style="padding:5px 14px;font-size:12px;background:#082A4F;color:#fff;border:none;" onclick="acctSendReminder()">Email unpaid members a reminder</button>
      <span style="font-size:11px;color:var(--gray);">${esc(lastRemText)}</span>
    </div>
    <p style="font-size:10px;color:var(--gray);margin-top:8px;">Dues status is exec only and is not shown to members. Not linked to any payment system.</p>
  </div>`;
}
// Travel: sample away tournament with line items and a per-player paid-up toggle.
// ============================================================
// Travel tournaments (Grass Club). Two-sided: execs create/manage tournaments and see the full
// picture; members join, form teams, offer/claim rides, request lodging, and pay per event (member
// side is pass 2). All persisted under DB_ROOT, sub-keys of the *_matches node the live rule already
// governs (no new node, no rules change). This pass builds the exec side and the record model.
//
//   travel/{eventId} = { name, location, startDate, endDate, regUrl, deadline,
//       costs:{lineId:{label,amount}}, formats:{twos,threes,fours}, lodgingOffered,
//       scope:'gold'|'garnet'|'both', announcedAt, createdAt }
//   travel/{eventId}/participants/{memberId} = { status:'in'|'declined', freeAgent, teamId,
//       canDrive, seats, rideWith, lodging, at }              [member side, pass 2]
//   travel/{eventId}/teams/{teamId} = { format, createdBy, members:{mid:'accepted'|'pending'}, createdAt }  [pass 2]
//   travel/{eventId}/paid/{memberId} = { paid:true, at }      [exec-set, per event, separate from dues]
//   standing/{memberId} = { good:false, note, at }            [exec-set; absent = good standing]  [pass 2]
// ============================================================
var TRAVEL_FORMAT_SIZE={twos:2,threes:3,fours:4};
var TRAVEL_FORMAT_LABEL={twos:'Twos',threes:'Threes',fours:'Fours'};
function travelEvents(){
  var o=D.travel||{};
  return Object.keys(o).map(function(id){ return Object.assign({id:id},o[id]); })
    .sort(function(a,b){ return (String(a.startDate||'')).localeCompare(String(b.startDate||''))||((a.createdAt||0)-(b.createdAt||0)); });
}
function travelCostTotal(ev){
  var c=(ev&&ev.costs)||{};
  return Object.keys(c).reduce(function(s,k){ var a=parseFloat(c[k]&&c[k].amount); return s+(isFinite(a)?a:0); },0);
}
function travelParticipants(id){ var ev=(D.travel||{})[id]; return (ev&&ev.participants)||{}; }
function travelTeams(id){ var ev=(D.travel||{})[id]; return (ev&&ev.teams)||{}; }
function travelIsPaid(id,mid){ var ev=(D.travel||{})[id]; var p=ev&&ev.paid&&ev.paid[mid]; return !!(p&&p.paid); }
function travelTeamComplete(team){
  if(!team) return false;
  var size=TRAVEL_FORMAT_SIZE[team.format]||0;
  var mem=team.members||{}; var keys=Object.keys(mem);
  return size>0 && keys.length===size && keys.every(function(k){ return mem[k]==='accepted'; });
}
// Members an event is announced to, by squad scope (same tier scoping as the chat channels).
function travelScopeMembers(scope){
  var tiers = scope==='gold'?['gold']:scope==='garnet'?['garnet']:['gold','garnet'];
  return (Array.isArray(D.players)?D.players:[]).filter(function(p){ return p&&p.status!=='prospect'&&tiers.indexOf(p.tier)>=0; });
}
// ---- Exec create / edit / delete -----------------------------------------
// ---- Flush-before-render: never lose an in-progress detail edit ----------
// The detail fields (name, location, dates, deadline, link, formats, lodging, scope) live only in the
// DOM until Save details. Any handler that re-renders the Travel tab rebuilds EVERY card from
// D.travel, so without this an unsaved edit on any card is discarded on the next render. Mirrors the
// tryout session fix: read the live editor and persist it before renderTravel tears the cards down.
// Read one event's detail fields from its live editor. Returns null if that editor is not rendered.
// Single source of truth for the detail-field reads (Save details and the flush both use it).
function travelReadDetails(id){
  var nameEl=document.getElementById('tv-name-'+id);
  if(!nameEl) return null;
  var g=function(f){ var el=document.getElementById('tv-'+f+'-'+id); return el?el.value.trim():''; };
  var ck=function(f){ var el=document.getElementById('tv-'+f+'-'+id); return !!(el&&el.checked); };
  var scEl=document.getElementById('tv-scope-'+id);
  return { name:g('name')||'Tournament', location:g('location'), startDate:g('start'), endDate:g('end'),
    regUrl:g('url'), deadline:g('deadline'),
    formats:{ twos:ck('fmt-twos'), threes:ck('fmt-threes'), fours:ck('fmt-fours') },
    lodgingOffered:ck('lodging'), scope:(scEl?scEl.value:'both')||'both' };
}
// Persist one event's detail fields (fbSet + mirror into D) from its live editor. No toast, no render.
function travelPersistDetails(id){
  var ev=(D.travel||{})[id]; if(!ev) return false;
  var updates=travelReadDetails(id); if(!updates) return false;
  Object.keys(updates).forEach(function(k){ fbSet('travel/'+id+'/'+k, updates[k]); ev[k]=updates[k]; });
  return true;
}
// Persist every travel editor currently in the DOM. Call this first in any handler that re-renders, so
// unsaved edits on ALL cards (not just the one being acted on) survive the rebuild.
function travelFlushEditors(){
  var inputs=document.querySelectorAll('input[id^="tv-name-"]');
  Array.prototype.forEach.call(inputs,function(el){
    var id=el.id.slice('tv-name-'.length);
    if(id) travelPersistDetails(id);
  });
}
function travelAddEvent(){
  travelFlushEditors();
  var id=gi('tv');
  var rec={ name:'New Tournament', location:'', startDate:'', endDate:'', regUrl:'', deadline:'',
    costs:{}, formats:{twos:false,threes:false,fours:false}, lodgingOffered:false,
    scope:'both', announcedAt:null, createdAt:Date.now() };
  fbSet('travel/'+id, rec);
  if(!D.travel)D.travel={}; D.travel[id]=rec;
  renderTravel();
  toast('Tournament added');
}
function travelSaveDetails(id){
  var ev=(D.travel||{})[id]; if(!ev) return;
  travelFlushEditors(); // persists this card and any other open editor before the full rebuild
  renderTravel();
  toast('Tournament saved');
}
function travelDeleteEvent(id){
  if(!window.confirm('Delete this tournament? All signups, teams, rides, and paid status for it will be removed.')) return;
  travelFlushEditors();
  fbSet('travel/'+id, null);
  if(D.travel) delete D.travel[id];
  renderTravel();
  toast('Tournament deleted');
}
// ---- Itemized cost lines --------------------------------------------------
function travelAddCost(id){
  travelFlushEditors();
  var lid=gi('tc'); var rec={label:'New line', amount:0};
  fbSet('travel/'+id+'/costs/'+lid, rec);
  var ev=(D.travel||{})[id]; if(ev){ if(!ev.costs)ev.costs={}; ev.costs[lid]=rec; }
  renderTravel();
}
function travelSaveCost(id, lid){
  travelFlushEditors();
  var le=document.getElementById('tv-cost-label-'+id+'-'+lid);
  var ae=document.getElementById('tv-cost-amt-'+id+'-'+lid);
  var amt=ae?parseFloat(ae.value):0; if(!isFinite(amt))amt=0;
  var rec={ label:(le?le.value.trim():'')||'Line', amount:Math.round(amt*100)/100 };
  fbSet('travel/'+id+'/costs/'+lid, rec);
  var ev=(D.travel||{})[id]; if(ev){ if(!ev.costs)ev.costs={}; ev.costs[lid]=rec; }
  renderTravel();
}
function travelRemoveCost(id, lid){
  travelFlushEditors();
  fbSet('travel/'+id+'/costs/'+lid, null);
  var ev=(D.travel||{})[id]; if(ev&&ev.costs) delete ev.costs[lid];
  renderTravel();
}
// ---- Announce (reuse exec messaging) -------------------------------------
function travelAnnounce(id){
  travelFlushEditors(); // so the announcement uses the latest typed name, dates, and link even if unsaved
  var ev=(D.travel||{})[id]; if(!ev) return;
  var members=travelScopeMembers(ev.scope);
  if(!members.length){ toast('No members in the selected squads to announce to.'); return; }
  var scopeLabel=ev.scope==='gold'?'Gold':ev.scope==='garnet'?'Garnet':'Gold and Garnet';
  if(!window.confirm('Announce "'+(ev.name||'this tournament')+'" to '+members.length+' '+scopeLabel+' member'+(members.length===1?'':'s')+'?')) return;
  var total=travelCostTotal(ev);
  var when=(ev.startDate?tsReadableDate(ev.startDate):'');
  if(ev.endDate&&ev.endDate!==ev.startDate) when+=(when?' to ':'')+tsReadableDate(ev.endDate);
  var lines=[];
  lines.push('New travel tournament: '+(ev.name||'Tournament')+(ev.location?' in '+ev.location:'')+'.');
  if(when.trim()) lines.push('Dates: '+when.trim()+'.');
  if(total>0) lines.push('Cost is about $'+total+' per player.');
  if(ev.deadline) lines.push('Sign up by '+tsReadableDate(ev.deadline)+'.');
  if(ev.regUrl) lines.push('Register: '+ev.regUrl);
  lines.push('Open the app to join, form a team, or mark yourself a free agent.');
  execSendMessage(members.map(function(p){ return p.id; }), lines.join('\n'));
  var now=Date.now();
  fbSet('travel/'+id+'/announcedAt', now);
  ev.announcedAt=now;
  renderTravel();
}
// ---- Per-event paid toggle (exec-set; separate from club dues) ------------
function travelTogglePaid(id, mid){
  travelFlushEditors();
  var ev=(D.travel||{})[id]; if(!ev) return;
  if(!ev.paid) ev.paid={};
  if(travelIsPaid(id,mid)){ fbSet('travel/'+id+'/paid/'+mid, null); delete ev.paid[mid]; }
  else { var rec={paid:true, at:Date.now()}; fbSet('travel/'+id+'/paid/'+mid, rec); ev.paid[mid]=rec; }
  renderTravel();
}
function renderTravel(){
  const pane=document.getElementById('tab-travel'); if(!pane)return;
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nm=mid=>{const p=gP(mid);return p?((p.firstName||'')+' '+(p.lastName||'')).trim():String(mid);};
  const events=travelEvents();
  const eventsHtml=events.length?events.map(ev=>{
    const id=ev.id;
    const total=travelCostTotal(ev);
    const costs=ev.costs||{};
    const costRows=Object.keys(costs).length?Object.keys(costs).map(lid=>{
      const c=costs[lid]||{};
      return `<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
        <input class="form-input" id="tv-cost-label-${esc(id)}-${esc(lid)}" value="${esc(c.label||'')}" placeholder="Label" style="flex:1;min-width:0;padding:5px 7px;font-size:12px;">
        <span style="font-size:12px;color:var(--gray);">$</span>
        <input class="form-input" id="tv-cost-amt-${esc(id)}-${esc(lid)}" type="number" min="0" step="1" value="${c.amount!=null?esc(c.amount):''}" placeholder="0" style="width:74px;padding:5px 7px;font-size:12px;">
        <button class="btn btn-small btn-secondary" style="padding:3px 8px;font-size:10px;" onclick="travelSaveCost('${esc(id)}','${esc(lid)}')">Save</button>
        <button class="btn btn-small btn-danger" style="padding:3px 8px;font-size:10px;" onclick="travelRemoveCost('${esc(id)}','${esc(lid)}')">&times;</button>
      </div>`;
    }).join(''):'<div style="font-size:11px;color:var(--gray);padding:2px 0;">No cost lines yet.</div>';
    const parts=travelParticipants(id);
    const going=Object.keys(parts).filter(mid=>parts[mid]&&parts[mid].status==='in');
    const teams=travelTeams(id);
    const teamRows=Object.keys(teams).length?Object.keys(teams).map(tid=>{
      const t=teams[tid]||{}; const mem=t.members||{};
      const size=TRAVEL_FORMAT_SIZE[t.format]||0; const complete=travelTeamComplete(t);
      const memList=Object.keys(mem).map(mid=>esc(nm(mid))+(mem[mid]==='pending'?' (pending)':'')).join(', ');
      return `<div style="font-size:12px;color:var(--charcoal);padding:2px 0;">${esc(TRAVEL_FORMAT_LABEL[t.format]||t.format||'Team')}: ${memList||'empty'} <span style="color:${complete?'#217F7F':'var(--red)'};font-weight:700;">${complete?'complete':'incomplete ('+Object.keys(mem).length+'/'+size+')'}</span></div>`;
    }).join(''):'<div style="font-size:11px;color:var(--gray);">No teams formed yet.</div>';
    const freeAgents=going.filter(mid=>parts[mid].freeAgent&&!parts[mid].teamId);
    const drivers=going.filter(mid=>parts[mid].canDrive&&(parts[mid].seats||0)>0);
    const driverRows=drivers.length?drivers.map(mid=>{
      const seats=parts[mid].seats||0; const claimed=going.filter(x=>parts[x].rideWith===mid).length;
      return `<div style="font-size:12px;color:var(--charcoal);padding:2px 0;">${esc(nm(mid))}: ${Math.max(0,seats-claimed)} of ${seats} seats open</div>`;
    }).join(''):'<div style="font-size:11px;color:var(--gray);">No drivers yet.</div>';
    const lodgingList=ev.lodgingOffered?going.filter(mid=>parts[mid].lodging):[];
    const paidRows=going.length?going.map(mid=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:12px;">
        <span style="color:var(--charcoal);">${esc(nm(mid))}</span>
        <button class="btn btn-small ${travelIsPaid(id,mid)?'btn-secondary':'btn-danger'}" style="padding:2px 10px;font-size:10px;" onclick="travelTogglePaid('${esc(id)}','${esc(mid)}')">${travelIsPaid(id,mid)?'Paid':'Owes'}</button>
      </div>`).join(''):'<div style="font-size:11px;color:var(--gray);">No one signed up yet.</div>';
    const unaccounted=going.filter(mid=>{
      const p=parts[mid];
      const onTeam=p.teamId&&teams[p.teamId]&&travelTeamComplete(teams[p.teamId]);
      const hasRide=p.canDrive||p.rideWith;
      const needsLodging=ev.lodgingOffered&&!p.lodging;
      return !onTeam || !hasRide || needsLodging;
    });
    const unaccountedRows=unaccounted.length?unaccounted.map(mid=>{
      const p=parts[mid]; const gaps=[];
      if(!(p.teamId&&teams[p.teamId]&&travelTeamComplete(teams[p.teamId]))) gaps.push('no team');
      if(!(p.canDrive||p.rideWith)) gaps.push('no ride');
      if(ev.lodgingOffered&&!p.lodging) gaps.push('no lodging');
      return `<div style="font-size:12px;color:var(--charcoal);padding:2px 0;">${esc(nm(mid))} <span style="color:var(--red);">${gaps.join(', ')}</span></div>`;
    }).join(''):(going.length?'<div style="font-size:11px;color:#217F7F;">Everyone signed up is fully set.</div>':'<div style="font-size:11px;color:var(--gray);">No one signed up yet.</div>');
    const H=t=>`<div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--charcoal);margin:8px 0 4px;">${t}</div>`;
    return `<div style="border:1px solid var(--gray-lighter);border-radius:10px;padding:12px;margin-bottom:12px;">
      <input class="form-input" id="tv-name-${esc(id)}" value="${esc(ev.name||'')}" placeholder="Tournament name" style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:var(--charcoal);padding:6px 8px;width:100%;box-sizing:border-box;margin-bottom:6px;">
      <input class="form-input" id="tv-location-${esc(id)}" value="${esc(ev.location||'')}" placeholder="Location" style="padding:6px 8px;font-size:12px;width:100%;box-sizing:border-box;margin-bottom:6px;">
      <div class="form-row" style="margin-bottom:6px;">
        <div style="flex:1;min-width:0;"><label style="font-size:10px;color:var(--gray);">Start</label><input type="date" class="form-input" id="tv-start-${esc(id)}" value="${esc(ev.startDate||'')}" style="padding:5px 7px;font-size:12px;width:100%;box-sizing:border-box;"></div>
        <div style="flex:1;min-width:0;"><label style="font-size:10px;color:var(--gray);">End</label><input type="date" class="form-input" id="tv-end-${esc(id)}" value="${esc(ev.endDate||'')}" style="padding:5px 7px;font-size:12px;width:100%;box-sizing:border-box;"></div>
        <div style="flex:1;min-width:0;"><label style="font-size:10px;color:var(--gray);">Deadline</label><input type="date" class="form-input" id="tv-deadline-${esc(id)}" value="${esc(ev.deadline||'')}" style="padding:5px 7px;font-size:12px;width:100%;box-sizing:border-box;"></div>
      </div>
      <input class="form-input" id="tv-url-${esc(id)}" value="${esc(ev.regUrl||'')}" placeholder="Registration website link" style="padding:6px 8px;font-size:12px;width:100%;box-sizing:border-box;margin-bottom:6px;">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:6px;font-size:12px;color:var(--charcoal);">
        <span style="color:var(--gray);">Formats</span>
        <label style="display:inline-flex;align-items:center;gap:3px;"><input type="checkbox" id="tv-fmt-twos-${esc(id)}" ${ev.formats&&ev.formats.twos?'checked':''}> Twos</label>
        <label style="display:inline-flex;align-items:center;gap:3px;"><input type="checkbox" id="tv-fmt-threes-${esc(id)}" ${ev.formats&&ev.formats.threes?'checked':''}> Threes</label>
        <label style="display:inline-flex;align-items:center;gap:3px;"><input type="checkbox" id="tv-fmt-fours-${esc(id)}" ${ev.formats&&ev.formats.fours?'checked':''}> Fours</label>
        <label style="display:inline-flex;align-items:center;gap:3px;margin-left:8px;"><input type="checkbox" id="tv-lodging-${esc(id)}" ${ev.lodgingOffered?'checked':''}> Lodging offered</label>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;font-size:12px;color:var(--charcoal);">
        <span style="color:var(--gray);">Goes to</span>
        <select class="form-select" id="tv-scope-${esc(id)}" style="padding:5px 8px;font-size:12px;">
          <option value="gold"${ev.scope==='gold'?' selected':''}>Gold</option>
          <option value="garnet"${ev.scope==='garnet'?' selected':''}>Garnet</option>
          <option value="both"${(!ev.scope||ev.scope==='both')?' selected':''}>Both</option>
        </select>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">
        <button class="btn btn-small btn-secondary" style="padding:4px 12px;font-size:11px;" onclick="travelSaveDetails('${esc(id)}')">Save details</button>
        <button class="btn btn-small" style="padding:4px 12px;font-size:11px;background:#082A4F;color:#fff;border:none;" onclick="travelAnnounce('${esc(id)}')">Announce</button>
        <button class="btn btn-small btn-danger" style="padding:4px 12px;font-size:11px;" onclick="travelDeleteEvent('${esc(id)}')">Delete</button>
        <span style="font-size:11px;color:var(--gray);margin-left:auto;">${ev.announcedAt?('Announced '+esc(new Date(ev.announcedAt).toLocaleDateString())):'Not announced'}</span>
      </div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--charcoal);margin-bottom:4px;">COST PER PLAYER</div>
      ${costRows}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
        <button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="travelAddCost('${esc(id)}')">Add cost line</button>
        <span style="font-size:13px;font-weight:700;color:var(--charcoal);">Total $${total} per player</span>
      </div>
      <div style="border-top:1px solid var(--gray-lighter);margin-top:10px;padding-top:6px;">
        ${H('GOING ('+going.length+')')}<div style="font-size:12px;color:var(--charcoal);">${going.length?going.map(mid=>esc(nm(mid))).join(', '):'<span style="color:var(--gray);">No one has joined yet.</span>'}</div>
        ${H('TEAMS')}${teamRows}
        ${H('FREE AGENTS')}<div style="font-size:12px;color:var(--charcoal);">${freeAgents.length?freeAgents.map(mid=>esc(nm(mid))).join(', '):'<span style="color:var(--gray);">None.</span>'}</div>
        ${H('RIDES')}${driverRows}
        ${H('LODGING')}<div style="font-size:12px;color:var(--charcoal);">${ev.lodgingOffered?(lodgingList.length?lodgingList.map(mid=>esc(nm(mid))).join(', '):'<span style="color:var(--gray);">No one has requested lodging.</span>'):'<span style="color:var(--gray);">Lodging not offered.</span>'}</div>
        ${H('PAID (per event)')}${paidRows}
        <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1px;color:var(--red);margin:8px 0 4px;">UNACCOUNTED</div>${unaccountedRows}
      </div>
    </div>`;
  }).join(''):'<div style="font-size:12px;color:var(--gray);padding:6px 0;">No tournaments yet. Add one to get started.</div>';
  pane.innerHTML=`<div class="card"><div class="card-title"><span class="bar"></span> 🚌 Travel Tournaments</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
      <p style="font-size:11px;color:var(--gray);margin:0;flex:1;min-width:180px;">Create tournaments, itemize costs, set formats, and announce to a squad. Members join and form teams in their app.</p>
      <button class="btn btn-small btn-secondary" style="padding:4px 12px;font-size:11px;white-space:nowrap;" onclick="travelAddEvent()">Add tournament</button>
    </div>
    ${eventsHtml}
  </div>`;
}

// ============================================================
// Travel tournaments, member side (Grass Club). A member in an invited squad joins, forms a team or
// marks themselves a free agent, offers or claims a ride, requests lodging, and can withdraw. Every
// action writes the exact shapes the exec dashboard already reads (participants/teams under
// travel/{eventId}), so the two sides stay in sync with no new node and no rules change. Members
// cannot send email (that path is exec-only), so a teammate is "told" through the shared record:
// a pending invite shows in the invitee's own panel, and a withdrawal shows teammates an incomplete
// team. After the deadline members can see everything but can no longer join or change arrangements.
// ------------------------------------------------------------
function mtvEv(id){ return (D.travel||{})[id]; }
function mtvInScope(ev, tier){
  var tiers = ev.scope==='gold'?['gold']:ev.scope==='garnet'?['garnet']:['gold','garnet'];
  return tiers.indexOf(tier)>=0;
}
function mtvDeadlinePassed(ev){ return !!(ev&&ev.deadline && td()>ev.deadline); }
function mtvStandingBad(mid){ var st=(D.standing||{})[mid]; return !!(st&&st.good===false); }
// Mutation guard: no changes once the deadline is past. Returns true when the member may still act.
function mtvGuard(ev){
  if(!ev) return false;
  if(mtvDeadlinePassed(ev)){ toast('The signup deadline for this tournament has passed.'); return false; }
  return true;
}
// ---- write helpers (fbSet + local mirror so the UI updates before the echo) ----
function mtvWritePart(id,mid,rec){
  fbSet('travel/'+id+'/participants/'+mid, rec);
  var ev=mtvEv(id); if(ev){ if(!ev.participants)ev.participants={}; if(rec===null)delete ev.participants[mid]; else ev.participants[mid]=rec; }
}
function mtvSetPartField(id,mid,field,val){
  fbSet('travel/'+id+'/participants/'+mid+'/'+field, val);
  var ev=mtvEv(id); if(ev&&ev.participants&&ev.participants[mid]){ if(val===null)delete ev.participants[mid][field]; else ev.participants[mid][field]=val; }
}
function mtvWriteTeam(id,tid,rec){
  fbSet('travel/'+id+'/teams/'+tid, rec);
  var ev=mtvEv(id); if(ev){ if(!ev.teams)ev.teams={}; if(rec===null)delete ev.teams[tid]; else ev.teams[tid]=rec; }
}
function mtvSetTeamMember(id,tid,mid,val){
  fbSet('travel/'+id+'/teams/'+tid+'/members/'+mid, val);
  var ev=mtvEv(id); if(ev&&ev.teams&&ev.teams[tid]){ if(!ev.teams[tid].members)ev.teams[tid].members={}; if(val===null)delete ev.teams[tid].members[mid]; else ev.teams[tid].members[mid]=val; }
}
// Remove me from a team; if no accepted member is left, the team dissolves.
function mtvRemoveMeFromTeam(id,tid){
  var ev=mtvEv(id); var t=ev&&ev.teams&&ev.teams[tid]; if(!t) return;
  mtvSetTeamMember(id,tid,currentPlayerId,null);
  var mem=((mtvEv(id).teams||{})[tid]||{}).members||{};
  var anyAccepted=Object.keys(mem).some(function(k){ return mem[k]==='accepted'; });
  if(!anyAccepted) mtvWriteTeam(id,tid,null);
}
// ---- member actions ----
function mtvJoin(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  if(mtvStandingBad(currentPlayerId)){ var st=(D.standing||{})[currentPlayerId]; toast('You are not in good standing. '+((st&&st.note)||'Talk to an exec.')); return; }
  mtvWritePart(id,currentPlayerId,{status:'in',freeAgent:false,teamId:null,canDrive:false,seats:0,rideWith:null,lodging:false,at:Date.now()});
  toast('You are in. Form a team or mark yourself a free agent.');
  renderMemberTravel();
}
function mtvDecline(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  mtvWritePart(id,currentPlayerId,{status:'declined',at:Date.now()});
  renderMemberTravel();
}
function mtvFormTeam(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  var fmtEl=document.getElementById('mtv-fmt-'+id); var fmt=fmtEl?fmtEl.value:'';
  if(!fmt){ toast('Pick a format first.'); return; }
  var size=TRAVEL_FORMAT_SIZE[fmt]||0;
  var invited=[]; var parts=(ev.participants||{});
  Object.keys(parts).forEach(function(mid){ var cb=document.getElementById('mtv-inv-'+id+'-'+mid); if(cb&&cb.checked) invited.push(mid); });
  if(1+invited.length>size){ toast('That is more players than a '+TRAVEL_FORMAT_LABEL[fmt]+' team holds ('+size+').'); return; }
  var tid=gi('tvt');
  var members={}; members[currentPlayerId]='accepted'; invited.forEach(function(mid){ members[mid]='pending'; });
  mtvWriteTeam(id,tid,{format:fmt,createdBy:currentPlayerId,members:members,createdAt:Date.now()});
  mtvSetPartField(id,currentPlayerId,'teamId',tid);
  mtvSetPartField(id,currentPlayerId,'freeAgent',false);
  toast(invited.length?'Team created. Invites stay pending until each player confirms.':'Team created. Invite players to fill it.');
  renderMemberTravel();
}
function mtvInvite(id,tid,mid){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  var t=(ev.teams||{})[tid]; if(!t) return;
  var size=TRAVEL_FORMAT_SIZE[t.format]||0;
  if(Object.keys(t.members||{}).length>=size){ toast('This team is already full.'); return; }
  mtvSetTeamMember(id,tid,mid,'pending');
  renderMemberTravel();
}
function mtvCancelInvite(id,tid,mid){
  if(!mtvGuard(mtvEv(id))) return;
  mtvSetTeamMember(id,tid,mid,null);
  renderMemberTravel();
}
function mtvAcceptInvite(id,tid){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  if(mtvStandingBad(currentPlayerId)){ var st=(D.standing||{})[currentPlayerId]; toast('You are not in good standing. '+((st&&st.note)||'Talk to an exec.')); return; }
  var part=(ev.participants||{})[currentPlayerId];
  if(part&&part.teamId&&part.teamId!==tid) mtvRemoveMeFromTeam(id,part.teamId);
  if(!part||part.status!=='in') mtvWritePart(id,currentPlayerId,{status:'in',freeAgent:false,teamId:tid,canDrive:false,seats:0,rideWith:null,lodging:false,at:Date.now()});
  else { mtvSetPartField(id,currentPlayerId,'teamId',tid); mtvSetPartField(id,currentPlayerId,'freeAgent',false); }
  mtvSetTeamMember(id,tid,currentPlayerId,'accepted');
  toast('You joined the team.');
  renderMemberTravel();
}
function mtvDeclineInvite(id,tid){
  if(!mtvGuard(mtvEv(id))) return;
  mtvSetTeamMember(id,tid,currentPlayerId,null);
  renderMemberTravel();
}
function mtvLeaveTeam(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  var part=(ev.participants||{})[currentPlayerId]; var tid=part&&part.teamId; if(!tid) return;
  mtvRemoveMeFromTeam(id,tid);
  mtvSetPartField(id,currentPlayerId,'teamId',null);
  toast('You left the team. Your teammates can see it is no longer complete.');
  renderMemberTravel();
}
function mtvSetFreeAgent(id,on){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  mtvSetPartField(id,currentPlayerId,'freeAgent',!!on);
  renderMemberTravel();
}
function mtvSaveDriving(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  var drv=document.getElementById('mtv-drive-'+id); var canDrive=!!(drv&&drv.checked);
  var seatsEl=document.getElementById('mtv-seats-'+id);
  var seats=canDrive?Math.max(0,parseInt((seatsEl&&seatsEl.value)||'0',10)||0):0;
  if(canDrive) mtvSetPartField(id,currentPlayerId,'rideWith',null); // a driver does not also ride with someone
  mtvSetPartField(id,currentPlayerId,'canDrive',canDrive);
  mtvSetPartField(id,currentPlayerId,'seats',seats);
  if(!canDrive){ // no longer driving: release anyone who had claimed a seat from me
    var parts=(mtvEv(id).participants)||{};
    Object.keys(parts).forEach(function(x){ if(parts[x].rideWith===currentPlayerId) mtvSetPartField(id,x,'rideWith',null); });
  }
  toast('Ride info saved.');
  renderMemberTravel();
}
function mtvClaimSeat(id,driverId){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  var parts=(ev.participants||{}); var driver=parts[driverId];
  if(!driver||!driver.canDrive){ toast('That driver is not offering a ride right now.'); return; }
  var seats=driver.seats||0;
  var claimed=Object.keys(parts).filter(function(x){ return parts[x].rideWith===driverId; }).length;
  if(claimed>=seats){ toast('That car is full.'); return; }
  mtvSetPartField(id,currentPlayerId,'canDrive',false);
  mtvSetPartField(id,currentPlayerId,'seats',0);
  mtvSetPartField(id,currentPlayerId,'rideWith',driverId);
  renderMemberTravel();
}
function mtvReleaseSeat(id){
  if(!mtvGuard(mtvEv(id))) return;
  mtvSetPartField(id,currentPlayerId,'rideWith',null);
  renderMemberTravel();
}
function mtvSetLodging(id,on){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  if(!ev.lodgingOffered) return;
  mtvSetPartField(id,currentPlayerId,'lodging',!!on);
  renderMemberTravel();
}
function mtvWithdraw(id){
  var ev=mtvEv(id); if(!mtvGuard(ev)) return;
  if(!window.confirm('Withdraw from this tournament? This frees your seat and lodging and removes you from your team.')) return;
  var part=(ev.participants||{})[currentPlayerId]||{};
  if(part.teamId) mtvRemoveMeFromTeam(id,part.teamId);           // removes me; teammates now see an incomplete team
  var parts=(mtvEv(id).participants)||{};
  Object.keys(parts).forEach(function(x){ if(parts[x].rideWith===currentPlayerId) mtvSetPartField(id,x,'rideWith',null); }); // free my riders
  mtvWritePart(id,currentPlayerId,null);                          // removes me from GOING, frees my claimed seat and lodging
  toast('You have withdrawn from this tournament.');
  renderMemberTravel();
}
function renderMemberTravel(){
  var pane=document.getElementById('pp-panel-travel'); if(!pane) return;
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); };
  var nm=function(mid){ var p=gP(mid); return p?((p.firstName||'')+' '+(p.lastName||'')).trim():String(mid); };
  var me=currentPlayerId; var meP=gP(me);
  if(!meP){ pane.innerHTML='<div class="card"><div style="font-size:13px;color:var(--gray);padding:8px;">Travel is not available right now.</div></div>'; return; }
  var myTier=meP.tier;
  var st=(D.standing||{})[me]; var bad=!!(st&&st.good===false);
  var standingBanner=bad?('<div class="card" style="border:2px solid var(--red);margin-bottom:12px;"><div style="font-family:\'Bebas Neue\';font-size:14px;letter-spacing:1px;color:var(--red);margin-bottom:4px;">Not in good standing</div><div style="font-size:13px;color:var(--charcoal);line-height:1.5;">'+esc((st&&st.note)||'')+'</div><div style="font-size:12px;color:var(--gray);margin-top:6px;">You cannot join a travel tournament until this is resolved.</div></div>'):'';
  var events=travelEvents().filter(function(ev){ return ev.announcedAt && mtvInScope(ev,myTier); });
  if(!events.length){
    pane.innerHTML='<div class="card"><div class="card-title"><span class="bar"></span> 🚌 Travel Tournaments</div>'+standingBanner+'<div style="font-size:13px;color:var(--gray);padding:6px 0;">No travel tournaments for your squad yet. When an exec announces one, it shows up here.</div></div>';
    return;
  }
  var H=function(t){ return '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:12px;letter-spacing:1px;color:var(--charcoal);margin:10px 0 4px;">'+t+'</div>'; };
  var cards=events.map(function(ev){
    var id=ev.id; var parts=ev.participants||{}; var teams=ev.teams||{};
    var mine=parts[me]; var joined=!!(mine&&mine.status==='in');
    var declined=!!(mine&&mine.status==='declined');
    var locked=mtvDeadlinePassed(ev);
    var total=travelCostTotal(ev);
    var going=Object.keys(parts).filter(function(x){ return parts[x].status==='in'; });
    // header
    var when=ev.startDate?tsReadableDate(ev.startDate):'';
    if(ev.endDate&&ev.endDate!==ev.startDate) when+=(when?' to ':'')+tsReadableDate(ev.endDate);
    var costRows=Object.keys(ev.costs||{}).map(function(lid){ var c=ev.costs[lid]||{}; return '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--charcoal);padding:1px 0;"><span>'+esc(c.label||'')+'</span><span>$'+esc(c.amount!=null?c.amount:0)+'</span></div>'; }).join('');
    var header='<div style="font-family:\'Bebas Neue\',sans-serif;font-size:18px;letter-spacing:1px;color:var(--charcoal);">'+esc(ev.name||'Tournament')+'</div>'
      +(ev.location?'<div style="font-size:13px;color:var(--charcoal);">'+esc(ev.location)+'</div>':'')
      +(when.trim()?'<div style="font-size:13px;color:var(--charcoal);">'+esc(when.trim())+'</div>':'')
      +(ev.deadline?'<div style="font-size:12px;color:'+(locked?'var(--red)':'var(--gray)')+';">Sign up by '+esc(tsReadableDate(ev.deadline))+(locked?' (closed)':'')+'</div>':'')
      +(ev.regUrl?'<div style="font-size:12px;margin-top:2px;"><a href="'+esc(ev.regUrl)+'" target="_blank" rel="noopener" style="color:#082A4F;">Registration link</a></div>':'')
      +(costRows?('<div style="border-top:1px solid var(--gray-lighter);margin-top:6px;padding-top:4px;">'+costRows+'<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:var(--charcoal);margin-top:2px;"><span>Total per player</span><span>$'+esc(total)+'</span></div></div>'):'');
    // my action area
    var body='';
    if(locked && !joined){
      body='<div style="font-size:12px;color:var(--gray);margin-top:8px;">Signups are closed. '+(declined?'You declined this one.':'You did not sign up.')+'</div>';
    } else if(!joined){
      if(bad){
        body='<div style="font-size:12px;color:var(--red);margin-top:8px;">Resolve your standing above to join.</div>';
      } else {
        body='<div style="display:flex;gap:8px;margin-top:10px;">'
          +'<button class="btn btn-small" style="flex:1;background:#082A4F;color:#fff;border:none;padding:7px;font-size:12px;" onclick="mtvJoin(\''+id+'\')">Join</button>'
          +'<button class="btn btn-small btn-secondary" style="flex:1;padding:7px;font-size:12px;" onclick="mtvDecline(\''+id+'\')">Decline</button>'
          +'</div>'+(declined?'<div style="font-size:11px;color:var(--gray);margin-top:4px;">You declined. You can still join before the deadline.</div>':'');
      }
    } else {
      // joined: team, ride, lodging, withdraw
      var myTeamId=mine.teamId; var myTeam=myTeamId?teams[myTeamId]:null;
      // incoming invites (pending on a team I did not accept)
      var invites=Object.keys(teams).filter(function(tid){ return (teams[tid].members||{})[me]==='pending'; });
      var inviteHtml=invites.map(function(tid){
        var t=teams[tid]; var mates=Object.keys(t.members||{}).map(function(x){ return esc(nm(x))+((t.members[x]==='pending')?' (pending)':''); }).join(', ');
        return '<div style="border:1px solid var(--gray-lighter);border-radius:8px;padding:8px;margin-bottom:6px;font-size:12px;">'
          +'<div style="color:var(--charcoal);margin-bottom:6px;">'+esc(nm(t.createdBy))+' invited you to a '+esc(TRAVEL_FORMAT_LABEL[t.format]||t.format||'')+' team ('+mates+').</div>'
          +(locked?'<div style="font-size:11px;color:var(--gray);">Signups are closed.</div>':'<div style="display:flex;gap:6px;"><button class="btn btn-small" style="background:#217F7F;color:#fff;border:none;padding:4px 10px;font-size:11px;" onclick="mtvAcceptInvite(\''+id+'\',\''+tid+'\')">Accept</button><button class="btn btn-small btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="mtvDeclineInvite(\''+id+'\',\''+tid+'\')">Decline</button></div>')
          +'</div>';
      }).join('');
      // team block
      var teamHtml='';
      if(myTeam){
        var size=TRAVEL_FORMAT_SIZE[myTeam.format]||0; var complete=travelTeamComplete(myTeam);
        var memRows=Object.keys(myTeam.members||{}).map(function(x){
          var pend=myTeam.members[x]==='pending';
          var canCancel=(myTeam.createdBy===me)&&pend&&!locked;
          return '<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--charcoal);padding:2px 0;"><span>'+esc(nm(x))+(pend?' <span style="color:var(--gray);">(pending)</span>':'')+(x===myTeam.createdBy?' <span style="color:var(--gray);">(captain)</span>':'')+'</span>'+(canCancel?'<button class="btn btn-small btn-secondary" style="padding:1px 8px;font-size:10px;" onclick="mtvCancelInvite(\''+id+'\',\''+myTeamId+'\',\''+x+'\')">Cancel</button>':'')+'</div>';
        }).join('');
        // captain can invite more until full
        var addHtml='';
        if(myTeam.createdBy===me && !locked && Object.keys(myTeam.members||{}).length<size){
          var avail=going.filter(function(x){ return x!==me && !Object.keys(teams).some(function(tid){ return (teams[tid].members||{})[x]==='accepted'; }) && !(myTeam.members||{})[x]; });
          addHtml=avail.length?('<div style="margin-top:6px;">'+avail.map(function(x){ return '<button class="btn btn-small btn-secondary" style="padding:3px 9px;font-size:11px;margin:0 4px 4px 0;" onclick="mtvInvite(\''+id+'\',\''+myTeamId+'\',\''+x+'\')">+ '+esc(nm(x))+'</button>'; }).join('')+'</div>'):'<div style="font-size:11px;color:var(--gray);margin-top:4px;">No one else is available to invite yet.</div>';
        }
        teamHtml='<div style="border:1px solid var(--gray-lighter);border-radius:8px;padding:8px;">'
          +'<div style="font-size:12px;color:var(--charcoal);margin-bottom:4px;">'+esc(TRAVEL_FORMAT_LABEL[myTeam.format]||myTeam.format||'Team')+' team &middot; <span style="color:'+(complete?'#217F7F':'var(--red)')+';font-weight:700;">'+(complete?'complete':'incomplete ('+Object.keys(myTeam.members||{}).length+'/'+size+')')+'</span></div>'
          +memRows+addHtml
          +(locked?'':'<div style="margin-top:6px;"><button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="mtvLeaveTeam(\''+id+'\')">Leave team</button></div>');
      } else if(!locked){
        // form a team or free agent
        var fmtOpts=Object.keys(TRAVEL_FORMAT_SIZE).filter(function(f){ return ev.formats&&ev.formats[f]; });
        if(!fmtOpts.length) fmtOpts=Object.keys(TRAVEL_FORMAT_SIZE);
        var avail2=going.filter(function(x){ return x!==me && !Object.keys(teams).some(function(tid){ return (teams[tid].members||{})[x]==='accepted'; }); });
        teamHtml='<div style="border:1px dashed var(--gray-lighter);border-radius:8px;padding:8px;">'
          +'<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px;font-size:12px;color:var(--charcoal);"><span>Form a team:</span><select id="mtv-fmt-'+id+'" class="form-select" style="padding:4px 8px;font-size:12px;">'+fmtOpts.map(function(f){ return '<option value="'+f+'">'+esc(TRAVEL_FORMAT_LABEL[f])+' ('+TRAVEL_FORMAT_SIZE[f]+')</option>'; }).join('')+'</select></div>'
          +(avail2.length?('<div style="font-size:11px;color:var(--gray);margin-bottom:4px;">Invite teammates (they confirm before the team counts):</div><div style="margin-bottom:6px;">'+avail2.map(function(x){ return '<label style="display:inline-flex;align-items:center;gap:4px;font-size:12px;margin:0 10px 4px 0;"><input type="checkbox" id="mtv-inv-'+id+'-'+x+'"> '+esc(nm(x))+'</label>'; }).join('')+'</div>'):'<div style="font-size:11px;color:var(--gray);margin-bottom:6px;">No teammates have joined yet. You can create the team and invite them once they do.</div>')
          +'<button class="btn btn-small" style="background:#082A4F;color:#fff;border:none;padding:5px 12px;font-size:11px;" onclick="mtvFormTeam(\''+id+'\')">Create team</button>'
          +'<div style="border-top:1px solid var(--gray-lighter);margin-top:8px;padding-top:8px;font-size:12px;color:var(--charcoal);">'
          +(mine.freeAgent?'You are listed as a free agent looking for a team. <button class="btn btn-small btn-secondary" style="padding:2px 8px;font-size:10px;margin-left:4px;" onclick="mtvSetFreeAgent(\''+id+'\',false)">Remove</button>':'<button class="btn btn-small btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="mtvSetFreeAgent(\''+id+'\',true)">I am a free agent</button>')
          +'</div></div>';
      } else {
        teamHtml='<div style="font-size:12px;color:var(--gray);">You are not on a team.</div>';
      }
      // rides
      var rideHtml='';
      var iAmRider=!!mine.rideWith;
      if(iAmRider){
        rideHtml='<div style="font-size:12px;color:var(--charcoal);">Riding with '+esc(nm(mine.rideWith))+'. '+(locked?'':'<button class="btn btn-small btn-secondary" style="padding:2px 8px;font-size:10px;margin-left:4px;" onclick="mtvReleaseSeat(\''+id+'\')">Release seat</button>')+'</div>';
      } else {
        var drivers=going.filter(function(x){ return x!==me && parts[x].canDrive && (parts[x].seats||0)>0; });
        var driverList=drivers.map(function(x){
          var open=Math.max(0,(parts[x].seats||0)-going.filter(function(y){ return parts[y].rideWith===x; }).length);
          return '<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--charcoal);padding:2px 0;"><span>'+esc(nm(x))+' &middot; '+open+' seat'+(open===1?'':'s')+' open</span>'+((open>0&&!locked&&!mine.canDrive)?'<button class="btn btn-small btn-secondary" style="padding:2px 8px;font-size:10px;" onclick="mtvClaimSeat(\''+id+'\',\''+x+'\')">Claim seat</button>':'')+'</div>';
        }).join('');
        rideHtml='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;font-size:12px;color:var(--charcoal);">'
          +'<label style="display:inline-flex;align-items:center;gap:4px;"><input type="checkbox" id="mtv-drive-'+id+'" '+(mine.canDrive?'checked':'')+' '+(locked?'disabled':'')+'> I can drive</label>'
          +'<span>Seats <input type="number" id="mtv-seats-'+id+'" min="0" step="1" value="'+esc(mine.seats||0)+'" '+(locked?'disabled':'')+' style="width:56px;padding:3px 6px;font-size:12px;border:1px solid var(--gray-lighter);border-radius:6px;"></span>'
          +(locked?'':'<button class="btn btn-small btn-secondary" style="padding:3px 10px;font-size:11px;" onclick="mtvSaveDriving(\''+id+'\')">Save</button>')
          +'</div>'
          +(driverList?('<div style="border-top:1px solid var(--gray-lighter);padding-top:4px;">'+driverList+'</div>'):'<div style="font-size:11px;color:var(--gray);">No one is offering a ride yet.</div>');
      }
      // lodging
      var lodgingHtml=ev.lodgingOffered?('<label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--charcoal);"><input type="checkbox" '+(mine.lodging?'checked':'')+' '+(locked?'disabled':'')+' onchange="mtvSetLodging(\''+id+'\',this.checked)"> Request lodging</label>'):'<div style="font-size:12px;color:var(--gray);">Lodging is not offered for this tournament.</div>';
      body='<div style="margin-top:10px;">'
        +'<div style="font-size:12px;color:#217F7F;font-weight:700;margin-bottom:4px;">You are going.</div>'
        +(inviteHtml?H('TEAM INVITES')+inviteHtml:'')
        +H('YOUR TEAM')+teamHtml
        +H('RIDE')+rideHtml
        +H('LODGING')+lodgingHtml
        +(locked?'<div style="font-size:11px;color:var(--gray);margin-top:8px;">Signups are closed. You can still see everything but can no longer make changes.</div>':'<div style="margin-top:10px;"><button class="btn btn-small btn-danger" style="padding:4px 12px;font-size:11px;" onclick="mtvWithdraw(\''+id+'\')">Withdraw</button></div>')
        +'</div>';
    }
    // roster visibility (everyone going, free agents) so members can coordinate
    var freeAgents=going.filter(function(x){ return parts[x].freeAgent&&!parts[x].teamId; });
    var roster=H('WHO IS GOING ('+going.length+')')+'<div style="font-size:12px;color:var(--charcoal);">'+(going.length?going.map(function(x){ return esc(nm(x)); }).join(', '):'<span style="color:var(--gray);">No one yet.</span>')+'</div>'
      +H('FREE AGENTS')+'<div style="font-size:12px;color:var(--charcoal);">'+(freeAgents.length?freeAgents.map(function(x){ return esc(nm(x)); }).join(', '):'<span style="color:var(--gray);">None.</span>')+'</div>';
    return '<div style="border:1px solid var(--gray-lighter);border-radius:10px;padding:12px;margin-bottom:12px;">'+header+body+'<div style="border-top:1px solid var(--gray-lighter);margin-top:10px;padding-top:2px;">'+roster+'</div></div>';
  }).join('');
  pane.innerHTML='<div class="card"><div class="card-title"><span class="bar"></span> 🚌 Travel Tournaments</div>'+standingBanner+cards+'</div>';
}

// ---- Good standing (Grass Club) ------------------------------------------
// Exec marks a member not in good standing with a note; the member sees it and cannot join travel.
// Clearing returns them to good standing. Stored at standing/{memberId}, a sub-key of the *_matches
// node the live rule already governs (no new node, no rules change). Absent = good standing.
function standingEditorHtml(pid){
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); };
  var st=(D.standing||{})[pid]; var bad=!!(st&&st.good===false); var note=bad?(st.note||''):'';
  return '<div style="font-family:\'Bebas Neue\';font-size:16px;letter-spacing:1px;color:var(--gray);margin-bottom:8px;">🏅 Good Standing</div>'
    +'<div id="cpm-standing-status" style="font-size:13px;font-weight:700;margin-bottom:8px;color:'+(bad?'var(--red)':'#217F7F')+';">'+(bad?'Not in good standing':'In good standing')+'</div>'
    +'<input type="text" id="cpm-standing-note" class="form-input" placeholder="What the member needs to do (e.g. pay dues, return gear)" value="'+esc(note)+'" style="width:100%;box-sizing:border-box;padding:8px;font-size:13px;margin-bottom:8px;">'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;">'
    +'<button class="btn btn-small btn-danger" style="padding:5px 12px;font-size:11px;" onclick="coachSetStanding(\''+pid+'\')">Mark not in good standing</button>'
    +'<button class="btn btn-small btn-secondary" style="padding:5px 12px;font-size:11px;" onclick="coachClearStanding(\''+pid+'\')">Clear (good standing)</button>'
    +'</div>'
    +'<div style="font-size:11px;color:var(--gray);margin-top:6px;">A member not in good standing cannot join a travel tournament and sees this note. No other member sees it.</div>';
}
function coachSetStanding(pid){
  var noteEl=document.getElementById('cpm-standing-note');
  var note=noteEl?noteEl.value.trim():'';
  if(!note){ toast('Add a short note saying what the member needs to do.'); return; }
  var rec={good:false,note:note,at:Date.now()};
  fbSet('standing/'+pid, rec);
  if(!D.standing)D.standing={}; D.standing[pid]=rec;
  var sb=document.getElementById('cpm-standing-block'); if(sb) sb.innerHTML=standingEditorHtml(pid);
  toast('Marked not in good standing.');
}
function coachClearStanding(pid){
  fbSet('standing/'+pid, null);
  if(D.standing)delete D.standing[pid];
  var sb=document.getElementById('cpm-standing-block'); if(sb) sb.innerHTML=standingEditorHtml(pid);
  toast('Cleared. Member is in good standing.');
}

// ---- Weekly practice schedule (Grass Club) -------------------------------
// A fixed weekly schedule per squad for the semester, persisted under DB_ROOT/practiceSchedule/{tier}
// (a sub-key of the *_matches node the live rule already governs; no new node, no rules change).
//   practiceSchedule/{gold|garnet} = { days:['Mon','Wed'], time:'H:MM AM/PM', location, updatedAt:ms }
// The time control mirrors the tryout session form (hour, minute, AM/PM); location defaults to the
// same club field. No one is notified on a change; execs message the club if something moves.
var PS_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var PS_LOC_DEFAULT='FSU Main Campus Fields';
function psSchedule(tier){ return ((D.practiceSchedule||{})[tier])||{}; }
function psTimeSelects(tier, stored){
  var tp=/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(stored||'').trim());
  var th=tp?String(parseInt(tp[1],10)):'', tmn=tp?tp[2]:'', ap=tp?tp[3].toUpperCase():'';
  var hourOpts='<option value="">Hour</option>';
  for(var h=1;h<=12;h++){ hourOpts+='<option value="'+h+'"'+(th===String(h)?' selected':'')+'>'+h+'</option>'; }
  var minOpts=['00','15','30','45'].map(function(mm){ return '<option value="'+mm+'"'+(tmn===mm?' selected':'')+'>'+mm+'</option>'; }).join('');
  var apOpts=['AM','PM'].map(function(x){ return '<option value="'+x+'"'+(ap===x?' selected':'')+'>'+x+'</option>'; }).join('');
  return '<div style="display:flex;gap:4px;align-items:center;">'
    +'<select class="form-select" id="ps-th-'+tier+'" style="padding:6px 4px;font-size:12px;">'+hourOpts+'</select>'
    +'<span style="font-size:12px;color:var(--gray);">:</span>'
    +'<select class="form-select" id="ps-tm-'+tier+'" style="padding:6px 4px;font-size:12px;">'+minOpts+'</select>'
    +'<select class="form-select" id="ps-tap-'+tier+'" style="padding:6px 4px;font-size:12px;">'+apOpts+'</select>'
    +'</div>';
}
function psComposeTime(tier){
  var g=function(id){ var el=document.getElementById(id); return el?el.value:''; };
  var th=g('ps-th-'+tier);
  return th===''?'':(th+':'+(g('ps-tm-'+tier)||'00')+' '+(g('ps-tap-'+tier)||'AM'));
}
function psReadDays(tier){
  return PS_DAYS.filter(function(d){ var el=document.getElementById('ps-day-'+tier+'-'+d); return el&&el.checked; });
}
function psSaveSchedule(tier){
  if(tier!=='gold'&&tier!=='garnet') return;
  var locEl=document.getElementById('ps-loc-'+tier);
  var rec={ days:psReadDays(tier), time:psComposeTime(tier), location:locEl?locEl.value.trim():'', updatedAt:Date.now() };
  fbSet('practiceSchedule/'+tier, rec);
  if(!D.practiceSchedule)D.practiceSchedule={}; D.practiceSchedule[tier]=rec;
  renderTeamAnalysis();
  toast((tier==='gold'?'Gold':'Garnet')+' practice schedule saved');
}
// One readable line: "Mon, Wed, Fri at 6:00 PM, FSU Main Campus Fields". Parts omitted if unset.
function psScheduleText(sched){
  if(!sched) return '';
  var days=Array.isArray(sched.days)?sched.days:[];
  var s=days.length?days.join(', '):'';
  if(sched.time) s+=(s?' at ':'at ')+sched.time;
  if(sched.location) s+=(s?', ':'')+sched.location;
  return s.trim();
}
// Exec editor for both squads, shown at the top of the Practice tab (club only).
function practiceScheduleEditorHtml(){
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); };
  var sq=function(tier,label,color){
    var sched=psSchedule(tier);
    var days=Array.isArray(sched.days)?sched.days:[];
    var loc=(sched.location!=null)?sched.location:PS_LOC_DEFAULT;
    var dayBoxes=PS_DAYS.map(function(d){
      var on=days.indexOf(d)>=0;
      return '<label style="display:inline-flex;align-items:center;gap:3px;font-size:11px;color:var(--charcoal);margin-right:6px;margin-bottom:4px;"><input type="checkbox" id="ps-day-'+tier+'-'+d+'"'+(on?' checked':'')+'> '+d+'</label>';
    }).join('');
    return '<div style="border:1px solid var(--gray-lighter);border-radius:8px;padding:10px 12px;margin-bottom:10px;">'
      +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:1px;color:'+color+';margin-bottom:6px;">'+label+' squad</div>'
      +'<div style="display:flex;flex-wrap:wrap;margin-bottom:8px;">'+dayBoxes+'</div>'
      +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;"><span style="font-size:12px;color:var(--gray);">Time</span>'+psTimeSelects(tier, sched.time)+'</div>'
      +'<input class="form-input" id="ps-loc-'+tier+'" value="'+esc(loc)+'" placeholder="Location" style="padding:6px 8px;font-size:12px;width:100%;box-sizing:border-box;margin-bottom:8px;">'
      +'<button class="btn btn-small btn-secondary" style="padding:3px 12px;font-size:11px;" onclick="psSaveSchedule(\''+tier+'\')">Save '+label+' schedule</button>'
      +'</div>';
  };
  return '<div class="card"><div class="card-title"><span class="bar"></span> 🗓️ Weekly Practice Schedule</div>'
    +'<p style="font-size:11px;color:var(--gray);margin-bottom:10px;">Set each squad\'s weekly practice. Members see their own squad\'s schedule in the app. No one is notified on changes.</p>'
    +sq('gold','Gold','#8a6d2b')
    +sq('garnet','Garnet','#782F40')
    +'</div>';
}
// The member's own squad practice card for the player portal.
function memberPracticeHtml(p){
  if(!(SC.tiersEnabled && p && (p.tier==='gold'||p.tier==='garnet'))) return '';
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); };
  var squad=p.tier==='gold'?'Gold':'Garnet';
  var txt=psScheduleText(psSchedule(p.tier));
  return '<div class="card" style="padding:12px 14px;margin-top:10px;">'
    +'<div style="font-family:\'Bebas Neue\';font-size:13px;letter-spacing:1px;color:var(--charcoal);margin-bottom:6px;">Your Practice Schedule</div>'
    +'<div style="font-size:13px;margin-bottom:4px;">You are on the <span class="tier-badge tier-'+p.tier+'">'+squad+'</span> squad.</div>'
    +(txt?'<div style="font-size:13px;color:var(--charcoal);line-height:1.5;">'+esc(txt)+'</div>':'<div style="font-size:12px;color:var(--gray);">Your practice schedule will be posted soon.</div>')
    +'</div>';
}
function renderTeamAnalysis(){
  // Club renders into tab-teamanalysis; HS renders the same analysis into the Practice destination mount.
  const pane=document.getElementById(SC.tiersEnabled?'tab-teamanalysis':'tab-practice');
  if(!pane)return;
  const tierLabel=t=>t==='gold'?'Gold':'Garnet';
  // HS (no tiers) analyzes the whole roster with no Gold/Garnet picker and a neutral team label; the club path is unchanged.
  const teamHead=SC.tiersEnabled?(tierLabel(analysisTier)+' team'):(analysisTier==='development'?'Development':analysisTier==='roster'?'Roster':(SC.displayName||SC.schoolName||'Your team'));
  const picker=SC.tiersEnabled?(`<div style="display:flex;gap:8px;margin-bottom:12px;" id="ta-tier-toggle">`+
    [['gold','Gold'],['garnet','Garnet']].map(([v,lbl])=>
      `<button class="filter-btn${analysisTier===v?' active':''}" onclick="setAnalysisTier('${v}')" style="flex:1;text-align:center;">${lbl}</button>`).join('')+
    `</div>`):(`<div style="display:flex;gap:8px;margin-bottom:12px;" id="ta-hs-toggle">`+
    [['all','Team'],['development','Development'],['roster','Roster']].map(([v,lbl])=>
      `<button class="filter-btn${analysisTier===v?' active':''}" onclick="setAnalysisTier('${v}')" style="flex:1;text-align:center;">${lbl}</button>`).join('')+
    `</div>`);
  const a=analyzeTierSkills(analysisTier);
  let body;
  if(!tierDataSufficient(a)){
    body=`<p style="color:var(--gray);font-size:13px;padding:10px 0;line-height:1.5;">Not enough assessment data yet to analyze this team. Complete more skill assessments first.</p>`;
  }else{
    // Weakest assessed first. The lowest few are flagged as the collective weak spots.
    const ranked=[...a.assessedSkills].sort((x,y)=>x.avg-y.avg);
    const weakCount=Math.min(3,ranked.length);
    const weakKeys=new Set(ranked.slice(0,weakCount).map(s=>s.key));
    const rows=ranked.map(s=>{
      const weak=weakKeys.has(s.key);
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--gray-lighter);font-size:13px;${weak?'font-weight:700;color:var(--loss-red);':'color:var(--charcoal);'}">
        <span>${s.label}${weak?' (weak spot)':''}</span>
        <span>${s.avg.toFixed(1)} <span style="color:var(--gray);font-weight:400;">(${s.assessedCount} assessed)</span></span>
      </div>`;
    }).join('');
    body=`<div style="font-size:12px;color:var(--gray);margin-bottom:8px;">${teamHead}: ${a.playerCount} player${a.playerCount===1?'':'s'}, skill averages weakest first (assessed scores only).</div>
      <div style="margin-bottom:12px;">${rows}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-small" style="flex:1;min-width:160px;" onclick="generatePracticePlan()">Generate Practice Plan</button>
        <button class="btn btn-secondary btn-small" style="flex:1;min-width:160px;" onclick="toggleBuilder()">Build Practice Plan</button>
      </div>
      <div id="ta-plan-output" style="margin-top:14px;">${analysisPlanText}</div>
      <div id="ta-builder" style="margin-top:14px;"></div>`;
  }
  pane.innerHTML=(SC.tiersEnabled?practiceScheduleEditorHtml():'')+`<div class="card"><div class="card-title"><span class="bar"></span> 📋 Team Analysis</div>
    <p style="font-size:12px;color:var(--gray);margin-bottom:12px;line-height:1.5;">Pick a team to see its collective skill averages, then generate a practice session aimed at the weakest spots. Assessment scores of zero mean unassessed and are left out of the averages.</p>
    ${picker}
    ${body}
  </div>`;
  // Repaint the drill-picker from state so it survives tier switches and plan re-renders. Club and HS both.
  renderBuilder();
}

// Demo + live, mirroring generateAIPlan. Ephemeral: result is held in
// analysisPlanText and rendered into #ta-plan-output, never written to Firebase.
async function generatePracticePlan(){
  const a=analyzeTierSkills(analysisTier);
  if(!tierDataSufficient(a))return;
  // Club labels the plan by tier; HS uses the neutral school/team name so the AI prompt and canned plan read naturally.
  const tierLabel=SC.tiersEnabled?(analysisTier==='gold'?'Gold':'Garnet'):(analysisTier==='development'?'Development':analysisTier==='roster'?'Roster':(SC.displayName||SC.schoolName||'this'));
  const ranked=[...a.assessedSkills].sort((x,y)=>x.avg-y.avg);
  const weak=ranked.slice(0,Math.min(3,ranked.length));
  const weakLabels=weak.map(s=>s.label);
  if(SC.demoMode){
    // Demo: no network, no Firebase. Build a canned but realistic session plan
    // that names the actual computed weak skills for the selected team.
    const w1=weakLabels[0]||'serving';
    const w2=weakLabels[1]||weakLabels[0]||'passing';
    const w3=weakLabels[2]||weakLabels[1]||weakLabels[0]||'defense';
    const plan=`Practice session for the ${tierLabel} team. The numbers point to ${weakLabels.join(', ')} as the spots holding this group back right now, so the whole session is built around them.\n\nWarmup. Fifteen minutes of dynamic movement and partner pepper, with a deliberate focus on clean ${w1} touches from the very first ball so the standard is set before competition starts.\n\nFocused block one. Spend twenty minutes on ${w1}. Run repeating reps with a clear target and a clean rep versus error count out loud, so players feel the standard climb instead of just going through the motions.\n\nFocused block two. Spend twenty minutes on ${w2} and ${w3} paired together in a single flowing drill, so players have to read and react the way they will in a real rally rather than treating each skill in isolation.\n\nScrimmage focus. Play short games to fifteen where points won with strong ${w1} or ${w2} count double. That rewards the exact habits this team needs and makes the weak spots the path to winning.\n\nCooldown. Five minutes of light movement and a quick circle where each player names one rep that felt better than last week, so the group leaves seeing progress on ${weakLabels.join(' and ')}.\n\n${COACH_SIGNOFF}.`;
    analysisPlanText=`<div style="white-space:pre-wrap;font-size:13px;line-height:1.7;color:var(--charcoal);">${plan}</div>`;
    renderTeamAnalysis();
    toast('Practice plan generated');
    return;
  }
  const out=document.getElementById('ta-plan-output');
  if(out)out.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is building a practice plan...</div></div>';
  const averagesLine=ranked.map(s=>`${s.label} ${s.avg.toFixed(1)} (${s.assessedCount} assessed)`).join(', ');
  try{
    const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        messages:[{role:'user',content:`You are an experienced high school girls beach volleyball coach planning a single team practice session. Be encouraging but honest. Use beach volleyball terminology only, never indoor volleyball terms.

Formatting rules you must follow without exception: no markdown of any kind, no hashtags, no double asterisks, no em dashes, no bullet point symbols. Use plain sentences and paragraphs only. Add a blank line between every paragraph. End every plan with the sign-off: ${COACH_SIGNOFF}.

TEAM: ${tierLabel} team, ${a.playerCount} players.

SKILL AVERAGES (assessed scores only, 1 to 10): ${averagesLine}

IDENTIFIED WEAK SPOTS (lowest averages): ${weakLabels.join(', ')}

Write a single practice session plan targeting these weak spots. Include a warmup, two or three focused drill blocks aimed at the weak skills with the real averages referenced, a scrimmage focus that rewards the weak skills, and a cooldown. Keep it to a few short paragraphs. Speak to the team as their coach.`}]
      })
    });
    const data=await response.json();
    const text=data.content?.map(c=>c.text||'').join('')||'Unable to generate plan. Please try again.';
    analysisPlanText=`<div style="white-space:pre-wrap;font-size:13px;line-height:1.7;color:var(--charcoal);">${text}</div>`;
    renderTeamAnalysis();
    toast('Practice plan generated');
  }catch(err){
    console.error('AI error:',err);
    const o=document.getElementById('ta-plan-output');
    if(o)o.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error generating plan. Check connection and try again.</div>';
  }
}

// ============================================================
// PLAYER GAME DAY (Player-side score entry)
// ============================================================
let pgdScoreUs=0,pgdScoreThem=0;
let pgdCurrentMatchId=null;
let pgdCurrentPair=[];
let pgdCurrentDate=null;
let pgdCurrentOpponent='';
// Stats keyed by player id: pgdStats[pid] = {k,a,b,d,e}
let pgdStats={};

function pgdResetScores(){pgdScoreUs=0;pgdScoreThem=0;}
function pgdResetStats(){pgdStats={};}

// Helper: build a stat block for one player
function pgdStatBlockHTML(pid,label,prefix){
  const s=pgdStats[pid]||{k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  const stats=['k','a','b','se','re','he','de'];
  const names=['Kills','Aces','Blocks','Srv Err','Rcv Err','Hit Err','Dig Err'];
  return `<div class="pgd-player-stats-block">
    <div class="pgd-player-stats-label">${label}</div>
    <div class="pgd-stats-grid">
      ${stats.map((st,i)=>`<div class="pgd-stat-col">
        <div class="pgd-stat-label">${st.toUpperCase()}<span class="stat-desc">${names[i]}</span></div>
        <div class="pgd-stat-ctrl">
          <button class="pgd-stat-btn" onclick="pgdStatAdj('${pid}','${st}',1,'${prefix}')">+</button>
          <div class="pgd-stat-num" id="${prefix}-${pid}-${st}">${s[st]||0}</div>
          <button class="pgd-stat-btn" onclick="pgdStatAdj('${pid}','${st}',-1,'${prefix}')">−</button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

// Helper: render existing sets for a match with edit buttons
function pgdSetsHTML(sets,matchId,pair,viewerPid,prefix){
  if(!sets||!sets.length)return'';
  let h='<div style="margin-bottom:12px;">';
  sets.forEach((s,i)=>{
    const win=(s.scoreUs||0)>(s.scoreThem||0);
    const enterer=s.enteredBy?gP(s.enteredBy):null;
    const byLabel=enterer?(enterer.id===viewerPid?'you':enterer.firstName):null;
    h+=`<div style="margin-bottom:4px;">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span class="pgd-set-chip ${win?'win':'loss'}">Set ${i+1}: ${s.scoreUs}-${s.scoreThem}</span>
        <button style="font-size:11px;background:none;border:1px solid var(--gray-lighter);border-radius:4px;padding:2px 8px;cursor:pointer;color:var(--gray);" onclick="pgdToggleEditSet('${prefix}-edit-${i}')">✎ Edit</button>
        ${byLabel?`<span class="pgd-enteredby">entered by ${byLabel}</span>`:''}
      </div>
      <div id="${prefix}-edit-${i}" style="display:none;">
        ${pgdEditSetFormHTML(matchId,i,s,pair,viewerPid,prefix)}
      </div>
    </div>`;
  });
  h+='</div>';
  return h;
}

// Helper: inline edit form for an existing set
function pgdEditSetFormHTML(matchId,setIdx,s,pair,viewerPid,prefix){
  const p0=gP(pair[0]),p1=pair[1]?gP(pair[1]):null;
  const ps0=(s.stats||{})[pair[0]]||{};
  const ps1=p1?(s.stats||{})[pair[1]]||{}:{};
  const statNames=['k','a','b','se','re','he','de'];
  return `<div class="pgd-set-edit-form">
    <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;color:var(--blue);margin-bottom:8px;">EDIT SET ${setIdx+1}</div>
    <div class="pgd-edit-score-row">
      <div style="text-align:center;">
        <div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">${SC.abbrev}</div>
        <input class="pgd-edit-input" type="number" id="${prefix}-eu-${setIdx}" value="${s.scoreUs||0}" min="0">
      </div>
      <div style="font-family:'Bebas Neue';font-size:16px;color:var(--gray-light);">—</div>
      <div style="text-align:center;">
        <div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">OPP</div>
        <input class="pgd-edit-input" type="number" id="${prefix}-et-${setIdx}" value="${s.scoreThem||0}" min="0">
      </div>
    </div>
    <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">Stats (optional)</div>
    ${[pair[0],pair[1]].filter(Boolean).map((pid2,pi)=>{
      const ps=pi===0?ps0:ps1;
      const pObj=pi===0?p0:p1;
      return `<div style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:var(--charcoal);margin-bottom:4px;">${pObj?pObj.firstName:'Player'}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${statNames.map(st=>`<div style="text-align:center;min-width:44px;">
            <div style="font-size:9px;color:var(--gray);font-weight:700;">${st.toUpperCase()}</div>
            <input type="number" style="width:44px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:14px;text-align:center;" id="${prefix}-e${st}${pi}-${setIdx}" value="${ps[st]||0}" min="0">
          </div>`).join('')}
        </div>
      </div>`;
    }).join('')}
    <div style="display:flex;gap:8px;margin-top:8px;">
      <button class="btn btn-blue btn-small" style="flex:1;" onclick="pgdSaveEditSet('${matchId}',${setIdx},'${pair.join(',')}','${prefix}')">Save</button>
      <button class="btn btn-secondary btn-small" onclick="pgdToggleEditSet('${prefix}-edit-${setIdx}')">Cancel</button>
    </div>
  </div>`;
}

function pgdToggleEditSet(id){
  const el=document.getElementById(id);if(!el)return;
  el.style.display=el.style.display==='none'?'block':'none';
}

function pgdSaveEditSet(matchId,setIdx,pairStr,prefix){
  const pair=pairStr.split(',').filter(Boolean);
  const fbNode='gamedays';
  const m=D.gamedays.find(x=>x.id===matchId);if(!m)return;
  const us=parseInt(document.getElementById(prefix+'-eu-'+setIdx).value);
  const them=parseInt(document.getElementById(prefix+'-et-'+setIdx).value);
  if(isNaN(us)||isNaN(them)){toast('Enter both scores');return;}
  if(us===them){toast('Scores cannot be tied');return;}
  const statNames=['k','a','b','se','re','he','de'];
  const stats={};
  pair.forEach((pid2,pi)=>{
    const ps={};
    statNames.forEach(st=>{
      const el=document.getElementById(prefix+'-e'+st+pi+'-'+setIdx);
      ps[st]=el?parseInt(el.value)||0:0;
    });
    stats[pid2]=ps;
  });
  const sets=[...(m.sets||[])];
  sets[setIdx]={...sets[setIdx],scoreUs:us,scoreThem:them,stats,editedBy:currentPlayerId||'coach',editedAt:td()};
  fbSet(fbNode+'/'+matchId+'/sets',sets);
  toast('Set '+( setIdx+1)+' updated!');
  setTimeout(()=>{if(currentRole==='player')renderPlayerGameDay();else renderExtMatches('gameday');},500);
}

// Helper: new set entry card (for own court or spectator court)
function pgdNewSetCardHTML(setNum,pair,prefix,isSpectator){
  const p0=gP(pair[0]),p1=pair[1]?gP(pair[1]):null;
  const statNames=['k','a','b','se','re','he','de'];
  const statFullNames=['Kills','Aces','Blocks','Srv Err','Rcv Err','Hit Err','Dig Err'];
  return `<div class="pgd-set-entry" id="${prefix}-new-set">
    <div style="font-size:12px;font-weight:700;color:var(--gray);margin-bottom:10px;">Set ${setNum}</div>
    <div class="pgd-score-grid">
      <div class="pgd-score-block">
        <div class="pgd-score-label">${SC.abbrev}</div>
        <div class="pgd-score-ctrl">
          <button class="pgd-score-btn" onclick="pgdScoreAdj('${prefix}','us',-1)">−</button>
          <div class="pgd-score-num" id="${prefix}-us">0</div>
          <button class="pgd-score-btn" onclick="pgdScoreAdj('${prefix}','us',1)">+</button>
        </div>
      </div>
      <div class="pgd-vs">VS</div>
      <div class="pgd-score-block">
        <div class="pgd-score-label">OPP</div>
        <div class="pgd-score-ctrl">
          <button class="pgd-score-btn" onclick="pgdScoreAdj('${prefix}','them',-1)">−</button>
          <div class="pgd-score-num" id="${prefix}-them">0</div>
          <button class="pgd-score-btn" onclick="pgdScoreAdj('${prefix}','them',1)">+</button>
        </div>
      </div>
    </div>
    <button class="pgd-stats-toggle" id="${prefix}-stats-toggle" onclick="pgdToggleStatsSection('${prefix}')">＋ Add stats (optional)</button>
    <div id="${prefix}-stats-section" style="display:none;">
      <div style="font-size:11px;color:var(--gray);text-align:center;margin:8px 0 4px;">Tap +/− to count as you play</div>
      ${[pair[0],pair[1]].filter(Boolean).map(pid2=>{
        const pObj=gP(pid2);
        return pgdStatBlockHTML(pid2,pObj?pObj.firstName:'Player',prefix);
      }).join('')}
    </div>
    <button class="btn btn-blue" style="width:100%;margin-top:12px;" onclick="pgdSubmitSet('${prefix}','${pair.join(',')}')">Save Set Score</button>
  </div>`;
}

// Score adj per-prefix
const pgdPrefixScores={};
function pgdScoreAdj(prefix,side,delta){
  if(!pgdPrefixScores[prefix])pgdPrefixScores[prefix]={us:0,them:0};
  pgdPrefixScores[prefix][side]=Math.max(0,pgdPrefixScores[prefix][side]+delta);
  const el=document.getElementById(prefix+'-'+side);
  if(el)el.textContent=pgdPrefixScores[prefix][side];
}

function pgdStatAdj(pid,stat,delta,prefix){
  if(!pgdStats[pid])pgdStats[pid]={k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  pgdStats[pid][stat]=Math.max(0,(pgdStats[pid][stat]||0)+delta);
  const el=document.getElementById(prefix+'-'+pid+'-'+stat);
  if(el)el.textContent=pgdStats[pid][stat];
}

function pgdToggleStatsSection(prefix){
  const section=document.getElementById(prefix+'-stats-section');
  const btn=document.getElementById(prefix+'-stats-toggle');
  if(!section||!btn)return;
  const open=section.style.display==='none';
  section.style.display=open?'block':'none';
  btn.textContent=open?'− Hide stats':'＋ Add stats (optional)';
  btn.classList.toggle('open',open);
}

function pgdSubmitSet(prefix,pairStr){
  if(!pgdPrefixScores[prefix])pgdPrefixScores[prefix]={us:0,them:0};
  const scoreUs=pgdPrefixScores[prefix].us;
  const scoreThem=pgdPrefixScores[prefix].them;
  if(scoreUs===scoreThem){toast('Scores cannot be tied');return;}
  const pair=pairStr.split(',').filter(Boolean);
  if(pair.length<2){toast('Need two players for this court');return;}

  const statsOpen=document.getElementById(prefix+'-stats-section')?.style.display!=='none';
  const stats={};
  pair.forEach(pid2=>{
    stats[pid2]=statsOpen&&pgdStats[pid2]?{...pgdStats[pid2]}:{k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  });
  const newSet={scoreUs,scoreThem:scoreThem,stats,enteredBy:currentPlayerId||null,enteredAt:td()};

  // Find or create match
  // prefix format: 'own' for own court, 'spec-{idx}' for spectator courts
  // We need to look up the match for this pair/date
  const matchDate=pgdCurrentDate||td();
  const _pgdAssign=Object.values(D.assignments).find(a=>a.date===matchDate);
  const existingMatch=D.gamedays.find(m=>resMatchesCourt(m,matchDate,pair,_pgdAssign&&_pgdAssign.id));
  if(existingMatch){
    const sets=[...(existingMatch.sets||[])];
    sets.push(newSet);
    fbSet('gamedays/'+existingMatch.id+'/sets',sets);
    if(prefix==='own')pgdCurrentMatchId=existingMatch.id;
  }else{
    // Need opponent info — look up from assignment
    const assignment=Object.values(D.assignments).find(a=>a.date===matchDate);
    const courtEntry=(assignment?.courts||[]).find(c=>arrEq([c.p1,c.p2].filter(Boolean),pair));
    const courtNum=courtEntry?courtEntry.court:(gP(pair[0])?.court||1);
    const opp=(assignment?.opponent||'Opponent')+' CT'+courtNum;
    const id=gi('gd');
    fbSetResult('gamedays',id,{id,date:matchDate,court:courtNum,pair,opponent:opp,assignmentId:(_pgdAssign&&_pgdAssign.id)||null,sets:[newSet]});
    if(prefix==='own')pgdCurrentMatchId=id;
  }

  const win=scoreUs>scoreThem;
  toast((win?'✓ Win':'✗ Loss')+' saved — '+scoreUs+'-'+scoreThem);
  pgdPrefixScores[prefix]={us:0,them:0};
  if(pgdStats[pair[0]])pgdStats[pair[0]]={k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  if(pgdStats[pair[1]])pgdStats[pair[1]]={k:0,a:0,b:0,se:0,re:0,he:0,de:0};
  setTimeout(renderPlayerGameDay,600);
}

function renderPlayerGameDay(){
  if(!currentPlayerId)return;
  const pid=currentPlayerId;
  const container=document.getElementById('pgd-content');
  const today=td();

  // Find today's/next assignment for this player
  const allAssign=Object.values(D.assignments)
    .filter(a=>a.date>=today)
    .sort((a,b)=>a.date.localeCompare(b.date));

  let nextAssign=null,nextCourt=null;
  for(const a of allAssign){
    for(const c of(a.courts||[])){
      if(c.p1===pid||c.p2===pid){nextAssign=a;nextCourt=c;break;}
    }
    if(nextAssign)break;
  }

  pgdCurrentDate=nextAssign?nextAssign.date:today;
  const myMatches=D.gamedays.filter(m=>(m.pair||[]).includes(pid))
    .sort((a,b)=>b.date.localeCompare(a.date));

  let h='';

  if(nextAssign&&nextCourt){
    const partner=nextCourt.p1===pid?gP(nextCourt.p2):gP(nextCourt.p1);
    const courtLabel='Court '+nextCourt.court+(nextCourt.subCourt?nextCourt.subCourt.toUpperCase():'');
    const typeLabel=nextAssign.type==='gameday'?'Dual':'Scrimmage';
    const isToday=nextAssign.date===today;

    pgdCurrentPair=[nextCourt.p1,nextCourt.p2].filter(Boolean);
    pgdCurrentOpponent=nextAssign.opponent||'Opponent';

    const existingMatch=D.gamedays.find(m=>resMatchesCourt(m,nextAssign.date,pgdCurrentPair,nextAssign.id));
    pgdCurrentMatchId=existingMatch?existingMatch.id:null;
    const existingSets=existingMatch?existingMatch.sets||[]:[];
    let sw=0,sl=0,ptDiff=0;
    existingSets.forEach(s=>{
      const us=s.scoreUs||0,them=s.scoreThem||0;
      us>them?sw++:sl++;ptDiff+=(us-them);
    });
    const savedNotes=pgdNotes[pid]&&pgdNotes[pid][nextAssign.date]||{};

    // Assignment banner
    h+=`<div class="pgd-assignment">
      <div class="pgd-label">${isToday?'TODAY — ':'UPCOMING — '}${typeLabel.toUpperCase()}</div>
      <div class="pgd-title">${fD(nextAssign.date)}${nextAssign.opponent?' vs '+nextAssign.opponent:''}</div>
      <div class="pgd-court-badge">${courtLabel} · w/ ${partner?partner.firstName+' '+partner.lastName:'TBD'}</div>
    </div>`;

    // Score entry card for own court
    h+=`<div class="pgd-court-section">
      <div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--blue);margin-bottom:8px;">MY DUAL SCORES</div>`;

    // Existing sets with edit buttons
    h+=pgdSetsHTML(existingSets,pgdCurrentMatchId,pgdCurrentPair,pid,'own');
    if(sw||sl){
      const diffStr=ptDiff>0?'+'+ptDiff:String(ptDiff);
      const diffColor=ptDiff>0?'var(--green)':ptDiff<0?'var(--loss-red)':'var(--gray)';
      h+=`<div style="font-family:'Bebas Neue';font-size:15px;margin-bottom:10px;color:${sw>=sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl} sets <span style="font-size:13px;color:${diffColor};margin-left:6px;">(${diffStr} pts)</span></div>`;
    }

    // New set entry
    h+=pgdNewSetCardHTML(existingSets.length+1,pgdCurrentPair,'own',false);
    h+=`</div>`;

    // Match notes
    h+=`<div style="background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);">
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;color:var(--charcoal);margin-bottom:10px;">📝 MATCH NOTES</div>
      <div style="margin-bottom:10px;">
        <label style="font-size:12px;font-weight:700;color:var(--gray);display:block;margin-bottom:6px;">How did I play?</label>
        <textarea class="pgd-notes-area" id="pgd-note-perf" placeholder="Serving, passing, hitting — what worked, what didn't...">${savedNotes.performance||''}</textarea>
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-size:12px;font-weight:700;color:var(--gray);display:block;margin-bottom:6px;">Opponent notes</label>
        <textarea class="pgd-notes-area" id="pgd-note-opp" placeholder="Their tendencies, weaknesses, what worked against them...">${savedNotes.opponent||''}</textarea>
      </div>
      <button class="btn btn-secondary btn-small" style="width:100%;" onclick="pgdSaveNotes()">Save Notes</button>
      ${savedNotes.savedAt?'<div style="font-size:11px;color:var(--green);text-align:center;margin-top:6px;">Last saved '+fD(savedNotes.savedAt)+'</div>':''}
    </div>`;

    // Spectator — other courts for same game day
    const otherCourts=(nextAssign.courts||[]).filter(c=>
      !arrEq([c.p1,c.p2].filter(Boolean),pgdCurrentPair)&&c.p1&&c.p2
    );
    if(otherCourts.length){
      h+=`<div style="background:var(--white);border-radius:var(--radius);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);">
        <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;color:var(--purple);margin-bottom:4px;">👀 TRACK OTHER COURTS</div>
        <div style="font-size:12px;color:var(--gray);margin-bottom:12px;">Enter scores &amp; stats for other courts. Your name is recorded as the tracker.</div>`;
      otherCourts.forEach((c,idx)=>{
        const specPair=[c.p1,c.p2].filter(Boolean);
        const sp0=gP(c.p1),sp1=gP(c.p2);
        const specLabel=[sp0,sp1].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
        const courtLabel2='Court '+c.court+(c.subCourt?c.subCourt.toUpperCase():'');
        const specMatch=D.gamedays.find(m=>m.date===nextAssign.date&&arrEq(m.pair||[],specPair));
        const specSets=specMatch?specMatch.sets||[]:[];
        let ssw=0,ssl=0,ssDiff=0;specSets.forEach(s=>{const us=s.scoreUs||0,them=s.scoreThem||0;us>them?ssw++:ssl++;ssDiff+=(us-them);});
        const ssDiffStr=ssDiff>0?'+'+ssDiff:String(ssDiff);
        const ssDiffColor=ssDiff>0?'var(--green)':ssDiff<0?'var(--loss-red)':'var(--gray)';
        const prefix2='spec-'+idx;
        h+=`<div class="pgd-court-section spectator" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <span class="court-badge court-${c.court}" style="font-size:11px;">${courtLabel2}</span>
              <div style="font-size:13px;font-weight:700;margin-top:4px;">${specLabel}</div>
            </div>
            ${specSets.length?`<div style="text-align:right;"><div style="font-family:'Bebas Neue';font-size:16px;color:${ssw>ssl?'var(--green)':'var(--loss-red)'};">${ssw}-${ssl}</div><div style="font-family:'Bebas Neue';font-size:13px;color:${ssDiffColor};">${ssDiffStr} pts</div></div>`:''}
          </div>
          ${pgdSetsHTML(specSets,specMatch?specMatch.id:null,specPair,pid,prefix2)}
          ${pgdNewSetCardHTML(specSets.length+1,specPair,prefix2,true)}
        </div>`;
      });
      h+=`</div>`;
    }

  }else{
    h+=`<div style="text-align:center;padding:30px 20px;">
      <div style="font-size:36px;margin-bottom:12px;">🏐</div>
      <div style="font-family:'Bebas Neue';font-size:18px;color:var(--gray);margin-bottom:8px;">No Upcoming Assignment</div>
      <div style="font-size:13px;color:var(--gray);">Check back when coaches post the game day lineup.</div>
    </div>`;
  }

  // Past game day history
  if(myMatches.length){
    h+=`<div style="background:var(--white);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);">
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;color:var(--blue);margin-bottom:10px;">MY DUAL HISTORY</div>`;
    myMatches.slice(0,8).forEach(m=>{
      const partner=(m.pair||[]).find(x=>x!==pid);
      const sets=m.sets||[];let sw=0,sl=0,pf=0,pa=0,tk=0,ta=0,tb=0,td2=0,te=0,hasStats=false;
      sets.forEach(s=>{
        const su=s.scoreUs||0,st=s.scoreThem||0;pf+=su;pa+=st;su>st?sw++:sl++;
        const ps=s.stats?.[pid]||{};
        if(ps.k||ps.a||ps.b||ps.d||ps.e){hasStats=true;tk+=ps.k||0;ta+=ps.a||0;tb+=ps.b||0;td2+=ps.d||0;te+=ps.e||0;}
      });
      h+=`<div style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:12px;color:var(--gray);">${fD(m.date)} · Court ${m.court||1}</div>
            <div style="font-size:13px;font-weight:700;">w/ ${pN(partner)} vs ${m.opponent||'?'}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:'Bebas Neue';font-size:16px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</div>
            <div style="font-size:11px;color:var(--gray);">${pmStr(pf-pa)}</div>
          </div>
        </div>
        ${hasStats?`<div style="display:flex;gap:10px;margin-top:5px;padding:5px 8px;background:var(--off-white);border-radius:6px;">
          <span style="font-size:11px;color:var(--gray);"><b style="color:var(--charcoal);">${tk}</b> K</span>
          <span style="font-size:11px;color:var(--gray);"><b style="color:var(--charcoal);">${ta}</b> A</span>
          <span style="font-size:11px;color:var(--gray);"><b style="color:var(--charcoal);">${tb}</b> B</span>
          <span style="font-size:11px;color:var(--gray);"><b style="color:var(--charcoal);">${td2}</b> D</span>
          <span style="font-size:11px;color:var(--gray);"><b style="color:var(--charcoal);">${te}</b> E</span>
        </div>`:''}
      </div>`;
    });
    h+='</div>';
  }

  container.innerHTML=h;
}

function pgdSaveNotes(){
  if(!currentPlayerId||!pgdCurrentDate){toast('No active game day');return;}
  const perf=document.getElementById('pgd-note-perf')?.value||'';
  const opp=document.getElementById('pgd-note-opp')?.value||'';
  // Guard the Firebase write only; the pgdNotes self-update below runs in all modes
  // so player game-day notes persist in-memory in demo too.
  if(db)db.ref(DB_ROOT+'/player_notes/'+pgdCurrentDate+'/'+currentPlayerId).set({
    performance:perf||null,opponent:opp||null,savedAt:td()
  });
  toast('Notes saved!');
  if(!pgdNotes[currentPlayerId])pgdNotes[currentPlayerId]={};
  pgdNotes[currentPlayerId][pgdCurrentDate]={performance:perf,opponent:opp,savedAt:td()};
  const _np=gP(currentPlayerId);
  notifyCoaches(
    'Player Notes: '+(_np?_np.firstName+' '+_np.lastName:currentPlayerId),
    'Player: '+(_np?_np.firstName+' '+_np.lastName:currentPlayerId)+'\nDate: '+pgdCurrentDate+(perf?'\n\nPerformance: '+perf:'')+(opp?'\nOpponent: '+opp:'')+'\n\nLog in to view full notes.'
  );
}


// ============================================================
// DUALS
// ============================================================
function getDualRecord(seasonId){
  let w=0,l=0;
  // Season-scoped views of the result nodes. Defaults to the active season (zero-arg call is unchanged); a passed seasonId scopes to that season for career rollups.
  const _S = seasonId || _activeSeason();
  const _inS = r => r && (r.seasonId===_S || r.seasonId==null);
  const sched=(D.schedule||[]).filter(_inS), duals=(D.duals||[]).filter(_inS), gds=(D.gamedays||[]).filter(_inS);
  // Dual W-L: from schedule (dual-level wins)
  sched.forEach(g=>{if(g.type==='scrimmage')return;if(g.scoreUs!=null&&g.scoreThem!=null&&g.scoreUs!==''&&g.scoreThem!==''){parseInt(g.scoreUs)>parseInt(g.scoreThem)?w++:l++;}});
  // Also count from D.duals that have no matching schedule entry with scores
  duals.forEach(d=>{
    if(d.leonCourts==null&&d.oppCourts==null)return;
    const hasSchedEntry=sched.some(g=>g.type!=='scrimmage'&&g.date===d.date&&(g.opponent||'').toLowerCase()===(d.opponent||'').toLowerCase()&&g.scoreUs!=null&&g.scoreUs!=='');
    if(!hasSchedEntry){d.dualWin?w++:l++;}
  });

  // Match W-L (court-level): sum scoreUs/scoreThem from schedule
  // Schedule stores court scores per dual (e.g. 4-1 means Leon won 4 courts)
  let cw=0,cl=0;
  sched.forEach(g=>{
    if(g.scoreUs!=null&&g.scoreThem!=null&&g.scoreUs!==''&&g.scoreThem!==''){
      cw+=parseInt(g.scoreUs)||0;
      cl+=parseInt(g.scoreThem)||0;
    }
  });

  // Sets W-L: from gameday individual set records (most accurate source)
  let sw=0,sl=0;
  gds.forEach(m=>{
    if(m.isExhibition||(m.court||0)>=6)return;
    (m.sets||[]).forEach(s=>{
      (s.scoreUs||0)>(s.scoreThem||0)?sw++:sl++;
    });
  });
  // Also count from structured duals if present
  duals.forEach(d=>{(d.courts||[]).filter(c=>!c.isExhibition).forEach(c=>{
    (c.sets||[]).forEach(s=>{(s.scoreUs||0)>(s.scoreThem||0)?sw++:sl++;});
  });});

  return{w,l,cw,cl,sw,sl,total:w+l};
}

// Build synthetic dual records from gamedays, grouped by date + opponent
function buildDualsFromGamedays(){
  // Schedule lookup: date → game
  const schedByDate={};
  D.schedule.filter(inSeason).forEach(g=>{if(g.date)schedByDate[g.date]=g;});

  // First pass: strip court suffixes from opponent names
  function cleanOpp(raw){
    if(!raw)return'';
    return raw
      .replace(/\s*(CT\s*\d+|Court\s*\d+|Exhibition|\s+\d+).*$/i,'')
      .trim();
  }
  function isGenericName(n){return!n||/^(opponent|unknown|tbd)$/i.test(n);}

  // Group gamedays by date + cleaned opponent
  const groups={};
  D.gamedays.filter(inSeason).forEach(m=>{
    let oppBase=cleanOpp(m.opponent);
    const sched=schedByDate[m.date];
    if(isGenericName(oppBase)&&sched){oppBase=sched.opponent||'Unknown';}
    if(!oppBase)oppBase='Unknown';
    const key=m.date+'||'+oppBase;
    if(!groups[key]){
      groups[key]={date:m.date,opponent:oppBase,courts:[],location:sched?sched.location||'home':'home'};
    }
    const isExhib=(m.isExhibition===true)||(m.court||0)>=6;
    groups[key].courts.push({court:m.court||1,pair:m.pair||[],sets:m.sets||[],isExhibition:isExhib,id:m.id});
  });

  // Second pass: if a date has a schedule entry, consolidate ALL groups for that date
  // into one if there's only one non-exhibition schedule game (handles edge case mismatches)
  const byDate={};
  Object.values(groups).forEach(g=>{
    if(!byDate[g.date])byDate[g.date]=[];
    byDate[g.date].push(g);
  });
  const finalGroups=[];
  Object.entries(byDate).forEach(([date,dayGroups])=>{
    const sched=schedByDate[date];
    if(dayGroups.length===1){
      // Single group for this date — use schedule opponent/location if available
      const g=dayGroups[0];
      if(sched&&isGenericName(g.opponent)){g.opponent=sched.opponent||g.opponent;g.location=sched.location||g.location;}
      finalGroups.push(g);
    }else{
      // Multiple groups (e.g. Mar 12 had Destin + South Walton) — keep separate
      dayGroups.forEach(g=>finalGroups.push(g));
    }
  });

  return finalGroups
    .map(d=>{
      const scored=d.courts.filter(c=>!c.isExhibition);
      const leonCourts=scored.filter(c=>{const sw=(c.sets||[]).filter(s=>(s.scoreUs||0)>(s.scoreThem||0)).length,sl=(c.sets||[]).filter(s=>(s.scoreThem||0)>(s.scoreUs||0)).length;return sw>sl;}).length;
      const oppCourts=scored.filter(c=>{const sw=(c.sets||[]).filter(s=>(s.scoreUs||0)>(s.scoreThem||0)).length,sl=(c.sets||[]).filter(s=>(s.scoreThem||0)>(s.scoreUs||0)).length;return sl>sw;}).length;
      return{...d,leonCourts,oppCourts,fromGamedays:true};
    })
    .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}

function renderDuals(){
  const rec=getDualRecord();
  const setEl=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  setEl('dual-season-rec',rec.w+'-'+rec.l);
  setEl('dual-courts-rec',rec.cw+'-'+rec.cl);
  setEl('dual-sets-rec',rec.sw+'-'+rec.sl);
  setEl('dash-dual-rec',rec.w+'-'+rec.l);
  setEl('dash-courts-rec',rec.cw+'-'+rec.cl);
  setEl('dash-sets-rec',rec.sw+'-'+rec.sl);
  const container=document.getElementById('duals-list');
  if(!container)return;

  // Merge structured duals + gameday-derived duals, deduplicate by date+opponent
  const gdDuals=buildDualsFromGamedays();
  const structuredDuals=D.duals||[];
  // For structured duals missing courts data, fill in from gameday-derived version
  const enrichedStructured=structuredDuals.map(d=>{
    const base=(d.courts||[]).length>0?d:(()=>{const gdMatch=gdDuals.find(g=>(g.date||'')===(d.date||'')&&(g.opponent||'').toLowerCase()===(d.opponent||'').toLowerCase());return gdMatch?{...d,courts:gdMatch.courts||[]}:d;})();
    return {...base,_isStructured:true};
  });
  const structuredKeys=new Set(enrichedStructured.map(d=>(d.date||'')+'||'+(d.opponent||'').toLowerCase()));
  const merged=[
    ...enrichedStructured,
    ...gdDuals.filter(d=>!structuredKeys.has((d.date||'')+'||'+(d.opponent||'').toLowerCase()))
  ].sort((a,b)=>(b.date||'').localeCompare(a.date||''));

  const duals=merged;

  // Auto-sync: write dual results back to schedule if schedule entry is missing scores
  if(currentRole==='coach'&&db){
    const _normOpp=s=>(s||'').toLowerCase().replace(/^[@\s]+/,'').replace(/[^a-z0-9]/g,'');
    duals.forEach(d=>{
      const lc=d.leonCourts||0,oc=d.oppCourts||0;
      if(lc===0&&oc===0)return;
      const hasCourts=(d.courts||[]).some(c=>!c.isExhibition&&(c.sets||[]).length>0);
      if(!hasCourts)return;
      const dOppNorm=_normOpp(d.opponent);
      const schedMatch=D.schedule.find(g=>g.date===d.date&&_normOpp(g.opponent)===dOppNorm&&g.type!=='scrimmage');
      if(schedMatch&&(schedMatch.scoreUs==null||schedMatch.scoreThem==null)){
        fbSet('schedule/'+schedMatch.id,Object.assign({},schedMatch,{scoreUs:lc,scoreThem:oc}));
      }
    });
  }

  if(!duals.length){container.innerHTML='<div class="empty-state"><div class="emoji">&#127942;</div><p>No dual matches recorded yet.</p></div>';return;}
  let h='';
  duals.forEach(d=>{
    const win=(d.leonCourts||0)>(d.oppCourts||0),loss=(d.oppCourts||0)>(d.leonCourts||0);
    const locLabel=d.location==='away'?'@ ':d.location==='neutral'?'(N) ':'vs ';
    const scored=(d.courts||[]).filter(c=>!c.isExhibition).sort((a,b)=>(a.court||0)-(b.court||0));
    const exhib=(d.courts||[]).filter(c=>c.isExhibition).sort((a,b)=>(a.court||0)-(b.court||0));
    const reopenBtn=d._isStructured&&currentRole==='coach'?'<button class="match-action-btn" onclick="reopenDual(\''+d.id+'\')" title="Reopen dual" style="color:var(--gold);font-weight:700;">&#x21BA;</button>':'';
    h+=`<div class="dual-card ${win?'win':loss?'loss':''}">
      <div style="display:flex;justify-content:flex-end;gap:4px;margin-bottom:4px;">
        <button class="match-action-btn" onclick="dhScanOppModal('${d.date||''}','${(d.opponent||'').replace(/'/g,"\\'")}','${d.location||'home'}')" title="Scan opponent lineup">📷</button>
        <button class="match-action-btn edit-btn" onclick="openDualEditModal('${d.id}','${d.opponent||''}','${d.date||''}','${d.location||'home'}')" title="Edit">&#x270E;</button>
        ${reopenBtn}
        <button class="match-action-btn" onclick="deleteDual('${d.id}')" title="Delete">&#x2715;</button>
      </div>
      <div class="dual-header">
        <div>
          <div style="font-size:12px;color:var(--gray);font-weight:600;">${fD(d.date)}</div>
          <div style="font-weight:700;font-size:17px;margin-top:2px;">${locLabel}${d.opponent||'TBD'}</div>
        </div>
        <div style="text-align:right;">
          <div class="dual-result-badge ${win?'win':loss?'loss':''}">${win?'W':loss?'L':'&#8212;'} ${d.leonCourts||0}-${d.oppCourts||0}</div>
          <div style="font-size:10px;color:var(--gray);margin-top:2px;">${win?'Dual Win':loss?'Dual Loss':'Tied'}</div>
        </div>
      </div>`;
    if(scored.length){
      h+='<div style="margin-top:8px;">';
      scored.forEach(c=>{
        const pair=(c.pair||c.team1||[]).map(id=>pN(id)).join(' & ')||'TBD';
        const sets=c.sets||[];let sw=0,sl=0;sets.forEach(s=>{(s.scoreUs||0)>(s.scoreThem||0)?sw++:sl++;});
        const cWin=sw>sl;
        const mid=c.id||'';
        const pairEditBtn=mid?'<button onclick="dhEditPairModal(\''+mid+'\')" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--gray);cursor:pointer;" title="Edit pair/court">✎</button>':'';
        const pairDeleteBtn=mid?'<button onclick="dhDeletePair(\''+mid+'\')" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--loss-red);cursor:pointer;" title="Delete pair">✕</button>':'';
        const addSetBtn=mid?'<button onclick="dhAddSet(\''+mid+'\')" style="font-size:10px;padding:1px 7px;border:1px dashed var(--gray-lighter);border-radius:3px;background:none;color:var(--gray);cursor:pointer;margin-top:2px;">+ Add Set</button>':'';
        const setsHtml=sets.map((s,si)=>{
          const win=(s.scoreUs||0)>(s.scoreThem||0);
          const enteredByName=s.enteredBy?(gP(s.enteredBy)||{}).firstName||null:null;
          return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
            <span style="font-family:'Bebas Neue';font-size:13px;color:${win?'var(--green)':'var(--loss-red)'};">S${si+1}: ${s.scoreUs}-${s.scoreThem}</span>${enteredByName?`<span style="font-size:9px;color:var(--gray);font-style:italic;">✎${enteredByName}</span>`:''}
            ${mid?`<button onclick="dhEditSet('${mid}',${si})" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--gray);cursor:pointer;">✎</button>
            <button onclick="dhDeleteSet('${mid}',${si})" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--gray);cursor:pointer;">✕</button>
            <span id="dh-edit-${mid}-${si}" style="display:none;align-items:center;gap:3px;">
              <input type="number" id="dh-us-${mid}-${si}" value="${s.scoreUs}" min="0" style="width:42px;padding:2px;border:1px solid var(--gray-lighter);border-radius:3px;font-family:'Bebas Neue';font-size:13px;text-align:center;">
              <span>-</span>
              <input type="number" id="dh-them-${mid}-${si}" value="${s.scoreThem}" min="0" style="width:42px;padding:2px;border:1px solid var(--gray-lighter);border-radius:3px;font-family:'Bebas Neue';font-size:13px;text-align:center;">
              <button onclick="dhSaveSet('${mid}',${si})" style="font-size:10px;padding:1px 7px;border:none;border-radius:3px;background:var(--green);color:var(--white);cursor:pointer;">✓</button>
              <button onclick="dhCancelEdit('${mid}',${si})" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--gray);cursor:pointer;">✗</button>
            </span>`:''}
          </div>`;
        }).join('');
        h+=`<div class="dual-court-row" style="flex-wrap:wrap;align-items:flex-start;">
          <span class="court-badge court-${c.court}" style="min-width:28px;text-align:center;margin-top:3px;">${c.court}</span>
          <span style="flex:1;font-weight:600;font-size:12px;padding-top:3px;">${pair}</span>
          ${pairEditBtn}${pairDeleteBtn}
          <span style="font-family:'Bebas Neue';font-size:14px;color:${cWin?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</span>
          <div style="width:100%;padding-left:36px;margin-top:4px;">${setsHtml}${addSetBtn}</div>
        </div>`;
      });
      h+='</div>';
    }
    if(exhib.length){
      h+='<div style="font-size:10px;font-weight:800;color:var(--gray);letter-spacing:1px;margin:6px 0 2px;padding-top:4px;border-top:1px dashed var(--gray-lighter);">EXHIBITION</div>';
      exhib.forEach(c=>{
        const pair=(c.pair||c.team1||[]).map(id=>pN(id)).join(' & ')||'TBD';
        const sets=c.sets||[];const setsStr=sets.length?sets.map(s=>s.scoreUs+'-'+s.scoreThem).join(', '):'—';
        h+=`<div class="dual-court-row" style="opacity:0.65;">
          <span class="court-badge court-${c.court}" style="min-width:28px;text-align:center;">${c.court}</span>
          <span style="flex:1;font-size:12px;">${pair}</span>
          ${c.id?`<button onclick="dhEditPairModal('${c.id}')" style="font-size:10px;padding:1px 5px;border:1px solid var(--gray-lighter);border-radius:3px;background:var(--white);color:var(--gray);cursor:pointer;" title="Edit pair/court">✎</button>`:''}
          <span style="font-size:10px;color:var(--purple);font-weight:700;">Exhib</span>
          <span style="font-size:11px;color:var(--gray);min-width:80px;text-align:right;">${setsStr}</span>
        </div>`;
      });
    }
    // Add Pair + Copy lineup buttons
    const allCourts=(d.courts||[]).sort((a,b)=>(a.court||0)-(b.court||0));
    const _safeOpp=(d.opponent||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    h+=`<div style="display:flex;gap:6px;margin-top:10px;">
      <button class="btn btn-small" style="flex:1;background:var(--green);color:#fff;border:none;font-size:11px;" onclick="dhAddPairModal('${d.date||''}','${_safeOpp}')">+ Add Pair</button>
      ${allCourts.length?`<button class="btn btn-small" style="flex:2;background:var(--charcoal);color:#fff;border:none;font-size:11px;" onclick="copyDualLineup(${duals.indexOf(d)})">📋 Copy Lineup</button>`:''}
    </div>`;
    h+='</div>';
  });
  container.innerHTML=h;
  // stash merged duals so copyDualLineup can access them
  window._renderedDuals=duals;
}

let _delDualArmed={};
function copyDualLineup(idx){
  const duals=window._renderedDuals||[];
  const d=duals[idx];
  if(!d){toast('Lineup not found');return;}
  const locLabel=d.location==='away'?'@ ':d.location==='neutral'?'(N) ':'vs ';
  const header=fD(d.date)+' '+locLabel+(d.opponent||'TBD');
  const lines=[header,''];
  const courts=(d.courts||[]).slice().sort((a,b)=>(a.court||0)-(b.court||0));
  const scored=courts.filter(c=>!c.isExhibition);
  const exhib=courts.filter(c=>c.isExhibition);
  scored.forEach(c=>{
    const ids=c.pair||c.team1||[];
    const fmt=id=>{const p=gP(id);if(!p)return'TBD';return p.firstName+' '+p.lastName+(p.jersey!=null?' (#'+p.jersey+')':'');};
    lines.push('Court '+c.court+': '+fmt(ids[0])+' / '+fmt(ids[1]));
  });
  if(exhib.length){
    lines.push('');
    exhib.forEach(c=>{
      const ids=c.pair||[];
      const fmt=id=>{const p=gP(id);if(!p)return'TBD';return p.firstName+' '+p.lastName+(p.jersey!=null?' (#'+p.jersey+')':'');};
      lines.push('Court '+c.court+' (Exhibition): '+fmt(ids[0])+' / '+fmt(ids[1]));
    });
  }
  navigator.clipboard.writeText(lines.join('\n')).then(()=>toast('Lineup copied ✓')).catch(()=>toast('Copy failed — try again'));
}
function openDualEditModal(id,opp,date,location){
  if(!id)return;
  document.getElementById('edit-modal-body').innerHTML=`
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">DATE</label>
      <input type="date" id="dual-edit-date" class="form-input" value="${date||td()}" style="padding:8px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">OPPONENT</label>
      <input type="text" id="dual-edit-opp" class="form-input" value="${opp||''}" placeholder="e.g. Lincoln HS" style="font-size:14px;">
    </div>
    <div>
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">LOCATION</label>
      <select id="dual-edit-loc" class="form-select">
        <option value="home" ${location==='home'?'selected':''}>Home</option>
        <option value="away" ${location==='away'?'selected':''}>Away</option>
        <option value="neutral" ${location==='neutral'?'selected':''}>Neutral</option>
      </select>
    </div>`;
  document.querySelector('#edit-modal .modal-title').innerHTML='Edit Dual <button class="modal-close" onclick="closeEdit()">&#x2715;</button>';
  document.querySelector('#edit-modal .modal-title').style.color='var(--blue)';
  document.getElementById('edit-save').textContent='Save Changes';
  document.getElementById('edit-save').onclick=function(){saveDualEdit(id);};
  document.getElementById('edit-modal').classList.add('active');
}

function saveDualEdit(id){
  const date=document.getElementById('dual-edit-date')?.value;
  const opp=document.getElementById('dual-edit-opp')?.value.trim();
  const loc=document.getElementById('dual-edit-loc')?.value;
  if(!date||!opp){toast('Date and opponent required');return;}
  const existing=D.duals.find(d=>d.id===id);
  if(existing){
    fbSet('duals/'+id+'/date',date);
    fbSet('duals/'+id+'/opponent',opp);
    fbSet('duals/'+id+'/location',loc);
    toast('Dual updated!');
    closeEdit();
  }else{
    // Gameday-derived dual — update all gameday records for this date/opponent
    toast('This dual is built from individual match records. Edit opponent name on each match in the Match Log tab.');
    closeEdit();
  }
}

function deleteDual(id){
  if(_delDualArmed[id]){clearTimeout(_delDualArmed[id]);delete _delDualArmed[id];fbRemove('duals/'+id);toast('Dual deleted');}
  else{_delDualArmed[id]=setTimeout(()=>{delete _delDualArmed[id];},3000);toast('Tap again to confirm delete');}
}
async function reopenDual(id){
  const pin=prompt('Enter '+COACH_LABEL+' PIN to reopen this dual:');
  if(!pin)return;
  let ok=false;
  try{
    const r=await fetch(AUTH_WORKER+'/auth/coach-verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dbRoot:DB_ROOT,pin:pin})});
    const j=await r.json().catch(()=>null);
    ok=!!(j&&j.ok);
  }catch(e){ok=false;}
  if(!ok){toast('Incorrect PIN');return;}
  fbRemove('duals/'+id);
  toast('Dual reopened');
  renderDuals();
}

function dhDeletePair(mid){
  if(!confirm('Delete this pair?'))return;
  fbRemove('gamedays/'+mid);toast('Pair deleted');renderDuals();
}

// ── DUAL SCORESHEET UPLOAD ──────────────────────────────────
function initDualScanner(){
  const dateEl=document.getElementById('dual-scan-date');
  if(dateEl)dateEl.value=td();
  const fileEl=document.getElementById('dual-scan-file');
  if(!fileEl)return;
  fileEl.addEventListener('change',async function(e){
    const file=e.target.files[0];if(!file)return;
    const preview=document.getElementById('dual-scan-preview');
    const result=document.getElementById('dual-scan-result');
    const reader=new FileReader();
    reader.onload=async function(ev){
      const base64=ev.target.result.split(',')[1];
      const mediaType=file.type||'image/jpeg';
      preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);">`;
      result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is reading your dual scoresheet...</div></div>';
      const date=document.getElementById('dual-scan-date').value||td();
      const playerList=D.players.map(p=>p.firstName+' '+p.lastName+' ('+p.id+')').join(', ');
      try{
        const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'claude-sonnet-4-20250514',max_tokens:2000,
            messages:[{role:'user',content:[
              {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
              {type:'text',text:`You are reading a handwritten high school beach volleyball DUAL MATCH scoresheet for SC.schoolName.

A dual has courts 1-5 counting toward the result. Courts 6+ are exhibition.
There may be ONE or MULTIPLE duals on this sheet (each has a different opponent header e.g. "VS Destin W5-0").

PLAYER ROSTER - match abbreviated names to these IDs:
${playerList}

COMMON ABBREVIATIONS:
Reag/RP = Reagan Giles (p16) + Riley Perezluha (p08)
Jord/Kend = Jordyn Russell (p13) + Kendall Cruse (p06)
Dez/Am = Destyni Zuema (p02) + Aubri Moore (p07)
Ri/Bent or R/Bent = Riley Knipple (p01) + Bentley Barnard (p10)
Liz/Madi = Lizzie Roader (p09) + Madalynn Edenfield (p12)
Salem/Jaz = Salem Ehrhardt (p15) + Jazmin Burdick (p11)
Eden/Madalynn = Eden Codd (p05) + Madalynn Edenfield (p12)

SCORE FORMAT: W21-18 W21-11 means ${SCHOOL_NAME} won set1 21-18, won set2 21-11
L19-21 means ${SCHOOL_NAME} lost a set 19-21

Return ONLY a JSON array, one element per dual:
[{"opponent":"Destin","leonCourts":5,"oppCourts":0,"courts":[{"court":2,"pair":["p16","p08"],"sets":[{"scoreUs":21,"scoreThem":18},{"scoreUs":21,"scoreThem":11}],"isExhibition":false}]}]

RULES: court 1-5 isExhibition:false, court 6+ isExhibition:true. Include ALL courts. Respond with ONLY the JSON array, no other text.`}
            ]}]
          })
        });
        const data=await response.json();
        const text=data.content?.map(c=>c.text||'').join('')||'';
        const clean=text.replace(/\`\`\`json|\`\`\`/g,'').trim();
        let parsed;
        try{parsed=JSON.parse(clean);}catch(pe){
          result.innerHTML=`<div style="color:var(--loss-red);font-size:13px;">Could not parse AI response. Raw output:</div><pre style="font-size:11px;background:var(--off-white);padding:10px;border-radius:6px;overflow-x:auto;white-space:pre-wrap;">${text}</pre>`;return;
        }
        if(!Array.isArray(parsed))parsed=[parsed];
        showDualReviewUI(parsed,date,result);
      }catch(err){
        console.error('Dual scan error:',err);
        result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error reading scoresheet. Try a clearer photo.</div>';
      }
    };
    reader.readAsDataURL(file);
    e.target.value='';
  });
}

function showDualReviewUI(duals,date,container){
  const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
  function playerOpts(selId){return'<option value="">Select Player</option>'+sorted.map(pl=>`<option value="${pl.id}" ${pl.id===selId?'selected':''}>${pl.firstName} ${pl.lastName.charAt(0)}. (CT${pl.court})</option>`).join('');}
  let h=`<div style="font-family:'Bebas Neue';font-size:15px;letter-spacing:1px;margin-bottom:10px;color:var(--green);">Found ${duals.length} dual(s) — review and save</div>`;
  h+=`<div style="font-size:12px;color:var(--gray);margin-bottom:14px;padding:8px 12px;background:#fffbeb;border-radius:6px;border-left:3px solid var(--gold);">Saving creates the dual record AND individual Game Day match entries so player stats update automatically.</div>`;
  duals.forEach((d,di)=>{
    const win=(d.leonCourts||0)>(d.oppCourts||0),loss=(d.oppCourts||0)>(d.leonCourts||0);
    h+=`<div class="dual-review-block" style="border-left:4px solid ${win?'var(--green)':loss?'var(--loss-red)':'var(--gray-lighter)'};">
      <div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;margin-bottom:10px;color:${win?'var(--green)':loss?'var(--loss-red)':'var(--charcoal)'};">DUAL ${di+1} ${win?'— WIN':loss?'— LOSS':''}</div>
      <div class="form-row" style="margin-bottom:8px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opponent</label>
          <input type="text" class="form-input" id="dr-${di}-opp" value="${d.opponent||''}" placeholder="Opponent name" style="padding:8px;font-size:13px;"></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Location</label>
          <select class="form-select" id="dr-${di}-loc" style="padding:8px;font-size:13px;"><option value="home">Home</option><option value="away">Away</option><option value="neutral">Neutral</option></select></div>
      </div>
      <div class="form-row" style="margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">${SCHOOL_NAME} Courts Won</label>
          <input type="number" class="form-input" id="dr-${di}-leon" value="${d.leonCourts||0}" min="0" max="7" style="padding:8px;font-size:13px;"></div>
        <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opp Courts Won</label>
          <input type="number" class="form-input" id="dr-${di}-oppc" value="${d.oppCourts||0}" min="0" max="7" style="padding:8px;font-size:13px;"></div>
      </div>
      <div style="font-family:'Bebas Neue';font-size:11px;letter-spacing:1px;color:var(--gray);margin-bottom:6px;">COURT RESULTS</div>`;
    (d.courts||[]).forEach((c,ci)=>{
      const isExhib=(c.isExhibition)||(c.court>=6);
      h+=`<div style="background:${isExhib?'#f5f3ff':'var(--white)'};border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid ${isExhib?'#c4b5fd':'var(--gray-lighter)'};">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-family:'Bebas Neue';font-size:11px;color:var(--gray);">CT</span>
          <input type="number" id="dr-${di}-${ci}-court" value="${c.court||ci+1}" min="1" max="8" style="width:48px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
          <span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;${isExhib?'color:var(--purple);background:#ede9fe;':'color:var(--green);background:#dcfce7;'}">${isExhib?'EXHIB':'SCORED'}</span>
        </div>
        <div class="form-row" style="margin-bottom:6px;">
          <select class="form-select" id="dr-${di}-${ci}-p1" style="padding:6px;font-size:12px;">${playerOpts((c.pair||[])[0])}</select>
          <select class="form-select" id="dr-${di}-${ci}-p2" style="padding:6px;font-size:12px;">${playerOpts((c.pair||[])[1])}</select>
        </div>`;
      (c.sets||[]).forEach((s,si)=>{
        const setWin=(s.scoreUs||0)>(s.scoreThem||0);
        h+=`<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="font-size:11px;color:var(--gray);min-width:36px;font-weight:700;">Set ${si+1}</span>
          <input type="number" id="dr-${di}-${ci}-s${si}-us" value="${s.scoreUs||0}" min="0" style="width:54px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:14px;text-align:center;">
          <span style="color:var(--gray);">&#8212;</span>
          <input type="number" id="dr-${di}-${ci}-s${si}-them" value="${s.scoreThem||0}" min="0" style="width:54px;padding:6px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:14px;text-align:center;">
          <span style="font-size:11px;font-weight:700;color:${setWin?'var(--green)':'var(--loss-red)'};">${setWin?'W':'L'}</span>
        </div>`;
      });
      h+='</div>';
    });
    h+='</div>';
  });
  h+=`<div style="display:flex;gap:8px;margin-top:12px;">
    <button class="btn btn-success btn-small" style="flex:1;padding:12px;" onclick="confirmDualSave()">Save All Duals + Create Match Records</button>
    <button class="btn btn-secondary btn-small" onclick="document.getElementById('dual-scan-result').innerHTML='';document.getElementById('dual-scan-preview').innerHTML='';">Cancel</button>
  </div>`;
  container.innerHTML=h;
  window._dualReviewData={duals,date};
}

function confirmDualSave(){
  const{duals,date}=window._dualReviewData||{};
  if(!duals||!duals.length){toast('No data to save');return;}
  let dualsSaved=0,matchesCreated=0;
  duals.forEach((d,di)=>{
    const opponent=(document.getElementById('dr-'+di+'-opp')?.value||'').trim()||d.opponent||'Unknown';
    const location=document.getElementById('dr-'+di+'-loc')?.value||'home';
    const leonCourts=parseInt(document.getElementById('dr-'+di+'-leon')?.value)||0;
    const oppCourts=parseInt(document.getElementById('dr-'+di+'-oppc')?.value)||0;
    const courts=[];
    (d.courts||[]).forEach((c,ci)=>{
      const court=parseInt(document.getElementById('dr-'+di+'-'+ci+'-court')?.value)||c.court||ci+1;
      const p1=document.getElementById('dr-'+di+'-'+ci+'-p1')?.value;
      const p2=document.getElementById('dr-'+di+'-'+ci+'-p2')?.value;
      const isExhibition=court>=6;
      const sets=[];
      for(let si=0;si<10;si++){
        const usEl=document.getElementById('dr-'+di+'-'+ci+'-s'+si+'-us');
        const themEl=document.getElementById('dr-'+di+'-'+ci+'-s'+si+'-them');
        if(!usEl)break;
        sets.push({scoreUs:parseInt(usEl.value)||0,scoreThem:parseInt(themEl.value)||0});
      }
      const sw=sets.filter(s=>(s.scoreUs||0)>(s.scoreThem||0)).length;
      const sl=sets.filter(s=>(s.scoreThem||0)>(s.scoreUs||0)).length;
      courts.push({court,pair:[p1,p2].filter(Boolean),sets,isExhibition,courtResult:sw>sl?'W':'L'});
      if(p1&&p2&&sets.length){
        const pair=[p1,p2];
        const already=D.gamedays.find(m=>m.date===date&&arrEq(m.pair||[],pair));
        if(!already){
          const mid=gi('gd');
          const matchSets=sets.map(s=>{const stats={};pair.forEach(pid=>{stats[pid]={k:0,b:0,a:0,se:0,re:0,he:0,de:0};});return{...s,stats};});
          fbSetResult('gamedays',mid,{id:mid,date,court,pair,opponent:opponent+' CT'+court,sets:matchSets,isExhibition});
          matchesCreated++;
        }
      }
    });
    const dualId=gi('dual');
    fbSetResult('duals',dualId,{id:dualId,date,opponent,location,leonCourts,oppCourts,dualWin:leonCourts>oppCourts,courts,createdAt:td()});
    dualsSaved++;
    // Auto-update schedule result if date+opponent match
    const schedMatch=D.schedule.find(g=>g.date===date&&(g.opponent||'').toLowerCase().includes(opponent.toLowerCase().split(' ')[0]));
    if(schedMatch&&schedMatch.scoreUs==null){fbSet('schedule/'+schedMatch.id+'/scoreUs',leonCourts);fbSet('schedule/'+schedMatch.id+'/scoreThem',oppCourts);}
  });
  toast(dualsSaved+' dual(s) + '+matchesCreated+' match records saved!');
  document.getElementById('dual-scan-result').innerHTML='<div style="color:var(--green);font-size:14px;font-weight:700;padding:12px;background:var(--green-bg);border-radius:8px;">Saved! Check Dual History below and Game Day tab for match entries.</div>';
  document.getElementById('dual-scan-preview').innerHTML='';
  window._dualReviewData=null;
}


// ============================================================
// DUAL HISTORY INLINE EDIT HELPERS
// ============================================================
function dhEditSet(matchId,si){
  const el=document.getElementById('dh-edit-'+matchId+'-'+si);
  if(el){el.style.display='inline-flex';}
}
function dhCancelEdit(matchId,si){
  const el=document.getElementById('dh-edit-'+matchId+'-'+si);
  if(el){el.style.display='none';}
}
function dhSaveSet(matchId,si){
  const m=D.gamedays.find(x=>x.id===matchId);if(!m)return;
  const us=parseInt(document.getElementById('dh-us-'+matchId+'-'+si)?.value);
  const them=parseInt(document.getElementById('dh-them-'+matchId+'-'+si)?.value);
  if(isNaN(us)||isNaN(them)){toast('Enter both scores');return;}
  if(us===them){toast('Scores cannot be tied');return;}
  const sets=[...(m.sets||[])];
  sets[si]={...sets[si],scoreUs:us,scoreThem:them,editedBy:'coach',editedAt:td()};
  fbSet('gamedays/'+matchId+'/sets',sets);
  toast('Set updated!');
}
function dhDeleteSet(matchId,si){
  const m=D.gamedays.find(x=>x.id===matchId);if(!m)return;
  const sets=(m.sets||[]).filter((_,i)=>i!==si);
  fbSet('gamedays/'+matchId+'/sets',sets.length?sets:null);
  toast('Set deleted');
}
function dhAddSet(matchId){
  const m=D.gamedays.find(x=>x.id===matchId);if(!m)return;
  // Open the existing Add Set modal
  openAddSet(matchId,'gameday');
}

// ── DUAL HISTORY: EDIT PAIR / COURT ─────────────────────────
function dhEditPairModal(matchId){
  const m=D.gamedays.find(x=>x.id===matchId);if(!m){toast('Match not found');return;}
  const sorted=[...D.players].sort((a,b)=>(a.court||99)-(b.court||99)||a.lastName.localeCompare(b.lastName));
  const sel=(selected)=>sorted.map(p=>`<option value="${p.id}"${p.id===selected?' selected':''}>${p.firstName} ${p.lastName}</option>`).join('');
  const p1=(m.pair||[])[0]||'';
  const p2=(m.pair||[])[1]||'';
  document.getElementById('edit-modal-body').innerHTML=`
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">COURT NUMBER</label>
      <input type="number" id="dh-pair-court" class="form-input" value="${m.court||1}" min="1" max="10" style="width:80px;padding:8px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">PLAYER 1</label>
      <select id="dh-pair-p1" class="form-select"><option value="">-- Select --</option>${sel(p1)}</select>
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">PLAYER 2</label>
      <select id="dh-pair-p2" class="form-select"><option value="">-- Select --</option>${sel(p2)}</select>
    </div>
    <div>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
        <input type="checkbox" id="dh-pair-exhib"${m.isExhibition?' checked':''} style="width:16px;height:16px;"> Exhibition match
      </label>
    </div>`;
  document.querySelector('#edit-modal .modal-title').innerHTML='Edit Pair / Court <button class="modal-close" onclick="closeEdit()">&#x2715;</button>';
  document.querySelector('#edit-modal .modal-title').style.color='var(--blue)';
  document.getElementById('edit-save').textContent='Save Changes';
  document.getElementById('edit-save').onclick=function(){dhSavePair(matchId);};
  document.getElementById('edit-modal').classList.add('active');
}

function dhSavePair(matchId){
  const m=D.gamedays.find(x=>x.id===matchId);if(!m)return;
  const court=parseInt(document.getElementById('dh-pair-court')?.value);
  const p1=document.getElementById('dh-pair-p1')?.value;
  const p2=document.getElementById('dh-pair-p2')?.value;
  const exhib=document.getElementById('dh-pair-exhib')?.checked||false;
  if(!court||!p1||!p2){toast('Court and both players required');return;}
  if(p1===p2){toast('Players must be different');return;}
  fbSet('gamedays/'+matchId+'/court',court);
  fbSet('gamedays/'+matchId+'/pair',[p1,p2]);
  fbSet('gamedays/'+matchId+'/isExhibition',exhib);
  toast('Pair updated!');
  closeEdit();
}

// ── DUAL HISTORY: ADD NEW PAIR TO EXISTING DUAL ─────────────
function dhAddPairModal(date,opponent){
  const sorted=[...D.players].sort((a,b)=>(a.court||99)-(b.court||99)||a.lastName.localeCompare(b.lastName));
  const opts=sorted.map(p=>`<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('');
  document.getElementById('edit-modal-body').innerHTML=`
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">COURT NUMBER</label>
      <input type="number" id="dh-new-court" class="form-input" value="1" min="1" max="10" style="width:80px;padding:8px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">PLAYER 1</label>
      <select id="dh-new-p1" class="form-select"><option value="">-- Select --</option>${opts}</select>
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">PLAYER 2</label>
      <select id="dh-new-p2" class="form-select"><option value="">-- Select --</option>${opts}</select>
    </div>
    <div>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
        <input type="checkbox" id="dh-new-exhib" style="width:16px;height:16px;"> Exhibition match
      </label>
    </div>`;
  document.querySelector('#edit-modal .modal-title').innerHTML='Add Pair to Dual <button class="modal-close" onclick="closeEdit()">&#x2715;</button>';
  document.querySelector('#edit-modal .modal-title').style.color='var(--green)';
  document.getElementById('edit-save').textContent='Add Pair';
  document.getElementById('edit-save').onclick=function(){dhSaveNewPair(date,opponent);};
  document.getElementById('edit-modal').classList.add('active');
}

function dhSaveNewPair(date,opponent){
  const court=parseInt(document.getElementById('dh-new-court')?.value);
  const p1=document.getElementById('dh-new-p1')?.value;
  const p2=document.getElementById('dh-new-p2')?.value;
  const exhib=document.getElementById('dh-new-exhib')?.checked||false;
  if(!court||!p1||!p2){toast('Court and both players required');return;}
  if(p1===p2){toast('Players must be different');return;}
  const id='gd_'+Date.now();
  fbSetResult('gamedays',id,{id,date,court,pair:[p1,p2],opponent,isExhibition:exhib,sets:[],addedByCoach:true,createdAt:td()});
  toast('Pair added!');
  closeEdit();
}

// ── DUAL HISTORY: RETROACTIVE OPPONENT LINEUP SCAN ──────────
function dhScanOppModal(date,opp){
  const safeOpp=(opp||'').replace(/"/g,'&quot;');
  document.getElementById('edit-modal-body').innerHTML=`
    <div style="margin-bottom:10px;display:flex;gap:10px;">
      <div style="flex:1;">
        <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">DATE</label>
        <input type="date" id="dhso-date" class="form-input" value="${date||td()}" style="padding:8px;">
      </div>
      <div style="flex:2;">
        <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:4px;">OPPONENT</label>
        <input type="text" id="dhso-opp" class="form-input" value="${safeOpp}" placeholder="e.g. Chiles" style="font-size:14px;">
      </div>
    </div>
    <div style="margin-bottom:12px;">
      <label style="font-size:11px;font-weight:700;color:var(--gray);display:block;margin-bottom:6px;">LINEUP PHOTO (FHSAA form)</label>
      <input type="file" id="dhso-file" accept="image/*" capture="environment" style="font-size:13px;width:100%;">
    </div>
    <div id="dhso-preview"></div>
    <div id="dhso-result"></div>`;
  document.querySelector('#edit-modal .modal-title').innerHTML='📷 Scan Opponent Lineup <button class="modal-close" onclick="closeEdit()">&#x2715;</button>';
  document.querySelector('#edit-modal .modal-title').style.color='var(--charcoal)';
  // Hide the generic Save button — we'll inject our own inside dhso-result
  const saveBtn=document.getElementById('edit-save');
  if(saveBtn)saveBtn.style.display='none';
  document.getElementById('edit-modal').classList.add('active');
  // Wire the file input after the modal is in the DOM
  setTimeout(()=>{
    const fileEl=document.getElementById('dhso-file');
    if(!fileEl)return;
    fileEl.addEventListener('change',async function(e){
      const file=e.target.files[0];if(!file)return;
      const preview=document.getElementById('dhso-preview');
      const result=document.getElementById('dhso-result');
      const reader=new FileReader();
      reader.onload=async function(ev){
        const base64=ev.target.result.split(',')[1];
        const mediaType=file.type||'image/jpeg';
        preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);margin-bottom:10px;">`;
        result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">Reading FHSAA lineup form...</div></div>';
        const promptText=`TASK: Extract data from an FHSAA Beach Volleyball Dual Match Lineup Form image.\n\nOUTPUT: Return ONLY a single JSON object. No explanation, no markdown, no code fences. Just the raw JSON.\n\nJSON FORMAT:\n{"school":"Lincoln HS","starters":[{"court":1,"p1":{"first":"Kenzie","last":"Poppell","jersey":"4"},"p2":{"first":"Londyn","last":"Dickey","jersey":"11"}}],"alternates":[{"first":"Jenny","last":"Heimbach","jersey":"7"}]}\n\nREADING THE FORM:\n- SCHOOL field at top = school name\n- Each row No.1 through No.5 = one court\n- Each row has TWO players: left-side = p1, right-side = p2\n- Columns per player: First Name, Last Name, Jersey No.\n- ALTERNATES table at bottom = alternates array\n- jersey field: jersey number as string or "" if not visible\n\nReturn the JSON object only. Start your response with { and end with }`;
        try{
          const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
            method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,
              messages:[{role:'user',content:[
                {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
                {type:'text',text:promptText}
              ]}]})
          });
          const data=await response.json();
          const text=data.content?.map(c=>c.text||'').join('')||'';
          let parsed;
          (function(){
            let clean=text.replace(/```json|```/gi,'').trim();
            try{parsed=JSON.parse(clean);return;}catch(e){}
            const ob=clean.indexOf('{');const oe=clean.lastIndexOf('}');
            if(ob>=0&&oe>ob){try{parsed=JSON.parse(clean.slice(ob,oe+1));return;}catch(e){}}
          })();
          if(!parsed){result.innerHTML=`<div style="color:var(--loss-red);font-size:13px;padding:10px;background:var(--off-white);border-radius:8px;">Couldn't parse the image. Try a flatter, better-lit photo.<br><small style="color:var(--gray);">${text.slice(0,200)}</small></div>`;return;}
          const starters=parsed.starters||[];
          const alternates=parsed.alternates||[];
          let h=`<div style="font-family:'Bebas Neue';font-size:13px;letter-spacing:1px;color:var(--green);margin-bottom:8px;">✓ Found ${starters.length} court(s) — edit if needed</div>`;
          starters.forEach((m,i)=>{
            const p1=m.p1||{first:'',last:'',jersey:''};
            const p2=m.p2||{first:'',last:'',jersey:''};
            h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
              <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;margin-bottom:8px;">COURT ${m.court}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 1</div>
                  <input type="text" id="dhso-${i}-p1f" value="${p1.first||''}" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                  <input type="text" id="dhso-${i}-p1l" value="${p1.last||''}" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                  <input type="text" id="dhso-${i}-p1j" value="${p1.jersey||''}" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
                </div>
                <div><div style="font-size:10px;font-weight:700;color:var(--gray);margin-bottom:4px;">PLAYER 2</div>
                  <input type="text" id="dhso-${i}-p2f" value="${p2.first||''}" placeholder="First" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                  <input type="text" id="dhso-${i}-p2l" value="${p2.last||''}" placeholder="Last" style="width:100%;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;margin-bottom:4px;">
                  <input type="text" id="dhso-${i}-p2j" value="${p2.jersey||''}" placeholder="#" style="width:60px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
                </div>
              </div>
              <input type="hidden" id="dhso-${i}-court" value="${m.court||i+1}">
            </div>`;
          });
          if(alternates.length){
            h+=`<div style="padding:8px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
              <div style="font-family:'Bebas Neue';font-size:11px;letter-spacing:1px;color:var(--purple);margin-bottom:6px;">ALTERNATES</div>`;
            alternates.forEach((a,i)=>{
              h+=`<div style="display:flex;gap:6px;margin-bottom:4px;">
                <input type="text" id="dhso-alt-${i}-f" value="${a.first||''}" placeholder="First" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
                <input type="text" id="dhso-alt-${i}-l" value="${a.last||''}" placeholder="Last" style="flex:1;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
                <input type="text" id="dhso-alt-${i}-j" value="${a.jersey||''}" placeholder="#" style="width:50px;padding:5px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:12px;">
              </div>`;
            });
            h+='</div>';
          }
          h+=`<button class="btn btn-primary" style="width:100%;margin-top:4px;" onclick="dhScanOppSave(${starters.length},${alternates.length})">💾 Save to Scouts</button>`;
          result.innerHTML=h;
        }catch(err){
          result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error contacting AI. Check your connection and try again.</div>';
          console.error('dhScanOpp error:',err);
        }
      };
      reader.readAsDataURL(file);
      e.target.value='';
    });
  },100);
}

function dhScanOppSave(count,altCount){
  const date=document.getElementById('dhso-date')?.value||td();
  const opp=document.getElementById('dhso-opp')?.value.trim()||'Opponent';
  const schoolKey=opp.toLowerCase().replace(/[^a-z0-9]+/g,'_');
  const existingSchool=D.opponents[schoolKey]||{};
  const oppCourts=[];
  for(let i=0;i<count;i++){
    const court=parseInt(document.getElementById(`dhso-${i}-court`)?.value)||i+1;
    const p1Name=(document.getElementById(`dhso-${i}-p1f`)?.value.trim()+' '+document.getElementById(`dhso-${i}-p1l`)?.value.trim()).trim();
    const p2Name=(document.getElementById(`dhso-${i}-p2f`)?.value.trim()+' '+document.getElementById(`dhso-${i}-p2l`)?.value.trim()).trim();
    const p1j=document.getElementById(`dhso-${i}-p1j`)?.value.trim()||'';
    const p2j=document.getElementById(`dhso-${i}-p2j`)?.value.trim()||'';
    if(p1Name||p2Name)oppCourts.push({court,player1:p1Name,jersey1:p1j,player2:p2Name,jersey2:p2j});
  }
  fbSet('opponents/'+schoolKey+'/info',{displayName:opp,lastDual:date});
  oppCourts.forEach(c=>{
    const up=(name,jersey,court,isAlt)=>{
      if(!name)return;
      const pKey=name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
      const ex=(existingSchool.players||{})[pKey]||{};
      fbSet('opponents/'+schoolKey+'/players/'+pKey,{...ex,firstName:name.split(' ')[0]||name,lastName:name.split(' ').slice(1).join(' ')||'',fullName:name,jersey:jersey||ex.jersey||'',typicalCourt:court||ex.typicalCourt||null,isAlternate:isAlt||false,firstSeen:ex.firstSeen||date,lastSeen:date});
    };
    up(c.player1,c.jersey1,c.court,false);
    up(c.player2,c.jersey2,c.court,false);
    if(c.player1&&c.player2){
      const pairKey=[c.player1,c.player2].map(n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'_')).sort().join('__');
      const ex=(existingSchool.pairs||{})[pairKey]||{};
      fbSet('opponents/'+schoolKey+'/pairs/'+pairKey,{...ex,player1:c.player1,player2:c.player2,court:c.court,firstSeen:ex.firstSeen||date,lastSeen:date});
    }
  });
  const alts=[];
  for(let i=0;i<altCount;i++){
    const af=document.getElementById(`dhso-alt-${i}-f`)?.value.trim()||'';
    const al=document.getElementById(`dhso-alt-${i}-l`)?.value.trim()||'';
    const aj=document.getElementById(`dhso-alt-${i}-j`)?.value.trim()||'';
    const aName=(af+' '+al).trim();
    if(aName){
      alts.push({firstName:af,lastName:al,jersey:aj,fullName:aName});
      const pKey=aName.toLowerCase().replace(/[^a-z0-9]+/g,'_');
      const ex=(existingSchool.players||{})[pKey]||{};
      fbSet('opponents/'+schoolKey+'/players/'+pKey,{...ex,firstName:af||aName,lastName:al||'',fullName:aName,jersey:aj||ex.jersey||'',typicalCourt:ex.typicalCourt||null,isAlternate:true,firstSeen:ex.firstSeen||date,lastSeen:date});
    }
  }
  writeOpponentIntel(date,opp,oppCourts,alts,'scanner');
  // Also save oppLineup to the matching assignment so Live Scoring shows opponent names
  const existingAssign=Object.values(D.assignments||{}).find(a=>a.date===date);
  if(existingAssign){
    fbSet('assignments/'+existingAssign.id+'/oppLineup',oppCourts);
  }else{
    const aid=gi('asgn');
    fbSet('assignments/'+aid,{id:aid,date,type:'gameday',opponent:opp,courts:[],oppLineup:oppCourts,notes:null,createdAt:new Date().toISOString()});
  }
  toast('Opponent lineup saved to Scouts + Live Scoring!');
  // Show the modal save button again before closing
  const saveBtn=document.getElementById('edit-save');if(saveBtn)saveBtn.style.display='';
  closeEdit();
}


// ============================================================
// PLAYER LIVE SCORE ENTRY
// ============================================================
function renderPlayerLiveScoring(){
  const container=document.getElementById('pp-live-courts');
  if(!container)return;
  const today=td();
  // Honor the portal switcher so the board and the scored dual agree; fall back to the first today dual.
  const assignment=(ppSelectedDualId&&D.assignments[ppSelectedDualId]&&D.assignments[ppSelectedDualId].date===today)
    ?D.assignments[ppSelectedDualId]
    :Object.values(D.assignments).find(a=>a.date===today);
  if(!assignment||!(assignment.courts||[]).length){
    // Show all available assignments
    const allA=Object.values(D.assignments||{}).filter(a=>a.courts&&a.courts.length>0).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    if(!allA.length){container.innerHTML=`<div style="text-align:center;padding:24px;color:var(--gray);"><div style="font-size:32px;margin-bottom:8px;">📅</div><div style="font-family:'Bebas Neue';font-size:16px;letter-spacing:1px;">No Assignments Yet</div></div>`;return;}
    const tL={gameday:'Dual',scrimmage:'Scrimmage',queens:'Queens'};
    container.innerHTML='<div>'+allA.map(a=>{
      const isToday=a.date===today;
      return`<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:6px;border-radius:8px;border:1px solid ${isToday?'var(--blue)':'var(--gray-lighter)'};background:${isToday?'var(--blue-bg)':'var(--white)'};">
        <div style="flex:1;"><div style="font-weight:700;font-size:13px;">${fD(a.date)} — ${a.opponent||'Practice'}${a.location?' · '+a.location:''}${a.time?' · '+a.time:''}</div>
        <div style="font-size:11px;color:var(--gray);">${tL[a.type||'gameday']||'Dual'} · ${(a.courts||[]).length} courts${isToday?' <strong style="color:var(--blue)">TODAY</strong>':''}</div></div>
        <button class="btn btn-blue btn-small" onclick="ppLoadCourts('${a.id}')" style="white-space:nowrap;padding:6px 12px;">Load Courts</button>
      </div>`;
    }).join('')+'</div>';
    return;
  }
  const aType=assignment.type||'gameday';
  const fbNode=aType==='scrimmage'?'scrimmages':'gamedays';
  const matchList=aType==='scrimmage'?D.scrimmages:D.gamedays;
  // Dual context line so the player knows which dual they are scoring (matches ppLoadCourts header style).
  let h=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:8px 12px;background:var(--blue-bg);border-radius:8px;">
    <span style="font-size:18px;">🏐</span>
    <div style="flex:1;"><div style="font-weight:700;font-size:14px;">Scoring: ${assignment.opponent?'vs '+assignment.opponent:'Practice'}</div>
    <div style="font-size:11px;color:var(--gray);">${fD(assignment.date)}${assignment.time?' · '+assignment.time:''}</div></div>
  </div>`;
  (assignment.courts||[]).sort((a,b)=>(a.court||0)-(b.court||0)).forEach((c,idx)=>{
    const p1=gP(c.p1),p2=gP(c.p2);
    const courtLabel='Court '+c.court;
    const partnerLabel=[p1,p2].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
    const opp=assignment.opponent?assignment.opponent+' CT'+c.court:'Opponent CT'+c.court;
    const existingMatch=matchList.find(m=>resMatchesCourt(m,today,[c.p1,c.p2].filter(Boolean),assignment.id));
    const matchId=existingMatch?existingMatch.id:null;
    const sets=existingMatch?existingMatch.sets||[]:[];
    let sw=0,sl=0,ptDiff=0;
    sets.forEach(s=>{const us=s.scoreUs||0,them=s.scoreThem||0;us>them?sw++:sl++;ptDiff+=(us-them);});
    const diffStr=ptDiff>0?'+'+ptDiff:String(ptDiff);
    const diffColor=ptDiff>0?'var(--green)':ptDiff<0?'var(--loss-red)':'var(--gray)';
    // Coach-assigned scorer tag (responsibility only, any player can still score any court).
    const _sc=(assignment.scorers||{})[c.court]||{};
    const _scNm=id2=>{const pp=gP(id2);return pp?pp.firstName+' '+pp.lastName.charAt(0)+'.':'';};
    const _scTag=_sc.primary?`<div style="font-size:11px;color:var(--blue);margin-top:2px;">✎ Scorer: ${_scNm(_sc.primary)}${_sc.secondary?' (backup: '+_scNm(_sc.secondary)+')':''}</div>`:'';

    h+=`<div class="live-court-card" id="pp-lc-${idx}">
      <div class="live-court-header">
        <div>
          <span class="court-badge court-${c.court}" style="font-size:12px;">${courtLabel}</span>
          <div class="live-pair-name" style="margin-top:4px;">${partnerLabel||'TBD'}</div>
          <div class="live-opp-name">vs ${opp}</div>
          ${_scTag}
        </div>
        <div style="text-align:right;">
          ${sets.length?`<div style="font-family:'Bebas Neue';font-size:18px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</div><div style="font-family:'Bebas Neue';font-size:15px;color:${diffColor};">${diffStr} pts</div>`:'<div style="font-size:12px;color:var(--gray);">No sets yet</div>'}
        </div>
      </div>`;
    // Existing sets as chips with delete
    if(sets.length){
      h+='<div style="margin-bottom:8px;padding:0 4px;">';
      sets.forEach((s,si)=>{
        const win=(s.scoreUs||0)>(s.scoreThem||0);
        h+=`<span class="live-set-chip ${win?'win':'loss'}">S${si+1}: ${s.scoreUs}-${s.scoreThem} <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:11px;padding:0 0 0 4px;" onclick="ppDelLiveSet('${matchId}','${fbNode}',${si})" title="Delete">✕</button></span>`;
      });
      h+='</div>';
    }
    // New set entry, gated by best-of-3 completion (mirrors coach side): stop offering sets at 2 wins.
    if(sw<2&&sl<2){
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;">
      <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:10px;letter-spacing:1px;">SET ${sets.length+1}</div>
      <span id="pp-setnum-${idx}" style="display:none;">${sets.length+1}</span>
      <div class="live-score-row">
        <div class="live-score-col">
          <div class="live-score-label">${SC.abbrev}</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('pp-us-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="pp-us-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('pp-us-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('pp-us-${idx}',-1)">−</button>
          </div>
        </div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
        <div class="live-score-col">
          <div class="live-score-label">OPP</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('pp-them-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="pp-them-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('pp-them-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('pp-them-${idx}',-1)">−</button>
          </div>
        </div>
      </div>
      <button class="pgd-stats-toggle" id="pp-st-${idx}-stats-toggle" onclick="pgdToggleStatsSection('pp-st-${idx}')">＋ Add stats (optional)</button>
      <div id="pp-st-${idx}-stats-section" style="display:none;">
        <div style="font-size:11px;color:var(--gray);text-align:center;margin:8px 0 4px;">Tap +/− to count as you play</div>
        ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const pObj=gP(pid2);return pgdStatBlockHTML(pid2,pObj?pObj.firstName:'Player','pp-st-${idx}');}).join('')}
      </div>
      <button class="btn btn-blue btn-small" style="width:100%;margin-top:8px;" onclick="ppSaveLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${today}',${c.court},'${matchId||''}','${assignment.opponent||''}','${fbNode}','pp-st-${idx}')">✓ Save Set — Court ${c.court}</button>
    </div></div>`;
    }else{
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">MATCH COMPLETE</div>
        <div style="font-size:12px;color:var(--gray);margin-top:4px;">${sw>sl?(partnerLabel||'Our pair'):(assignment.opponent||'Opponent')} won ${Math.max(sw,sl)}-${Math.min(sw,sl)}</div>
      </div></div>`;
    }
  });
  container.innerHTML=h;
  applyLiveScoringToCounters();
}

function ppLoadCourts(assignmentId){
  const a=Object.values(D.assignments||{}).find(x=>x.id===assignmentId);
  if(!a){toast('Assignment not found');return;}
  const container=document.getElementById('pp-live-courts');if(!container)return;
  const aType=a.type||'gameday';
  const fbNode=aType==='scrimmage'?'scrimmages':'gamedays';
  const matchList=aType==='scrimmage'?D.scrimmages:D.gamedays;
  const courts=(a.courts||[]).sort((c1,c2)=>(c1.court||0)-(c2.court||0));
  let h=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:8px 12px;background:var(--blue-bg);border-radius:8px;">
    <span style="font-size:18px;">🏐</span>
    <div style="flex:1;"><div style="font-weight:700;font-size:14px;">${a.opponent||'Practice'} — ${fD(a.date)}</div>
    <div style="font-size:11px;color:var(--gray);">${a.location||''}${a.time?' · '+a.time:''}</div></div>
    <button onclick="renderPlayerLiveScoring()" style="font-size:11px;padding:4px 8px;border:1px solid var(--gray-lighter);border-radius:5px;background:var(--white);cursor:pointer;">← Back</button>
  </div>`;
  courts.forEach((c,idx)=>{
    const existingMatch=matchList.find(m=>resMatchesCourt(m,a.date,[c.p1,c.p2].filter(Boolean),a.id));
    const matchId=existingMatch?existingMatch.id:null;
    const sets=existingMatch?existingMatch.sets||[]:[];
    let sw=0,sl=0,ptDiff=0;
    sets.forEach(sv=>{const us=sv.scoreUs||0,them=sv.scoreThem||0;us>them?sw++:sl++;ptDiff+=(us-them);});
    const p1o=gP(c.p1),p2o=gP(c.p2);
    const partnerLabel=[p1o,p2o].filter(Boolean).map(p=>p.firstName+' '+p.lastName.charAt(0)+'.').join(' & ');
    const opp=(a.opponent||'Opponent')+' CT'+c.court;
    // Coach-assigned scorer tag (responsibility only, any player can still score any court).
    const _sc=(a.scorers||{})[c.court]||{};
    const _scNm=id2=>{const pp=gP(id2);return pp?pp.firstName+' '+pp.lastName.charAt(0)+'.':'';};
    const _scTag=_sc.primary?`<div style="font-size:11px;color:var(--blue);margin-top:2px;">✎ Scorer: ${_scNm(_sc.primary)}${_sc.secondary?' (backup: '+_scNm(_sc.secondary)+')':''}</div>`:'';
    h+=`<div class="live-court-card">
      <div class="live-court-header">
        <div><span class="court-badge court-${c.court}" style="font-size:12px;">Court ${c.court}</span>
          <div class="live-pair-name" style="margin-top:4px;">${partnerLabel||'TBD'}</div>
          <div class="live-opp-name">vs ${opp}</div>${_scTag}</div>
        <div style="text-align:right;">${sets.length?`<div style="font-family:'Bebas Neue';font-size:18px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">${sw}-${sl}</div>`:'<div style="font-size:12px;color:var(--gray);">No sets yet</div>'}</div>
      </div>`;
    if(sets.length){h+='<div style="margin-bottom:8px;padding:0 4px;">';sets.forEach((sv,si)=>{const win=(sv.scoreUs||0)>(sv.scoreThem||0);h+=`<span class="live-set-chip ${win?'win':'loss'}">S${si+1}: ${sv.scoreUs}-${sv.scoreThem} <button style="background:none;border:none;color:inherit;cursor:pointer;font-size:11px;" onclick="ppDelLiveSet('${matchId}','${fbNode}',${si})">✕</button></span>`;});h+='</div>';}
    // Set-entry block, gated by best-of-3 completion (mirrors coach side): stop offering sets at 2 wins.
    if(sw<2&&sl<2){
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;">
      <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:10px;">SET ${sets.length+1}</div>
      <span id="pp-setnum-${idx}" style="display:none;">${sets.length+1}</span>
      <div class="live-score-row">
        <div class="live-score-col"><div class="live-score-label">${SC.abbrev}</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('pp-us-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="pp-us-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('pp-us-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('pp-us-${idx}',-1)">−</button>
          </div></div>
        <div style="font-family:'Bebas Neue';font-size:24px;color:var(--gray-light);">—</div>
        <div class="live-score-col"><div class="live-score-label">OPP</div>
          <div class="ls-counter">
            <button class="ls-btn ls-btn-plus" onclick="lsAdj('pp-them-${idx}',1)">+</button>
            <input type="number" class="ls-inp" id="pp-them-${idx}" value="0" min="0" inputmode="numeric" pattern="[0-9]*" onchange="lsAdj('pp-them-${idx}',0)">
            <button class="ls-btn ls-btn-minus" onclick="lsAdj('pp-them-${idx}',-1)">−</button>
          </div></div>
      </div>
      <button class="pgd-stats-toggle" id="pp-st-${idx}-stats-toggle" onclick="pgdToggleStatsSection('pp-st-${idx}')">＋ Add stats (optional)</button>
      <div id="pp-st-${idx}-stats-section" style="display:none;">
        <div style="font-size:11px;color:var(--gray);text-align:center;margin:8px 0 4px;">Tap +/− to count as you play</div>
        ${[c.p1,c.p2].filter(Boolean).map(pid2=>{const pObj=gP(pid2);return pgdStatBlockHTML(pid2,pObj?pObj.firstName:'Player','pp-st-${idx}');}).join('')}
      </div>
      <button class="btn btn-blue btn-small" style="width:100%;margin-top:8px;" onclick="ppSaveLiveSet(${idx},'${c.p1||''}','${c.p2||''}','${a.date}',${c.court},'${matchId||''}','${a.opponent||''}','${fbNode}','pp-st-${idx}')">✓ Save Set — Court ${c.court}</button>
    </div></div>`;
    }else{
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-top:4px;text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${sw>sl?'var(--green)':'var(--loss-red)'};">MATCH COMPLETE</div>
        <div style="font-size:12px;color:var(--gray);margin-top:4px;">${sw>sl?(partnerLabel||'Our pair'):(a.opponent||'Opponent')} won ${Math.max(sw,sl)}-${Math.min(sw,sl)}</div>
      </div></div>`;
    }
  });
  container.innerHTML=h;
}

function ppSaveLiveSet(idx,p1,p2,date,court,existingId,opponent,fbNode,statsPrefix){
  const usEl=document.getElementById('pp-us-'+idx);
  const themEl=document.getElementById('pp-them-'+idx);
  const us=parseInt(usEl?.tagName==='INPUT'?usEl.value:usEl?.textContent);
  const them=parseInt(themEl?.tagName==='INPUT'?themEl.value:themEl?.textContent);
  if(isNaN(us)||isNaN(them)){toast('Enter both scores');return;}
  if(us===them){toast('Scores cannot be tied');return;}
  const node=fbNode||'gamedays';
  const matchList=node==='scrimmages'?D.scrimmages:D.gamedays;
  const pair=[p1,p2].filter(Boolean);
  const statsOpen=statsPrefix&&document.getElementById(statsPrefix+'-stats-section')?.style.display!=='none';
  const stats={};
  pair.forEach(pid=>{
    if(statsOpen&&pgdStats[pid]){
      stats[pid]={k:pgdStats[pid].k||0,b:pgdStats[pid].b||0,a:pgdStats[pid].a||0,d:pgdStats[pid].d||0,e:pgdStats[pid].e||0};
    }else{
      stats[pid]={k:0,b:0,a:0,se:0,re:0,he:0,de:0};
    }
  });
  const newSet={scoreUs:us,scoreThem:them,stats,enteredBy:currentPlayerId||null};
  const opp=(opponent||'Opponent')+' CT'+court;
  if(existingId){
    const m=matchList.find(x=>x.id===existingId);
    const sets=m?[...(m.sets||[])]:[];
    sets.push(newSet);
    fbSet(node+'/'+existingId+'/sets',sets);
  }else{
    const id=gi('gd');
    const _pa=Object.values(D.assignments||{}).find(x=>x.date===date&&(x.courts||[]).some(cc=>arrEq([cc.p1,cc.p2].filter(Boolean),pair)));
    const _aid=_pa?_pa.id:null;
    fbSetResult(node,id,{id,date,court:parseInt(court),pair,opponent:opp,sets:[newSet],...(_aid?{assignmentId:_aid}:{})});
  }
  toast((us>them?'✓ Win':'✗ Loss')+' — '+us+'-'+them+' saved · Court '+court);
  pair.forEach(pid=>{delete pgdStats[pid];});
  // Reset just this court's counters
  if(usEl)usEl.textContent='0';
  if(themEl)themEl.textContent='0';
  const usInp=document.getElementById('pp-us-'+idx+'-inp');
  const themInp=document.getElementById('pp-them-'+idx+'-inp');
  if(usInp)usInp.value='0';
  if(themInp)themInp.value='0';
  setTimeout(renderPlayerLiveScoring,500);
}

function ppDelLiveSet(matchId,fbNode,setIdx){
  if(!matchId)return;
  const node=fbNode||'gamedays';
  const matchList=node==='scrimmages'?D.scrimmages:D.gamedays;
  const m=matchList.find(x=>x.id===matchId);if(!m)return;
  const sets=(m.sets||[]).filter((_,i)=>i!==setIdx);
  fbSet(node+'/'+matchId+'/sets',sets.length?sets:null);
  toast('Set deleted');
  setTimeout(renderPlayerLiveScoring,400);
}

// ============================================================
// PLAYER MY MATCHES TAB
// ============================================================
function renderPlayerMatches(){
  if(!currentPlayerId)return;
  const pid=currentPlayerId;
  renderPlayerExtMatches(pid,D.gamedays,'pp-gameday');
  renderPlayerExtMatches(pid,D.scrimmages,'pp-scrimmage');
  // Queens matches
  const myQ=D.matches.filter(m=>(m.team1||[]).includes(pid)||(m.team2||[]).includes(pid)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  if(myQ.length){
    let h='';
    myQ.forEach(m=>{
      const onT1=(m.team1||[]).includes(pid);
      const partner=onT1?(m.team1||[]).find(x=>x!==pid):(m.team2||[]).find(x=>x!==pid);
      const opps=onT1?(m.team2||[]):(m.team1||[]);
      const myScore=onT1?(m.score1||0):(m.score2||0);
      const theirScore=onT1?(m.score2||0):(m.score1||0);
      const win=myScore>theirScore;
      const diff=myScore-theirScore;
      h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
        <div><div style="font-size:12px;color:var(--gray);">${fD(m.date)} · Court ${m.court}</div>
          <div style="font-size:13px;font-weight:700;">w/ ${pN(partner)} vs ${opps.map(id=>pN(id)).join(' & ')}</div></div>
        <div style="text-align:right;">
          <div class="set-score ${win?'win':'loss'}" style="font-size:20px;">${myScore}-${theirScore}</div>
          <div class="plus-minus ${pmClass(diff)}" style="font-size:13px;">${pmStr(diff)}</div></div></div>`;
    });
    document.getElementById('pp-queens').innerHTML=h;
  }else{
    document.getElementById('pp-queens').innerHTML='<div style="color:var(--gray);font-size:13px;text-align:center;padding:12px;">No Queens matches yet</div>';
  }
}


// ============================================================
// AI PAIRING EDIT & SAVE
// ============================================================
function editAIPairings(){
  const data=window._aiPairingData;
  if(!data)return;
  const container=document.getElementById('ai-pairings-result');
  const sortedPlayers=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
  function matchPlayer(name){
    if(!name||!name.trim())return '';
    const n=name.trim().toLowerCase();
    // 1. Exact full name match
    let p=sortedPlayers.find(x=>(x.firstName+' '+x.lastName).toLowerCase()===n);
    if(p)return p.firstName+' '+p.lastName;
    // 2. "First Last" with period variations
    const nClean=n.replace(/\./g,'').replace(/\s+/g,' ').trim();
    p=sortedPlayers.find(x=>(x.firstName+' '+x.lastName).toLowerCase().replace(/\./g,'')===nClean);
    if(p)return p.firstName+' '+p.lastName;
    // 3. "First L." or "First L" — first name + last initial
    const parts=nClean.split(' ');
    if(parts.length>=2){
      const fname=parts[0],linitial=parts[parts.length-1].replace(/\./g,'')[0];
      p=sortedPlayers.find(x=>x.firstName.toLowerCase()===fname&&x.lastName.toLowerCase().startsWith(linitial));
      if(p)return p.firstName+' '+p.lastName;
    }
    // 4. First name only
    if(parts.length>=1){
      p=sortedPlayers.find(x=>x.firstName.toLowerCase()===parts[0]);
      if(p)return p.firstName+' '+p.lastName;
    }
    return '';
  }
  function playerOpts(rawVal=''){
    const val=matchPlayer(rawVal);
    return'<option value="">Select Player</option>'+sortedPlayers.map(p=>`<option value="${p.firstName} ${p.lastName}" ${(p.firstName+' '+p.lastName)===val?'selected':''}>${p.firstName} ${p.lastName} (CT${p.court})</option>`).join('');
  }
  let h=`<div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1px;color:var(--blue);margin-bottom:12px;">EDIT PAIRINGS</div>`;
  // Date + opponent + type fields
  h+=`<div class="form-row" style="margin-bottom:8px;">
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Date</label>
      <input type="date" class="form-input" id="aip-date" value="${data.aiDate||td()}" style="padding:8px;font-size:13px;"></div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Opponent (if dual)</label>
      <input type="text" class="form-input" id="aip-opp" placeholder="e.g. Chiles" style="padding:8px;font-size:13px;"></div>
  </div>
  <div class="form-row" style="margin-bottom:8px;">
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Location</label>
      <select class="form-input" id="aip-location" style="padding:8px;font-size:13px;">
        <option${(data.aiLocation===(SC.homeVenue||'Tom Brown')||!data.aiLocation)?' selected':''}>${SC.homeVenue||'Tom Brown'}</option>
        <option${data.aiLocation==='Northside'?' selected':''}>Northside</option>
        <option${data.aiLocation==='4 Oaks'?' selected':''}>4 Oaks</option>
        <option${data.aiLocation==='Away'?' selected':''}>Away</option>
      </select></div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:11px;">Time</label>
      <input type="time" class="form-input" id="aip-time" value="${data.aiTime||''}" style="padding:8px;font-size:13px;"></div>
  </div>`;
  // Court rows
  let courtIdx=0;
  let currentRound=1;
  data.parsed.forEach((p,i)=>{
    if(p.type==='round'){
      h+=`<div style="font-family:'Bebas Neue';font-size:14px;letter-spacing:1.5px;color:var(--red);margin:12px 0 6px;">⚡ Round ${p.num}</div>`;
      currentRound=parseInt(p.num);
    }else if(p.type==='queens'){
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-bottom:8px;" id="aip-court-${courtIdx}">
        <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;color:var(--charcoal);margin-bottom:6px;">
          CT <input type="number" id="aip-ct-${courtIdx}" value="${p.court}" min="1" max="8" style="width:44px;padding:3px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
          ${data.numRounds>1?`<span style="font-size:10px;color:var(--gray);margin-left:6px;">Round ${currentRound}</span>`:''}
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:4px;">Team A</div>
        <div class="form-row" style="margin-bottom:6px;">
          <select class="form-select" id="aip-a1-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.teamA.split('&')[0]?.trim())}</select>
          <select class="form-select" id="aip-a2-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.teamA.split('&')[1]?.trim())}</select>
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--blue);margin-bottom:4px;">Team B</div>
        <div class="form-row">
          <select class="form-select" id="aip-b1-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.teamB.split('&')[0]?.trim())}</select>
          <select class="form-select" id="aip-b2-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.teamB.split('&')[1]?.trim())}</select>
        </div>
        <input type="hidden" id="aip-type-${courtIdx}" value="queens">
        <input type="hidden" id="aip-round-${courtIdx}" value="${currentRound}">
      </div>`;
      courtIdx++;
    }else if(p.type==='pair'){
      h+=`<div style="background:var(--off-white);border-radius:8px;padding:10px;margin-bottom:8px;">
        <div style="font-family:'Bebas Neue';font-size:12px;letter-spacing:1px;color:var(--charcoal);margin-bottom:6px;">
          CT <input type="number" id="aip-ct-${courtIdx}" value="${p.court}" min="1" max="8" style="width:44px;padding:3px;border:1px solid var(--gray-lighter);border-radius:4px;font-size:13px;font-weight:700;">
        </div>
        <div class="form-row">
          <select class="form-select" id="aip-p1-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.players.split('+')[0]?.trim())}</select>
          <select class="form-select" id="aip-p2-${courtIdx}" style="padding:6px;font-size:12px;">${playerOpts(p.players.split('+')[1]?.trim())}</select>
        </div>
        <input type="hidden" id="aip-type-${courtIdx}" value="pair">
        <input type="hidden" id="aip-round-${courtIdx}" value="1">
      </div>`;
      courtIdx++;
    }
  });
  window._aiPairingData.courtCount=courtIdx;
  h+=`<div style="display:flex;gap:8px;margin-top:12px;">
    <button class="btn btn-success btn-small" id="aip-save-btn" style="flex:1;" onclick="saveAIAssignment(this)">💾 Save to Live Score Entry</button>
    <button class="btn btn-secondary btn-small" onclick="generateAIPairings()">↩ Regenerate</button>
  </div>`;
  container.innerHTML=h;
}

function saveAIAssignment(btnEl){
  const data=window._aiPairingData;
  if(!data){toast('No pairings to save');return;}
  // Prevent double-save
  const saveBtn=btnEl||document.getElementById('aip-save-btn');
  if(saveBtn){saveBtn.disabled=true;saveBtn.textContent='Saving...';}

  const context=data.context||'gameday';
  const type=context==='queens'?'queens':context==='scrimmage'?'scrimmage':'gameday';
  const numRounds=data.numRounds||1;
  const hasForm=!!document.getElementById('aip-ct-0');

  // Read date/opp/loc/time from edit form if showing, else from generator fields
  const date=(hasForm?document.getElementById('aip-date')?.value:null)||data.aiDate||td();
  const opp=(hasForm?document.getElementById('aip-opp')?.value.trim():null)||null;
  const loc=(hasForm?document.getElementById('aip-location')?.value:null)||data.aiLocation||SC.homeVenue||'Tom Brown';
  const atime=(hasForm?document.getElementById('aip-time')?.value:null)||data.aiTime||'';

  // Helper: deterministic ID prevents duplicates if saved twice
  function assignId(rnd){return 'asgn_'+date+'_'+type+'_r'+rnd;}

  let totalSaved=0;

  if(hasForm){
    // ── Save from edit form ──────────────────────────────────────
    const courtCount=data.courtCount||0;
    if(numRounds>1){
      const roundCourts={};
      for(let i=0;i<courtCount;i++){
        const ct=parseInt(document.getElementById('aip-ct-'+i)?.value)||1;
        const rnd=parseInt(document.getElementById('aip-round-'+i)?.value)||1;
        const aipType=document.getElementById('aip-type-'+i)?.value||'pair';
        if(!roundCourts[rnd])roundCourts[rnd]=[];
        if(aipType==='queens'){
          const a1=nameToId(document.getElementById('aip-a1-'+i)?.value);
          const a2=nameToId(document.getElementById('aip-a2-'+i)?.value);
          const b1=nameToId(document.getElementById('aip-b1-'+i)?.value);
          const b2=nameToId(document.getElementById('aip-b2-'+i)?.value);
          if(a1&&a2)roundCourts[rnd].push({court:ct,p1:a1,p2:a2,b1:b1||null,b2:b2||null});
        }else{
          const p1=nameToId(document.getElementById('aip-p1-'+i)?.value);
          const p2=nameToId(document.getElementById('aip-p2-'+i)?.value);
          if(p1&&p2)roundCourts[rnd].push({court:ct,p1,p2});
        }
      }
      Object.entries(roundCourts).forEach(([rnd,courts])=>{
        if(!courts.length)return;
        const id=assignId(rnd);
        fbSet('assignments/'+id,{id,date,type,location:loc,time:atime,opponent:opp,courts,
          notes:'Round '+rnd+' of '+numRounds,round:parseInt(rnd),totalRounds:numRounds,createdAt:td()});
        totalSaved++;
      });
    }else{
      const courts=[];
      for(let i=0;i<courtCount;i++){
        const ct=parseInt(document.getElementById('aip-ct-'+i)?.value)||1;
        const aipType=document.getElementById('aip-type-'+i)?.value||'pair';
        if(aipType==='queens'){
          const a1=nameToId(document.getElementById('aip-a1-'+i)?.value);
          const a2=nameToId(document.getElementById('aip-a2-'+i)?.value);
          const b1=nameToId(document.getElementById('aip-b1-'+i)?.value);
          const b2=nameToId(document.getElementById('aip-b2-'+i)?.value);
          if(a1&&a2)courts.push({court:ct,p1:a1,p2:a2,b1:b1||null,b2:b2||null});
        }else{
          const p1=nameToId(document.getElementById('aip-p1-'+i)?.value);
          const p2=nameToId(document.getElementById('aip-p2-'+i)?.value);
          if(p1&&p2)courts.push({court:ct,p1,p2});
        }
      }
      if(!courts.length){
        toast('No courts to save');
        if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='💾 Save to Live Score Entry';}
        return;
      }
      const id=assignId(1);
      fbSet('assignments/'+id,{id,date,type,location:loc,time:atime,opponent:opp,courts,createdAt:td()});
      totalSaved=1;
    }
  }else{
    // ── Save directly from parsed AI data (no edit form open) ───
    if(numRounds>1){
      const roundCourts={};let currentRound=1;
      data.parsed.forEach(p=>{
        if(p.type==='round'){currentRound=parseInt(p.num);return;}
        if(!roundCourts[currentRound])roundCourts[currentRound]=[];
        if(p.type==='queens'){
          const a1=nameToId(p.teamA.split('&')[0]?.trim());
          const a2=nameToId(p.teamA.split('&')[1]?.trim());
          const b1=nameToId(p.teamB.split('&')[0]?.trim());
          const b2=nameToId(p.teamB.split('&')[1]?.trim());
          if(a1&&a2)roundCourts[currentRound].push({court:p.court,p1:a1,p2:a2,b1:b1||null,b2:b2||null});
        }else if(p.type==='pair'){
          const p1=nameToId(p.players.split('+')[0]?.trim());
          const p2=nameToId(p.players.split('+')[1]?.trim());
          if(p1&&p2)roundCourts[currentRound].push({court:p.court,p1,p2});
        }
      });
      Object.entries(roundCourts).forEach(([rnd,courts])=>{
        if(!courts.length)return;
        const id=assignId(rnd);
        fbSet('assignments/'+id,{id,date,type,location:loc,time:atime,opponent:opp,courts,
          notes:'Round '+rnd+' of '+numRounds,round:parseInt(rnd),totalRounds:numRounds,createdAt:td()});
        totalSaved++;
      });
    }else{
      const courts=[];
      data.parsed.forEach(p=>{
        if(p.type==='queens'){
          const a1=nameToId(p.teamA.split('&')[0]?.trim());
          const a2=nameToId(p.teamA.split('&')[1]?.trim());
          const b1=nameToId(p.teamB.split('&')[0]?.trim());
          const b2=nameToId(p.teamB.split('&')[1]?.trim());
          if(a1&&a2)courts.push({court:p.court,p1:a1,p2:a2,b1:b1||null,b2:b2||null});
        }else if(p.type==='pair'){
          const p1=nameToId(p.players.split('+')[0]?.trim());
          const p2=nameToId(p.players.split('+')[1]?.trim());
          if(p1&&p2)courts.push({court:p.court,p1,p2});
        }
      });
      if(!courts.length){
        toast('No courts to save');
        if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='💾 Save to Live Score Entry';}
        return;
      }
      const id=assignId(1);
      fbSet('assignments/'+id,{id,date,type,location:loc,time:atime,opponent:opp,courts,createdAt:td()});
      totalSaved=1;
    }
  }

  if(!totalSaved){toast('Nothing to save — check player selections');if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='💾 Save to Live Score Entry';}return;}

  // Show confirmation in the result container
  const container=document.getElementById('ai-pairings-result');
  if(container){
    const tLabel={gameday:'Dual',scrimmage:'Scrimmage',queens:'Queens'}[type]||type;
    const rndNote=numRounds>1?` (${totalSaved} rounds)`:'';
    container.innerHTML=`<div style="background:var(--green-bg);border:1px solid var(--green);border-radius:10px;padding:16px;text-align:center;">
      <div style="font-family:'Bebas Neue';font-size:18px;letter-spacing:1.5px;color:var(--green);margin-bottom:6px;">✓ ${tLabel} Saved${rndNote}</div>
      <div style="font-size:12px;color:var(--gray);margin-bottom:12px;">${fD(date)}${opp?' vs '+opp:''} · ${loc}</div>
      <button class="btn btn-blue btn-small" onclick="
        document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
        const dt=document.querySelector('.tab[data-tab=\\'duals\\']');
        if(dt){dt.classList.add('active');document.getElementById('tab-duals').classList.add('active');renderDuals();renderLiveAssignmentList();}
      ">🏐 Open Live Score Entry →</button>
      <button class="btn btn-secondary btn-small" style="margin-left:8px;" onclick="generateAIPairings()">↩ Generate New</button>
    </div>`;
  }
  window._aiPairingData=null;
  renderAssignments();
}

// Helper: convert "First Last" name string back to player ID
function nameToId(fullName){
  if(!fullName)return null;
  const n=fullName.trim().toLowerCase();
  const p=D.players.find(x=>(x.firstName+' '+x.lastName).toLowerCase()===n);
  return p?p.id:null;
}

// ============================================================
// SEED MISSING DUAL DATA (CCS, FSU HS, Mosley)
// ============================================================
function seedMissingDuals(){return;//disabled
  if(!db){toast('Not connected');return;}
  const MISSING=[
    // Community Christian 2/24 — W 4-1
    {date:'2026-02-24',court:1,pair:['p01','p10'],opponent:'Community Christian CT1',sets:[{scoreUs:21,scoreThem:19},{scoreUs:16,scoreThem:21},{scoreUs:15,scoreThem:7}]},
    {date:'2026-02-24',court:2,pair:['p16','p08'],opponent:'Community Christian CT2',sets:[{scoreUs:21,scoreThem:15},{scoreUs:21,scoreThem:19}]},
    {date:'2026-02-24',court:3,pair:['p13','p06'],opponent:'Community Christian CT3',sets:[{scoreUs:21,scoreThem:9},{scoreUs:21,scoreThem:7}]},
    {date:'2026-02-24',court:4,pair:['p02','p09'],opponent:'Community Christian CT4',sets:[{scoreUs:16,scoreThem:21},{scoreUs:22,scoreThem:20},{scoreUs:13,scoreThem:15}]},
    {date:'2026-02-24',court:5,pair:['p11','p15'],opponent:'Community Christian CT5',sets:[{scoreUs:21,scoreThem:0},{scoreUs:21,scoreThem:7}]},
    {date:'2026-02-24',court:6,pair:['p05','p03'],opponent:'Community Christian Exhibition',sets:[{scoreUs:21,scoreThem:10},{scoreUs:21,scoreThem:9}],isExhibition:true},
    // Florida State University HS 3/3 — L 2-3
    {date:'2026-03-03',court:1,pair:['p01','p10'],opponent:'Florida State University HS CT1',sets:[{scoreUs:16,scoreThem:21},{scoreUs:23,scoreThem:21},{scoreUs:17,scoreThem:19}]},
    {date:'2026-03-03',court:2,pair:['p16','p08'],opponent:'Florida State University HS CT2',sets:[{scoreUs:17,scoreThem:21},{scoreUs:18,scoreThem:21}]},
    {date:'2026-03-03',court:3,pair:['p13','p06'],opponent:'Florida State University HS CT3',sets:[{scoreUs:21,scoreThem:10},{scoreUs:18,scoreThem:21},{scoreUs:15,scoreThem:11}]},
    {date:'2026-03-03',court:4,pair:['p02','p03'],opponent:'Florida State University HS CT4',sets:[{scoreUs:8,scoreThem:21},{scoreUs:21,scoreThem:14},{scoreUs:11,scoreThem:15}]},
    {date:'2026-03-03',court:5,pair:['p11','p15'],opponent:'Florida State University HS CT5',sets:[{scoreUs:21,scoreThem:16},{scoreUs:21,scoreThem:15}]},
    {date:'2026-03-03',court:6,pair:['p05','p09'],opponent:'Florida State University HS Exhibition',sets:[{scoreUs:23,scoreThem:21},{scoreUs:16,scoreThem:21},{scoreUs:15,scoreThem:7}],isExhibition:true},
    {date:'2026-03-03',court:7,pair:['p07','p12'],opponent:'Florida State University HS Exhibition',sets:[{scoreUs:11,scoreThem:21}],isExhibition:true},
    {date:'2026-03-03',court:8,pair:['p12','p14'],opponent:'Florida State University HS Exhibition',sets:[{scoreUs:16,scoreThem:21}],isExhibition:true},
    // Mosley 3/5 — W 3-2
    {date:'2026-03-05',court:1,pair:['p01','p16'],opponent:'Mosley CT1',sets:[{scoreUs:21,scoreThem:14},{scoreUs:21,scoreThem:15}]},
    {date:'2026-03-05',court:2,pair:['p10','p08'],opponent:'Mosley CT2',sets:[{scoreUs:21,scoreThem:18},{scoreUs:21,scoreThem:17}]},
    {date:'2026-03-05',court:3,pair:['p13','p06'],opponent:'Mosley CT3',sets:[{scoreUs:21,scoreThem:6},{scoreUs:21,scoreThem:11}]},
    {date:'2026-03-05',court:4,pair:['p11','p15'],opponent:'Mosley CT4',sets:[{scoreUs:20,scoreThem:22},{scoreUs:14,scoreThem:21}]},// ⚠️ Set 2 score unclear on sheet — verify & correct if needed
    {date:'2026-03-05',court:5,pair:['p02','p03'],opponent:'Mosley CT5',sets:[{scoreUs:16,scoreThem:21},{scoreUs:22,scoreThem:20},{scoreUs:9,scoreThem:15}]},
    {date:'2026-03-05',court:6,pair:['p05','p07'],opponent:'Mosley Exhibition',sets:[{scoreUs:21,scoreThem:12},{scoreUs:16,scoreThem:21},{scoreUs:15,scoreThem:6}],isExhibition:true},
    {date:'2026-03-05',court:7,pair:['p09','p04'],opponent:'Mosley Exhibition',sets:[{scoreUs:21,scoreThem:8},{scoreUs:17,scoreThem:15}],isExhibition:true},
    {date:'2026-03-05',court:8,pair:['p12','p14'],opponent:'Mosley Exhibition',sets:[{scoreUs:12,scoreThem:21}],isExhibition:true},
  ];
  const u={};let skipped=0;
  MISSING.forEach(function(m){
    // Skip if a match for this pair+date already exists
    const already=D.gamedays.find(function(g){
      return g.date===m.date&&g.pair&&g.pair.length===2&&
        g.pair.slice().sort().join()==m.pair.slice().sort().join();
    });
    if(already){skipped++;return;}
    const id=gi('gd');
    const stats={};m.pair.forEach(function(pid){stats[pid]={k:0,b:0,a:0,se:0,re:0,he:0,de:0};});
    const sets=m.sets.map(function(s){return{scoreUs:s.scoreUs,scoreThem:s.scoreThem,stats:JSON.parse(JSON.stringify(stats))};});
    u[DB_ROOT+'/gamedays/'+id]={id:id,date:m.date,court:m.court,pair:m.pair,opponent:m.opponent,sets:sets,isExhibition:m.isExhibition||false};
  });
  const statusEl=document.getElementById('seed-missing-status');
  if(!Object.keys(u).length){
    if(statusEl)statusEl.textContent='✓ All data already in Firebase ('+skipped+' courts skipped)';
    toast('All data already present');return;
  }
  db.ref().update(u,function(err){
    if(err){toast('Error: '+err.message);return;}
    const msg='✓ Added '+Object.keys(u).length+' court records'+(skipped?' ('+skipped+' already existed)':'')+'! ⚠️ Check Mosley CT4 Set 2 score.';
    if(statusEl)statusEl.textContent=msg;
    toast('Done! '+Object.keys(u).length+' courts added');
  });
}


// ============================================================
// LEON QUEENS FAN PAGE
// ============================================================
function lfToggle(uid){var el=document.getElementById(uid+'_body');if(el)el.style.display=el.style.display==='none'?'block':'none';}

var _lfRefreshTimer=null;

function showLeonFans(){
  var loginOl=document.getElementById('login-overlay');
  if(loginOl)loginOl.classList.add('hidden');
  var ol=document.getElementById('school-fans-overlay');
  if(ol){ol.style.display='block';renderFans();history.pushState({fanPage:true},'');}
  // Auto-refresh every 30 seconds while page is open
  if(_lfRefreshTimer)clearInterval(_lfRefreshTimer);
  _lfRefreshTimer=setInterval(function(){
    var overlay=document.getElementById('school-fans-overlay');
    if(!overlay||overlay.style.display==='none'){clearInterval(_lfRefreshTimer);_lfRefreshTimer=null;return;}
    renderFans();
    // Flash the refresh indicator
    var dot=document.getElementById('lf-refresh-dot');
    if(dot){dot.style.opacity='1';setTimeout(function(){dot.style.opacity='0.4';},600);}
  },30000);
}

function hideFans(){
  var ol=document.getElementById('school-fans-overlay');
  if(ol)ol.style.display='none';
  // Stop auto-refresh
  if(_lfRefreshTimer){clearInterval(_lfRefreshTimer);_lfRefreshTimer=null;}
  if(!currentRole){
    var loginOl=document.getElementById('login-overlay');
    if(loginOl)loginOl.classList.remove('hidden');
  }
}

function hideLeonFans(){hideFans();}

function lfManualRefresh(){
  renderFans();
  var dot=document.getElementById('lf-refresh-dot');
  if(dot){dot.style.opacity='1';setTimeout(function(){dot.style.opacity='0.4';},600);}
}

// ============================================================
// ATHLETE CARD (shareable player profile, internal-only for now)
// ============================================================
// Demo-only athlete academics/club info, keyed by player id. In-memory only: edited via the coach
// modal (coachSaveAthleteInfo) and shown on the athlete card. Never persisted, resets on refresh.
// Seeded for the Sand Sharks demo roster; other configs start empty and fall back to the COMING SOON rows.
let _demoAthleteInfo={
  sd01:{gpa:'4.0',sat:'1290',act:'28',major:'Sports Medicine',club:'Gulf Coast Juniors 18s',years:'5',tourney:'AAU Nationals, top 12 finish 2025'},
  sd02:{gpa:'3.8',sat:'1240',act:'27',major:'Marketing',club:'Emerald Coast VBC 18-1',years:'4',tourney:'USAV Nationals qualifier 2025'},
  sd03:{gpa:'3.6',sat:'1180',act:'25',major:'Kinesiology',club:'Panhandle Beach Elite',years:'4',tourney:'AAU Nationals, pool play 2025'},
  sd04:{gpa:'3.9',sat:'1260',act:'27',major:'Business',club:'30A Beach Club 18s',years:'3',tourney:'USAV Florida Region champions 2025'},
  sd05:{gpa:'3.5',sat:'1150',act:'24',major:'Nursing',club:'Gulf Coast Juniors 17s',years:'3',tourney:'AAU Grand Prix, top 20 2025'},
  sd06:{gpa:'3.7',sat:'1210',act:'26',major:'Communications',club:'Emerald Coast VBC 17-1',years:'4',tourney:'USAV Nationals qualifier 2024'},
  sd07:{gpa:'3.4',sat:'1100',act:'23',major:'Education',club:'Panhandle Beach Elite',years:'2',tourney:'Florida Region top 8 2025'},
  sd08:{gpa:'3.8',sat:'1230',act:'27',major:'Exercise Science',club:'30A Beach Club 17s',years:'3',tourney:'AAU Nationals, pool play 2024'},
  sd09:{gpa:'4.1',sat:'1330',act:'30',major:'Engineering',club:'Gulf Coast Juniors 18s',years:'6',tourney:'AAU Nationals, top 8 finish 2025'},
  sd10:{gpa:'3.9',sat:'1280',act:'28',major:'Psychology',club:'Emerald Coast VBC 18-1',years:'5',tourney:'USAV Nationals, day 3 finish 2025'},
  sd11:{gpa:'3.6',sat:'1170',act:'25',major:'Health Sciences',club:'Panhandle Beach Elite',years:'4',tourney:'AAU Grand Prix, top 15 2025'},
  sd12:{gpa:'3.3',sat:'1080',act:'22',major:'Undecided',club:'30A Beach Club 16s',years:'2',tourney:'Florida Region qualifier 2025'},
  sd13:{gpa:'3.7',sat:'1200',act:'26',major:'Biology',club:'Gulf Coast Juniors 17s',years:'3',tourney:'AAU Nationals, pool play 2025'},
  sd14:{gpa:'3.5',sat:'1140',act:'24',major:'Graphic Design',club:'Emerald Coast VBC 16-1',years:'2',tourney:'Florida Region top 10 2025'},
  sd15:{gpa:'4.0',sat:'1300',act:'29',major:'Pre-Law',club:'Panhandle Beach Elite',years:'5',tourney:'AAU Nationals, top 10 finish 2024'},
  sd16:{gpa:'3.8',sat:'1220',act:'27',major:'Athletic Training',club:'30A Beach Club 17s',years:'3',tourney:'USAV Nationals qualifier 2025'}
};
// Coach-side athlete-info editor (demo only). Reads the modal inputs, updates the in-memory dataset,
// toasts, and does NOT write to Firebase. Reopening the athlete card reflects the edit for the session.
function coachSaveAthleteInfo(){
  const ov=document.getElementById('coach-player-overlay'); const pid=ov&&ov.dataset.pid; if(!pid)return;
  const gv=id=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  _demoAthleteInfo[pid]={gpa:gv('cpm-ai-gpa'),sat:gv('cpm-ai-sat'),act:gv('cpm-ai-act'),major:gv('cpm-ai-major'),club:gv('cpm-ai-club'),years:gv('cpm-ai-years'),tourney:gv('cpm-ai-tourney')};
  toast('Athlete info saved for this demo session');
}
function showAthleteCard(pid){
  var ol=document.getElementById('athlete-overlay');
  if(!ol)return;
  ol.dataset.pid=pid;
  var loginOl=document.getElementById('login-overlay');
  if(loginOl)loginOl.classList.add('hidden');
  ol.style.display='block';
  renderAthleteCard(pid);
  history.pushState({athletePage:true},'');
  // No auto-refresh timer: this is a static profile, not a live scoreboard.
}

function hideAthleteCard(){
  var ol=document.getElementById('athlete-overlay');
  if(ol)ol.style.display='none';
  if(!currentRole){
    var loginOl=document.getElementById('login-overlay');
    if(loginOl)loginOl.classList.remove('hidden');
  }
}

function renderAthleteCard(pid){
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var BN="font-family:'Bebas Neue',sans-serif", BODY="font-family:'Barlow',sans-serif";
  var RED=SC.colors.primary, DARK=SC.colors.primaryDeeper, GOLD=SC.colors.gold||'#d4a843';
  var rp=gP(pid)||{};                          // roster record: name, jersey, csRank, photo
  var pp=(profilesData&&profilesData.players&&profilesData.players[pid])||{}; // identity: height, reach, gradYear, position, side, hand
  var person=Object.assign({}, rp, pp);        // merged for avatar (name from roster, identity/photo layered on)

  // ac-header: avatar, name, class of gradYear, shared glance line, CS rating when present.
  var hdr=document.getElementById('ac-header');
  if(hdr){
    var name=((rp.firstName||'')+' '+(rp.lastName||'')).trim()||pN(pid);
    var glance=athleteGlanceLine(pid);
    var rating=(rp.csRank!=null&&rp.csRank!==0)?rp.csRank:null; // csRank lives on the roster record; omit when absent or unassessed (0)
    hdr.innerHTML=
      '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:6px 0 14px;">'
      +'<div style="margin-bottom:10px;">'+avatarHtml(person,96)+'</div>'
      +'<div style="'+BN+';font-size:34px;letter-spacing:2px;color:#fff;line-height:1;">'+esc(name)+'</div>'
      +(pp.gradYear?'<div style="'+BN+';font-size:14px;letter-spacing:2px;color:'+GOLD+';margin-top:4px;">CLASS OF '+esc(pp.gradYear)+'</div>':'')
      +(glance?'<div style="'+BODY+';font-size:13px;color:rgba(255,255,255,0.85);margin-top:8px;">'+esc(glance)+'</div>':'')
      +(rating!=null?'<div style="'+BN+';font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.6);margin-top:6px;">CS RATING '+esc(rating)+'</div>':'')
      +'</div>';
  }

  // Strict per-season team dual record from schedule (seasonId===S, NO null fallback) so a future
  // unstamped straggler cannot leak into every season row. The career headline is the sum of these,
  // keeping the headline and the per-season strip consistent.
  function teamDualRec(S){
    var g=(D.schedule||[]).filter(function(x){return x.seasonId===S && x.type!=='scrimmage' && x.scoreUs!=null && x.scoreUs!=='' && x.scoreThem!=null && x.scoreThem!=='';});
    var w=0,l=0; g.forEach(function(x){ parseInt(x.scoreUs)>parseInt(x.scoreThem)?w++:l++; });
    return {w:w,l:l};
  }
  var seasons=allSeasonIds();
  var careerW=0,careerL=0; seasons.forEach(function(S){var r=teamDualRec(S); careerW+=r.w; careerL+=r.l;});
  var careerTot=careerW+careerL;
  var careerPct=careerTot?Math.round((careerW/careerTot)*100):0;

  // ac-record LEADS: headline is career dual W-L and win percentage. Player set/skill detail is secondary text only.
  var rec=document.getElementById('ac-record');
  if(rec){
    var cs=combinedStats(pid,{allSeasons:true}); // player career detail (secondary only)
    var setsLine='Sets '+(cs.gdSets||0)+' · +/- '+((cs.totalDiff>=0?'+':'')+cs.totalDiff);
    var queensLine=(cs.qGP>0)?('Queens '+cs.qWins+'-'+cs.qLosses):'';
    var secondary=esc(setsLine)+(queensLine?' · '+esc(queensLine):'');
    // Individual pair-match record from gamedays. combinedStats does not surface matchesWon/matchesLost, so read extStats directly.
    var indStats=extStats(pid, D.gamedays||[], {allSeasons:true});
    var indW=indStats.matchesWon||0, indL=indStats.matchesLost||0, hasInd=(indW+indL)>0;
    var headLabel, headNum, headPct, subLine;
    if(hasInd){
      // Auto-promote: once real gameday data exists, the athlete's own pair-match record leads; the team dual record moves to a muted secondary line.
      var indTot=indW+indL;
      headLabel='CAREER MATCHES'; headNum=indW+'-'+indL; headPct=indTot?Math.round((indW/indTot)*100):0;
      subLine='Team duals '+careerW+'-'+careerL;
    } else {
      // No individual data yet (today's live Leon state): keep the team-dual headline exactly as before, and show no 0-0 individual placeholder.
      headLabel='CAREER DUALS'; headNum=careerW+'-'+careerL; headPct=careerPct;
      subLine='';
    }
    rec.innerHTML=
      '<div style="background:#ffffff;border-radius:14px;padding:18px 16px;margin-bottom:14px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.15);">'
      +'<div style="'+BN+';font-size:12px;letter-spacing:3px;color:'+RED+';margin-bottom:6px;">'+headLabel+'</div>'
      +'<div style="'+BN+';font-size:52px;line-height:1;color:'+DARK+';">'+headNum+'</div>'
      +'<div style="'+BN+';font-size:18px;letter-spacing:1px;color:'+GOLD+';margin-top:4px;">'+headPct+'% WIN</div>'
      +(subLine?'<div style="'+BODY+';font-size:12px;color:#aaa;margin-top:8px;">'+esc(subLine)+'</div>':'')
      +'<div style="'+BODY+';font-size:12px;color:#888;margin-top:'+(subLine?'4px':'10px')+';">'+secondary+'</div>'
      +'</div>';
  }

  // ac-seasons: per-season strip. Team record strict via teamDualRec(S); player detail strict via combinedStats(pid,{season:S}).
  var seasBox=document.getElementById('ac-seasons');
  if(seasBox){
    var rows=seasons.map(function(S){
      var t=teamDualRec(S);
      var pcs=combinedStats(pid,{season:S});
      var detail=(pcs.qGP>0?('Q '+pcs.qWins+'-'+pcs.qLosses+'  '):'')+'Sets '+(pcs.gdSets||0);
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.15);">'
        +'<div style="'+BN+';font-size:18px;letter-spacing:1px;color:#fff;">'+esc(S)+'</div>'
        +'<div style="text-align:right;">'
        +'<div style="'+BN+';font-size:18px;color:'+GOLD+';">'+t.w+'-'+t.l+' <span style="font-size:11px;color:rgba(255,255,255,0.6);">DUALS</span></div>'
        +'<div style="'+BODY+';font-size:11px;color:rgba(255,255,255,0.7);">'+esc(detail)+'</div>'
        +'</div></div>';
    }).join('');
    seasBox.innerHTML=
      '<div style="'+BN+';font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.9);margin:4px 0 8px;">BY SEASON</div>'
      +'<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;overflow:hidden;margin-bottom:14px;">'+rows+'</div>';
  }

  // ac-athletic: read the same underlying data the modal athletic blocks use (identity height/reach,
  // latest jumpTests block/approach, best star drill) and render fresh here. We do NOT call
  // coachRenderVertHistory / coachRenderDrillHistory: those write into the cpm-* modal mounts.
  var ath=document.getElementById('ac-athletic');
  if(ath){
    var verts=Object.values((profilesData&&(profilesData.jumpTests||profilesData.verticals))||{})
      .filter(function(v){return v.playerId===pid||v.player===pid;}).sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
    var latest=verts[0]||{};
    var drills=Object.values((profilesData&&profilesData.starDrills)||{}).filter(function(d){return d.playerId===pid||d.player===pid;});
    var bestDrill=drills.length?Math.min.apply(null,drills.map(function(d){return d.time;})):null;
    var items=[];
    if(pp.height)items.push(['Height',pp.height]);
    if(pp.reach)items.push(['Standing Reach',pp.reach]);
    var bj=latest.blockJump||latest.block||latest.blockJumpTouch||'';
    var aj=latest.approachJump||latest.approach||latest.approachJumpTouch||'';
    if(bj)items.push(['Block Jump',bj]);
    if(aj)items.push(['Approach Jump',aj]);
    if(bestDrill!=null)items.push(['Best Star Drill',bestDrill.toFixed(1)+'s']);
    var rowsA=items.map(function(it){
      return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);">'
        +'<span style="'+BODY+';font-size:13px;color:rgba(255,255,255,0.7);">'+esc(it[0])+'</span>'
        +'<span style="'+BN+';font-size:17px;color:#fff;">'+esc(it[1])+'</span></div>';
    }).join('');
    ath.innerHTML=
      '<div style="'+BN+';font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.9);margin:4px 0 8px;">ATHLETIC</div>'
      +'<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:6px 14px;margin-bottom:14px;">'
      +(rowsA||'<div style="'+BODY+';font-size:12px;color:rgba(255,255,255,0.6);text-align:center;padding:10px;">No measurements yet</div>')
      +'</div>';
  }

  // College-profile preview sections: field LABELS AND STRUCTURE ONLY, clearly marked COMING SOON.
  // No fabricated data anywhere: every value cell is a neutral dash. Display-only, no Firebase writes, no new profile fields.
  var csBadge='<span style="'+BN+';font-size:10px;letter-spacing:1px;color:'+GOLD+';padding:2px 8px;border:1px solid '+GOLD+';border-radius:10px;margin-left:8px;">COMING SOON</span>';
  function csRow(label,val){
    var has=(val!=null&&val!=='');
    return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.12);">'
      +'<span style="'+BODY+';font-size:13px;color:rgba(255,255,255,0.7);">'+esc(label)+'</span>'
      +'<span style="'+BN+';font-size:17px;color:rgba(255,255,255,'+(has?'0.9':'0.4')+');">'+(has?esc(val):'-')+'</span></div>';
  }
  function csSection(title, bodyHtml, helper, live){
    return '<div style="opacity:'+(live?'1':'0.55')+';margin-bottom:14px;">'
      +'<div style="display:flex;align-items:center;margin:4px 0 8px;"><span style="'+BN+';font-size:13px;letter-spacing:2px;color:rgba(255,255,255,0.9);">'+title+'</span>'+(live?'':csBadge)+'</div>'
      +'<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:6px 14px;">'+bodyHtml+'</div>'
      +'<div style="'+BODY+';font-size:11px;color:rgba(255,255,255,0.65);margin-top:6px;">'+esc(helper)+'</div>'
      +'</div>';
  }

  // Demo-only academics/club values; null (live schools, or an unseeded demo id) falls back to the COMING SOON rows.
  var _ai=SC.demoMode?_demoAthleteInfo[pid]:null;
  var acad=document.getElementById('ac-academics');
  if(acad){
    if(_ai){
      acad.innerHTML=csSection('ACADEMICS',
        csRow('GPA',_ai.gpa)+csRow('SAT',_ai.sat)+csRow('ACT',_ai.act)+csRow('Intended Major',_ai.major),
        'Demo preview. Real academics are shared once a parent approves the profile.', true);
    }else{
      acad.innerHTML=csSection('ACADEMICS',
        csRow('GPA')+csRow('SAT')+csRow('ACT')+csRow('Intended Major'),
        'Academics are coming with the full athlete profile, shared once a parent approves it.');
    }
  }

  var club=document.getElementById('ac-club');
  if(club){
    if(_ai){
      club.innerHTML=csSection('CLUB & TOURNAMENTS',
        csRow('Club Team',_ai.club)+csRow('Years Club Experience',_ai.years)+csRow('National Tournament Results (USAV / AAU / AVP)',_ai.tourney),
        'Demo preview. Club history is shared once a parent approves the profile.', true);
    }else{
      club.innerHTML=csSection('CLUB & TOURNAMENTS',
        csRow('Club Team')+csRow('Years Club Experience')+csRow('National Tournament Results (USAV / AAU / AVP)'),
        'Club history and tournament results are coming with the full athlete profile, shared once a parent approves it.');
    }
  }

  var hi=document.getElementById('ac-highlights');
  if(hi){
    var hiBody='<div style="'+BODY+';font-size:13px;color:rgba(255,255,255,0.6);text-align:center;padding:14px;">Highlight reel and match photos will live here.</div>';
    hi.innerHTML=csSection('HIGHLIGHT VIDEO & PHOTOS', hiBody,
      'Video and photo highlights are coming with the full athlete profile, shared once a parent approves it.');
  }

  // MAKE PUBLIC renders LAST, into its own mount below every section. Definition and use are adjacent so a future
  // edit to the ATHLETIC section cannot break this. Display-only stub: disabled button, no Firebase write.
  // athleteOptIn is intentionally NOT created or written here; it stays a future field for the parent-accounts step.
  var shareHtml=
    '<div style="opacity:0.55;margin-bottom:8px;">'
    +'<button disabled style="width:100%;'+BN+';font-size:15px;letter-spacing:1.5px;padding:11px;border-radius:10px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.10);color:#fff;cursor:not-allowed;">MAKE PUBLIC</button>'
    +'<div style="'+BODY+';font-size:11px;color:rgba(255,255,255,0.65);text-align:center;margin-top:6px;">Public sharing requires parent approval. Coming with parent accounts.</div>'
    +'</div>';
  var share=document.getElementById('ac-share');
  if(share)share.innerHTML=shareHtml;
}

function renderFans(){
  var BN='font-family:"Bebas Neue",sans-serif';
  var WIN_C='#0a9e5c',LOSS_C='#e63946',RED=SC.colors.primary,DARK_RED=SC.colors.primaryDeeper,GOLD=SC.colors.gold||'#d4a843';
  var today=td();
  var TIER={1:'Top',2:'Mid',3:'Dev',4:'Court 4',5:'Court 5'};

  var ROSTER=(D.players||[]).slice().sort(function(a,b){return (parseInt(a.jersey)||999)-(parseInt(b.jersey)||999);}).map(function(p){
    return {jersey:p.jersey||'',name:p.firstName+' '+p.lastName,cls:p.classYear||''};
  });

  var allSched=(D.schedule||[]).filter(inSeason).sort(function(a,b){return (a.date||'').localeCompare(b.date||'');});
  var schedPast=allSched.filter(function(g){return g.type!=='scrimmage'&&g.scoreUs!=null&&g.scoreUs!==''&&g.scoreThem!=null&&g.scoreThem!=='';});
  var schedUpcoming=allSched.filter(function(g){return (g.scoreUs==null||g.scoreUs==='')&&g.date>=today;});
  var schedToday=allSched.find(function(g){return g.date===today;});

  var dW=schedPast.filter(function(d){return parseInt(d.scoreUs)>parseInt(d.scoreThem);}).length;
  var dL=schedPast.filter(function(d){return parseInt(d.scoreThem)>parseInt(d.scoreUs);}).length;
  var recEl=document.getElementById('lf-record');
  if(recEl)recEl.textContent=dW+'-'+dL;

  var gdByDate={};
  (D.gamedays||[]).filter(inSeason).forEach(function(m){if(!gdByDate[m.date])gdByDate[m.date]={};gdByDate[m.date][m.court]=m;});

  var PAST=schedPast.map(function(g){
    var gd=gdByDate[g.date]||{},courts=[];
    for(var ct=1;ct<=5;ct++){
      var m=gd[ct];if(!m)continue;
      var sets=(m.sets||[]);
      var sw=sets.filter(function(s){return (s.scoreUs||0)>(s.scoreThem||0);}).length;
      var setStr=sets.map(function(s){return s.scoreUs+'-'+s.scoreThem;}).join(', ');
      var pairLabel=(m.pair||[]).map(function(pid){var p=(D.players||[]).find(function(x){return x.id===pid;});return p?(p.firstName+' '+p.lastName.charAt(0)+'.'+(p.jersey?' #'+p.jersey:'')):'';}).filter(Boolean).join(' & ');
      courts.push({ct:ct,pair:pairLabel||m.opponent||'CT'+ct,sets:setStr,win:sw>(sets.length-sw)});
    }
    return {opp:g.opponent||'Opponent',date:g.date||'',w:parseInt(g.scoreUs)||0,l:parseInt(g.scoreThem)||0,courts:courts};
  });

  // ── NEXT GAME / LIVE NOW BANNER ──
  var bannerEl=document.getElementById('lf-banner');
  if(bannerEl){
    var mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var todayHasGame=!!(schedToday||Object.values(D.assignments||{}).find(function(a){return a.date===today;}));
    if(todayHasGame&&schedToday){
      var hasResult=schedToday.scoreUs!=null&&schedToday.scoreUs!=='';
      var lW=parseInt(schedToday.scoreUs)||0,lL=parseInt(schedToday.scoreThem)||0;
      if(hasResult){
        var win2=lW>lL;
        bannerEl.innerHTML='<div style="text-align:center;">'
          +'<div style="'+BN+';font-size:11px;letter-spacing:3px;color:'+RED+';margin-bottom:4px;">TODAY\'S RESULT</div>'
          +'<div style="'+BN+';font-size:22px;color:#fff;">vs '+schedToday.opponent+'</div>'
          +'<div style="'+BN+';font-size:38px;color:'+(win2?WIN_C:LOSS_C)+';">'+lW+'-'+lL+' '+(win2?'WIN':'LOSS')+'</div>'
          +(schedToday.location?'<div style="font-size:11px;color:#555;">\uD83D\uDCCD '+schedToday.location+'</div>':'')
          +'</div>';
        bannerEl.style.cssText='border-radius:12px;padding:14px;margin-bottom:14px;background:#ffffff;border:1px solid #f7a8b8;';
      } else {
        bannerEl.innerHTML='<div style="display:flex;align-items:center;gap:12px;">'
          +'<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#4ade80;animation:pulse 1.5s infinite;flex-shrink:0;"></span>'
          +'<div><div style="'+BN+';font-size:11px;letter-spacing:3px;color:#4ade80;margin-bottom:2px;">LIVE NOW</div>'
          +'<div style="'+BN+';font-size:20px;color:#fff;">vs '+schedToday.opponent+'</div>'
          +(schedToday.location?'<div style="font-size:11px;color:#555;">\uD83D\uDCCD '+schedToday.location+'</div>':'')
          +'</div></div>';
        bannerEl.style.cssText='border-radius:12px;padding:14px;margin-bottom:14px;background:rgba(10,158,92,0.2);border:1px solid rgba(74,222,128,0.4);';
      }
    } else if(schedUpcoming.length){
      var ng=schedUpcoming[0];
      var pts=ng.date.split('-');
      var dStr=mon[parseInt(pts[1])-1]+' '+parseInt(pts[2]);
      bannerEl.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;">'
        +'<div><div style="'+BN+';font-size:11px;letter-spacing:2px;color:'+RED+';margin-bottom:4px;">NEXT GAME</div>'
        +'<div style="'+BN+';font-size:20px;color:#fff;">'+(ng.location==='away'?'@ ':'vs ')+ng.opponent+'</div>'
        +(ng.location?'<div style="font-size:12px;color:#555;">'+(ng.location==='away'?'Away':'Home')+(ng.time?' \xb7 '+ng.time:'')+'</div>':'')
        +'</div>'
        +'<div style="'+BN+';font-size:24px;color:'+RED+';">'+dStr+'</div>'
        +'</div>';
      bannerEl.style.cssText='border-radius:12px;padding:14px;margin-bottom:14px;background:#ffffff;border:1px solid #f7a8b8;';
    } else {
      bannerEl.style.display='none';
    }
  }

  // ── IN PROGRESS ──
  var tc=document.getElementById('lf-today');
  var tcc=document.getElementById('lf-today-courts');
  var todayAssign=Object.values(D.assignments||{}).find(function(a){return a.date===today;});
  var todayGD=gdByDate[today]||{};
  var liveScoring=D.liveScoring||{};
  var gameTimeReached=false;
  if(todayAssign&&todayAssign.time){
    var nowH=new Date().getHours(),nowM=new Date().getMinutes();
    var tParts=todayAssign.time.split(':');
    var gtH=parseInt(tParts[0]||0),gtM=parseInt(tParts[1]||0);
    gameTimeReached=(nowH>gtH)||(nowH===gtH&&nowM>=gtM);
  }
  var hasActivity=todayAssign&&(gameTimeReached||Object.keys(todayGD).length>0||Object.keys(liveScoring).length>0);

  if(hasActivity){
    if(tc)tc.style.display='block';
    if(tcc){
      var schedT=(D.schedule||[]).filter(inSeason).find(function(g){return g.date===today;});
      var oppName2=schedT?schedT.opponent:(todayAssign.opponent||'Today\'s Dual');
      var courts2=[];
      (todayAssign.courts||[]).sort(function(a,b){return (a.court||0)-(b.court||0);}).forEach(function(c,idx){
        var m=todayGD[c.court];
        var pids=[c.p1,c.p2].filter(Boolean);
        var pairLabel2=pids.map(function(pid){var p=(D.players||[]).find(function(x){return x.id===pid;});return p?(p.firstName+' '+p.lastName.charAt(0)+'.'+(p.jersey?' #'+p.jersey:'')):'';}).filter(Boolean).join(' & ');
        var _lsSlice=lsView(todayAssign&&todayAssign.id);var live=_lsSlice[idx]||_lsSlice[String(idx)];
        var hasLive=!!(live&&live.date===today&&(live.us>0||live.them>0));
        if(m&&(m.sets||[]).length>0){
          var sets=m.sets||[];
          var sw=sets.filter(function(s){return (s.scoreUs||0)>(s.scoreThem||0);}).length;
          var sl=sets.length-sw;
          var setStr=sets.map(function(s){return s.scoreUs+'-'+s.scoreThem;}).join(', ');
          if(hasLive){
            courts2.push({ct:c.court,pair:pairLabel2,status:'live_with_history',sW:sw,sL:sl,sets:setStr,usScore:live.us,themScore:live.them,setNum:live.setNum||sets.length+1});
          } else {
            courts2.push({ct:c.court,pair:pairLabel2,status:'done',sW:sw,sL:sl,sets:setStr});
          }
        } else if(hasLive){
          courts2.push({ct:c.court,pair:pairLabel2,status:'live',usScore:live.us,themScore:live.them,setNum:live.setNum||1});
        } else {
          courts2.push({ct:c.court,pair:pairLabel2,status:'warmup'});
        }
      });
      var lW2=courts2.filter(function(c){return (c.status==='done'||c.status==='live_with_history')&&c.sW>c.sL;}).length;
      var lL2=courts2.filter(function(c){return (c.status==='done'||c.status==='live_with_history')&&c.sL>c.sW;}).length;
      var gameTimeDisp=todayAssign.time?' · '+todayAssign.time:'';
      var hdr2='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
        +'<div><div style="'+BN+';font-size:16px;color:'+DARK_RED+';">vs '+oppName2+'</div>'
        +(schedT&&schedT.location?'<div style="font-size:11px;color:'+RED+';">\uD83D\uDCCD '+schedT.location+gameTimeDisp+'</div>':(gameTimeDisp?'<div style="font-size:11px;color:'+RED+';">⏰'+gameTimeDisp+'</div>':''))
        +'</div><div style="'+BN+';font-size:22px;color:'+RED+';">'+lW2+' \u2013 '+lL2+'</div></div>';
      tcc.innerHTML=hdr2+courts2.map(function(c){
        var scoreHtml;
        if(c.status==='done'){
          var col=c.sW>c.sL?WIN_C:LOSS_C;
          scoreHtml='<div style="text-align:right;"><div style="'+BN+';font-size:18px;color:'+col+';">'+c.sW+'-'+c.sL+'</div>'
            +'<div style="font-size:10px;color:'+col+';">'+(c.sW>c.sL?'WIN':'LOSS')+'</div>'
            +'<div style="font-size:10px;color:#888;">'+c.sets+'</div></div>';
        } else if(c.status==='live_with_history'){
          scoreHtml='<div style="text-align:right;">'
            +'<div style="'+BN+';font-size:13px;color:'+(c.sW>c.sL?WIN_C:LOSS_C)+';">'+c.sW+'-'+c.sL+' sets</div>'
            +'<div style="'+BN+';font-size:22px;color:'+DARK_RED+';">'+c.usScore+' \u2013 '+c.themScore+'</div>'
            +'<div style="font-size:10px;font-weight:700;color:#e67e00;letter-spacing:1px;">Set '+c.setNum+' \u2022 IN PLAY</div>'
            +'</div>';
        } else if(c.status==='live'){
          scoreHtml='<div style="text-align:right;">'
            +'<div style="'+BN+';font-size:26px;color:'+DARK_RED+';">'+c.usScore+' \u2013 '+c.themScore+'</div>'
            +'<div style="font-size:10px;font-weight:700;color:#e67e00;letter-spacing:1px;">Set '+c.setNum+' \u2022 IN PLAY</div>'
            +'</div>';
        } else {
          scoreHtml='<div style="font-size:11px;color:#bbb;font-style:italic;">Warming up</div>';
        }
        var dot=(c.status==='live'||c.status==='live_with_history')?'<span style="display:inline-block;width:7px;height:7px;background:#e67e00;border-radius:50%;margin-right:5px;animation:pulse 1.5s infinite;"></span>':'';
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #fde2e8;">'
          +'<div><span style="'+BN+';font-size:11px;background:#fde2e8;color:'+RED+';padding:2px 7px;border-radius:4px;margin-right:8px;">CT'+c.ct+'</span>'
          +dot+'<span style="color:'+DARK_RED+';font-size:13px;font-weight:700;">'+c.pair+'</span></div>'
          +scoreHtml+'</div>';
      }).join('');
    }
  } else {
    if(tc)tc.style.display='none';
  }

  // ── UPCOMING SCHEDULE ──
  var upEl=document.getElementById('lf-upcoming');
  var upSec=document.getElementById('lf-upcoming-section');
  if(upEl&&upSec){
    if(schedUpcoming.length){
      var mon3=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      upEl.innerHTML=schedUpcoming.slice(0,5).map(function(g){
        var pts3=g.date.split('-');
        var dStr3=mon3[parseInt(pts3[1])-1]+' '+parseInt(pts3[2]);
        var loc3=g.location==='away'?'@ ':'vs ';
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #fde2e8;">'
          +'<div><div style="'+BN+';font-size:14px;color:'+DARK_RED+';">'+loc3+g.opponent+'</div>'
          +(g.location?'<div style="font-size:11px;color:#555;">'+(g.location==='away'?'Away':'Home')+(g.time?' \xb7 '+g.time:'')+'</div>':'')
          +'</div><div style="'+BN+';font-size:16px;color:'+RED+';">'+dStr3+'</div>'
          +'</div>';
      }).join('');
      upSec.style.display='block';
    } else {
      upSec.style.display='none';
    }
  }

  // ── SEASON RESULTS ──
  var resEl=document.getElementById('lf-results');
  if(resEl){
    if(PAST.length===0){
      resEl.innerHTML='<div style="text-align:center;color:var(--gray);font-size:13px;padding:16px;">No results yet this season.</div>';
    } else {
      resEl.innerHTML=PAST.slice().reverse().map(function(d){
        var win=d.w>d.l;var rc=win?WIN_C:LOSS_C;
        var uid='lfc'+d.opp.replace(/[^a-z0-9]/gi,'');
        var mon4=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var pts4=d.date.split('-');var dateStr=pts4.length>=3?mon4[parseInt(pts4[1])-1]+' '+parseInt(pts4[2]):'';
        var courts3=d.courts.map(function(c){
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid #fde2e8;">'
            +'<div style="display:flex;align-items:center;gap:8px;">'
            +'<span style="'+BN+';font-size:10px;background:#fde2e8;color:'+RED+';padding:1px 6px;border-radius:3px;">CT'+c.ct+'</span>'
            +'<span style="font-size:12px;color:#5a0010;">'+c.pair+'</span></div>'
            +'<div style="font-size:12px;font-weight:700;color:'+(c.win?WIN_C:LOSS_C)+';">'+c.sets+'</div></div>';
        }).join('');
        return '<div style="background:#ffffff;border:1px solid #f7a8b8;border-radius:12px;margin-bottom:10px;overflow:hidden;">'
          +'<div onclick="lfToggle(\''+uid+'\')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;">'
          +'<div><span style="'+BN+';font-size:15px;color:'+DARK_RED+';">vs '+d.opp+'</span>'
          +'<span style="font-size:12px;color:#888;margin-left:8px;">'+dateStr+'</span></div>'
          +'<div style="display:flex;align-items:center;gap:10px;">'
          +'<span style="'+BN+';font-size:14px;color:'+rc+';">'+d.w+'-'+d.l+' '+(win?'WIN':'LOSS')+'</span>'
          +'<span style="color:#bbb;">\u25b8</span></div></div>'
          +'<div id="'+uid+'_body" style="display:none;padding:10px 14px;background:#fff9f9;">'+courts3+'</div></div>';
      }).join('');
    }
  }

  // ── ROSTER ──
  var rostEl=document.getElementById('lf-roster');
  if(rostEl){
    rostEl.innerHTML=ROSTER.map(function(p){
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#ffffff;border:1px solid #f7a8b8;border-radius:8px;margin-bottom:5px;">'
        +'<span style="'+BN+';font-size:18px;color:#f7a8b8;min-width:26px;text-align:right;">'+p.jersey+'</span>'
        +'<div><div style="font-size:14px;font-weight:700;color:'+DARK_RED+';">'+p.name+'</div>'
        +'<div style="font-size:11px;color:'+RED+';">'+p.cls+'</div></div></div>';
    }).join('');
  }
}

// ============================================================
// FAN PAGE EMAIL OPT-IN
// ============================================================
function submitLeonFanEmail(){
  var input=document.getElementById('lf-email-input');
  var errEl=document.getElementById('lf-email-error');
  var email=(input?input.value:'').trim();
  if(!email||!email.includes('@')){
    if(errEl)errEl.textContent='Please enter a valid email address.';
    return;
  }
  if(errEl)errEl.textContent='';
  var notifResults=document.getElementById('lf-notif-results');
  var notifSchedule=document.getElementById('lf-notif-schedule');
  try{
    if(db){
      var id='fe'+Date.now().toString(36);
      db.ref(DB_ROOT+'/fan_emails/'+id).set({
        email:email,
        notifResults:notifResults?notifResults.checked:true,
        notifSchedule:notifSchedule?notifSchedule.checked:true,
        signedUpAt:new Date().toISOString()
      });
    }
  }catch(e){console.error('Fan email save error:',e);}
  var form=document.getElementById('lf-email-form');
  var success=document.getElementById('lf-email-success');
  if(form)form.style.display='none';
  if(success)success.style.display='block';
}

// ============================================================
// INIT
// ============================================================
initDualScanner();


// ── SCRIMMAGE SCORESHEET SCANNER ─────────────────────────────
(function(){
  const dateEl=document.getElementById('sc-scan-date');if(dateEl)dateEl.value=td();
  const fileEl=document.getElementById('sc-scan-file');if(!fileEl)return;
  fileEl.addEventListener('change',async function(e){
    const file=e.target.files[0];if(!file)return;
    const preview=document.getElementById('sc-scan-preview');
    const result=document.getElementById('sc-scan-result');
    const reader=new FileReader();
    reader.onload=async function(ev){
      const base64=ev.target.result.split(',')[1];
      const mediaType=file.type||'image/jpeg';
      preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);">`;
      result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is reading your scrimmage scoresheet...</div></div>';
      const date=document.getElementById('sc-scan-date').value||td();
      const playerList=D.players.map(p=>p.firstName+' '+p.lastName+' ('+p.id+')').join(', ');
      try{
        const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'claude-sonnet-4-20250514',max_tokens:2500,
            messages:[{role:'user',content:[
              {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
              {type:'text',text:`You are reading a handwritten high school beach volleyball SCRIMMAGE scoresheet for SC.schoolName.
PLAYER ROSTER: ${playerList}
Extract all court matchups and set scores. Each court has ${SCHOOL_NAME} pair vs opponent pair.
Return ONLY valid JSON: {"opponent":"team name or empty","courts":[{"court":1,"pair":["p01","p02"],"opponentPair":"Name & Name","sets":[{"scoreUs":21,"scoreThem":15}]}]}
- Match player names to IDs from roster. pair = array of 2 player IDs.
- scoreUs = ${SCHOOL_NAME} score, scoreThem = opponent score.
- Respond with ONLY the JSON, no other text.`}
            ]}]
          })
        });
        const data=await response.json();
        const text=data.content?.map(c=>c.text||'').join('')||'';
        let parsed;
        (function(){let c=text.replace(/\`\`\`json|\`\`\`/gi,'').trim();try{parsed=JSON.parse(c);return;}catch(e){}const os=c.indexOf('{'),oe=c.lastIndexOf('}');if(os>=0&&oe>os){try{parsed=JSON.parse(c.slice(os,oe+1));return;}catch(e){}}parsed=null;})();
        if(!parsed||!parsed.courts){result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Couldn\'t read scoresheet. Enter manually above.</div><pre style="font-size:10px;background:var(--off-white);padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;">'+text.slice(0,600)+'</pre>';return;}
        // Show review form
        const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
        function pOpts(selId){return'<option value="">Select</option>'+sorted.map(pl=>`<option value="${pl.id}" ${pl.id===selId?'selected':''}>${pl.firstName} ${pl.lastName.charAt(0)}. (CT${pl.court})</option>`).join('');}
        let h=`<div style="font-family:'Bebas Neue';font-size:14px;margin-bottom:8px;color:var(--green);">✓ Found ${parsed.courts.length} court(s) — review & save</div>`;
        parsed.courts.forEach((c,i)=>{
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
            <div style="font-family:'Bebas Neue';font-size:12px;margin-bottom:6px;">COURT ${c.court||i+1}</div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="sc-scan-p1-${i}" style="font-size:12px;">${pOpts((c.pair||[])[0])}</select>
              <select class="form-select" id="sc-scan-p2-${i}" style="font-size:12px;">${pOpts((c.pair||[])[1])}</select>
            </div>
            <div style="margin-bottom:6px;"><input type="text" id="sc-scan-opp-${i}" value="${c.opponentPair||parsed.opponent||''}" class="form-input" placeholder="Opponent pair name" style="font-size:12px;padding:6px;"></div>
            ${(c.sets||[]).map((s,si)=>`<div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;"><span style="font-size:12px;color:var(--gray);">Set ${si+1}</span><input type="number" id="sc-scan-us-${i}-${si}" value="${s.scoreUs||0}" min="0" style="width:50px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-family:'Bebas Neue';font-size:14px;text-align:center;"> <span>-</span> <input type="number" id="sc-scan-them-${i}-${si}" value="${s.scoreThem||0}" min="0" style="width:50px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-family:'Bebas Neue';font-size:14px;text-align:center;"></div>`).join('')}
            <input type="hidden" id="sc-scan-court-${i}" value="${c.court||i+1}">
            <input type="hidden" id="sc-scan-sets-count-${i}" value="${(c.sets||[]).length}">
          </div>`;
        });
        h+=`<div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn btn-purple btn-small" style="flex:1;" onclick="scScanSave(${parsed.courts.length},'${date}')">✓ Save Scrimmage</button>
          <button class="btn btn-secondary btn-small" onclick="document.getElementById('sc-scan-result').innerHTML='';document.getElementById('sc-scan-preview').innerHTML='';">✕ Cancel</button>
        </div>`;
        result.innerHTML=h;
        e.target.value='';
      }catch(err){result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error reading photo. Try a clearer image.</div>';}
    };
    reader.readAsDataURL(file);
    e.target.value='';
  });
})();

function scScanSave(count,date){
  let saved=0;
  for(let i=0;i<count;i++){
    const p1=document.getElementById('sc-scan-p1-'+i)?.value;
    const p2=document.getElementById('sc-scan-p2-'+i)?.value;
    if(!p1||!p2)continue;
    const court=parseInt(document.getElementById('sc-scan-court-'+i)?.value)||i+1;
    const opp=document.getElementById('sc-scan-opp-'+i)?.value.trim()||'Opponent';
    const setsCount=parseInt(document.getElementById('sc-scan-sets-count-'+i)?.value)||0;
    const sets=[];
    for(let si=0;si<setsCount;si++){
      const us=parseInt(document.getElementById('sc-scan-us-'+i+'-'+si)?.value)||0;
      const them=parseInt(document.getElementById('sc-scan-them-'+i+'-'+si)?.value)||0;
      sets.push({scoreUs:us,scoreThem:them,stats:{}});
    }
    if(!sets.length)continue;
    const id=gi('sc');
    fbSetResult('scrimmages',id,{id,date,court,pair:[p1,p2],opponent:opp,sets});
    saved++;
  }
  toast('Saved '+saved+' scrimmage match'+(saved===1?'':'es')+'!');
  document.getElementById('sc-scan-result').innerHTML='';
  document.getElementById('sc-scan-preview').innerHTML='';
  renderExtMatches('scrimmage');
}

// ── QUEENS SCORESHEET SCANNER ─────────────────────────────────
(function(){
  const dateEl=document.getElementById('qs-scan-date');if(dateEl)dateEl.value=td();
  const fileEl=document.getElementById('qs-scan-file');if(!fileEl)return;
  fileEl.addEventListener('change',async function(e){
    const file=e.target.files[0];if(!file)return;
    const preview=document.getElementById('qs-scan-preview');
    const result=document.getElementById('qs-scan-result');
    const reader=new FileReader();
    reader.onload=async function(ev){
      const base64=ev.target.result.split(',')[1];
      const mediaType=file.type||'image/jpeg';
      preview.innerHTML=`<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;border:2px solid var(--gray-lighter);">`;
      result.innerHTML='<div class="ai-loading"><div class="spinner"></div><div style="margin-top:8px;">AI is reading your Queens scoresheet...</div></div>';
      const date=document.getElementById('qs-scan-date').value||td();
      const playerList=D.players.map(p=>p.firstName+' '+p.lastName+' ('+p.id+')').join(', ');
      try{
        const response=await fetch('https://beach-volleyball-ai.markmcnees-479.workers.dev',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'claude-sonnet-4-20250514',max_tokens:2500,
            messages:[{role:'user',content:[
              {type:'image',source:{type:'base64',media_type:mediaType,data:base64}},
              {type:'text',text:`You are reading a handwritten QUEENS (${SCHOOL_NAME} vs ${SCHOOL_NAME} internal) beach volleyball scoresheet.
PLAYER ROSTER: ${playerList}
Each court has Team A (2 players) vs Team B (2 players), all ${SCHOOL_NAME} players.
Return ONLY valid JSON: {"courts":[{"court":1,"team1":["p01","p02"],"team2":["p03","p04"],"score1":21,"score2":15}]}
- Match names to IDs from roster. All players are ${SCHOOL_NAME} players.
- score1 = Team A score (first pair), score2 = Team B score.
- If multiple sets, include the final set score.
- Respond with ONLY the JSON, no other text.`}
            ]}]
          })
        });
        const data=await response.json();
        const text=data.content?.map(c=>c.text||'').join('')||'';
        let parsed;
        (function(){let c=text.replace(/\`\`\`json|\`\`\`/gi,'').trim();try{parsed=JSON.parse(c);return;}catch(e){}const os=c.indexOf('{'),oe=c.lastIndexOf('}');if(os>=0&&oe>os){try{parsed=JSON.parse(c.slice(os,oe+1));return;}catch(e){}}parsed=null;})();
        if(!parsed||!parsed.courts){result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Couldn\'t read scoresheet.</div><pre style="font-size:10px;background:var(--off-white);padding:8px;border-radius:4px;overflow-x:auto;white-space:pre-wrap;">'+text.slice(0,600)+'</pre>';return;}
        const sorted=[...D.players].sort((a,b)=>a.court-b.court||a.lastName.localeCompare(b.lastName));
        function pOpts(selId){return'<option value="">Select</option>'+sorted.map(pl=>`<option value="${pl.id}" ${pl.id===selId?'selected':''}>${pl.firstName} ${pl.lastName.charAt(0)}. (CT${pl.court})</option>`).join('');}
        let h=`<div style="font-family:'Bebas Neue';font-size:14px;margin-bottom:8px;color:var(--green);">✓ Found ${parsed.courts.length} court(s) — review & save</div>`;
        parsed.courts.forEach((c,i)=>{
          h+=`<div style="padding:10px;background:var(--off-white);border-radius:8px;margin-bottom:8px;">
            <div style="font-family:'Bebas Neue';font-size:12px;margin-bottom:6px;">COURT ${c.court||i+1}</div>
            <div style="font-size:10px;font-weight:700;color:var(--charcoal);margin-bottom:4px;">TEAM A</div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="qs-scan-a1-${i}" style="font-size:12px;">${pOpts((c.team1||[])[0])}</select>
              <select class="form-select" id="qs-scan-a2-${i}" style="font-size:12px;">${pOpts((c.team1||[])[1])}</select>
            </div>
            <div style="font-size:10px;font-weight:700;color:var(--charcoal);margin-bottom:4px;">TEAM B</div>
            <div class="form-row" style="margin-bottom:6px;">
              <select class="form-select" id="qs-scan-b1-${i}" style="font-size:12px;">${pOpts((c.team2||[])[0])}</select>
              <select class="form-select" id="qs-scan-b2-${i}" style="font-size:12px;">${pOpts((c.team2||[])[1])}</select>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:12px;color:var(--gray);">Score</span>
              <input type="number" id="qs-scan-s1-${i}" value="${c.score1||0}" min="0" style="width:50px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-family:'Bebas Neue';font-size:14px;text-align:center;">
              <span>-</span>
              <input type="number" id="qs-scan-s2-${i}" value="${c.score2||0}" min="0" style="width:50px;padding:4px;border:1px solid var(--gray-lighter);border-radius:4px;font-family:'Bebas Neue';font-size:14px;text-align:center;">
            </div>
            <input type="hidden" id="qs-scan-court-${i}" value="${c.court||i+1}">
          </div>`;
        });
        h+=`<div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn btn-small" style="flex:1;background:var(--gold);color:var(--black);border:none;" onclick="qsScanSave(${parsed.courts.length},'${date}')">✓ Save Queens Results</button>
          <button class="btn btn-secondary btn-small" onclick="document.getElementById('qs-scan-result').innerHTML='';document.getElementById('qs-scan-preview').innerHTML='';">✕ Cancel</button>
        </div>`;
        result.innerHTML=h;
        e.target.value='';
      }catch(err){result.innerHTML='<div style="color:var(--loss-red);font-size:13px;">Error reading photo.</div>';}
    };
    reader.readAsDataURL(file);
    e.target.value='';
  });
})();

function qsScanSave(count,date){
  let saved=0;
  for(let i=0;i<count;i++){
    const a1=document.getElementById('qs-scan-a1-'+i)?.value;
    const a2=document.getElementById('qs-scan-a2-'+i)?.value;
    const b1=document.getElementById('qs-scan-b1-'+i)?.value;
    const b2=document.getElementById('qs-scan-b2-'+i)?.value;
    if(!a1||!a2||!b1||!b2)continue;
    const court=parseInt(document.getElementById('qs-scan-court-'+i)?.value)||i+1;
    const s1=parseInt(document.getElementById('qs-scan-s1-'+i)?.value)||0;
    const s2=parseInt(document.getElementById('qs-scan-s2-'+i)?.value)||0;
    if(s1===s2)continue;
    const id=gi('qm');
    fbSetResult('matches',id,{id,date,court,team1:[a1,a2],team2:[b1,b2],score1:s1,score2:s2});
    saved++;
  }
  toast('Saved '+saved+' Queens match'+(saved===1?'':'es')+'!');
  document.getElementById('qs-scan-result').innerHTML='';
  document.getElementById('qs-scan-preview').innerHTML='';
  renderQueens();
}

['q-date','sc-date','sc-filter-date','assign-date','cnote-date','dual-scan-date','qs-scan-date'].forEach(function(id){var el=document.getElementById(id);if(el)el.value=td();});
initFB();
window.addEventListener('popstate',function(e){
  var ol=document.getElementById('school-fans-overlay');
  if(ol&&ol.style.display!=='none'){ol.style.display='none';if(typeof hideFans==='function')hideFans();}
  var ao=document.getElementById('athlete-overlay');
  if(ao&&ao.style.display!=='none'){if(typeof hideAthleteCard==='function')hideAthleteCard();else ao.style.display='none';}
});
setTimeout(runMigration,2000);
setTimeout(function(){
  if(!db)return;
  // Leon-only seed data (schedule, standings, jersey backfill). Gate exactly like
  // seedDB so it can never fire on another school's node with Leon's ids/values.
  if(DB_ROOT!=='leon_queens_matches' || !SC.allowAutoSeed)return;
  db.ref(DB_ROOT+'/schedule').once('value',function(snap){
    var ex=snap.val()||{};var u={};
    [{id:'sch01',date:'2026-02-24',opponent:'Community Christian',location:'home',scoreUs:4,scoreThem:1},{id:'sch02',date:'2026-02-26',opponent:'Wakulla',location:'home',scoreUs:4,scoreThem:1},{id:'sch03',date:'2026-02-26',opponent:'Sneads',location:'home',scoreUs:5,scoreThem:0},{id:'sch04',date:'2026-03-03',opponent:'Florida State University HS',location:'home',scoreUs:2,scoreThem:3},{id:'sch05',date:'2026-03-05',opponent:'Mosley',location:'home',scoreUs:3,scoreThem:2},{id:'sch06',date:'2026-03-09',opponent:'Chiles',location:'home',scoreUs:0,scoreThem:5},{id:'sch07',date:'2026-03-11',opponent:'Lincoln',location:'away',scoreUs:5,scoreThem:0},{id:'sch08',date:'2026-03-12',opponent:'Destin',location:'away',scoreUs:5,scoreThem:0},{id:'sch09',date:'2026-03-12',opponent:'South Walton',location:'away',scoreUs:1,scoreThem:4}].forEach(function(g){if(!ex[g.id]){u[DB_ROOT+'/schedule/'+g.id]=g;}});
    db.ref(DB_ROOT+'/standings').once('value',function(snap2){
      var exSt=snap2.val()||{};
      if(Object.keys(exSt).length<5){var st={'Chiles':{w:7,l:0},'Lincoln':{w:4,l:3},'Florida State University HS':{w:4,l:2},'Wakulla':{w:3,l:3},'Mosley':{w:3,l:3},'Community Christian':{w:1,l:5},'Sneads':{w:1,l:4},'South Walton':{w:4,l:2},'Gulf Breeze':{w:4,l:1},'Destin':{w:2,l:3},'Maclay':{w:2,l:2},'Godby':{w:0,l:3}};Object.keys(st).forEach(function(t){u[DB_ROOT+'/standings/'+t]=st[t];});}
      db.ref(DB_ROOT+'/_jerseys_seeded').once('value',function(snap3){
        db.ref(DB_ROOT+'/players').once('value',function(snapP){
          var existing=snapP.val()||{};
          // Only backfill a jersey onto a player that ALREADY exists; never create a
          // record. Creating a jersey-only record is what stripped the roster before.
          if(!snap3.val()){var j={p01:9,p02:5,p03:10,p04:2,p05:7,p06:8,p07:13,p08:3,p09:17,p10:6,p11:4,p12:11,p13:15,p14:18,p15:12,p16:1};Object.keys(j).forEach(function(pid){if(existing[pid])u[DB_ROOT+'/players/'+pid+'/jersey']=j[pid];});u[DB_ROOT+'/_jerseys_seeded']=true;}
          if(Object.keys(u).length){db.ref().update(u,function(err){console.log(err?'Seed err':('Seed OK '+Object.keys(u).length));});}else{console.log('Seed: nothing missing');}
        });
      });
    });
  });
},2500);
function togglePPQuiz(){
  const pid=currentPlayerId;if(!pid)return;
  const wrap=document.getElementById('pp-quiz-frame-wrap');
  const iframe=document.getElementById('pp-quiz-iframe');
  const btn=document.getElementById('pp-start-quiz-btn');
  if(wrap.style.display==='none'){
    iframe.src=SC.courtsenseUrl+'?v=2&player='+pid;
    wrap.style.display='block';btn.textContent='CLOSE QUIZ';
  } else {
    wrap.style.display='none';iframe.src='';btn.textContent='TAKE COURTSENSE IQ QUIZ';
  }
}
function renderPPQuizHistory(){
  const pid=currentPlayerId;
  const el=document.getElementById('pp-quiz-history');if(!el)return;
  const attempts=D.quizScores&&D.quizScores[pid]?Object.values(D.quizScores[pid]).sort((a,b)=>b.date.localeCompare(a.date)):[];
  if(!attempts.length){el.innerHTML='<div style="font-size:12px;color:var(--gray);padding:8px 0;">No attempts yet. Your quiz score will average with your coach rating for Court Sense.</div>';return;}
  let h='<div style="font-size:11px;font-weight:700;color:var(--gray);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Your Attempts</div>';
  attempts.slice(0,5).forEach(a=>{
    const pct=Math.round(a.score/a.maxScore*100);
    const grade=pct>=90?'A+':pct>=70?'B':pct>=50?'C':'D';
    const col=pct>=70?'green':pct>=50?'#f5a623':'var(--red)';
    h+=`<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid rgba(0,0,0,0.05);color:var(--gray);"><span>${a.date}</span><span style="font-family:'Bebas Neue';font-size:15px;color:${col};">${a.score}/${a.maxScore} pts — ${grade}</span></div>`;
  });
  el.innerHTML=h;
}
window.addEventListener('message',function(e){
  if(!e.data||e.data.type!=='courtsenseScore')return;
  const {playerId,score,maxScore,date}=e.data;if(!playerId)return;
  const key=date.replace(/-/g,'')+'_'+Date.now();
  if(db)db.ref(SC.dbRoots.profiles+'/quizScores/'+playerId+'/'+key).set({score,maxScore,date});
  const wrap=document.getElementById('pp-quiz-frame-wrap');
  const iframe=document.getElementById('pp-quiz-iframe');
  const btn=document.getElementById('pp-start-quiz-btn');
  if(wrap)wrap.style.display='none';if(iframe)iframe.src='';
  if(btn)btn.textContent='RETAKE COURTSENSE IQ QUIZ';
  setTimeout(()=>renderPPQuizHistory(),600);
});
