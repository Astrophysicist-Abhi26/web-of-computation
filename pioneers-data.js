// ============================================================
// THE WEB OF COMPUTATION — pioneers (edit me)
// One entry per person. The constellation, the biography panel
// and the Pioneers gallery are all generated from this list.
//
//   id      stable key; also the portrait file name: portraits/<id>.jpg
//   born    year (number) or text such as "c. 1986"; null if not public
//   died    year, or null if living
//   y       the year of their defining contribution (drives the time
//           scrubber and chronological order)
//   dom     domain ids (found, hard, algo, lang, info, data, ai, ml)
//   fields  field ids from data.js; shown as "on the map" links
//   role    one line: nationality and occupation
//   epitaph one line: why they matter
//   legacy  a short closing paragraph
//   life    timeline rows: [year, title, detail]
//   works   key papers: [year, title, url]
//
// Portraits and their credits live in portraits/credits.js.
// Dates written with "c." are approximate and worth re-checking.
// ============================================================

const PEOPLE = [

// ---------------- the mechanical dream ----------------
{ id:"babbage", name:"Charles Babbage", born:1791, died:1871, y:1822,
  dom:["hard"], fields:["mech"],
  role:"English mathematician and inventor",
  epitaph:"Designed the computer a century before anyone could build it.",
  legacy:"Died embittered with neither engine finished. In 1991 the Science Museum in London built his Difference Engine No. 2 from his drawings, and it worked.",
  life:[
    [1791,"Born in London","Son of a banker; largely self-taught in mathematics before Cambridge."],
    [1822,"Difference Engine","Proposes a machine to compute polynomial tables by the method of finite differences."],
    [1828,"Lucasian Professor at Cambridge","Holds Newton's old chair for eleven years without giving a lecture."],
    [1837,"Analytical Engine","Designs a general-purpose machine with a 'mill' (CPU), a 'store' (memory) and punched-card programs."],
    [1842,"Funding ends","The British government abandons the project after spending about £17,000."],
    [1871,"Dies in London","Neither engine was ever completed in his lifetime."],
    [1991,"Vindicated","The Science Museum completes Difference Engine No. 2. It computes correctly."]
  ],
  works:[
    [1864,"Passages from the Life of a Philosopher",null]
  ]},

{ id:"lovelace", name:"Ada Lovelace", born:1815, died:1852, y:1843,
  dom:["hard","found"], fields:["mech"],
  role:"English mathematician and writer",
  epitaph:"The first programmer, and the first to see that computers could manipulate any symbol, not just numbers.",
  legacy:"Her 'Lovelace objection' (that a machine can only do what we order it to) was answered directly by Turing in 1950. Ada Lovelace Day, every October, celebrates women in science.",
  life:[
    [1815,"Born in London","Only legitimate child of Lord Byron; her mother steered her towards mathematics."],
    [1833,"Meets Babbage","Sees a working fragment of the Difference Engine at 17 and begins a lifelong correspondence."],
    [1843,"The Notes","Translates Menabrea's paper on the Analytical Engine and adds notes three times its length."],
    [1843,"Note G","Sets out a step-by-step method for the Engine to compute Bernoulli numbers: the first published program."],
    [1843,"Beyond arithmetic","Argues the Engine 'might compose elaborate and scientific pieces of music'."],
    [1852,"Dies at 36","Uterine cancer. Buried next to her father."]
  ],
  works:[
    [1843,"Sketch of the Analytical Engine, with Notes by the Translator","https://www.fourmilab.ch/babbage/sketch.html"]
  ]},

{ id:"boole", name:"George Boole", born:1815, died:1864, y:1847,
  dom:["found"], fields:["logic"],
  role:"English mathematician and logician",
  epitaph:"Turned logic into algebra. Every chip is applied Boole.",
  legacy:"His algebra lay mostly unused for 90 years until Claude Shannon showed in 1937 that it describes switching circuits exactly.",
  life:[
    [1815,"Born in Lincoln","Son of a shoemaker; left school at 16 to support his family."],
    [1847,"The Mathematical Analysis of Logic","Shows that logical reasoning can be written as equations."],
    [1849,"Professor at Queen's College, Cork","Appointed without a university degree."],
    [1854,"The Laws of Thought","The full system of what we now call Boolean algebra."],
    [1864,"Dies at 49","Pneumonia, after walking to a lecture in heavy rain."]
  ],
  works:[
    [1854,"An Investigation of the Laws of Thought","https://www.gutenberg.org/ebooks/15114"]
  ]},

// ---------------- logic becomes machine ----------------
{ id:"godel", name:"Kurt Gödel", born:1906, died:1978, y:1931,
  dom:["found"], fields:["logic","computability"],
  role:"Austrian-American logician",
  epitaph:"Proved that any consistent formal system rich enough for arithmetic contains truths it cannot prove.",
  legacy:"His diagonal trick became Turing's halting proof and the backbone of computability theory. Paranoid about being poisoned, he starved to death in Princeton.",
  life:[
    [1906,"Born in Brno","Then part of Austria-Hungary."],
    [1929,"Completeness theorem","His doctoral thesis: first-order logic proves every valid statement."],
    [1931,"Incompleteness theorems","Ends Hilbert's dream of a complete, provably consistent mathematics."],
    [1940,"Flees to Princeton","Joins the Institute for Advanced Study; close friend of Einstein."],
    [1956,"Letter to von Neumann","Asks, in effect, whether P = NP, fifteen years before the question was named."],
    [1978,"Dies in Princeton","Refused food he feared was poisoned; weighed about 30 kg."]
  ],
  works:[
    [1931,"Über formal unentscheidbare Sätze der Principia Mathematica","https://doi.org/10.1007/BF01700692"]
  ]},

{ id:"turing", name:"Alan Turing", born:1912, died:1954, y:1936,
  dom:["found","hard","info","ai"], fields:["computability","wartime","founding","classic-crypto"],
  role:"English mathematician and codebreaker",
  epitaph:"Defined computation, helped break Enigma, and asked whether machines can think.",
  legacy:"Touches four continents of this map, more than anyone. Royal pardon in 2013; on the Bank of England £50 note since 2021. The Turing Award is computing's highest honour.",
  life:[
    [1912,"Born in London",""],
    [1936,"On Computable Numbers","Defines the Turing machine and the universal machine, and proves the halting problem undecidable."],
    [1939,"Bletchley Park","Designs the Bombe with Gordon Welchman; leads the attack on naval Enigma in Hut 8."],
    [1946,"The ACE","Designs one of the first stored-program computers at the National Physical Laboratory."],
    [1950,"Computing Machinery and Intelligence","Proposes the Imitation Game, now called the Turing test."],
    [1952,"Prosecuted","Convicted of 'gross indecency' for being gay and forced into chemical castration."],
    [1952,"Morphogenesis","Publishes a mathematical theory of how patterns form in living things."],
    [1954,"Dies at 41","Cyanide poisoning, ruled suicide."],
    [2013,"Royal pardon","Posthumous pardon; the 2017 'Turing law' pardons thousands more."]
  ],
  works:[
    [1936,"On Computable Numbers, with an Application to the Entscheidungsproblem","https://doi.org/10.1112/plms/s2-42.1.230"],
    [1950,"Computing Machinery and Intelligence","https://doi.org/10.1093/mind/LIX.236.433"]
  ]},

{ id:"shannon", name:"Claude Shannon", born:1916, died:2001, y:1937,
  dom:["info","hard","ai"], fields:["infotheory","wartime"],
  role:"American mathematician and engineer",
  epitaph:"Invented the bit, and twice bridged logic to reality.",
  legacy:"Cross-entropy, the loss that trains every modern language model, comes straight from his 1948 paper. He spent his later years juggling, unicycling and building maze-solving mice.",
  life:[
    [1916,"Born in Petoskey, Michigan",""],
    [1937,"The most important master's thesis","Shows that Boolean algebra describes relay switching circuits exactly."],
    [1943,"Meets Turing","The two share lunches at Bell Labs while working on wartime cryptography."],
    [1948,"A Mathematical Theory of Communication","Founds information theory: entropy, the bit, channel capacity."],
    [1949,"Communication Theory of Secrecy Systems","Proves the one-time pad unbreakable and puts cryptography on a mathematical footing."],
    [1950,"Theseus","A mechanical mouse that learns its way through a maze: one of the first learning machines."],
    [2001,"Dies at 84","After years of Alzheimer's disease."]
  ],
  works:[
    [1948,"A Mathematical Theory of Communication","https://doi.org/10.1002/j.1538-7305.1948.tb01338.x"]
  ]},

{ id:"mcculloch", name:"Warren McCulloch", born:1898, died:1969, y:1943,
  dom:["ml","found"], fields:["prehistory"],
  role:"American neurophysiologist",
  epitaph:"With Walter Pitts, described the neuron as a logic gate.",
  legacy:"The 1943 paper is the root of both neural networks and finite automata. He took in the teenage Pitts as family.",
  life:[
    [1898,"Born in Orange, New Jersey",""],
    [1941,"Meets Walter Pitts","Invites the homeless 18-year-old prodigy to live with his family in Chicago."],
    [1943,"A Logical Calculus of the Ideas Immanent in Nervous Activity","Networks of idealised neurons can compute any logical function."],
    [1946,"Macy conferences","Chairs the meetings where cybernetics is born."],
    [1952,"MIT","Moves to MIT's Research Laboratory of Electronics."],
    [1969,"Dies","A few months after Pitts."]
  ],
  works:[
    [1943,"A Logical Calculus of the Ideas Immanent in Nervous Activity","https://doi.org/10.1007/BF02478259"]
  ]},

{ id:"pitts", name:"Walter Pitts", born:1923, died:1969, y:1943,
  dom:["ml","found"], fields:["prehistory","automata"],
  role:"American logician",
  epitaph:"A self-taught runaway who co-invented the artificial neuron at 20.",
  legacy:"Never earned a degree. After a break with Norbert Wiener he burned his unpublished work and withdrew. His 1943 model sits at the start of every neural network.",
  life:[
    [1923,"Born in Detroit","Escapes a violent home; teaches himself logic in the public library."],
    [1935,"Reads Principia Mathematica","At 12, writes to Bertrand Russell pointing out errors. Russell invites him to Cambridge."],
    [1943,"The McCulloch–Pitts neuron","Co-authors the paper that founds neural computation."],
    [1959,"What the Frog's Eye Tells the Frog's Brain","Co-author of a landmark paper on visual processing."],
    [1969,"Dies at 46","Of complications of alcoholism, in a Cambridge boarding house."]
  ],
  works:[]},

{ id:"vonneumann", name:"John von Neumann", born:1903, died:1957, y:1945,
  dom:["hard","algo","ai"], fields:["stored","decision","paradigms"],
  role:"Hungarian-American mathematician",
  epitaph:"Computer architecture, game theory, Monte Carlo, merge sort and self-replicating machines.",
  legacy:"Almost every computer since 1945 follows the design in his EDVAC report. He died working on 'The Computer and the Brain'.",
  life:[
    [1903,"Born in Budapest","A prodigy who could divide eight-digit numbers in his head as a child."],
    [1928,"Minimax theorem","Founds game theory; with Morgenstern's 1944 book it reshapes economics."],
    [1945,"First Draft of a Report on the EDVAC","Describes the stored-program architecture: one memory for data and instructions."],
    [1945,"Merge sort","Writes one of the first sorting programs for a stored-program machine."],
    [1946,"Monte Carlo method","With Ulam, uses random sampling to simulate neutron diffusion on ENIAC."],
    [1948,"Self-reproducing automata","Designs a cellular automaton that copies itself."],
    [1957,"Dies at 53","Cancer, possibly from exposure at atomic tests."]
  ],
  works:[
    [1945,"First Draft of a Report on the EDVAC","https://doi.org/10.1109/85.238389"]
  ]},

{ id:"wiener", name:"Norbert Wiener", born:1894, died:1964, y:1948,
  dom:["ai","info"], fields:["founding","decision"],
  role:"American mathematician",
  epitaph:"Founded cybernetics: control and communication in animals and machines.",
  legacy:"Feedback, control loops and the idea of machines with purpose all run through his work. After Hiroshima he refused military funding and warned about automation's effect on workers.",
  life:[
    [1894,"Born in Columbia, Missouri","A child prodigy; Harvard PhD at 18."],
    [1923,"Brownian motion","Gives the rigorous mathematics of random motion, now the Wiener process."],
    [1942,"Anti-aircraft predictor","Wartime work on predicting a plane's path leads to feedback theory."],
    [1948,"Cybernetics","The book that names and launches the field."],
    [1950,"The Human Use of Human Beings","An early warning about automation and society."],
    [1964,"Dies in Stockholm",""]
  ],
  works:[]},

{ id:"hopper", name:"Grace Hopper", born:1906, died:1992, y:1952,
  dom:["lang"], fields:["compilers","langs"],
  role:"American computer scientist and US Navy rear admiral",
  epitaph:"Built the first compiler and made programming human.",
  legacy:"Her insistence that programs be written in English-like words led to COBOL, which still runs much of the world's banking. The destroyer USS Hopper is named after her.",
  life:[
    [1906,"Born in New York",""],
    [1934,"Yale PhD in mathematics",""],
    [1944,"Harvard Mark I","Joins the Navy and programs one of the first large computers."],
    [1947,"The 'bug'","Her team tapes a moth found in a relay into the logbook."],
    [1952,"A-0 compiler","Writes the first compiler, which translates symbolic code into machine code."],
    [1959,"COBOL","Her FLOW-MATIC language shapes the design of COBOL."],
    [1986,"Retires at 79","The oldest serving officer in the US Navy."],
    [1992,"Dies at 85",""]
  ],
  works:[]},

{ id:"bellman", name:"Richard Bellman", born:1920, died:1984, y:1953,
  dom:["algo","ml"], fields:["paradigms","decision","deeprl"],
  role:"American applied mathematician",
  epitaph:"Invented dynamic programming, and with it the equation reinforcement learning is built on.",
  legacy:"The Bellman equation sits inside every value function in reinforcement learning, from TD-learning to AlphaGo. He also coined 'the curse of dimensionality'.",
  life:[
    [1920,"Born in New York",""],
    [1953,"Dynamic programming","At RAND, solves multistage decisions by breaking them into overlapping sub-problems."],
    [1957,"Dynamic Programming","The book, with the Bellman equation."],
    [1961,"Curse of dimensionality","Names the problem that haunts high-dimensional learning."],
    [1984,"Dies at 63",""]
  ],
  works:[]},

// ---------------- the mainframe age ----------------
{ id:"mccarthy", name:"John McCarthy", born:1927, died:2011, y:1956,
  dom:["ai","lang"], fields:["founding","symbolic","langs"],
  role:"American computer scientist",
  epitaph:"Named the field 'artificial intelligence' and created LISP.",
  legacy:"LISP introduced garbage collection, conditionals as expressions and code-as-data. He also proposed time-sharing, the ancestor of cloud computing.",
  life:[
    [1927,"Born in Boston",""],
    [1955,"The Dartmouth proposal","Coins the term 'artificial intelligence' for a 1956 summer workshop."],
    [1958,"LISP","Creates the second-oldest programming language still in use."],
    [1959,"Programs with Common Sense","Proposes an 'advice taker' that reasons with logic."],
    [1963,"Stanford AI Lab","Founds SAIL."],
    [1971,"Turing Award",""],
    [2011,"Dies at 84",""]
  ],
  works:[
    [1955,"A Proposal for the Dartmouth Summer Research Project on AI","http://jmc.stanford.edu/articles/dartmouth/dartmouth.pdf"],
    [1960,"Recursive Functions of Symbolic Expressions","https://doi.org/10.1145/367177.367199"]
  ]},

{ id:"minsky", name:"Marvin Minsky", born:1927, died:2016, y:1956,
  dom:["ai","ml"], fields:["symbolic","founding","prehistory"],
  role:"American cognitive scientist",
  epitaph:"Symbolic AI's champion, and the perceptron's prosecutor.",
  legacy:"Co-founded the MIT AI Lab. His 1969 book with Papert was right about single-layer perceptrons and wrong about where the field would go. He lived long enough to see deep networks win.",
  life:[
    [1927,"Born in New York",""],
    [1951,"SNARC","Builds one of the first neural-network learning machines, from vacuum tubes."],
    [1956,"Dartmouth workshop","Co-organiser of the meeting that founded AI."],
    [1959,"MIT AI Lab","Co-founds it with McCarthy."],
    [1969,"Perceptrons","With Seymour Papert, proves the limits of single-layer networks."],
    [1969,"Turing Award",""],
    [1986,"The Society of Mind","Argues intelligence emerges from many simple agents."],
    [2016,"Dies at 88",""]
  ],
  works:[]},

{ id:"newell", name:"Allen Newell", born:1927, died:1992, y:1956,
  dom:["ai"], fields:["symbolic","founding"],
  role:"American computer scientist and cognitive psychologist",
  epitaph:"Co-wrote the first AI program, which proved theorems from Principia Mathematica.",
  legacy:"With Herbert Simon he framed intelligence as symbol manipulation and search, the central idea of symbolic AI.",
  life:[
    [1927,"Born in San Francisco",""],
    [1956,"Logic Theorist","With Simon and Cliff Shaw, proves 38 of the first 52 theorems of Principia Mathematica."],
    [1957,"General Problem Solver","A program meant to solve any formalised problem by means–ends analysis."],
    [1975,"Turing Award","Shared with Simon."],
    [1990,"Unified Theories of Cognition","Proposes the Soar architecture."],
    [1992,"Dies at 65",""]
  ],
  works:[
    [1956,"The Logic Theory Machine","https://doi.org/10.1109/TIT.1956.1056797"]
  ]},

{ id:"simon", name:"Herbert A. Simon", born:1916, died:2001, y:1956,
  dom:["ai","data"], fields:["symbolic","decision"],
  role:"American polymath: economist, political scientist and computer scientist",
  epitaph:"Won both the Turing Award and the Nobel Prize in Economics.",
  legacy:"His idea of 'bounded rationality' (people satisfice rather than optimise) changed economics. In AI, his heuristic search is still inside every planner.",
  life:[
    [1916,"Born in Milwaukee",""],
    [1947,"Administrative Behavior","Studies how organisations actually make decisions."],
    [1956,"Logic Theorist","Co-creates the first AI program with Newell and Shaw."],
    [1958,"A bold prediction","Forecasts a computer chess champion within ten years. It took forty."],
    [1975,"Turing Award","Shared with Newell."],
    [1978,"Nobel Prize in Economics","For research on decision-making within organisations."],
    [2001,"Dies at 84",""]
  ],
  works:[]},

{ id:"rosenblatt", name:"Frank Rosenblatt", born:1928, died:1971, y:1958,
  dom:["ml"], fields:["prehistory","paradigms-ml"],
  role:"American psychologist",
  epitaph:"Built the perceptron, the first machine that learned from examples.",
  legacy:"Died at 43, in the depth of his field's rejection. Backpropagation vindicated his approach fifteen years later.",
  life:[
    [1928,"Born in New Rochelle, New York",""],
    [1957,"The perceptron","Proposes a learning rule for an artificial neuron at Cornell Aeronautical Laboratory."],
    [1958,"The Mark I Perceptron","Custom hardware with 400 photocells learns to classify shapes. The New York Times reports on it."],
    [1962,"Principles of Neurodynamics","Describes multilayer perceptrons, but without a way to train them."],
    [1969,"Perceptrons","Minsky and Papert's critique turns funding away from neural networks."],
    [1971,"Dies at 43","A boating accident on Chesapeake Bay, on his birthday."]
  ],
  works:[
    [1958,"The Perceptron: A Probabilistic Model for Information Storage","https://doi.org/10.1037/h0042519"]
  ]},

{ id:"samuel", name:"Arthur Samuel", born:1901, died:1990, y:1959,
  dom:["ml","ai"], fields:["prehistory","milestones"],
  role:"American computer scientist",
  epitaph:"Coined the phrase 'machine learning' with a checkers program that improved by playing itself.",
  legacy:"His program learned an evaluation function from self-play, the same idea that powered TD-Gammon and AlphaZero.",
  life:[
    [1901,"Born in Emporia, Kansas",""],
    [1949,"IBM","Joins IBM Poughkeepsie."],
    [1952,"Checkers on the IBM 701","One of the first programs to learn from experience."],
    [1959,"Some Studies in Machine Learning Using the Game of Checkers","The paper that popularised the term 'machine learning'."],
    [1966,"Stanford","Moves to Stanford, where he keeps programming into his eighties."],
    [1990,"Dies at 88",""]
  ],
  works:[
    [1959,"Some Studies in Machine Learning Using the Game of Checkers","https://doi.org/10.1147/rd.33.0210"]
  ]},

{ id:"ivakhnenko", name:"Alexey Ivakhnenko", born:1913, died:2007, y:1965,
  dom:["ml"], fields:["prehistory","deep"],
  role:"Soviet-Ukrainian mathematician",
  epitaph:"Trained deep, multilayer networks in the 1960s, decades before 'deep learning' had a name.",
  legacy:"His Group Method of Data Handling grew networks layer by layer and pruned them with validation data. Many historians call it the first working deep learning.",
  life:[
    [1913,"Born in Kobeliaky, Ukraine",""],
    [1965,"Group Method of Data Handling","With Valentin Lapa, publishes a way to train multilayer polynomial networks."],
    [1971,"An 8-layer network","Describes a deep network trained with his method."],
    [2007,"Dies in Kyiv",""]
  ],
  works:[
    [1971,"Polynomial Theory of Complex Systems","https://doi.org/10.1109/TSMC.1971.4308320"]
  ]},

{ id:"amari", name:"Shun-ichi Amari", born:1936, died:null, y:1967,
  dom:["ml"], fields:["prehistory","classical"],
  role:"Japanese mathematician",
  epitaph:"Trained multilayer networks by stochastic gradient descent in 1967, and founded information geometry.",
  legacy:"Much of what the West rediscovered in the 1980s (gradient learning in multilayer nets, associative memories) appears in his Japanese papers of the 1960s and 70s.",
  life:[
    [1936,"Born in Tokyo",""],
    [1967,"Adaptive pattern classifiers","Trains a multilayer network with stochastic gradient descent."],
    [1972,"Associative memory","Describes a self-organising memory network like the later Hopfield network."],
    [1985,"Information geometry","Applies differential geometry to statistics; leads to the natural gradient (1998)."],
    [1994,"RIKEN Brain Science Institute","Leads its mathematical neuroscience lab."],
    [2025,"Kyoto Prize","Awarded for his mathematical theory of neural networks."]
  ],
  works:[
    [1967,"A Theory of Adaptive Pattern Classifiers","https://doi.org/10.1109/PGEC.1967.264666"]
  ]},

{ id:"dijkstra", name:"Edsger W. Dijkstra", born:1930, died:2002, y:1959,
  dom:["algo","lang"], fields:["paradigms","structs","langs"],
  role:"Dutch computer scientist",
  epitaph:"Gave us the shortest-path algorithm and the case for structured programming.",
  legacy:"His shortest-path algorithm routes every navigation app. He wrote over 1,300 handwritten essays, the 'EWDs', and argued that testing can show bugs but never their absence.",
  life:[
    [1930,"Born in Rotterdam",""],
    [1956,"Shortest path","Designs his algorithm in about twenty minutes at a café in Amsterdam."],
    [1959,"A Note on Two Problems in Connexion with Graphs","Publishes the shortest-path algorithm."],
    [1965,"Semaphores","Invents a basic tool of concurrent programming."],
    [1968,"Go To Statement Considered Harmful","The letter that launches structured programming."],
    [1972,"Turing Award",""],
    [2002,"Dies at 72",""]
  ],
  works:[
    [1959,"A Note on Two Problems in Connexion with Graphs","https://doi.org/10.1007/BF01386390"],
    [1968,"Go To Statement Considered Harmful","https://doi.org/10.1145/362929.362947"]
  ]},

{ id:"knuth", name:"Donald Knuth", born:1938, died:null, y:1968,
  dom:["algo","lang"], fields:["analysis","structs","compilers"],
  role:"American computer scientist",
  epitaph:"Made the analysis of algorithms a science, and wrote TeX so the books would look right.",
  legacy:"The Art of Computer Programming is still in progress more than 55 years after volume 1. He pays $2.56, 'one hexadecimal dollar', to anyone who finds an error.",
  life:[
    [1938,"Born in Milwaukee",""],
    [1968,"The Art of Computer Programming, vol. 1","Begins the series that defines algorithm analysis."],
    [1974,"Turing Award",""],
    [1976,"Big-O notation","Standardises Big-O, Big-Omega and Big-Theta."],
    [1978,"TeX","Starts writing the typesetting system still used for most mathematics."],
    [2022,"Volume 4B","Publishes the latest volume in his eighties."]
  ],
  works:[
    [1968,"The Art of Computer Programming","https://www-cs-faculty.stanford.edu/~knuth/taocp.html"]
  ]},

{ id:"codd", name:"E. F. Codd", born:1923, died:2003, y:1970,
  dom:["data"], fields:["databases"],
  role:"English computer scientist",
  epitaph:"Saw that data could be organised as simple tables of relations.",
  legacy:"IBM resisted his relational model because it threatened its existing products. It won anyway: every SQL database descends from his 1970 paper.",
  life:[
    [1923,"Born on the Isle of Portland, England",""],
    [1943,"RAF pilot","Flies for Coastal Command in the Second World War."],
    [1949,"IBM","Joins IBM as a mathematical programmer."],
    [1970,"A Relational Model of Data for Large Shared Data Banks","Founds relational databases."],
    [1981,"Turing Award",""],
    [2003,"Dies at 79",""]
  ],
  works:[
    [1970,"A Relational Model of Data for Large Shared Data Banks","https://doi.org/10.1145/362384.362685"]
  ]},

{ id:"ritchie", name:"Dennis Ritchie", born:1941, died:2011, y:1972,
  dom:["lang"], fields:["langs","systems"],
  role:"American computer scientist",
  epitaph:"Created C and co-created Unix.",
  legacy:"Linux, macOS, iOS and Android all descend from Unix, and most of the world's systems code is C or its children. He died the same week as Steve Jobs, with far less attention.",
  life:[
    [1941,"Born in Bronxville, New York",""],
    [1969,"Unix","Builds Unix with Ken Thompson at Bell Labs."],
    [1972,"C","Designs the C language."],
    [1978,"The C Programming Language","The 'K&R' book, with Brian Kernighan."],
    [1983,"Turing Award","Shared with Thompson."],
    [2011,"Dies at 70",""]
  ],
  works:[]},

{ id:"sparckjones", name:"Karen Spärck Jones", born:1935, died:2007, y:1972,
  dom:["data","ml"], fields:["practice","classical"],
  role:"British computer scientist",
  epitaph:"Invented inverse document frequency, the idea behind search engines.",
  legacy:"TF-IDF ranked the web for decades. Her motto: 'Computing is too important to be left to men.'",
  life:[
    [1935,"Born in Huddersfield, England",""],
    [1964,"Synonymy and Semantic Classification","Early statistical work on word meaning."],
    [1972,"Inverse document frequency","Shows that rare words tell you more about a document than common ones."],
    [1999,"Cambridge professorship","Professor of Computers and Information."],
    [2007,"Lovelace Medal","Awarded by the British Computer Society."],
    [2007,"Dies at 71",""]
  ],
  works:[
    [1972,"A Statistical Interpretation of Term Specificity","https://doi.org/10.1108/eb026526"]
  ]},

{ id:"vapnik", name:"Vladimir Vapnik", born:1936, died:null, y:1971,
  dom:["ml","data"], fields:["classical","stats"],
  role:"Soviet-American statistician",
  epitaph:"Gave learning a theory: VC dimension, and the support vector machine.",
  legacy:"For a decade before deep learning, SVMs were the best off-the-shelf classifiers. His theory of generalisation is still how many people think about overfitting.",
  life:[
    [1936,"Born in Tashkent",""],
    [1971,"VC theory","With Alexey Chervonenkis, measures how complex a model class is."],
    [1990,"Emigrates","Joins AT&T Bell Labs in New Jersey."],
    [1995,"Support-vector networks","With Corinna Cortes, the soft-margin SVM."],
    [1995,"The Nature of Statistical Learning Theory",""],
    [2014,"Facebook AI Research",""]
  ],
  works:[
    [1995,"Support-Vector Networks","https://doi.org/10.1007/BF00994018"]
  ]},

{ id:"diffie", name:"Whitfield Diffie", born:1944, died:null, y:1976,
  dom:["info"], fields:["modern-crypto"],
  role:"American cryptographer",
  epitaph:"Co-invented public-key cryptography.",
  legacy:"Every HTTPS connection starts with an idea from his 1976 paper with Martin Hellman.",
  life:[
    [1944,"Born in Washington, D.C.",""],
    [1976,"New Directions in Cryptography","With Hellman: two strangers can agree a secret key over a public channel."],
    [1991,"Sun Microsystems","Chief security officer; a leading voice against government backdoors."],
    [2015,"Turing Award","Shared with Hellman."]
  ],
  works:[
    [1976,"New Directions in Cryptography","https://doi.org/10.1109/TIT.1976.1055638"]
  ]},

{ id:"hellman", name:"Martin Hellman", born:1945, died:null, y:1976,
  dom:["info"], fields:["modern-crypto"],
  role:"American cryptographer",
  epitaph:"Co-invented public-key cryptography, then fought for the public's right to use it.",
  legacy:"Went on to work on the risk of nuclear war, applying risk analysis to deterrence.",
  life:[
    [1945,"Born in New York",""],
    [1976,"Diffie–Hellman key exchange","Co-authors 'New Directions in Cryptography'."],
    [1977,"The DES debate","Argues publicly that the US encryption standard's key is too short."],
    [2015,"Turing Award","Shared with Diffie; they pledge the prize money to peace and security work."]
  ],
  works:[
    [1976,"New Directions in Cryptography","https://doi.org/10.1109/TIT.1976.1055638"]
  ]},

{ id:"reddy", name:"Raj Reddy", born:1937, died:null, y:1976,
  dom:["ai"], fields:["milestones","symbolic"],
  role:"Indian-American computer scientist",
  epitaph:"Pioneered speech recognition and robotics; the first person of Asian origin to win the Turing Award.",
  legacy:"Founded Carnegie Mellon's Robotics Institute and has spent decades pushing technology for people in developing countries.",
  life:[
    [1937,"Born in Katur, Andhra Pradesh",""],
    [1966,"Stanford PhD","One of the first PhDs in computer science, under John McCarthy."],
    [1976,"Hearsay-II","A speech-understanding system whose 'blackboard' architecture spread across AI."],
    [1979,"CMU Robotics Institute","Founding director."],
    [1994,"Turing Award","Shared with Edward Feigenbaum."]
  ],
  works:[]},

// ---------------- the thaw and the second wave ----------------
{ id:"fukushima", name:"Kunihiko Fukushima", born:1936, died:null, y:1980,
  dom:["ml"], fields:["deep","prehistory"],
  role:"Japanese computer scientist",
  epitaph:"Invented the Neocognitron, the ancestor of every convolutional network.",
  legacy:"His 1980 architecture of stacked convolution and pooling layers is the design LeCun later trained with backpropagation. He also used the rectifier (ReLU) activation in 1969.",
  life:[
    [1936,"Born in Taiwan","Then under Japanese rule."],
    [1969,"The rectifier","Uses a rectified linear activation in a visual feature network."],
    [1975,"Cognitron","A self-organising multilayer network."],
    [1980,"Neocognitron","Convolution and pooling layers that recognise shapes wherever they appear."],
    [2021,"Bower Award","For the Neocognitron."]
  ],
  works:[
    [1980,"Neocognitron","https://doi.org/10.1007/BF00344251"]
  ]},

{ id:"hopfield", name:"John Hopfield", born:1933, died:null, y:1982,
  dom:["ml"], fields:["prehistory","deep"],
  role:"American physicist",
  epitaph:"Showed that a network of neurons can store memories as valleys in an energy landscape.",
  legacy:"His 1982 paper brought physicists into neural networks and helped end the first AI winter. Nobel Prize in Physics 2024, shared with Hinton.",
  life:[
    [1933,"Born in Chicago",""],
    [1982,"Hopfield network","Associative memory as energy minimisation."],
    [1984,"Continuous version","Extends the model to graded neurons."],
    [1985,"Travelling salesman","With David Tank, uses the network to attack optimisation problems."],
    [2024,"Nobel Prize in Physics","Shared with Geoffrey Hinton."]
  ],
  works:[
    [1982,"Neural Networks and Physical Systems with Emergent Collective Computational Abilities","https://doi.org/10.1073/pnas.79.8.2554"]
  ]},

{ id:"pearl", name:"Judea Pearl", born:1936, died:null, y:1985,
  dom:["ml","ai","data"], fields:["classical","decision","stats"],
  role:"Israeli-American computer scientist and philosopher",
  epitaph:"Gave machines a way to reason with uncertainty, then with cause and effect.",
  legacy:"Bayesian networks underpin diagnosis, spam filters and speech systems. His later work on causality asks what today's pattern-matching AI is missing.",
  life:[
    [1936,"Born in Tel Aviv",""],
    [1985,"Bayesian networks","Coins the term and shows how beliefs spread through a graph."],
    [1988,"Probabilistic Reasoning in Intelligent Systems","The book that brings probability into mainstream AI."],
    [2000,"Causality","The do-calculus: a mathematics of intervention."],
    [2011,"Turing Award",""],
    [2018,"The Book of Why","Written for a general audience."]
  ],
  works:[]},

{ id:"rumelhart", name:"David Rumelhart", born:1942, died:2011, y:1986,
  dom:["ml"], fields:["prehistory","deep"],
  role:"American cognitive psychologist",
  epitaph:"Lead author of the 1986 backpropagation paper that revived neural networks.",
  legacy:"The PDP books made 'connectionism' a movement. The Rumelhart Prize is cognitive science's top award.",
  life:[
    [1942,"Born in Wessington Springs, South Dakota",""],
    [1986,"Learning representations by back-propagating errors","With Hinton and Williams, in Nature."],
    [1986,"Parallel Distributed Processing","Co-edits the two volumes with James McClelland."],
    [1998,"Retires","Pick's disease ends his career."],
    [2011,"Dies at 68",""]
  ],
  works:[
    [1986,"Learning Representations by Back-propagating Errors","https://doi.org/10.1038/323533a0"]
  ]},

{ id:"hinton", name:"Geoffrey Hinton", born:1947, died:null, y:1986,
  dom:["ml"], fields:["prehistory","deep","paradigms-ml"],
  role:"British-Canadian computer scientist",
  epitaph:"Carried neural networks through two winters to their triumph.",
  legacy:"Nobel Prize in Physics 2024. In 2023 he left Google so he could speak freely about the risks of the technology he helped create.",
  life:[
    [1947,"Born in Wimbledon, London","Great-great-grandson of George Boole."],
    [1978,"Edinburgh PhD","Studies neural networks when few others will."],
    [1985,"Boltzmann machines","With Terry Sejnowski."],
    [1986,"Backpropagation","Co-authors the Nature paper with Rumelhart and Williams."],
    [2006,"Deep belief nets","Shows deep networks can be trained layer by layer, restarting the field."],
    [2012,"AlexNet","With students Krizhevsky and Sutskever, wins ImageNet by a huge margin."],
    [2013,"Google","DNNresearch is acquired by Google."],
    [2018,"Turing Award","Shared with LeCun and Bengio."],
    [2023,"Leaves Google","To warn about AI risk."],
    [2024,"Nobel Prize in Physics","Shared with John Hopfield."]
  ],
  works:[
    [1986,"Learning Representations by Back-propagating Errors","https://doi.org/10.1038/323533a0"],
    [2006,"A Fast Learning Algorithm for Deep Belief Nets","https://doi.org/10.1162/neco.2006.18.7.1527"]
  ]},

{ id:"sutton", name:"Richard S. Sutton", born:"c. 1957", died:null, y:1988,
  dom:["ml","ai"], fields:["paradigms-ml","deeprl","decision"],
  role:"American-Canadian computer scientist",
  epitaph:"Founded modern reinforcement learning and wrote 'The Bitter Lesson'.",
  legacy:"His essay argues that general methods that scale with compute always beat hand-built knowledge. Turing Award 2024, shared with Andrew Barto.",
  life:[
    [1984,"UMass Amherst PhD","Under Andrew Barto."],
    [1988,"Temporal-difference learning","Learning predictions from other predictions."],
    [1998,"Reinforcement Learning: An Introduction","The standard textbook, with Barto."],
    [2017,"DeepMind Alberta","Leads DeepMind's Edmonton lab."],
    [2019,"The Bitter Lesson","A short essay that became the scaling era's creed."],
    [2025,"Turing Award","For 2024, shared with Barto."]
  ],
  works:[
    [1988,"Learning to Predict by the Methods of Temporal Differences","https://doi.org/10.1007/BF00115009"],
    [2019,"The Bitter Lesson","http://www.incompleteideas.net/IncIdeas/BitterLesson.html"]
  ]},

{ id:"barto", name:"Andrew Barto", born:"c. 1948", died:null, y:1983,
  dom:["ml","ai"], fields:["paradigms-ml","deeprl"],
  role:"American computer scientist",
  epitaph:"Co-founded reinforcement learning with his student Richard Sutton.",
  legacy:"Their textbook trained a generation. Turing Award 2024, shared with Sutton.",
  life:[
    [1983,"Actor–critic","With Sutton and Anderson, neuron-like elements that learn to balance a pole."],
    [1998,"Reinforcement Learning: An Introduction","With Sutton; second edition 2018."],
    [2025,"Turing Award","For 2024, shared with Sutton."]
  ],
  works:[
    [2018,"Reinforcement Learning: An Introduction (2nd ed., free online)","http://incompleteideas.net/book/the-book.html"]
  ]},

{ id:"lecun", name:"Yann LeCun", born:1960, died:null, y:1989,
  dom:["ml"], fields:["deep","paradigms-ml"],
  role:"French-American computer scientist",
  epitaph:"Made convolutional networks work, first on handwritten cheques.",
  legacy:"His LeNet read a large share of US cheques in the late 1990s. As founding director of Meta's AI lab he championed open models, and he remains a loud sceptic that LLMs alone lead to human-level AI.",
  life:[
    [1960,"Born near Paris",""],
    [1987,"PhD, Sorbonne","A form of backpropagation."],
    [1989,"Convolutional networks","At Bell Labs, trains CNNs by backprop to read handwritten zip codes."],
    [1998,"LeNet-5 and MNIST","The architecture and the dataset that became machine learning's 'hello world'."],
    [2003,"New York University",""],
    [2013,"Facebook AI Research","Founding director."],
    [2018,"Turing Award","Shared with Hinton and Bengio."]
  ],
  works:[
    [1989,"Backpropagation Applied to Handwritten Zip Code Recognition","https://doi.org/10.1162/neco.1989.1.4.541"],
    [1998,"Gradient-Based Learning Applied to Document Recognition","https://doi.org/10.1109/5.726791"]
  ]},

{ id:"schmidhuber", name:"Jürgen Schmidhuber", born:1963, died:null, y:1997,
  dom:["ml"], fields:["deep","prehistory"],
  role:"German computer scientist",
  epitaph:"Co-invented the LSTM, and has long insisted on credit for much else.",
  legacy:"LSTMs powered speech recognition and translation on billions of phones in the 2010s. His campaigns over who invented what have made attribution a debate of its own.",
  life:[
    [1963,"Born in Munich",""],
    [1991,"Early ideas","A neural 'history compressor' and adversarial 'artificial curiosity'."],
    [1995,"IDSIA","Co-director of the Swiss AI lab in Lugano."],
    [1997,"LSTM","With his student Sepp Hochreiter."],
    [2015,"Deep Learning in Neural Networks: An Overview","A history with 888 references."],
    [2021,"KAUST","Directs the AI initiative in Saudi Arabia."]
  ],
  works:[
    [1997,"Long Short-Term Memory","https://doi.org/10.1162/neco.1997.9.8.1735"],
    [2015,"Deep Learning in Neural Networks: An Overview","https://arxiv.org/abs/1404.7828"]
  ]},

{ id:"hochreiter", name:"Sepp Hochreiter", born:1967, died:null, y:1997,
  dom:["ml"], fields:["deep"],
  role:"German computer scientist",
  epitaph:"Diagnosed the vanishing gradient as a student, then co-invented the LSTM to fix it.",
  legacy:"Still pushing recurrent networks: his xLSTM (2024) challenges Transformers.",
  life:[
    [1967,"Born in Mühldorf, Germany",""],
    [1991,"Diploma thesis","Analyses why gradients vanish in deep and recurrent networks."],
    [1997,"LSTM","With Schmidhuber: gated memory cells that keep gradients alive."],
    [2006,"Johannes Kepler University Linz","Heads the Institute for Machine Learning."],
    [2024,"xLSTM","A scaled-up LSTM family; co-founds the company NXAI."]
  ],
  works:[
    [1997,"Long Short-Term Memory","https://doi.org/10.1162/neco.1997.9.8.1735"],
    [2024,"xLSTM: Extended Long Short-Term Memory","https://arxiv.org/abs/2405.04517"]
  ]},

{ id:"breiman", name:"Leo Breiman", born:1928, died:2005, y:2001,
  dom:["ml","data"], fields:["classical","stats"],
  role:"American statistician",
  epitaph:"Invented bagging and random forests, and told statisticians to take prediction seriously.",
  legacy:"Random forests are still among the most reliable tools for tabular data. His 'Two Cultures' essay predicted the split between modelling and machine learning.",
  life:[
    [1928,"Born in New York",""],
    [1984,"CART","Classification and regression trees, with Friedman, Olshen and Stone."],
    [1996,"Bagging","Averaging models trained on bootstrap samples."],
    [2001,"Random forests","Many decorrelated trees vote."],
    [2001,"Statistical Modeling: The Two Cultures","A challenge to his own field."],
    [2005,"Dies at 77",""]
  ],
  works:[
    [2001,"Random Forests","https://doi.org/10.1023/A:1010933404324"],
    [2001,"Statistical Modeling: The Two Cultures","https://doi.org/10.1214/ss/1009213726"]
  ]},

{ id:"bengio", name:"Yoshua Bengio", born:1964, died:null, y:2003,
  dom:["ml"], fields:["deep","llm"],
  role:"French-Canadian computer scientist",
  epitaph:"Taught networks to model language with word vectors, and built Montreal into an AI capital.",
  legacy:"The most-cited computer scientist alive. He now spends much of his time on AI safety and chaired the first International AI Safety Report.",
  life:[
    [1964,"Born in Paris",""],
    [1993,"Université de Montréal",""],
    [1994,"Vanishing gradients","Shows why long-range dependencies are hard for recurrent nets."],
    [2003,"A Neural Probabilistic Language Model","Word embeddings plus a neural net predict the next word."],
    [2014,"Attention","His lab's translation model (Bahdanau, Cho, Bengio) introduces neural attention."],
    [2018,"Turing Award","Shared with Hinton and LeCun."],
    [2025,"International AI Safety Report","Chairs the first report, backed by some 30 countries."]
  ],
  works:[
    [2003,"A Neural Probabilistic Language Model","https://jmlr.org/papers/v3/bengio03a.html"],
    [2014,"Neural Machine Translation by Jointly Learning to Align and Translate","https://arxiv.org/abs/1409.0473"]
  ]},

{ id:"koller", name:"Daphne Koller", born:1968, died:null, y:2009,
  dom:["ml","data"], fields:["classical","stats"],
  role:"Israeli-American computer scientist and entrepreneur",
  epitaph:"Wrote the book on probabilistic graphical models and co-founded Coursera.",
  legacy:"Now applies machine learning to drug discovery at insitro, the company she founded in 2018.",
  life:[
    [1968,"Born in Jerusalem",""],
    [1995,"Stanford faculty",""],
    [2004,"MacArthur Fellowship",""],
    [2009,"Probabilistic Graphical Models","With Nir Friedman; the field's reference text."],
    [2012,"Coursera","Co-founds it with Andrew Ng."],
    [2018,"insitro","Founds a machine-learning drug discovery company."]
  ],
  works:[]},

{ id:"feifeili", name:"Fei-Fei Li", born:1976, died:null, y:2009,
  dom:["ml","data"], fields:["deep","practice"],
  role:"Chinese-American computer scientist",
  epitaph:"Built ImageNet and showed that data is the third pillar of AI, beside algorithms and compute.",
  legacy:"Co-directs Stanford's Institute for Human-Centered AI. Her company World Labs builds 'spatial intelligence': models of 3D worlds.",
  life:[
    [1976,"Born in Beijing","Emigrates to New Jersey at 15; her family runs a dry-cleaning shop."],
    [2005,"Caltech PhD",""],
    [2009,"ImageNet","14 million labelled images, annotated with help from crowd workers."],
    [2010,"ImageNet Challenge","The annual contest where AlexNet makes history in 2012."],
    [2017,"AI4ALL","Co-founds a non-profit to bring more diverse students into AI."],
    [2019,"Stanford HAI","Co-founding director."],
    [2024,"World Labs","Co-founds a spatial-intelligence company."]
  ],
  works:[
    [2009,"ImageNet: A Large-Scale Hierarchical Image Database","https://doi.org/10.1109/CVPR.2009.5206848"]
  ]},

{ id:"ng", name:"Andrew Ng", born:1976, died:null, y:2011,
  dom:["ml","hard"], fields:["deep","aihw"],
  role:"British-American computer scientist and educator",
  epitaph:"Put deep learning on GPUs and taught machine learning to millions.",
  legacy:"His online courses are how a large share of today's practitioners first learned the subject.",
  life:[
    [1976,"Born in London","Grows up in Hong Kong and Singapore."],
    [2009,"Deep learning on GPUs","Shows GPUs speed up training by up to 70 times."],
    [2011,"Google Brain","Co-founds it with Jeff Dean and Greg Corrado."],
    [2012,"The 'cat neuron'","A network trained on YouTube stills learns to detect cats with no labels."],
    [2012,"Coursera","Co-founds it with Daphne Koller."],
    [2014,"Baidu","Chief scientist until 2017."],
    [2017,"DeepLearning.AI","Launches the Deep Learning Specialization."]
  ],
  works:[
    [2009,"Large-scale Deep Unsupervised Learning using Graphics Processors","https://doi.org/10.1145/1553374.1553486"]
  ]},

{ id:"huang", name:"Jensen Huang", born:1963, died:null, y:2007,
  dom:["hard"], fields:["aihw"],
  role:"Taiwanese-American engineer and executive",
  epitaph:"Turned the graphics card into the engine of AI.",
  legacy:"CUDA let researchers program GPUs for general maths. Nvidia's chips train almost every frontier model, and in 2024 it briefly became the world's most valuable company.",
  life:[
    [1963,"Born in Tainan, Taiwan","Moves to the US as a child."],
    [1993,"Co-founds Nvidia","Planned, the story goes, at a Denny's restaurant."],
    [1999,"GeForce 256","Marketed as the first 'GPU'."],
    [2007,"CUDA","A platform for general-purpose computing on GPUs."],
    [2016,"DGX-1","Hand-delivers the first AI supercomputer box to OpenAI."],
    [2024,"World's most valuable company","Nvidia briefly tops the list."]
  ],
  works:[]},

{ id:"dean", name:"Jeff Dean", born:1968, died:null, y:2004,
  dom:["lang","ml","hard"], fields:["systems","aihw","deep"],
  role:"American computer scientist",
  epitaph:"Built the systems that made web-scale computing, and then web-scale AI, possible.",
  legacy:"MapReduce, Bigtable and TensorFlow all bear his name. He co-founded Google Brain and helped start the TPU project.",
  life:[
    [1968,"Born in Hawaii",""],
    [1999,"Joins Google","One of its first few dozen employees."],
    [2004,"MapReduce","With Sanjay Ghemawat: simple parallel processing over thousands of machines."],
    [2011,"Google Brain","Co-founds it with Andrew Ng and Greg Corrado."],
    [2015,"TensorFlow","Google open-sources its deep learning framework."],
    [2023,"Chief Scientist, Google DeepMind","After Brain and DeepMind merge."]
  ],
  works:[
    [2004,"MapReduce: Simplified Data Processing on Large Clusters","https://doi.org/10.1145/1327452.1327492"],
    [2016,"TensorFlow: A System for Large-Scale Machine Learning","https://arxiv.org/abs/1603.04467"]
  ]},

// ---------------- the deep learning era ----------------
{ id:"krizhevsky", name:"Alex Krizhevsky", born:null, died:null, y:2012,
  dom:["ml","hard"], fields:["deep","aihw"],
  role:"Ukrainian-born Canadian computer scientist",
  epitaph:"Trained AlexNet on two gaming GPUs in his bedroom and started the deep learning boom.",
  legacy:"AlexNet cut the ImageNet error rate from 26% to 15% in 2012. Almost everything in this era follows from that result.",
  life:[
    [2009,"CIFAR-10","Builds the small image dataset still used in thousands of papers."],
    [2012,"AlexNet","With Sutskever and Hinton, wins ImageNet by a huge margin."],
    [2013,"Google","Joins via the DNNresearch acquisition."],
    [2017,"Leaves Google","Largely steps away from the spotlight."]
  ],
  works:[
    [2012,"ImageNet Classification with Deep Convolutional Neural Networks","https://doi.org/10.1145/3065386"]
  ]},

{ id:"sutskever", name:"Ilya Sutskever", born:"c. 1986", died:null, y:2012,
  dom:["ml"], fields:["deep","llm"],
  role:"Israeli-Canadian computer scientist",
  epitaph:"Co-created AlexNet and sequence-to-sequence learning, and led the research that produced GPT.",
  legacy:"Believed early that scale would unlock intelligence. Now runs Safe Superintelligence, a lab with a single goal.",
  life:[
    [1991,"Emigrates","From Russia to Israel as a child; later moves to Canada."],
    [2012,"AlexNet","Co-author with Krizhevsky and Hinton."],
    [2014,"Sequence to sequence","One network reads a sentence, another writes its translation."],
    [2015,"Co-founds OpenAI","Chief scientist."],
    [2023,"The board crisis","Votes to remove Sam Altman as CEO, then publicly regrets it."],
    [2024,"Safe Superintelligence","Leaves OpenAI and co-founds SSI."]
  ],
  works:[
    [2014,"Sequence to Sequence Learning with Neural Networks","https://arxiv.org/abs/1409.3215"]
  ]},

{ id:"hassabis", name:"Demis Hassabis", born:1976, died:null, y:2016,
  dom:["ml","ai"], fields:["deeprl","milestones","deep"],
  role:"British computer scientist, neuroscientist and entrepreneur",
  epitaph:"Chess prodigy turned game designer turned neuroscientist, who built DeepMind to 'solve intelligence'.",
  legacy:"AlphaGo, AlphaZero and AlphaFold came from his lab. Nobel Prize in Chemistry 2024 and a knighthood the same year.",
  life:[
    [1976,"Born in London","Reaches chess master strength at 13."],
    [1994,"Theme Park","Co-designs the hit video game at 17."],
    [1998,"Elixir Studios","Founds his own games company."],
    [2009,"UCL PhD in cognitive neuroscience","Studies memory and imagination."],
    [2010,"Co-founds DeepMind","With Shane Legg and Mustafa Suleyman."],
    [2014,"Acquired by Google",""],
    [2016,"AlphaGo","Beats Lee Sedol 4–1 in Seoul."],
    [2020,"AlphaFold 2","Predicts protein structures at near-experimental accuracy."],
    [2021,"Isomorphic Labs","Founds a drug discovery spin-off."],
    [2024,"Nobel Prize in Chemistry","Shared with John Jumper and David Baker; knighted the same year."]
  ],
  works:[
    [2016,"Mastering the Game of Go with Deep Neural Networks and Tree Search","https://doi.org/10.1038/nature16961"],
    [2021,"Highly Accurate Protein Structure Prediction with AlphaFold","https://doi.org/10.1038/s41586-021-03819-2"]
  ]},

{ id:"silver", name:"David Silver", born:1976, died:null, y:2016,
  dom:["ml","ai"], fields:["deeprl","milestones"],
  role:"British computer scientist",
  epitaph:"Led AlphaGo, then AlphaZero, which taught itself chess, shogi and Go from scratch.",
  legacy:"His free UCL course on reinforcement learning is a classic. In 2025 he and Sutton argued AI is entering an 'era of experience', learning from its own interactions.",
  life:[
    [1997,"Elixir Studios","Lead programmer at Hassabis's games company."],
    [2009,"PhD, University of Alberta","On reinforcement learning for Go."],
    [2013,"DQN","Co-author of DeepMind's Atari-playing network."],
    [2016,"AlphaGo","Lead researcher."],
    [2017,"AlphaZero","Learns chess, shogi and Go by self-play alone."],
    [2019,"ACM Prize in Computing",""],
    [2020,"MuZero","Masters games without being told the rules."]
  ],
  works:[
    [2016,"Mastering the Game of Go with Deep Neural Networks and Tree Search","https://doi.org/10.1038/nature16961"],
    [2018,"A General Reinforcement Learning Algorithm that Masters Chess, Shogi, and Go","https://doi.org/10.1126/science.aar6404"]
  ]},

{ id:"jumper", name:"John Jumper", born:1985, died:null, y:2020,
  dom:["ml"], fields:["deep","deeprl"],
  role:"American chemist and computer scientist",
  epitaph:"Led AlphaFold 2, which solved a 50-year-old problem in biology.",
  legacy:"AlphaFold's database now holds predicted structures for over 200 million proteins, free to every scientist. Nobel Prize in Chemistry 2024.",
  life:[
    [1985,"Born in Little Rock, Arkansas",""],
    [2017,"University of Chicago PhD","In theoretical chemistry."],
    [2017,"DeepMind",""],
    [2020,"CASP14","AlphaFold 2 wins the protein-structure competition decisively."],
    [2021,"AlphaFold Protein Structure Database","Opened to all researchers."],
    [2024,"Nobel Prize in Chemistry","Shared with Hassabis and Baker; the youngest chemistry laureate in over 70 years."]
  ],
  works:[
    [2021,"Highly Accurate Protein Structure Prediction with AlphaFold","https://doi.org/10.1038/s41586-021-03819-2"]
  ]},

{ id:"goodfellow", name:"Ian Goodfellow", born:null, died:null, y:2014,
  dom:["ml"], fields:["deep","paradigms-ml"],
  role:"American computer scientist",
  epitaph:"Invented generative adversarial networks after an argument in a Montreal bar.",
  legacy:"GANs made the first photorealistic fake faces. His work on adversarial examples showed how easily neural networks can be fooled.",
  life:[
    [2014,"GANs","Two networks compete: one forges, one detects."],
    [2014,"Adversarial examples","Explains why tiny, invisible changes fool image classifiers."],
    [2016,"Deep Learning","The textbook, with Bengio and Courville."],
    [2019,"Apple","Director of machine learning, until 2022."],
    [2022,"Google DeepMind",""]
  ],
  works:[
    [2014,"Generative Adversarial Networks","https://arxiv.org/abs/1406.2661"],
    [2014,"Explaining and Harnessing Adversarial Examples","https://arxiv.org/abs/1412.6572"]
  ]},

{ id:"kingma", name:"Diederik P. Kingma", born:null, died:null, y:2014,
  dom:["ml"], fields:["deep","classical"],
  role:"Dutch computer scientist",
  epitaph:"Co-invented the variational autoencoder and Adam, the optimiser that trains almost everything.",
  legacy:"Adam is among the most cited papers in science. VAEs remain inside today's image generators.",
  life:[
    [2013,"Variational autoencoders","With Max Welling: generative models trained by backprop."],
    [2014,"Adam","With Jimmy Ba: an adaptive optimiser that became the default."],
    [2015,"OpenAI","Part of the founding team."],
    [2018,"Google Brain",""],
    [2024,"Anthropic",""]
  ],
  works:[
    [2013,"Auto-Encoding Variational Bayes","https://arxiv.org/abs/1312.6114"],
    [2014,"Adam: A Method for Stochastic Optimization","https://arxiv.org/abs/1412.6980"]
  ]},

{ id:"vinyals", name:"Oriol Vinyals", born:1983, died:null, y:2014,
  dom:["ml"], fields:["deep","llm","deeprl"],
  role:"Spanish computer scientist",
  epitaph:"Co-invented sequence-to-sequence learning and led AlphaStar.",
  legacy:"Co-leads Google DeepMind's Gemini models.",
  life:[
    [1983,"Born in Barcelona",""],
    [2014,"Sequence to sequence","With Sutskever and Le."],
    [2015,"Show and Tell","Neural image captioning."],
    [2019,"AlphaStar","Reaches Grandmaster level in StarCraft II."],
    [2023,"Gemini","Co-leads Google DeepMind's multimodal models."]
  ],
  works:[
    [2014,"Sequence to Sequence Learning with Neural Networks","https://arxiv.org/abs/1409.3215"],
    [2019,"Grandmaster Level in StarCraft II","https://doi.org/10.1038/s41586-019-1724-z"]
  ]},

{ id:"kaiminghe", name:"Kaiming He", born:1984, died:null, y:2015,
  dom:["ml"], fields:["deep"],
  role:"Chinese computer scientist",
  epitaph:"Invented residual connections, the shortcut that lets networks go hundreds of layers deep.",
  legacy:"The ResNet paper is one of the most cited papers of the 21st century, and residual connections sit inside every Transformer.",
  life:[
    [1984,"Born in Guangzhou",""],
    [2009,"Dark channel prior","Wins CVPR best paper for image dehazing."],
    [2015,"ResNet","Wins ImageNet with a 152-layer network."],
    [2017,"Mask R-CNN","Best paper at ICCV."],
    [2024,"MIT","Joins the faculty."]
  ],
  works:[
    [2015,"Deep Residual Learning for Image Recognition","https://arxiv.org/abs/1512.03385"]
  ]},

{ id:"abbeel", name:"Pieter Abbeel", born:1977, died:null, y:2015,
  dom:["ml","ai"], fields:["deeprl","deep"],
  role:"Belgian-American roboticist",
  epitaph:"Taught robots to learn skills by trial and error, and co-authored the paper behind diffusion image models.",
  legacy:"His Berkeley lab trained many of today's leaders in robot learning.",
  life:[
    [1977,"Born in Antwerp",""],
    [2008,"Berkeley","Robots that fold laundry."],
    [2015,"Trust region policy optimisation","A stable way to train deep RL policies."],
    [2017,"Covariant","Co-founds a robotics AI company."],
    [2020,"Denoising diffusion","With Ho and Jain, the paper that set off diffusion image models."],
    [2021,"ACM Prize in Computing",""]
  ],
  works:[
    [2015,"Trust Region Policy Optimization","https://arxiv.org/abs/1502.05477"],
    [2020,"Denoising Diffusion Probabilistic Models","https://arxiv.org/abs/2006.11239"]
  ]},

{ id:"vaswani", name:"Ashish Vaswani", born:null, died:null, y:2017,
  dom:["ml"], fields:["llm","deep"],
  role:"Indian-American computer scientist",
  epitaph:"First author of 'Attention Is All You Need', which introduced the Transformer.",
  legacy:"The Transformer is the architecture behind GPT, Claude, Gemini and most of modern AI. All eight authors left Google within a few years.",
  life:[
    [2014,"USC PhD",""],
    [2016,"Google Brain",""],
    [2017,"The Transformer","Replaces recurrence with attention alone."],
    [2022,"Adept","Co-founds an AI agent start-up."],
    [2023,"Essential AI","Co-founds another AI company."]
  ],
  works:[
    [2017,"Attention Is All You Need","https://arxiv.org/abs/1706.03762"]
  ]},

{ id:"shazeer", name:"Noam Shazeer", born:"c. 1976", died:null, y:2017,
  dom:["ml"], fields:["llm","deep"],
  role:"American computer scientist",
  epitaph:"Transformer co-author, and inventor of the mixture-of-experts layers that scale today's largest models.",
  legacy:"Left Google to co-found Character.AI in 2021 and returned in 2024 to co-lead Gemini.",
  life:[
    [2000,"Joins Google","Works on spelling correction and ads."],
    [2017,"Mixture of experts","Sparsely gated layers with thousands of expert sub-networks."],
    [2017,"The Transformer","Co-author; responsible for multi-head attention."],
    [2021,"Character.AI","Co-founds it with Daniel De Freitas."],
    [2024,"Back to Google","Co-leads Gemini."]
  ],
  works:[
    [2017,"Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer","https://arxiv.org/abs/1701.06538"],
    [2017,"Attention Is All You Need","https://arxiv.org/abs/1706.03762"]
  ]},

{ id:"radford", name:"Alec Radford", born:null, died:null, y:2018,
  dom:["ml"], fields:["llm","deep"],
  role:"American researcher",
  epitaph:"Lead author of GPT-1, GPT-2, CLIP and Whisper.",
  legacy:"Showed that simply predicting the next word, at scale, produces general-purpose language models.",
  life:[
    [2015,"DCGAN","Makes GANs stable enough to generate convincing images."],
    [2016,"OpenAI",""],
    [2018,"GPT-1","Generative pre-training, then fine-tuning."],
    [2019,"GPT-2","Its staged release starts the debate over publishing powerful models."],
    [2021,"CLIP","Learns images and text in one shared space."],
    [2024,"Leaves OpenAI","To do independent research."]
  ],
  works:[
    [2015,"Unsupervised Representation Learning with DCGANs","https://arxiv.org/abs/1511.06434"],
    [2021,"Learning Transferable Visual Models From Natural Language Supervision","https://arxiv.org/abs/2103.00020"]
  ]},

{ id:"karpathy", name:"Andrej Karpathy", born:1986, died:null, y:2015,
  dom:["ml"], fields:["deep","llm"],
  role:"Slovak-Canadian computer scientist and educator",
  epitaph:"The field's best teacher: from CS231n to building GPT from scratch on video.",
  legacy:"Led Tesla's Autopilot vision team and now builds AI-native education at Eureka Labs. Coined 'Software 2.0' and 'vibe coding'.",
  life:[
    [1986,"Born in Bratislava","Moves to Toronto at 15."],
    [2015,"CS231n","Creates Stanford's convolutional networks course with Fei-Fei Li."],
    [2015,"The Unreasonable Effectiveness of RNNs","A blog post that taught a generation."],
    [2015,"OpenAI","A founding member."],
    [2017,"Tesla","Director of AI; builds Autopilot's vision stack."],
    [2023,"Back to OpenAI","Returns briefly."],
    [2024,"Eureka Labs","Founds an AI education company."],
    [2025,"'Vibe coding'","His phrase for programming by prompting spreads worldwide."]
  ],
  works:[
    [2015,"The Unreasonable Effectiveness of Recurrent Neural Networks","https://karpathy.github.io/2015/05/21/rnn-effectiveness/"],
    [2023,"nanoGPT","https://github.com/karpathy/nanoGPT"]
  ]},

{ id:"olah", name:"Chris Olah", born:null, died:null, y:2020,
  dom:["ml"], fields:["llm","deep"],
  role:"Canadian researcher",
  epitaph:"Pioneered mechanistic interpretability: opening neural networks to read the circuits inside.",
  legacy:"Has no university degree. His visual explanations on his blog and at Distill set a new standard for clear research writing. Co-founded Anthropic.",
  life:[
    [2015,"Colah's blog","Explanations of LSTMs and more, read by millions."],
    [2017,"Distill","Co-founds a journal for interactive, visual research."],
    [2017,"Feature Visualization","Shows what individual neurons respond to."],
    [2020,"Circuits","Traces how features connect inside a vision network."],
    [2021,"Anthropic","Co-founder; leads interpretability research."],
    [2021,"Transformer circuits","Applies the approach to language models."]
  ],
  works:[
    [2020,"Zoom In: An Introduction to Circuits","https://distill.pub/2020/circuits/zoom-in/"],
    [2021,"A Mathematical Framework for Transformer Circuits","https://transformer-circuits.pub/2021/framework/index.html"]
  ]},

{ id:"amodei", name:"Dario Amodei", born:1983, died:null, y:2020,
  dom:["ml"], fields:["llm"],
  role:"American AI researcher and entrepreneur",
  epitaph:"Led the research behind GPT-2 and GPT-3, then co-founded Anthropic to build AI with safety at its core.",
  legacy:"Co-authored the scaling laws that made model growth predictable. His essay 'Machines of Loving Grace' sets out what AI could do for biology, health and poverty.",
  life:[
    [1983,"Born in San Francisco",""],
    [2011,"Princeton PhD","In biophysics."],
    [2014,"Baidu","Works with Andrew Ng on speech recognition."],
    [2016,"Concrete Problems in AI Safety","Co-authors an influential research agenda."],
    [2016,"OpenAI","Later VP of research; leads GPT-2 and GPT-3."],
    [2020,"Scaling laws","Model quality improves predictably with size, data and compute."],
    [2021,"Co-founds Anthropic","With his sister Daniela and other OpenAI colleagues."],
    [2023,"Claude","Anthropic releases its first Claude models."],
    [2024,"Machines of Loving Grace","A long essay on AI's potential upside."]
  ],
  works:[
    [2016,"Concrete Problems in AI Safety","https://arxiv.org/abs/1606.06565"],
    [2020,"Scaling Laws for Neural Language Models","https://arxiv.org/abs/2001.08361"],
    [2024,"Machines of Loving Grace","https://www.darioamodei.com/essay/machines-of-loving-grace"]
  ]},

{ id:"altman", name:"Sam Altman", born:1985, died:null, y:2022,
  dom:["ml"], fields:["llm"],
  role:"American entrepreneur",
  epitaph:"Took ChatGPT to the public and made AI a mass-market product.",
  legacy:"ChatGPT gained an estimated 100 million users within about two months. His brief removal and return in November 2023 exposed the tension between safety and speed inside AI labs.",
  life:[
    [1985,"Born in Chicago",""],
    [2005,"Loopt","Drops out of Stanford to found a location app."],
    [2014,"Y Combinator","Becomes president of the start-up accelerator."],
    [2015,"Co-founds OpenAI","As a non-profit research lab."],
    [2019,"OpenAI CEO",""],
    [2022,"ChatGPT","Released as a 'low-key research preview' on 30 November."],
    [2023,"Fired and rehired","The board removes him; he returns within five days."]
  ],
  works:[]},

// ---------------- voices often left out ----------------
{ id:"gebru", name:"Timnit Gebru", born:"c. 1983", died:null, y:2018,
  dom:["ml","data"], fields:["practice","llm"],
  role:"Ethiopian-born American computer scientist",
  epitaph:"Showed how AI systems can encode bias, and paid a price for saying so.",
  legacy:"Her dismissal from Google over the 'Stochastic Parrots' paper became a turning point in debates about corporate AI ethics. She founded the independent DAIR institute.",
  life:[
    [2017,"Black in AI","Co-founds a community for Black researchers."],
    [2018,"Gender Shades","Co-author with Joy Buolamwini."],
    [2018,"Datasheets for Datasets","Proposes documenting how every dataset was made."],
    [2020,"Leaves Google","Dismissed after a dispute over a paper on the risks of large language models."],
    [2021,"On the Dangers of Stochastic Parrots","The paper is published."],
    [2021,"DAIR","Founds the Distributed AI Research Institute."]
  ],
  works:[
    [2018,"Datasheets for Datasets","https://arxiv.org/abs/1803.09010"],
    [2021,"On the Dangers of Stochastic Parrots","https://doi.org/10.1145/3442188.3445922"]
  ]},

{ id:"buolamwini", name:"Joy Buolamwini", born:"c. 1990", died:null, y:2018,
  dom:["ml","data"], fields:["practice","deep"],
  role:"Ghanaian-American-Canadian computer scientist",
  epitaph:"Found that face-recognition systems failed most on darker-skinned women, and made companies fix it.",
  legacy:"Her audits pushed IBM, Microsoft and Amazon to change or pause their face-recognition products.",
  life:[
    [2015,"The white mask","A face-tracking system at MIT can only see her when she wears a white mask."],
    [2016,"Algorithmic Justice League","Founds an organisation to fight bias in AI."],
    [2018,"Gender Shades","With Timnit Gebru, audits commercial face-analysis systems."],
    [2020,"Coded Bias","The documentary about her work."],
    [2023,"Unmasking AI","Her book."]
  ],
  works:[
    [2018,"Gender Shades","https://proceedings.mlr.press/v81/buolamwini18a.html"]
  ]}
];
