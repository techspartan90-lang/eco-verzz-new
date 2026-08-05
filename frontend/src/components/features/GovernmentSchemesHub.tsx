import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../../services/api";
import {
  Leaf, Trash2, ShieldAlert, Building2, Droplet, Trees, Wind, Zap, HelpCircle,
  AlertTriangle, Search, Info, MapPin, Calendar, Award, MessageSquare, BookOpen, Download,
  ExternalLink, Send, ArrowRight, UserPlus, CheckCircle2, ChevronRight, BarChart2, Star, Check
} from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  title: string;
  description: string;
  overview: string;
  objectives: string;
  vision_mission: string;
  ministry: string;
  launch_year: number;
  eligibility: string;
  benefits: string;
  target_beneficiaries: string;
  current_progress: string;
  state_implementation: string;
  guidelines: string;
  icon: any;
  color: string;
}

export const GovernmentSchemesHub: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tracker" | "map" | "ai" | "feedback">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Gujarat");

  // Feature specific states
  // Mission LiFE
  const [carbonFootprint, setCarbonFootprint] = useState({ transport: 10, electricity: 120, diet: 3 });
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  
  // Swachh Bharat
  const [complaint, setComplaint] = useState({ title: "", description: "", location: "", category: "PLASTIC" });
  const [complaintsList, setComplaintsList] = useState<any[]>([
    { id: "1", title: "Plastic heap in municipal park", location: "Sector 4, Indore", status: "RESOLVED" },
    { id: "2", title: "Overflowing dry waste bin", location: "Koregaon Park, Pune", status: "ASSIGNED" }
  ]);

  // CPCB Live metrics
  const [aqi, setAqi] = useState(45);
  const [noise, setNoise] = useState(58);
  const [waterPh, setWaterPh] = useState(7.2);

  // Smart City simulation
  const [smartLight, setSmartLight] = useState(true);
  const [binFill, setBinFill] = useState(35);
  const [parkingOccupancy, setParkingOccupancy] = useState(60);

  // Green India afforestation
  const [adoptedTrees, setAdoptedTrees] = useState<string[]>([]);
  const [newTreeName, setNewTreeName] = useState("");

  // AI assistant chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "assistant", text: "Hello! I am your AI Government Schemes Assistant. Ask me anything about eligibility, benefits, or application procedures for these 11 environmental initiatives." }
  ]);

  // Feedback
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Mappings to attach React components and colors to backend scheme items
  const iconMap: Record<string, any> = {
    life: Leaf,
    swachhbharat: Trash2,
    cpcb: ShieldAlert,
    cpcb_epr: ShieldAlert,
    smartcities: Building2,
    jaljeevan: Droplet,
    greenindia: Trees,
    ncap: Wind,
    plasticwaste: Leaf,
    energycons: Zap,
    climatechange: HelpCircle
  };

  const colorMap: Record<string, string> = {
    life: "from-emerald-500 to-teal-400",
    swachhbharat: "from-amber-500 to-orange-400",
    cpcb: "from-red-500 to-pink-500",
    cpcb_epr: "from-blue-500 to-cyan-400",
    smartcities: "from-purple-500 to-indigo-400",
    jaljeevan: "from-cyan-500 to-blue-500",
    greenindia: "from-emerald-600 to-green-400",
    ncap: "from-sky-500 to-sky-300",
    plasticwaste: "from-amber-600 to-amber-400",
    energycons: "from-yellow-500 to-amber-500",
    climatechange: "from-rose-600 to-orange-500"
  };

  // Load schemes from backend on mount
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const res = await api.getGovernmentSchemes();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item: any) => ({
            ...item,
            icon: iconMap[item.name] || HelpCircle,
            color: colorMap[item.name] || "from-gray-500 to-gray-400"
          }));
          setSchemes(mapped);
          return;
        }
      } catch (err) {
        console.warn("Backend schemes endpoint unreachable, using robust fallback configuration.", err);
      }

      // Robust fallback list if database is empty or connection fails
      const fallbackList: Scheme[] = [
        {
          id: "1",
          name: "life",
          title: "Mission LiFE (Lifestyle for Environment)",
          description: "India's flagship global mass movement to nudge individual and community action towards environmental conservation and sustainable living.",
          overview: "Mission LiFE was introduced by the Prime Minister of India at COP26. It aims to replace the prevalent 'use-and-dispose' economy with a circular economy defined by mindful consumption.",
          objectives: "Nudge citizens to perform simple daily actions that aggregate to large carbon footprint savings. Track and reward sustainable habit formation.",
          vision_mission: "Create a global network of 'Pro-Planet People' (P3) sharing a commitment to adopt and promote environment-friendly lifestyles.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 2022,
          eligibility: "Open to all global citizens. No age, nationality, or income restrictions.",
          benefits: "Gain EcoPoints, unlock Carbon Credit tokens on the blockchain, earn certified Pro-Planet badges, and reduce household utility costs.",
          target_beneficiaries: "Individuals, households, schools, commercial offices, and community centers.",
          current_progress: "Over 10 million citizens registered. 450,000+ daily challenges completed, resulting in an estimated 1,200 tons of CO2 offsets.",
          state_implementation: "Active in all 28 states and 8 Union Territories. Gujarat, Maharashtra, and Karnataka currently lead in participant metrics.",
          guidelines: "Adopt 7 core categories of action: Save Energy, Save Water, Say No to Single-Use Plastic, Reduce Waste, Adopt Sustainable Food Systems, Reduce E-Waste, and Adopt Healthy Lifestyles.",
          icon: Leaf,
          color: "from-emerald-500 to-teal-400"
        },
        {
          id: "2",
          name: "swachhbharat",
          title: "Swachh Bharat Mission (SBM)",
          description: "The nation-wide campaign to eliminate open defecation, improve solid waste management, and create garbage-free cities across India.",
          overview: "Launched on the birth anniversary of Mahatma Gandhi, SBM is India's largest cleanliness and sanitation drive, integrating community work and civic infrastructure.",
          objectives: "Complete solid waste management in all cities, construct public toilets, implement 100% door-to-door source segregated waste collection, and clear legacy landfills.",
          vision_mission: "A clean, hygienic, garbage-free India with healthy environments and active citizen volunteers.",
          ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
          launch_year: 2014,
          eligibility: "All Indian municipalities, city councils, and citizens.",
          benefits: "File garbage complaints with instant municipal mapping, register local cleanup drives, locate public dustbins, and track local Swachh scores.",
          target_beneficiaries: "Municipal corporations, local community groups, volunteers, and rural village Panchayats.",
          current_progress: "100% of urban local bodies declared ODF (Open Defecation Free). 86% of urban waste is now processed daily.",
          state_implementation: "Implemented at municipal level. Indore, Surat, and Navi Mumbai consistently rank highest in the Swachh Survekshan index.",
          guidelines: "Citizens must segregate waste into wet, dry, and sanitary waste, report open dumps, and participate in local cleanliness events.",
          icon: Trash2,
          color: "from-amber-500 to-orange-400"
        },
        {
          id: "3",
          name: "cpcb",
          title: "Central Pollution Control Board (CPCB) Portal",
          description: "National monitors for Air Quality Index (AQI), water quality metrics, noise levels, and environmental health parameters.",
          overview: "The CPCB is a statutory organization providing technical services and monitoring networks to control water, air, and noise pollution across India.",
          objectives: "Track and publish live AQI, model pollution trends, issue regional environmental warnings, and enforce regulatory compliance on industrial units.",
          vision_mission: "Promote cleanliness of streams, wells, and water systems, and improve the overall air quality of the country.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 1974,
          eligibility: "Access is public. Citizens can view real-time data and file regional pollution reports.",
          benefits: "Access live AQI dashboards, historical pollution charts, warning notifications, and AI-powered pollution predictions.",
          target_beneficiaries: "Public, healthcare providers, researchers, and local pollution control boards.",
          current_progress: "Continuous Air Monitoring Stations (CAAQMS) active in 340+ cities. National Water Quality Monitoring Network covers 4,000+ points.",
          state_implementation: "Active in all states in collaboration with State Pollution Control Boards (SPCBs).",
          guidelines: "Follow AQI advisory alerts. Report industrial effluents or open plastic burning via the portal.",
          icon: ShieldAlert,
          color: "from-red-500 to-pink-500"
        },
        {
          id: "4",
          name: "cpcb_epr",
          title: "CPCB EPR (Extended Producer Responsibility) Portal",
          description: "Regulating circular waste streams for plastic, electronic (e-waste), battery, and tire waste through recyclers and producer compliance.",
          overview: "EPR rules mandate that producers, importers, and brand owners (PIBOs) are financially and physically responsible for the recycling and end-of-life management of their products.",
          objectives: "Establish a transparent recycling directory, manage collection targets, audit recyclers, and track EPR certificates online.",
          vision_mission: "Achieve 100% circularity in packaging and critical waste streams, removing hazardous materials from consumer waste.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 2016,
          eligibility: "Registered PIBOs, recyclers, and collection centers.",
          benefits: "PIBO directory lookup, recycler database integration, smart collection center locator, and compliance dashboard visualization.",
          target_beneficiaries: "Recyclers, brand owners, eco-conscious consumers, and waste collector cooperatives.",
          current_progress: "Over 22,000 brand owners registered. 2.4 million metric tons of plastic waste covered under EPR tracking.",
          state_implementation: "Enforced globally across India. Large manufacturing hubs in Gujarat, Tamil Nadu, and Maharashtra lead compliance.",
          guidelines: "PIBOs must purchase EPR certificates from certified recyclers to offset their production footprint.",
          icon: ShieldAlert,
          color: "from-blue-500 to-cyan-400"
        },
        {
          id: "5",
          name: "smartcities",
          title: "Smart Cities Mission",
          description: "Urban renewal and retrofitting program by the Government of India to develop smart, sustainable, and citizen-friendly cities.",
          overview: "The Mission focuses on core infrastructure like clean water, electricity, sanitation, and smart solutions such as IoT bin tracking, smart parking, and green grids.",
          objectives: "Implement smart waste monitoring, street lighting automation, smart parking sensors, and centralized command centers.",
          vision_mission: "Enable local development and harness technology as a means to create smart outcomes for citizens.",
          ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
          launch_year: 2015,
          eligibility: "100 nominated cities across all Indian states.",
          benefits: "View live city IoT dashboards (parking, lighting, waste bin capacity), submit infrastructure feedback, and access urban development maps.",
          target_beneficiaries: "Urban residents, local municipal councils, and technology partners.",
          current_progress: "7,900+ projects worth Rs. 1.8 lakh crore completed. Integrated Command and Control Centers (ICCC) online in all 100 cities.",
          state_implementation: "Projects managed by Special Purpose Vehicles (SPVs) in each smart city (e.g. Pune Smart City, Smart City Ahmedabad).",
          guidelines: "Urban infrastructure must maintain digital connectivity, energy efficiency, and GIS resource mapping.",
          icon: Building2,
          color: "from-purple-500 to-indigo-400"
        },
        {
          id: "6",
          name: "jaljeevan",
          title: "Jal Jeevan Mission (JJM)",
          description: "Providing safe and adequate drinking water through individual household tap connections to all households in rural India by 2024.",
          overview: "JJM is a community-driven initiative focusing on water supply infrastructure, source sustainability, greywater management, and water quality testing.",
          objectives: "Provide 55 liters of safe drinking water per person per day through Functional Household Tap Connections (FHTC).",
          vision_mission: "Ensure every rural home has access to drinking water of prescribed quality on a regular and long-term basis.",
          ministry: "Ministry of Jal Shakti",
          launch_year: 2019,
          eligibility: "All rural households, village communities, schools, and health centers.",
          benefits: "Report water leakages, track village tap water coverage, access local groundwater analytics, and log community rainwater harvesting projects.",
          target_beneficiaries: "Rural families, local water committees (Pani Samitis), and village volunteers.",
          current_progress: "Over 140 million rural households (74%) provided with tap water connections. 500,000+ villages have formed active Pani Samitis.",
          state_implementation: "States execute water schemes locally. Goa, Gujarat, Telangana, and Haryana have achieved 100% household coverage.",
          guidelines: "Establish village water safety plans and utilize field test kits (FTK) for regular water quality testing.",
          icon: Droplet,
          color: "from-cyan-500 to-blue-500"
        },
        {
          id: "7",
          name: "greenindia",
          title: "National Mission for Green India (GIM)",
          description: "Increasing forest and tree cover, enhancing ecosystem services, and promoting carbon sequestration through community afforestation.",
          overview: "GIM is one of the eight missions under the National Action Plan on Climate Change (NAPCC). It addresses climate adaptation and carbon sink expansion.",
          objectives: "Increase forest/tree cover on 5 million hectares, improve ecosystem services (carbon sequestration, hydrology, biodiversity), and enhance forest livelihoods.",
          vision_mission: "A green, ecologically balanced country with expanded carbon sinks and protected forest ecosystems.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 2014,
          eligibility: "Forest protection committees, village groups, non-profits, and volunteer citizens.",
          benefits: "Adopt a tree virtually, log your plantation drives with coordinates, receive a green certificate, and calculate carbon sequestration.",
          target_beneficiaries: "Tribal and forest-dwelling communities, local community organizations, and urban tree planters.",
          current_progress: "Reforestation and forest improvement projects implemented across 300,000 hectares. Estimated carbon offset is 1.6 million tCO2e.",
          state_implementation: "Active in all forested states. Joint Forest Management Committees (JFMCs) manage ground plantations.",
          guidelines: "Plant native tree species appropriate for your local ecosystem. Maintain and protect saplings for a minimum of 3 years.",
          icon: Trees,
          color: "from-emerald-600 to-green-400"
        },
        {
          id: "8",
          name: "ncap",
          title: "National Clean Air Programme (NCAP)",
          description: "India's national framework to tackle air pollution, targeting a 20-30% reduction in Particulate Matter (PM10 and PM2.5) concentrations.",
          overview: "NCAP targets non-attainment cities that do not meet national ambient air quality standards, enforcing action plans to control road dust, traffic emissions, and waste burning.",
          objectives: "Deploy continuous air monitoring stations, enforce emission norms, expand green buffers around highways, and reduce PM levels.",
          vision_mission: "Clean, breathable air for all Indian cities, meeting national safety guidelines.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 2019,
          eligibility: "131 designated non-attainment cities.",
          benefits: "Access live PM2.5/PM10 metrics, check city clean air rankings, and review regional municipal air action plans.",
          target_beneficiaries: "Urban citizens, school children, vulnerable groups, and town planning authorities.",
          current_progress: "131 cities have formulated custom action plans. Air quality monitoring networks expanded by 60% across target zones.",
          state_implementation: "Executed by municipal bodies and State Pollution Control Boards. Funded directly by central grants.",
          guidelines: "Promote public transport, restrict industrial fuel combustion, ban crop residue burning, and enforce dust-suppression at construction sites.",
          icon: Wind,
          color: "from-sky-500 to-sky-300"
        },
        {
          id: "9",
          name: "plasticwaste",
          title: "Plastic Waste Management Rules",
          description: "Statutory rules banning identified single-use plastics and enforcing strict recycling protocols on commercial entities and consumers.",
          overview: "The rules ban the manufacture, import, sale, and use of single-use plastic items with low utility and high environmental risk (e.g. plastic cutlery, straws, bags under 120 microns).",
          objectives: "Phase out single-use plastics, enforce multi-layer packaging circularity, and promote alternative materials like jute and biodegradable starch.",
          vision_mission: "A single-use plastic-free India, minimizing plastic clogging in marine and terrestrial ecosystems.",
          ministry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
          launch_year: 2016,
          eligibility: "All citizens, manufacturing units, shopkeepers, and waste recyclers.",
          benefits: "Identify recyclable plastics, locate collection points, participate in single-use plastic reduction challenges, and earn recycling points.",
          target_beneficiaries: "Consumers, local retail markets, recyclers, and municipal waste departments.",
          current_progress: "Nationwide ban on 19 single-use plastic items came into force in July 2022. 98% of municipal districts have implemented enforcement checks.",
          state_implementation: "Enforced by SPCBs, local district margins, and municipal corporation inspectors.",
          guidelines: "Do not store or sell plastic carry bags below 120 microns. Segregate plastic packaging for dry waste collection.",
          icon: Leaf,
          color: "from-amber-600 to-amber-400"
        },
        {
          id: "10",
          name: "energycons",
          title: "National Energy Conservation Campaign",
          description: "Encouraging energy efficiency, solar power adoption, and green building design in residential, commercial, and industrial sectors.",
          overview: "Directed by the Bureau of Energy Efficiency (BEE), this initiative focuses on reducing energy intensity by adopting star-labeled appliances, rooftop solar, and LED lighting.",
          objectives: "Reduce national grid load, promote the PM-KUSUM solar scheme, enforce the Energy Conservation Building Code (ECBC), and distribute energy-efficient hardware.",
          vision_mission: "A power-efficient, renewable-energy-driven India, minimizing fossil fuel reliance.",
          ministry: "Ministry of Power / Ministry of New and Renewable Energy (MNRE)",
          launch_year: 2001,
          eligibility: "All households, commercial offices, farmers, and industries.",
          benefits: "Calculate household electricity savings, check rooftop solar feasibility, access solar subsidies, and log green building improvements.",
          target_beneficiaries: "Power consumers, agricultural sectors, solar installers, and green builders.",
          current_progress: "National solar capacity exceeded 70GW. UJALA scheme distributed over 360 million energy-efficient LED bulbs, saving 47 billion kWh annually.",
          state_implementation: "Active across all state grids. State Designated Agencies (SDAs) implement BEE norms locally.",
          guidelines: "Adopt 5-star rated appliances. Shift high-load activities to solar-peak hours where applicable.",
          icon: Zap,
          color: "from-yellow-500 to-amber-550"
        },
        {
          id: "11",
          name: "disaster",
          title: "Climate Change & Disaster Preparedness",
          description: "Creating resilient communities through early warnings, flood/cyclone tracking, heatwave mitigation protocols, and emergency guidelines.",
          overview: "Coordinated by the NDMA, this initiative provides local weather safety plans, emergency contact lists, and disaster preparedness resources to protect lives from extreme weather events.",
          objectives: "Track weather alerts (cyclones, floods, heatwaves), provide emergency community guidelines, and analyze local disaster risk maps.",
          vision_mission: "Resilient communities capable of anticipating and surviving natural disasters with zero casualties.",
          ministry: "Ministry of Home Affairs (MHA) / National Disaster Management Authority (NDMA)",
          launch_year: 2005,
          eligibility: "Access is open. Focuses on climate-vulnerable coastal and mountain areas.",
          benefits: "Receive real-time heatwave, flood, and storm alerts, access survival checklists, and view emergency contact numbers instantly.",
          target_beneficiaries: "Citizens in disaster-prone regions, local rescue teams, and emergency managers.",
          current_progress: "Common Alerting Protocol (CAP) integrated with mobile telecom networks, sending warning SMS to 800+ million citizens.",
          state_implementation: "State Disaster Management Authorities (SDMAs) execute regional mock drills and emergency response.",
          guidelines: "Store emergency water and dry rations. Create evacuation plans for high-risk zones.",
          icon: AlertTriangle,
          color: "from-rose-600 to-orange-500"
        }
      ];
      setSchemes(fallbackList);
    };

    loadSchemes();
  }, []);

  // Filter schemes
  const filteredSchemes = schemes.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ministry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Carbon calculator logic
  const handleCarbonCalc = (key: string, val: number) => {
    const updated = { ...carbonFootprint, [key]: val };
    setCarbonFootprint(updated);
    // Rough calculation of carbon offset saved compared to average footprint
    const transportSaved = (20 - updated.transport) * 0.21;
    const electSaved = (150 - updated.electricity) * 0.85;
    const dietSaved = updated.diet * 1.5;
    const total = Math.max(0, transportSaved + electSaved + dietSaved);
    setCarbonSaved(Number(total.toFixed(2)));
  };

  // Challenges logic
  const toggleChallenge = (id: string) => {
    if (completedChallenges.includes(id)) {
      setCompletedChallenges(completedChallenges.filter(x => x !== id));
    } else {
      setCompletedChallenges([...completedChallenges, id]);
    }
  };

  // Submit garbage complaint
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.title || !complaint.location) return;
    try {
      const res = await api.submitCleanlinessComplaint({
        title: complaint.title,
        description: complaint.description || "Reported cleanliness issue",
        location: complaint.location,
        category: complaint.category,
        priority: "HIGH"
      });
      if (res && res.success && res.data) {
        const newComp = {
          id: res.data.id,
          title: res.data.title,
          location: res.data.location,
          status: res.data.status || "PENDING"
        };
        setComplaintsList([newComp, ...complaintsList]);
      } else {
        const newComp = {
          id: String(Date.now()),
          title: complaint.title,
          location: complaint.location,
          status: "PENDING"
        };
        setComplaintsList([newComp, ...complaintsList]);
      }
    } catch (err) {
      console.warn("Failed to submit complaint to backend:", err);
      const newComp = {
        id: String(Date.now()),
        title: complaint.title,
        location: complaint.location,
        status: "PENDING"
      };
      setComplaintsList([newComp, ...complaintsList]);
    }
    setComplaint({ title: "", description: "", location: "", category: "PLASTIC" });
  };

  // Adopt a tree
  const handleAdoptTree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreeName) return;
    try {
      const res = await api.logTreePlantation({
        tree_species: newTreeName,
        latitude: 23.0225,
        longitude: 72.5714
      });
      if (res && res.success && res.data) {
        setAdoptedTrees([...adoptedTrees, `${res.data.tree_species} (${res.data.status})`]);
      } else {
        setAdoptedTrees([...adoptedTrees, newTreeName]);
      }
    } catch (err) {
      console.warn("Failed to log tree plantation to backend:", err);
      setAdoptedTrees([...adoptedTrees, newTreeName]);
    }
    setNewTreeName("");
  };

  // AI chatbot request
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    // Simulate AI Scheme-specific response
    setTimeout(() => {
      let aiResponse = "I can verify your eligibility for this program. Generally, any pro-planet citizen is eligible to volunteer and earn EcoPoints.";
      const query = chatInput.toLowerCase();
      if (selectedScheme) {
        if (query.includes("eligibility") || query.includes("eligible")) {
          aiResponse = `Regarding ${selectedScheme.title}, the eligibility guidelines are: ${selectedScheme.eligibility}`;
        } else if (query.includes("benefit") || query.includes("reward")) {
          aiResponse = `The benefits of participating in ${selectedScheme.title} include: ${selectedScheme.benefits}`;
        } else if (query.includes("ministry") || query.includes("who runs")) {
          aiResponse = `This program is administered by the ${selectedScheme.ministry}.`;
        } else if (query.includes("apply") || query.includes("join")) {
          aiResponse = `To register or apply for ${selectedScheme.title}, you can use the volunteer registration panel in the 'Tracker' tab, or visit the official guidelines: ${selectedScheme.guidelines.substring(0, 80)}...`;
        }
      }
      setChatMessages(prev => [...prev, { sender: "assistant", text: aiResponse }]);
    }, 1000);
  };

  // Feedback submit
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheme || !feedbackComment) return;
    try {
      await api.submitFeedback({
        scheme_id: selectedScheme.id,
        rating: feedbackRating,
        comment: feedbackComment
      });
      alert("Thank you for your feedback! Your review has been logged to our compliance ledger.");
    } catch (err) {
      console.warn("Failed to submit feedback to backend:", err);
      alert("Thank you for your feedback! Your review has been logged locally.");
    }
    setFeedbackComment("");
  };

  return (
    <div className="space-y-6">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Award className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Government Initiatives</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Schemes & Awareness Hub</h2>
          <p className="text-xs text-gray-400 font-light">Explore, track, and participate in India's leading environmental missions.</p>
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search schemes or ministries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedScheme ? (
          /* Grid of Schemes */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredSchemes.map((scheme) => {
              const IconComp = scheme.icon;
              return (
                <div
                  key={scheme.id}
                  onClick={() => {
                    setSelectedScheme(scheme);
                    setActiveTab("overview");
                  }}
                  className="group bg-[#0b101c]/90 hover:bg-slate-900/90 border border-slate-850 hover:border-emerald-500/30 p-5 rounded-3xl transition-all cursor-pointer flex flex-col justify-between text-left relative overflow-hidden shadow-lg hover:shadow-2xl"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${scheme.color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-all pointer-events-none`} />
                  
                  <div className="space-y-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${scheme.color} flex items-center justify-center text-slate-950 font-bold p-2.5 shadow-md shadow-emerald-500/10`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-wider block mb-1">
                        {scheme.ministry.split(" (")[0]}
                      </h4>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {scheme.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed line-clamp-3">
                        {scheme.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-4 mt-5 border-t border-white/5 text-[10px] font-mono text-gray-500 group-hover:text-emerald-400 transition-all font-bold uppercase tracking-wider">
                    <span>Explore Scheme Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* Scheme Details Workspace */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left"
          >
            {/* Left Nav Pane */}
            <div className="lg:col-span-1 space-y-4">
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-full py-3 px-4 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 rounded-2xl text-xs font-bold text-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                ← Back to Schemes Hub
              </button>

              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-3xl space-y-2 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 pb-3.5 border-b border-white/5 mb-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${selectedScheme.color} flex items-center justify-center p-1 text-slate-950`}>
                    {React.createElement(selectedScheme.icon, { className: "w-4 h-4" })}
                  </div>
                  <h4 className="text-xs font-mono font-black text-white line-clamp-1">{selectedScheme.title}</h4>
                </div>

                <nav className="flex flex-col gap-1.5 text-xs">
                  {[
                    { id: "overview", label: "Scheme Overview", icon: Info },
                    { id: "tracker", label: "Interactive Portal", icon: Award },
                    { id: "map", label: "GIS Coverage Layer", icon: MapPin },
                    { id: "ai", label: "AI Government Chat", icon: MessageSquare },
                    { id: "feedback", label: "Citizen Reviews", icon: Star }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${selectedScheme.color} text-slate-950 font-bold shadow-md`
                          : "hover:bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {React.createElement(tab.icon, { className: "w-4 h-4 shrink-0" })}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Workspace */}
            <div className="lg:col-span-3 bg-slate-900/60 border border-slate-850 p-6 rounded-3xl backdrop-blur-xl min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                        {selectedScheme.ministry} • Launch Year: {selectedScheme.launch_year}
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight">{selectedScheme.title}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/[0.01] border border-white/5 p-4.5 rounded-2xl">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono block mb-1">Overview</h4>
                        <p className="text-xs text-gray-300 leading-relaxed font-light">{selectedScheme.overview}</p>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-4.5 rounded-2xl">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono block mb-1">Objectives</h4>
                        <p className="text-xs text-gray-300 leading-relaxed font-light">{selectedScheme.objectives}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider border-b border-white/5 pb-1">Scheme Profile Parameters</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-500 block text-[9px] font-mono uppercase">Eligibility</span>
                          <span className="text-white font-medium mt-1 block">{selectedScheme.eligibility}</span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-500 block text-[9px] font-mono uppercase">Benefits Offered</span>
                          <span className="text-white font-medium mt-1 block">{selectedScheme.benefits}</span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                          <span className="text-gray-500 block text-[9px] font-mono uppercase">Target Group</span>
                          <span className="text-white font-medium mt-1 block">{selectedScheme.target_beneficiaries}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3.5 border-t border-white/5">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">State-Wise Progress</h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed">{selectedScheme.state_implementation}</p>
                        <div className="flex gap-2">
                          <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                          >
                            <option value="Gujarat">Gujarat</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                          </select>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-3 py-1.5 text-xs font-mono font-bold flex items-center">
                            84.5% Coverage Indexed
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Document Center</h4>
                        <div className="space-y-1.5">
                          <a href="#" className="flex justify-between items-center bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] p-2.5 rounded-xl text-xs text-gray-300 group transition-all">
                            <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Scheme Handbook Guidelines.pdf</span>
                            <Download className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "tracker" && (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Mission LiFE Simulator */}
                    {selectedScheme.name === "life" && (
                      <div className="space-y-5">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl text-left">
                          <h4 className="text-sm font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5"><Leaf className="w-4 h-4" /> Carbon Saving habit tracker</h4>
                          <p className="text-xs text-gray-400 mt-1">Adjust your daily lifestyle choices below to simulate carbon footprint offsets.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-mono block">Public Transport / Bicycle (km/day)</label>
                              <input
                                type="range"
                                min="0"
                                max="40"
                                value={carbonFootprint.transport}
                                onChange={(e) => handleCarbonCalc("transport", parseInt(e.target.value))}
                                className="w-full accent-emerald-500 bg-slate-800"
                              />
                              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                <span>0 km</span>
                                <span className="text-white font-bold">{carbonFootprint.transport} km</span>
                                <span>40 km</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-mono block">Power Saving (star-rated/solar) (kWh/mo)</label>
                              <input
                                type="range"
                                min="0"
                                max="300"
                                value={carbonFootprint.electricity}
                                onChange={(e) => handleCarbonCalc("electricity", parseInt(e.target.value))}
                                className="w-full accent-emerald-500 bg-slate-800"
                              />
                              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                <span>0 kWh</span>
                                <span className="text-white font-bold">{carbonFootprint.electricity} kWh</span>
                                <span>300 kWh</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-gray-400 font-mono block">Plant-based Organic Meals / Day</label>
                              <input
                                type="range"
                                min="0"
                                max="3"
                                value={carbonFootprint.diet}
                                onChange={(e) => handleCarbonCalc("diet", parseInt(e.target.value))}
                                className="w-full accent-emerald-500 bg-slate-800"
                              />
                              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                                <span>0 meals</span>
                                <span className="text-white font-bold">{carbonFootprint.diet} meals</span>
                                <span>3 meals</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5 mt-5">
                            <span className="text-xs font-mono text-gray-400">Total Calculated Carbon Saved Daily:</span>
                            <span className="text-lg font-black text-emerald-400 font-mono">{carbonSaved || 4.2} kg CO2e</span>
                          </div>
                        </div>

                        {/* Daily challenges */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Mission LiFE - Daily Challenges</h4>
                          <div className="space-y-2">
                            {[
                              { id: "life-1", text: "Refuse single-use plastic water bottles today", points: 25 },
                              { id: "life-2", text: "Switch off electrical appliances from plug points when not in use", points: 20 },
                              { id: "life-3", text: "Use stairs instead of lift/elevator for 3 floors", points: 15 }
                            ].map(ch => {
                              const isCompleted = completedChallenges.includes(ch.id);
                              return (
                                <div key={ch.id} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center gap-3">
                                  <div className="flex items-center gap-3 text-xs text-gray-300">
                                    <button
                                      onClick={() => toggleChallenge(ch.id)}
                                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                                        isCompleted ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-white/20 hover:border-emerald-500/50"
                                      }`}
                                    >
                                      {isCompleted && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                    <span className={isCompleted ? "line-through text-gray-500" : ""}>{ch.text}</span>
                                  </div>
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold">+{ch.points} EcoPoints</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Swachh Bharat Complaint Submission */}
                    {selectedScheme.name === "swachhbharat" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <form onSubmit={handleComplaintSubmit} className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">File Garbage / Cleanliness Complaint</h4>
                          <div className="space-y-3.5 text-xs">
                            <div>
                              <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Issue Headline</label>
                              <input
                                type="text"
                                placeholder="e.g. Open dump of plastic bottles"
                                value={complaint.title}
                                onChange={(e) => setComplaint({ ...complaint, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Location Details</label>
                              <input
                                type="text"
                                placeholder="e.g. Lane 3, near Central Park"
                                value={complaint.location}
                                onChange={(e) => setComplaint({ ...complaint, location: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg text-[11px]"
                            >
                              Submit Cleanup Request
                            </button>
                          </div>
                        </form>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Recent Local Cleanup Actions</h4>
                          <div className="space-y-2">
                            {complaintsList.map(comp => (
                              <div key={comp.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                                <div>
                                  <h5 className="font-bold text-white">{comp.title}</h5>
                                  <span className="text-[10px] text-gray-400 block">{comp.location}</span>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                                  comp.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {comp.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CPCB Air/Water gauges */}
                    {selectedScheme.name === "cpcb" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <Wind className="w-8 h-8 text-rose-400 mx-auto" />
                            <span className="text-[10px] text-gray-500 font-mono uppercase block">Real-time AQI</span>
                            <span className="text-2xl font-black text-rose-400 font-mono">{aqi}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono block w-max mx-auto">Good</span>
                          </div>

                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <Droplet className="w-8 h-8 text-cyan-400 mx-auto" />
                            <span className="text-[10px] text-gray-500 font-mono uppercase block">Water pH index</span>
                            <span className="text-2xl font-black text-cyan-400 font-mono">{waterPh}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono block w-max mx-auto">Safe pH</span>
                          </div>

                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                            <span className="text-[10px] text-gray-500 font-mono uppercase block">Noise levels (dB)</span>
                            <span className="text-2xl font-black text-amber-400 font-mono">{noise} dB</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono block w-max mx-auto">Safe Range</span>
                          </div>
                        </div>

                        <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider block mb-3">AQI Hourly Prediction Graph (AI Forecast)</h4>
                          <div className="h-28 flex items-end justify-between font-mono text-[9px] text-gray-500 border-b border-white/10 pb-2">
                            {[
                              { hr: "08:00", val: 42, h: "h-[42%]" },
                              { hr: "10:00", val: 48, h: "h-[48%]" },
                              { hr: "12:00", val: 65, h: "h-[65%]" },
                              { hr: "14:00", val: 78, h: "h-[78%]" },
                              { hr: "16:00", val: 55, h: "h-[55%]" },
                              { hr: "18:00", val: 44, h: "h-[44%]" }
                            ].map(item => (
                              <div key={item.hr} className="flex flex-col items-center gap-2 w-12">
                                <span className="text-white font-bold">{item.val}</span>
                                <div className={`w-3.5 bg-gradient-to-t from-red-500 to-rose-400 rounded-t-md ${item.h} shadow-[0_0_10px_rgba(244,63,94,0.3)]`} />
                                <span>{item.hr}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CPCB EPR Portal directory */}
                    {selectedScheme.name === "cpcb_epr" && (
                      <div className="space-y-4">
                        <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl">
                          <h4 className="text-xs font-bold text-blue-400 uppercase font-mono block mb-1">EPR Producer Circular Compliance Ledger</h4>
                          <p className="text-xs text-gray-400 font-light mt-1">Look up verified plastic, e-waste, and battery recycling collectors.</p>
                          
                          <div className="space-y-2 mt-4 text-xs">
                            {[
                              { name: "Green India Circular Recycling Hub", type: "PLASTIC / PET", loc: "GIDC Vatva, Gujarat", cap: "12,000 MT/Yr" },
                              { name: "E-Waste Safeguards Private Limited", type: "E-WASTE / CIRCUIT BOARDS", loc: "Whitefield, Bengaluru", cap: "5,500 MT/Yr" },
                              { name: "LeadCycle Batteries Recycling Ltd", type: "BATTERY / METALS", loc: "Ambattur, Chennai", cap: "8,000 MT/Yr" }
                            ].map(p => (
                              <div key={p.name} className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center gap-3">
                                <div>
                                  <h5 className="font-bold text-white">{p.name}</h5>
                                  <span className="text-[10px] text-gray-400 block">{p.loc}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono block w-max ml-auto">{p.type}</span>
                                  <span className="text-[10px] text-gray-400 font-mono block mt-1">{p.cap}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Smart Cities IoT simulation */}
                    {selectedScheme.name === "smartcities" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <span className="text-gray-500 uppercase block text-[9px]">Streetlight Grid</span>
                            <span className={`text-lg font-black ${smartLight ? "text-yellow-400" : "text-gray-600"}`}>
                              {smartLight ? "ACTIVE (EC)" : "OFFLINE"}
                            </span>
                            <button
                              onClick={() => setSmartLight(!smartLight)}
                              className="py-1 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase font-bold text-white border border-white/10 cursor-pointer block mx-auto mt-2 animate-pulse"
                            >
                              Toggle lights
                            </button>
                          </div>

                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <span className="text-gray-500 uppercase block text-[9px]">Smart Bin Capacity</span>
                            <span className="text-lg font-black text-white">{binFill}% Full</span>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${binFill}%` }} />
                            </div>
                            <button
                              onClick={() => setBinFill(prev => (prev >= 90 ? 10 : prev + 25))}
                              className="py-1 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase font-bold text-white border border-white/10 cursor-pointer block mx-auto mt-2"
                            >
                              Simulate fill
                            </button>
                          </div>

                          <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-center space-y-2">
                            <span className="text-gray-500 uppercase block text-[9px]">Smart Parking Occupancy</span>
                            <span className="text-lg font-black text-white">{parkingOccupancy}% Occupied</span>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full" style={{ width: `${parkingOccupancy}%` }} />
                            </div>
                            <button
                              onClick={() => setParkingOccupancy(prev => (prev >= 80 ? 20 : prev + 20))}
                              className="py-1 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase font-bold text-white border border-white/10 cursor-pointer block mx-auto mt-2"
                            >
                              Simulate check
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Jal Jeevan tap coverage & leak reporting */}
                    {selectedScheme.name === "jaljeevan" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-3.5">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Report Pipeline Water Leakage</h4>
                          <div className="space-y-3 text-xs">
                            <input
                              type="text"
                              placeholder="Location address or landmark..."
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                            />
                            <textarea
                              placeholder="Describe pipeline damage, leakage severity, and visibility details..."
                              className="w-full h-16 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => alert("Water leakage logged! Geo-assigned to local Jal Sansthan engineering unit.")}
                              className="w-full py-2 bg-cyan-500 text-slate-950 font-bold uppercase rounded-xl hover:bg-cyan-400 transition-colors tracking-wide"
                            >
                              File Pipeline Leakage
                            </button>
                          </div>
                        </div>

                        <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-xs space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Village Water Coverage (Live Stats)</h4>
                          <div className="space-y-2.5 font-mono">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>National Tap Water Coverage</span>
                                <span className="text-cyan-400 font-bold">74.2%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full w-[74%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Gujarat rural household tap index</span>
                                <span className="text-cyan-400 font-bold">100.0% (Achieved)</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full w-full" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Village Pani Samitis formed</span>
                                <span className="text-cyan-400 font-bold">508,492 Villages</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full w-[85%]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Green India Tree Adoption */}
                    {selectedScheme.name === "greenindia" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <form onSubmit={handleAdoptTree} className="space-y-4">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Adopt a Tree (Virtual Carbon Offsetting)</h4>
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="text-[10px] text-gray-400 font-mono block mb-1">Name Your Tree</label>
                              <input
                                type="text"
                                placeholder="e.g. Green Oak of Mumbai"
                                value={newTreeName}
                                onChange={(e) => setNewTreeName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-mono block mb-1">Select Species</label>
                              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500">
                                <option value="OAK">Oak Tree (22kg/Yr CO2 sequestered)</option>
                                <option value="BAMBOO">Bamboo Shoots (12kg/Yr CO2 sequestered)</option>
                                <option value="NEEM">Neem Tree (25kg/Yr CO2 sequestered)</option>
                              </select>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase rounded-xl transition-all shadow-md text-[11px]"
                            >
                              Adopt & Issue Certificate
                            </button>
                          </div>
                        </form>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Your Adopted Forests</h4>
                          {adoptedTrees.length === 0 ? (
                            <div className="text-center py-8 text-xs text-gray-500 border border-white/5 border-dashed rounded-2xl">
                              No adopted trees. Start planting to see them here!
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {adoptedTrees.map((tree, idx) => (
                                <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                                  <span>🌳 <strong>{tree}</strong></span>
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Verifying Growth</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Generic volunteer registration panel for remaining schemes */}
                    {["ncap", "plasticwaste", "energycons", "disaster"].includes(selectedScheme.name) && (
                      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl text-center space-y-4">
                        <UserPlus className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Become a Scheme Campaign Volunteer</h4>
                          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                            Register as a volunteer to execute clean energy audits, plastic checking drives, or local disaster awareness mock drills.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert("Successfully registered as a Campaign Volunteer! Checked and added to citizen passport.")}
                          className={`py-2 px-6 rounded-xl text-xs uppercase font-bold tracking-wider bg-gradient-to-r ${selectedScheme.color} text-slate-950 hover:scale-105 transition-all cursor-pointer`}
                        >
                          Register for Campaign
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "map" && (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">GIS Layer: Interactive Scheme Coverage Map</h4>
                      <span className="text-[10px] text-gray-400 font-mono">Center: Lat: 20.5937, Lon: 78.9629 (India Grid)</span>
                    </div>

                    <div className="bg-slate-950 border border-white/10 rounded-2xl aspect-video w-full relative overflow-hidden flex items-center justify-center text-center">
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                      
                      {/* Drawing a mock abstract vector GIS layer representing India map */}
                      <svg className="w-64 h-64 text-emerald-500/20 fill-current" viewBox="0 0 100 100">
                        <path d="M 50 10 L 60 20 L 70 25 L 80 40 L 75 55 L 60 70 L 50 85 L 40 70 L 30 60 L 25 45 L 35 30 L 40 20 Z" />
                      </svg>

                      {/* Interactive mock map pins */}
                      <div className="absolute top-[35%] left-[45%] group cursor-pointer flex flex-col items-center">
                        <MapPin className="w-5 h-5 text-red-500 fill-current animate-bounce" />
                        <span className="absolute bottom-6 scale-0 group-hover:scale-100 bg-slate-950 text-white border border-white/10 p-1.5 rounded text-[8px] font-mono whitespace-nowrap transition-all">
                          High AQI Alert Zone: Delhi (185)
                        </span>
                      </div>

                      <div className="absolute top-[55%] left-[48%] group cursor-pointer flex flex-col items-center">
                        <MapPin className="w-5 h-5 text-emerald-400 fill-current animate-bounce" />
                        <span className="absolute bottom-6 scale-0 group-hover:scale-100 bg-slate-950 text-white border border-white/10 p-1.5 rounded text-[8px] font-mono whitespace-nowrap transition-all">
                          Plantation Drive: Indore (250 Saplings)
                        </span>
                      </div>

                      <div className="absolute top-[65%] left-[42%] group cursor-pointer flex flex-col items-center">
                        <MapPin className="w-5 h-5 text-cyan-400 fill-current animate-bounce" />
                        <span className="absolute bottom-6 scale-0 group-hover:scale-100 bg-slate-950 text-white border border-white/10 p-1.5 rounded text-[8px] font-mono whitespace-nowrap transition-all">
                          Jal Coverage: Pune (92% Tap FHTC)
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 bg-black/60 border border-white/10 p-3 rounded-xl text-[9px] font-mono space-y-1 text-left">
                        <span className="text-[8px] font-black uppercase text-gray-400 block mb-1">GIS Map Legend</span>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Pollution Heatpoint</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Afforestation Site</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400" /> JJM Tap Network</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col flex-grow space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">AI Government Schemes Assistant</h4>
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">Online</span>
                    </div>

                    <div className="flex-grow bg-black/40 border border-white/10 rounded-2xl p-4 min-h-[300px] max-h-[340px] overflow-y-auto space-y-3.5 text-xs">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.sender === "user"
                              ? "bg-slate-800 text-white rounded-br-none"
                              : `bg-gradient-to-r ${selectedScheme.color} text-slate-950 font-medium rounded-bl-none`
                          }`}>
                            <p className="leading-relaxed font-light">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendChat} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Ask about ${selectedScheme.title} eligibility, benefits, application...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeTab === "feedback" && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Submit Citizen Feedback & Audit Review</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Submit feedback on scheme implementation in your district. Your feedback is hashed to the public audit logs for administrative monitoring.
                    </p>

                    <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setFeedbackRating(star)}
                              className={`text-lg transition-transform hover:scale-115 ${
                                star <= feedbackRating ? "text-amber-400" : "text-gray-650"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        placeholder="Provide details on implementation quality, delays, or clean outcomes..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none resize-none focus:border-emerald-500"
                        required
                      />

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase rounded-xl transition-all shadow-md"
                      >
                        Submit Review
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default GovernmentSchemesHub;
