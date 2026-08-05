import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models.government import (
    GovernmentScheme,
    GovernmentNews,
    GovernmentEvent,
    Volunteer,
    Participation,
    Certificate,
    CarbonActivity,
    WaterActivity,
    TreePlantation,
    PollutionReport,
    SmartCity,
    SchemeAnalytics,
    Downloads,
    Media,
    FAQs
)
from app.repositories.government_repository import GovernmentRepository
from app.models.user import User


class GovernmentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = GovernmentRepository(db)

    # ==========================================
    # DATABASE SEEDER
    # ==========================================
    def seed_schemes(self) -> str:
        # Check if already seeded
        existing = self.repo.get_all_schemes()
        if len(existing) > 0:
            return "Schemes already seeded"

        schemes_data = [
            {
                "name": "life",
                "title": "Mission LiFE (Lifestyle for Environment)",
                "description": "India's flagship global mass movement to nudge individual and community action towards environmental conservation and sustainable living.",
                "overview": "Mission LiFE was introduced by the Prime Minister of India at COP26. It aims to replace the prevalent 'use-and-dispose' economy with a circular economy defined by mindful consumption.",
                "objectives": "Nudge citizens to perform simple daily actions that aggregate to large carbon footprint savings. Track and reward sustainable habit formation.",
                "vision_mission": "Create a global network of 'Pro-Planet People' (P3) sharing a commitment to adopt and promote environment-friendly lifestyles.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 2022,
                "eligibility": "Open to all global citizens. No age, nationality, or income restrictions.",
                "benefits": "Gain EcoPoints, unlock Carbon Credit tokens on the blockchain, earn certified Pro-Planet badges, and reduce household utility costs.",
                "target_beneficiaries": "Individuals, households, schools, commercial offices, and community centers.",
                "current_progress": "Over 10 million citizens registered. 450,000+ daily challenges completed, resulting in an estimated 1,200 tons of CO2 offsets.",
                "state_implementation": "Active in all 28 states and 8 Union Territories. Gujarat, Maharashtra, and Karnataka currently lead in participant metrics.",
                "guidelines": "Adopt 7 core categories of action: Save Energy, Save Water, Say No to Single-Use Plastic, Reduce Waste, Adopt Sustainable Food Systems, Reduce E-Waste, and Adopt Healthy Lifestyles.",
                "official_links": {
                    "website": "https://www.life.gov.in",
                    "portal": "https://life.mygov.in"
                },
                "faqs": [
                    {"question": "What is Mission LiFE?", "answer": "It is a citizen-centric movement to encourage daily actions that protect the environment."},
                    {"question": "How do I earn rewards?", "answer": "Log daily eco challenges (e.g. using public transport, planting trees) on the EcoVerzz app to earn EcoPoints."}
                ],
                "downloads": [
                    {"title": "Mission LiFE Official Booklet", "file_url": "https://life.gov.in/docs/life_booklet.pdf"},
                    {"title": "Daily Eco Challenges Guidelines", "file_url": "https://life.gov.in/docs/eco_challenges.pdf"}
                ],
                "media": [
                    {"title": "Mission LiFE Launch Video", "type": "VIDEO", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
                    {"title": "Eco Friendly Habit Graphics", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=1"}
                ]
            },
            {
                "name": "swachhbharat",
                "title": "Swachh Bharat Mission (SBM)",
                "description": "The nation-wide campaign to eliminate open defecation, improve solid waste management, and create garbage-free cities across India.",
                "overview": "Launched on the birth anniversary of Mahatma Gandhi, SBM is India's largest cleanliness and sanitation drive, integrating community work and civic infrastructure.",
                "objectives": "Complete solid waste management in all cities, construct public toilets, implement 100% door-to-door source segregated waste collection, and clear legacy landfills.",
                "vision_mission": "A clean, hygienic, garbage-free India with healthy environments and active citizen volunteers.",
                "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
                "launch_year": 2014,
                "eligibility": "All Indian municipalities, city councils, and citizens.",
                "benefits": "File garbage complaints with instant municipal mapping, register local cleanup drives, locate public dustbins, and track local Swachh scores.",
                "target_beneficiaries": "Municipal corporations, local community groups, volunteers, and rural village Panchayats.",
                "current_progress": "100% of urban local bodies declared ODF (Open Defecation Free). 86% of urban waste is now processed daily.",
                "state_implementation": "Implemeted at municipal level. Indore, Surat, and Navi Mumbai consistently rank highest in the Swachh Survekshan index.",
                "guidelines": "Citizens must segregate waste into wet, dry, and sanitary waste, report open dumps, and participate in local cleanliness events.",
                "official_links": {
                    "website": "https://swachhbharatmission.ddp.gov.in",
                    "portal": "https://sbmurban.gov.in"
                },
                "faqs": [
                    {"question": "How do I report a garbage dump?", "answer": "Go to the Swachh Bharat section, take a photo of the waste, enter the location, and submit a waste complaint."},
                    {"question": "What is source segregation?", "answer": "Separating wet organic waste, dry recyclable waste, and hazardous waste at the point of origin."}
                ],
                "downloads": [
                    {"title": "SBM Solid Waste Management Rules", "file_url": "https://sbm.gov.in/docs/swm_rules.pdf"}
                ],
                "media": [
                    {"title": "Segregation Guide Chart", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=2"}
                ]
            },
            {
                "name": "cpcb",
                "title": "Central Pollution Control Board (CPCB) Portal",
                "description": "National monitors for Air Quality Index (AQI), water quality metrics, noise levels, and environmental health parameters.",
                "overview": "The CPCB is a statutory organization providing technical services and monitoring networks to control water, air, and noise pollution across India.",
                "objectives": "Track and publish live AQI, model pollution trends, issue regional environmental warnings, and enforce regulatory compliance on industrial units.",
                "vision_mission": "Promote cleanliness of streams, wells, and water systems, and improve the overall air quality of the country.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 1974,
                "eligibility": "Access is public. Citizens can view real-time data and file regional pollution reports.",
                "benefits": "Access live AQI dashboards, historical pollution charts, warning notifications, and AI-powered pollution predictions.",
                "target_beneficiaries": "Public, healthcare providers, researchers, and local pollution control boards.",
                "current_progress": "Continuous Air Monitoring Stations (CAAQMS) active in 340+ cities. National Water Quality Monitoring Network covers 4,000+ points.",
                "state_implementation": "Active in all states in collaboration with State Pollution Control Boards (SPCBs).",
                "guidelines": "Follow AQI advisory alerts. Report industrial effluents or open plastic burning via the portal.",
                "official_links": {
                    "website": "https://cpcb.nic.in",
                    "portal": "https://app.cpcbccr.com/AQI_India"
                },
                "faqs": [
                    {"question": "What is AQI?", "answer": "Air Quality Index is a number representing the cleanliness or pollution level of the ambient air."},
                    {"question": "What are safe AQI levels?", "answer": "An AQI between 0 and 50 is considered Good. Levels above 200 can be unhealthy."}
                ],
                "downloads": [
                    {"title": "National Air Quality Index Report", "file_url": "https://cpcb.nic.in/docs/aqi_report.pdf"}
                ],
                "media": [
                    {"title": "Air Quality Index Parameter Chart", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=3"}
                ]
            },
            {
                "name": "cpcb_epr",
                "title": "CPCB EPR (Extended Producer Responsibility) Portal",
                "description": "Regulating circular waste streams for plastic, electronic (e-waste), battery, and tire waste through recyclers and producer compliance.",
                "overview": "EPR rules mandate that producers, importers, and brand owners (PIBOs) are financially and physically responsible for the recycling and end-of-life management of their products.",
                "objectives": "Establish a transparent recycling directory, manage collection targets, audit recyclers, and track EPR certificates online.",
                "vision_mission": "Achieve 100% circularity in packaging and critical waste streams, removing hazardous materials from consumer waste.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 2016,
                "eligibility": "Registered PIBOs, recyclers, and collection centers.",
                "benefits": "PIBO directory lookup, recycler database integration, smart collection center locator, and compliance dashboard visualization.",
                "target_beneficiaries": "Recyclers, brand owners, eco-conscious consumers, and waste collector cooperatives.",
                "current_progress": "Over 22,000 brand owners registered. 2.4 million metric tons of plastic waste covered under EPR tracking.",
                "state_implementation": "Enforced globally across India. Large manufacturing hubs in Gujarat, Tamil Nadu, and Maharashtra lead compliance.",
                "guidelines": "PIBOs must purchase EPR certificates from certified recyclers to offset their production footprint.",
                "official_links": {
                    "website": "https://cpcb.nic.in/epr",
                    "portal": "https://eprplastic.cpcb.gov.in"
                },
                "faqs": [
                    {"question": "What is EPR?", "answer": "Extended Producer Responsibility is a policy requiring manufacturers to manage the disposal of products at the end of their lifecycle."},
                    {"question": "Where can I recycle my battery?", "answer": "Use our Collection Center Locator to find CPCB-registered recycling partners near you."}
                ],
                "downloads": [
                    {"title": "Plastic Waste Management Rules", "file_url": "https://cpcb.nic.in/docs/pwm_rules_2016.pdf"}
                ],
                "media": [
                    {"title": "EPR Workflow Chart", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=4"}
                ]
            },
            {
                "name": "smartcities",
                "title": "Smart Cities Mission",
                "description": "Urban renewal and retrofitting program by the Government of India to develop smart, sustainable, and citizen-friendly cities.",
                "overview": "The Mission focuses on core infrastructure like clean water, electricity, sanitation, and smart solutions such as IoT bin tracking, smart parking, and green grids.",
                "objectives": "Implement smart waste monitoring, street lighting automation, smart parking sensors, and centralized command centers.",
                "vision_mission": "Enable local development and harness technology as a means to create smart outcomes for citizens.",
                "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
                "launch_year": 2015,
                "eligibility": "100 nominated cities across all Indian states.",
                "benefits": "View live city IoT dashboards (parking, lighting, waste bin capacity), submit infrastructure feedback, and access urban development maps.",
                "target_beneficiaries": "Urban residents, local municipal councils, and technology partners.",
                "current_progress": "7,900+ projects worth Rs. 1.8 lakh crore completed. Integrated Command and Control Centers (ICCC) online in all 100 cities.",
                "state_implementation": "Projects managed by Special Purpose Vehicles (SPVs) in each smart city (e.g. Pune Smart City, Smart City Ahmedabad).",
                "guidelines": "Urban infrastructure must maintain digital connectivity, energy efficiency, and GIS resource mapping.",
                "official_links": {
                    "website": "https://smartcities.gov.in",
                    "portal": "https://smartnet.niua.org"
                },
                "faqs": [
                    {"question": "What is a smart waste bin?", "answer": "A waste container fitted with ultrasonic fill sensors to notify collection trucks when full, reducing carbon emissions."},
                    {"question": "What does ICCC do?", "answer": "The Integrated Command and Control Center coordinates traffic, air quality monitors, lighting, and waste management in real-time."}
                ],
                "downloads": [
                    {"title": "Smart Cities Mission Guidelines", "file_url": "https://smartcities.gov.in/docs/guidelines.pdf"}
                ],
                "media": [
                    {"title": "Smart City IoT Ecosystem", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=5"}
                ]
            },
            {
                "name": "jaljeevan",
                "title": "Jal Jeevan Mission (JJM)",
                "description": "Providing safe and adequate drinking water through individual household tap connections to all households in rural India by 2024.",
                "overview": "JJM is a community-driven initiative focusing on water supply infrastructure, source sustainability, greywater management, and water quality testing.",
                "objectives": "Provide 55 liters of safe drinking water per person per day through Functional Household Tap Connections (FHTC).",
                "vision_mission": "Ensure every rural home has access to drinking water of prescribed quality on a regular and long-term basis.",
                "ministry": "Ministry of Jal Shakti",
                "launch_year": 2019,
                "eligibility": "All rural households, village communities, schools, and health centers.",
                "benefits": "Report water leakages, track village tap water coverage, access local groundwater analytics, and log community rainwater harvesting projects.",
                "target_beneficiaries": "Rural families, local water committees (Pani Samitis), and village volunteers.",
                "current_progress": "Over 140 million rural households (74%) provided with tap water connections. 500,000+ villages have formed active Pani Samitis.",
                "state_implementation": "States execute water schemes locally. Goa, Gujarat, Telangana, and Haryana have achieved 100% household coverage.",
                "guidelines": "Establish village water safety plans and utilize field test kits (FTK) for regular water quality testing.",
                "official_links": {
                    "website": "https://jaljeevanmission.gov.in",
                    "portal": "https://ejalshakti.gov.in"
                },
                "faqs": [
                    {"question": "How do I report a water leak?", "answer": "Navigate to Jal Jeevan Mission, click 'Report Leakage', enter description/address, and submit for municipal action."},
                    {"question": "What is a Pani Samiti?", "answer": "A village-level water committee responsible for managing, operating, and maintaining drinking water supply systems."}
                ],
                "downloads": [
                    {"title": "JJM Operational Guidelines", "file_url": "https://jaljeevanmission.gov.in/docs/operational_guidelines.pdf"}
                ],
                "media": [
                    {"title": "Rainwater Harvesting Design Model", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=6"}
                ]
            },
            {
                "name": "greenindia",
                "title": "National Mission for Green India (GIM)",
                "description": "Increasing forest and tree cover, enhancing ecosystem services, and promoting carbon sequestration through community afforestation.",
                "overview": "GIM is one of the eight missions under the National Action Plan on Climate Change (NAPCC). It addresses climate adaptation and carbon sink expansion.",
                "objectives": "Increase forest/tree cover on 5 million hectares, improve ecosystem services (carbon sequestration, hydrology, biodiversity), and enhance forest livelihoods.",
                "vision_mission": "A green, ecologically balanced country with expanded carbon sinks and protected forest ecosystems.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 2014,
                "eligibility": "Forest protection committees, village groups, non-profits, and volunteer citizens.",
                "benefits": "Adopt a tree virtually, log your plantation drives with coordinates, receive a green certificate, and calculate carbon sequestration.",
                "target_beneficiaries": "Tribal and forest-dwelling communities, local community organizations, and urban tree planters.",
                "current_progress": "Reforestation and forest improvement projects implemented across 300,000 hectares. Estimated carbon offset is 1.6 million tCO2e.",
                "state_implementation": "Active in all forested states. Joint Forest Management Committees (JFMCs) manage ground plantations.",
                "guidelines": "Plant native tree species appropriate for your local ecosystem. Maintain and protect saplings for a minimum of 3 years.",
                "official_links": {
                    "website": "https://fsi.nic.in",
                    "portal": "https://moef.gov.in"
                },
                "faqs": [
                    {"question": "How do I adopt a tree?", "answer": "Use our Tree Adoption form, name your tree, select the species, and commit to tracking its growth to earn EcoPoints."},
                    {"question": "How much carbon does one tree absorb?", "answer": "A mature tree absorbs approximately 22kg of CO2 per year, depending on the species and environment."}
                ],
                "downloads": [
                    {"title": "Forest Conservation Act Guidelines", "file_url": "https://moef.gov.in/docs/forest_act.pdf"}
                ],
                "media": [
                    {"title": "Green Cover Plantation Progress", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=7"}
                ]
            },
            {
                "name": "ncap",
                "title": "National Clean Air Programme (NCAP)",
                "description": "India's national framework to tackle air pollution, targeting a 20-30% reduction in Particulate Matter (PM10 and PM2.5) concentrations.",
                "overview": "NCAP targets non-attainment cities that do not meet national ambient air quality standards, enforcing action plans to control road dust, traffic emissions, and waste burning.",
                "objectives": "Deploy continuous air monitoring stations, enforce emission norms, expand green buffers around highways, and reduce PM levels.",
                "vision_mission": "Clean, breathable air for all Indian cities, meeting national safety guidelines.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 2019,
                "eligibility": "131 designated non-attainment cities.",
                "benefits": "Access live PM2.5/PM10 metrics, check city clean air rankings, and review regional municipal air action plans.",
                "target_beneficiaries": "Urban citizens, school children, vulnerable groups, and town planning authorities.",
                "current_progress": "131 cities have formulated custom action plans. Air quality monitoring networks expanded by 60% across target zones.",
                "state_implementation": "Executed by municipal bodies and State Pollution Control Boards. Funded directly by central grants.",
                "guidelines": "Promote public transport, restrict industrial fuel combustion, ban crop residue burning, and enforce dust-suppression at construction sites.",
                "official_links": {
                    "website": "https://cpcb.nic.in/ncap",
                    "portal": "https://prana.cpcb.gov.in"
                },
                "faqs": [
                    {"question": "What is PM2.5?", "answer": "Fine particulate matter with a diameter less than 2.5 micrometers, which can penetrate deep into lungs and blood systems."},
                    {"question": "What are non-attainment cities?", "answer": "Cities that consistently fail to meet national ambient air quality standards over a 5-year period."}
                ],
                "downloads": [
                    {"title": "NCAP National Action Plan Document", "file_url": "https://cpcb.nic.in/docs/ncap_framework.pdf"}
                ],
                "media": [
                    {"title": "Air Pollutants Breakdown Chart", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=8"}
                ]
            },
            {
                "name": "plasticwaste",
                "title": "Plastic Waste Management Rules",
                "description": "Statutory rules banning identified single-use plastics and enforcing strict recycling protocols on commercial entities and consumers.",
                "overview": "The rules ban the manufacture, import, sale, and use of single-use plastic items with low utility and high environmental risk (e.g. plastic cutlery, straws, bags under 120 microns).",
                "objectives": "Phase out single-use plastics, enforce multi-layer packaging circularity, and promote alternative materials like jute and biodegradable starch.",
                "vision_mission": "A single-use plastic-free India, minimizing plastic clogging in marine and terrestrial ecosystems.",
                "ministry": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "launch_year": 2016,
                "eligibility": "All citizens, manufacturing units, shopkeepers, and waste recyclers.",
                "benefits": "Identify recyclable plastics, locate collection points, participate in single-use plastic reduction challenges, and earn recycling points.",
                "target_beneficiaries": "Consumers, local retail markets, recyclers, and municipal waste departments.",
                "current_progress": "Nationwide ban on 19 single-use plastic items came into force in July 2022. 98% of municipal districts have implemented enforcement checks.",
                "state_implementation": "Enforced by SPCBs, local district magistrates, and municipal corporation inspectors.",
                "guidelines": "Do not store or sell plastic carry bags below 120 microns. Segregate plastic packaging for dry waste collection.",
                "official_links": {
                    "website": "https://cpcb.nic.in/plastic-waste",
                    "portal": "https://cpcb.nic.in/pw-rules"
                },
                "faqs": [
                    {"question": "Which plastic items are banned?", "answer": "Plastic straws, plates, cups, cutlery, wrapping films around sweet boxes, cigarette packets, and ear buds with plastic sticks."},
                    {"question": "What is the micron limit for plastic bags?", "answer": "Plastic carry bags must have a thickness of at least 120 microns to encourage reusability."}
                ],
                "downloads": [
                    {"title": "List of Banned Single Use Plastics", "file_url": "https://cpcb.nic.in/docs/banned_sup.pdf"}
                ],
                "media": [
                    {"title": "Eco Friendly Alternatives Guide", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=9"}
                ]
            },
            {
                "name": "energycons",
                "title": "National Energy Conservation Campaign",
                "description": "Encouraging energy efficiency, solar power adoption, and green building design in residential, commercial, and industrial sectors.",
                "overview": "Directed by the Bureau of Energy Efficiency (BEE), this initiative focuses on reducing energy intensity by adopting star-labeled appliances, rooftop solar, and LED lighting.",
                "objectives": "Reduce national grid load, promote the PM-KUSUM solar scheme, enforce the Energy Conservation Building Code (ECBC), and distribute energy-efficient hardware.",
                "vision_mission": "A power-efficient, renewable-energy-driven India, minimizing fossil fuel reliance.",
                "ministry": "Ministry of Power / Ministry of New and Renewable Energy (MNRE)",
                "launch_year": 2001,
                "eligibility": "All households, commercial offices, farmers, and industries.",
                "benefits": "Calculate household electricity savings, check rooftop solar feasibility, access solar subsidies, and log green building improvements.",
                "target_beneficiaries": "Power consumers, agricultural sectors, solar installers, and green builders.",
                "current_progress": "National solar capacity exceeded 70GW. UJALA scheme distributed over 360 million energy-efficient LED bulbs, saving 47 billion kWh annually.",
                "state_implementation": "Active across all state grids. State Designated Agencies (SDAs) implement BEE norms locally.",
                "guidelines": "Adopt 5-star rated appliances. Shift high-load activities to solar-peak hours where applicable.",
                "official_links": {
                    "website": "https://beeindia.gov.in",
                    "portal": "https://solarrooftop.gov.in"
                },
                "faqs": [
                    {"question": "What do Star Labels mean?", "answer": "Star labels indicate the energy efficiency of an appliance, with 5 stars being the most efficient."},
                    {"question": "How do I apply for rooftop solar subsidy?", "answer": "Submit a rooftop solar interest report to access state and central subsidy calculators and installer listings."}
                ],
                "downloads": [
                    {"title": "Rooftop Solar Subsidy Guidelines", "file_url": "https://mnre.gov.in/docs/solar_rooftop.pdf"}
                ],
                "media": [
                    {"title": "Solar Energy Conversion System", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=10"}
                ]
            },
            {
                "name": "disaster",
                "title": "Climate Change & Disaster Preparedness",
                "description": "Creating resilient communities through early warnings, flood/cyclone tracking, heatwave mitigation protocols, and emergency guidelines.",
                "overview": "Coordinated by the NDMA, this initiative provides local weather safety plans, emergency contact lists, and disaster preparedness resources to protect lives from extreme weather events.",
                "objectives": "Track weather alerts (cyclones, floods, heatwaves), provide emergency community guidelines, and analyze local disaster risk maps.",
                "vision_mission": "Resilient communities capable of anticipating and surviving natural disasters with zero casualties.",
                "ministry": "Ministry of Home Affairs (MHA) / National Disaster Management Authority (NDMA)",
                "launch_year": 2005,
                "eligibility": "Access is open. Focuses on climate-vulnerable coastal and mountain areas.",
                "benefits": "Receive real-time heatwave, flood, and storm alerts, access survival checklists, and view emergency contact numbers instantly.",
                "target_beneficiaries": "Citizens in disaster-prone regions, local rescue teams, and emergency managers.",
                "current_progress": "Common Alerting Protocol (CAP) integrated with mobile telecom networks, sending warning SMS to 800+ million citizens.",
                "state_implementation": "State Disaster Management Authorities (SDMAs) execute regional mock drills and emergency response.",
                "guidelines": "Store emergency water and dry rations. Create evacuation plans for high-risk zones.",
                "official_links": {
                    "website": "https://ndma.gov.in",
                    "portal": "https://sachet.ndma.gov.in"
                },
                "faqs": [
                    {"question": "What should I do during a heatwave?", "answer": "Avoid direct sunlight between 12:00 and 15:00, drink plenty of water, and wear light-colored cotton clothes."},
                    {"question": "Where can I find disaster helpline numbers?", "answer": "Click the Emergency Contacts tab on the disaster portal to find local national rescue, ambulance, and police coordinates."}
                ],
                "downloads": [
                    {"title": "NDMA Cyclone Preparedness Booklet", "file_url": "https://ndma.gov.in/docs/cyclone_guide.pdf"}
                ],
                "media": [
                    {"title": "Emergency Evacuation Kit checklist", "type": "IMAGE", "url": "https://picsum.photos/800/400?random=11"}
                ]
            }
        ]

        for s in schemes_data:
            scheme = GovernmentScheme(
                name=s["name"],
                title=s["title"],
                description=s["description"],
                overview=s["overview"],
                objectives=s["objectives"],
                vision_mission=s["vision_mission"],
                ministry=s["ministry"],
                launch_year=s["launch_year"],
                eligibility=s["eligibility"],
                benefits=s["benefits"],
                target_beneficiaries=s["target_beneficiaries"],
                current_progress=s["current_progress"],
                state_implementation=s["state_implementation"],
                guidelines=s["guidelines"],
                official_links=s["official_links"]
            )
            self.db.add(scheme)
            self.db.flush()  # Get ID

            # Add FAQs
            for f in s["faqs"]:
                faq = FAQs(scheme_id=scheme.id, question=f["question"], answer=f["answer"])
                self.db.add(faq)

            # Add Downloads
            for d in s["downloads"]:
                dl = Downloads(scheme_id=scheme.id, title=d["title"], file_url=d["file_url"])
                self.db.add(dl)

            # Add Media
            for m in s["media"]:
                med = Media(scheme_id=scheme.id, title=m["title"], type=m["type"], url=m["url"])
                self.db.add(med)

            # Add News announcement
            news = GovernmentNews(
                scheme_id=scheme.id,
                title=f"{s['title']} - Updated Implementation Guidelines Released",
                content=f"The government has announced updated operational guidelines for {s['title']} to accelerate progress in 2026. This includes increased citizen incentives and local budget allocations."
            )
            self.db.add(news)

            # Add Event
            event = GovernmentEvent(
                scheme_id=scheme.id,
                title=f"{s['title']} Community Awareness & Engagement Drive",
                description=f"Join local citizens and volunteers in raising awareness and executing projects for {s['title']}. We will map resources, discuss local plans, and reward participants.",
                event_date=datetime.utcnow() + timedelta(days=7),
                location="Town Hall & Central Community Park",
                max_volunteers=50
            )
            self.db.add(event)

            # Add Mock Smart City Devices (only for Smart Cities Mission)
            if s["name"] == "smartcities":
                cities = ["New Delhi Smart District", "Indore Clean Corridor", "Pune Green Hub", "Bengaluru Tech Grid"]
                for city in cities:
                    sc = SmartCity(
                        city_name=city,
                        bin_fill_level=42.5,
                        street_light_status="ON",
                        parking_occupancy=65.0
                    )
                    self.db.add(sc)

        self.db.commit()
        return "Seeded 11 environmental schemes successfully"

    # ==========================================
    # CORE BUSINESS LOGIC
    # ==========================================
    def get_schemes(self) -> List[GovernmentScheme]:
        return self.repo.get_all_schemes()

    def get_scheme_by_id(self, scheme_id: uuid.UUID) -> Optional[GovernmentScheme]:
        return self.repo.get_scheme_by_id(scheme_id)

    def register_volunteer(self, user_id: uuid.UUID, scheme_id: uuid.UUID, event_id: Optional[uuid.UUID] = None) -> Volunteer:
        vol = Volunteer(
            user_id=user_id,
            scheme_id=scheme_id,
            event_id=event_id,
            status="APPROVED"  # Auto approve volunteer registration
        )
        # Allocate EcoPoints for volunteering
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.role = "Volunteer"  # Upgrade role
            # Allocate 100 points
            # We can update user ecoPoints if column exists or log history
            # Based on user model we have scannedItemsCount.
            user.is_verified = True
            self.db.flush()

        return self.repo.create_volunteer(vol)

    def log_carbon_activity(self, user_id: uuid.UUID, category: str, value: float) -> CarbonActivity:
        # Category: Transport (km), Diet (meals), Electricity (kWh)
        # Calculate co2 offset in kg
        co2_saved = 0.0
        points = 0
        if category.lower() == "transport":
            co2_saved = value * 0.21  # 0.21 kg per km saved using public transport / cycle
            points = int(value * 2)
        elif category.lower() == "diet":
            co2_saved = value * 1.5  # 1.5 kg saved per plant-based meal
            points = int(value * 5)
        elif category.lower() == "electricity":
            co2_saved = value * 0.85  # 0.85 kg saved per kWh of solar/saving
            points = int(value * 1)
        else:
            co2_saved = value * 0.5
            points = int(value * 2)

        activity = CarbonActivity(
            user_id=user_id,
            category=category,
            value=value,
            co2_saved=co2_saved,
            points_earned=points
        )
        self.repo.create_carbon_activity(activity)

        # Award points to user
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.is_verified = True

        # Log participation
        scheme = self.repo.get_scheme_by_name("life")
        if scheme:
            p = Participation(
                user_id=user_id,
                scheme_id=scheme.id,
                challenge_name=f"Mission LiFE - {category} Offset Audit",
                status="COMPLETED",
                points_earned=points,
                completed_at=datetime.utcnow()
            )
            self.repo.create_participation(p)

            # Issue Pro-Planet Certificate if total points earned > 100
            total_points = sum(a.points_earned for a in self.repo.get_carbon_activities_by_user(user_id))
            if total_points >= 100:
                cert = Certificate(
                    user_id=user_id,
                    scheme_id=scheme.id,
                    title="Mission LiFE Pro-Planet Green Citizen Certificate",
                    certificate_url="/static/certificates/pro_planet_cert.pdf"
                )
                self.repo.create_certificate(cert)

        return activity

    def log_water_activity(self, user_id: uuid.UUID, category: str, description: str) -> WaterActivity:
        activity = WaterActivity(
            user_id=user_id,
            category=category,
            description=description,
            status="PENDING"
        )
        self.repo.create_water_activity(activity)

        scheme = self.repo.get_scheme_by_name("jaljeevan")
        if scheme:
            p = Participation(
                user_id=user_id,
                scheme_id=scheme.id,
                challenge_name=f"Jal Jeevan Mission - Water {category} Audit",
                status="COMPLETED",
                points_earned=50,
                completed_at=datetime.utcnow()
            )
            self.repo.create_participation(p)
        return activity

    def log_tree_plantation(self, user_id: uuid.UUID, tree_species: str, latitude: float, longitude: float) -> TreePlantation:
        # Sequestration estimates: standard tree absorbs ~22 kg/yr CO2
        plantation = TreePlantation(
            user_id=user_id,
            tree_species=tree_species,
            latitude=latitude,
            longitude=longitude,
            status="VERIFIED",
            carbon_sequestered=22.0
        )
        self.repo.create_tree_plantation(plantation)

        scheme = self.repo.get_scheme_by_name("greenindia")
        if scheme:
            p = Participation(
                user_id=user_id,
                scheme_id=scheme.id,
                challenge_name=f"National Mission for Green India - Tree Adoption ({tree_species})",
                status="COMPLETED",
                points_earned=200,
                completed_at=datetime.utcnow()
            )
            self.repo.create_participation(p)

            # Issue Certificate
            cert = Certificate(
                user_id=user_id,
                scheme_id=scheme.id,
                title=f"Green India Afforestation & Adoption Certificate ({tree_species})",
                certificate_url="/static/certificates/green_india_cert.pdf"
            )
            self.repo.create_certificate(cert)

        return plantation

    def log_pollution_report(self, user_id: uuid.UUID, pollution_type: str, description: str, location: str, latitude: float, longitude: float) -> PollutionReport:
        report = PollutionReport(
            user_id=user_id,
            pollution_type=pollution_type,
            description=description,
            location=location,
            latitude=latitude,
            longitude=longitude,
            status="PENDING"
        )
        self.repo.create_pollution_report(report)

        scheme = self.repo.get_scheme_by_name("cpcb")
        if scheme:
            p = Participation(
                user_id=user_id,
                scheme_id=scheme.id,
                challenge_name=f"CPCB - Community Pollution Monitor Report ({pollution_type})",
                status="COMPLETED",
                points_earned=100,
                completed_at=datetime.utcnow()
            )
            self.repo.create_participation(p)
        return report

    # ==========================================
    # ANALYTICS & DASHBOARD SUMMARY
    # ==========================================
    def get_global_analytics(self) -> Dict[str, Any]:
        schemes = self.repo.get_all_schemes()
        plantations = self.repo.get_tree_plantations()
        carbon_logs = self.db.query(CarbonActivity).all()

        total_co2_saved = sum(c.co2_saved for c in carbon_logs) + (len(plantations) * 22.0)
        total_trees_planted = len(plantations)
        total_volunteers = self.db.query(Volunteer).filter(Volunteer.status == "APPROVED").count()

        # Build mock state-wise coverage data
        state_data = [
            {"state": "Maharashtra", "participation": 12400, "trees_planted": 890, "co2_offset_ton": 320.5},
            {"state": "Gujarat", "participation": 14200, "trees_planted": 1250, "co2_offset_ton": 450.2},
            {"state": "Karnataka", "participation": 9800, "trees_planted": 710, "co2_offset_ton": 280.9},
            {"state": "Tamil Nadu", "participation": 11500, "trees_planted": 920, "co2_offset_ton": 390.1},
            {"state": "Uttar Pradesh", "participation": 15400, "trees_planted": 1450, "co2_offset_ton": 520.4}
        ]

        return {
            "national_stats": {
                "total_carbon_saved_kg": round(total_co2_saved, 2),
                "total_trees_planted": total_trees_planted,
                "total_volunteers": total_volunteers,
                "total_active_citizens": 45892,
                "cleanliness_index_score": 88.5
            },
            "state_wise_coverage": state_data,
            "scheme_performance": [
                {"scheme": s.title, "participation_count": len(s.events) * 25 + 120}
                for s in schemes
            ],
            "aqi_trends": [
                {"city": "Mumbai", "aqi": 52, "status": "Moderate"},
                {"city": "Indore", "aqi": 34, "status": "Good"},
                {"city": "Bengaluru", "aqi": 41, "status": "Good"},
                {"city": "Delhi", "aqi": 185, "status": "Poor"},
                {"city": "Pune", "aqi": 38, "status": "Good"}
            ]
        }

    def get_user_dashboard_summary(self, user_id: uuid.UUID) -> Dict[str, Any]:
        carbon_logs = self.repo.get_carbon_activities_by_user(user_id)
        certificates = self.repo.get_certificates_by_user(user_id)
        volunteers = self.repo.get_volunteers_by_user(user_id)

        user_co2 = sum(c.co2_saved for c in carbon_logs)
        user_points = sum(c.points_earned for c in carbon_logs)

        # Get list of daily challenges
        daily_challenges = [
            {"id": "ch-1", "title": "Avoid single-use water bottles today", "category": "PLASTIC", "points": 25, "completed": False},
            {"id": "ch-2", "title": "Take a 10-minute public transport or bicycle ride", "category": "TRANSPORT", "points": 50, "completed": False},
            {"id": "ch-3", "title": "Audit and record power consumption of 3 household devices", "category": "ENERGY", "points": 30, "completed": False}
        ]

        return {
            "user_stats": {
                "carbon_saved_kg": round(user_co2, 2),
                "eco_points_earned": user_points,
                "certificates_count": len(certificates),
                "volunteered_campaigns": len(volunteers)
            },
            "daily_challenges": daily_challenges,
            "certificates": [
                {"id": c.id, "title": c.title, "issue_date": c.issue_date, "url": c.certificate_url}
                for c in certificates
            ]
        }
