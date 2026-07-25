import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Leaf, Sparkles, TrendingUp, User, Award, Zap, Bell, MapPin, 
  Camera, ShoppingBag, Share2, BookOpen, Heart, MessageCircle, 
  Plus, Calendar, ChevronRight, Check, CheckCircle, HelpCircle, 
  Trophy, Shield, Lock, Mail, FileText, Printer, Search, 
  Flame, Coins, LogOut, RefreshCw, X, Eye, Home, MessageSquare, 
  Globe, Users, Video, Settings, Cpu, Send, CheckSquare, Sparkle, Trash2, ArrowRight, Activity, Database, Target, BarChart2, Building2, AlertTriangle
} from "lucide-react";
import { audioEngine } from "./AudioEngine";
import { UserProfile } from "../types";
import { EarthVisualizer } from "./EarthVisualizer";
import { api } from "../services/api";
import { RealtimeUserBrowserInfo } from "./RealtimeUserBrowserInfo";
import { RightSidebar } from "./dashboard/RightSidebar";
import { EcoChatOverlay } from "./dashboard/EcoChatOverlay";

interface DashboardProps {
  profile: UserProfile;
  onLogout: () => void;
}

interface Story {
  id: string;
  title: string;
  imageEmoji: string;
  author: string;
  desc: string;
  time: string;
  likes: number;
  comments: string[];
}

const COMMUNITY_STORIES: Story[] = [
  {
    id: "story-1",
    title: "Plastic Cleanup",
    imageEmoji: "🌊",
    author: "Elena G.",
    desc: "We cleared 12kg of plastics and micro-particles from the local creek bed. The river is breathing again!",
    time: "2h ago",
    likes: 42,
    comments: ["Pure inspiration! 🌎", "Let me know the next location!"]
  },
  {
    id: "story-2",
    title: "Food Rescue",
    imageEmoji: "🍎",
    author: "Dave K.",
    desc: "Rescued 15 surplus vegan salads from The Green Grocer and delivered them to the community pantry.",
    time: "4h ago",
    likes: 56,
    comments: ["Zero waste is beautiful.", "Thank you Dave! 🌱"]
  },
  {
    id: "story-3",
    title: "Tree Plantation",
    imageEmoji: "🌳",
    author: "Sora M.",
    desc: "Planted 8 saplings in the urban biosphere park. Each oak will absorb ~22kg of CO2 per year once mature.",
    time: "1d ago",
    likes: 89,
    comments: ["A green lung for our city!", "This is amazing! ✨"]
  },
  {
    id: "story-4",
    title: "Success Stories",
    imageEmoji: "♻️",
    author: "EcoClub",
    desc: "Our cooperative recycling hub reached a milestone: 5 tons of electronic waste safely diverted from landfills.",
    time: "2d ago",
    likes: 124,
    comments: ["Incredible achievement!", "Proud to be part of this."]
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ profile, onLogout, initialView }) => {
  // Navigation View selection
  const [activeView, setActiveView] = useState<string>(initialView || "home");

  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  // Core Gamification States
  const [ecoPoints, setEcoPoints] = useState(480);
  const [xp, setXp] = useState(650);
  const [level, setLevel] = useState(3);
  const [streak, setStreak] = useState(7);
  const [streakActive, setStreakActive] = useState(true);

  // Live Data States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [foodDonations, setFoodDonations] = useState<any[]>([]);
  const [showNewDonationModal, setShowNewDonationModal] = useState(false);
  const [newDonationTitle, setNewDonationTitle] = useState("");
  const [newDonationDesc, setNewDonationDesc] = useState("");
  const [newDonationType, setNewDonationType] = useState("COOKED");
  const [newDonationQty, setNewDonationQty] = useState("");
  const [newDonationQuality, setNewDonationQuality] = useState("GOOD");
  const [newDonationAddress, setNewDonationAddress] = useState("");
  const [newDonationHours, setNewDonationHours] = useState("24");
  
  const [wasteReports, setWasteReports] = useState<any[]>([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportDesc, setNewReportDesc] = useState("");
  const [newReportCategory, setNewReportCategory] = useState("PLASTIC");
  const [newReportPriority, setNewReportPriority] = useState("MEDIUM");
  const [newReportLocation, setNewReportLocation] = useState("");
  const [newReportImage, setNewReportImage] = useState<File | null>(null);
  
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newRatingValue, setNewRatingValue] = useState(5);
  const [newRatingFeedback, setNewRatingFeedback] = useState("");
  
  const [showCompleteCleanupModal, setShowCompleteCleanupModal] = useState(false);
  const [cleanupAfterImage, setCleanupAfterImage] = useState<File | null>(null);
  const [cleanupNotes, setCleanupNotes] = useState("");

  const [activeReportFilter, setActiveReportFilter] = useState({ category: "", status: "", priority: "", search: "" });

  // Load live user profile on mount
  useEffect(() => {
    const fetchLiveProfile = async () => {
      try {
        const liveProfile = await api.getProfile();
        if (liveProfile) {
          setEcoPoints(liveProfile.ecoPoints);
          setXp(Math.round(liveProfile.scannedItemsCount * 10) % 1000);
          setLevel(Math.floor((liveProfile.scannedItemsCount * 10) / 1000) + 1);
        }
      } catch (err) {
        console.warn("Could not load live profile", err);
      }
    };
    fetchLiveProfile();
  }, []);

  // Fetch food donations when on food_rescue tab
  const fetchLiveDonations = async () => {
    setLoading(true);
    try {
      const res = await api.getFoodDonations();
      setFoodDonations(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "food_rescue") {
      fetchLiveDonations();
    }
  }, [activeView]);

  // Fetch waste reports when on waste_reports tab
  const fetchLiveReports = async () => {
    setLoading(true);
    try {
      const res = await api.getWasteReports(activeReportFilter);
      setWasteReports(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "waste_reports") {
      fetchLiveReports();
    }
  }, [activeView, activeReportFilter]);


  // Community Feed
  const [socialPosts, setSocialPosts] = useState([
    { id: "p1", author: "Iniya 🌱", avatar: "👩‍🌾", category: "Food Rescue", content: "Just rescued 2 meals from Artisan Bakery! Sourdough saved from landfill, preventing 2.4kg of greenhouse gases. 🥖❤️", likes: 24, hasLiked: false, commentsCount: 3, joined: false },
    { id: "p2", author: "Marcus Aurelius", avatar: "🧑‍🚀", category: "Cleanup Drive", content: "Delivered 12kg of sorted cardboard to the circular bio-shredder. Registered on-chain carbon offset! 📦♻️", likes: 18, hasLiked: false, commentsCount: 1, joined: false }
  ]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Today's Mission & Floating elements
  const [missionProgress, setMissionProgress] = useState(0); 
  const [missionClaimed, setMissionClaimed] = useState(false);
  const [isClaimingPoints, setIsClaimingPoints] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{ x: number; y: number; amount: string; id: number }[]>([]);

  // AI Mascot speaks
  const [companionMsgIndex, setCompanionMsgIndex] = useState(0);
  const [showMascotTooltip, setShowMascotTooltip] = useState(true);
  const companionMessages = [
    "Great job today! 🌱 You are actively protecting our communal ecosystem.",
    "Did you know? Rescuing just 2 meals prevents about 2.5kg of CO2 emissions!",
    "Your 7-day streak is glowing! 🔥 Complete Today's Mission to level up your passport.",
    "We have 3 recycling hubs offering rewards in your immediate 2km radius!",
    "Eco AI Scan can identify plastic codes instantly. Give it a test run!"
  ];

  // Interactive Live Chats simulation
  const [activeChatPartner, setActiveChatPartner] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatsData, setChatsData] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    "Elena G.": [
      { sender: "them", text: "Hey! Are you joining the Plastic creek cleanup drive this Saturday? 🌊", time: "10:30 AM" },
      { sender: "them", text: "We need 15 volunteers to clear out the microplastics block near North Creek.", time: "10:31 AM" }
    ],
    "Dave K.": [
      { sender: "them", text: "Just rescued 15 vegan boxes from Bistro Green. They are in the community fridge! 🍎", time: "9:15 AM" }
    ],
    "EcoClub NGO": [
      { sender: "them", text: "Welcome to the communal legacy ledger! Your contributions are verified weekly.", time: "Yesterday" }
    ]
  });

  // Friend / Follow States
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your Eco Passport unlocked 'Green Seedling' Stamp!", read: false, time: "Just now" },
    { id: 2, text: "Elena liked your shared beach cleanup proposal.", read: false, time: "1h ago" }
  ]);

  // AI Scan Feature
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ name: string; co2: string; points: number; route: string } | null>(null);

  // Food Rescue List
  const [rescuedItems, setRescuedItems] = useState<string[]>([]);

  // Circular Exchange Goods
  const [marketItems, setMarketItems] = useState([
    { id: "m1", name: "Reusable Bamboo Travel Cup", price: 150, image: "🍵", stock: 12, purchased: false },
    { id: "m2", name: "Plant 1 Tree (Madagascar Rainforest)", price: 300, image: "🌳", stock: 999, purchased: false },
    { id: "m3", name: "Zero-Waste Beeswax Food Wraps", price: 200, image: "🐝", stock: 8, purchased: false },
    { id: "m4", name: "Urban Composting Starter Kit", price: 400, image: "📦", stock: 5, purchased: false }
  ]);
  const [userListings, setUserListings] = useState([
    { id: "ul1", name: "Clean Aluminum Cans (5kg)", reward: 120, status: "Active" }
  ]);
  const [newListingName, setNewListingName] = useState("");
  const [newListingReward, setNewListingReward] = useState("50");

  // Quiz
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const quizQuestion = {
    q: "How long does a standard plastic bottle take to fully decompose in a modern landfill?",
    options: ["About 50 Years", "Over 450 Years", "It decomposes instantly in rainwater", "Never (It breaks into microplastics only)"],
    correctIndex: 1,
    explanation: "Standard PET plastics require roughly 450 years to degrade, during which they leach toxic chemical residues into soil and waterways. Recycling is our only shield!"
  };

  // Rewards chests
  const [chests, setChests] = useState([
    { id: "c1", type: "Daily Leaf Chest", status: "ready", reward: "+80 EcoPoints, +100 XP" },
    { id: "c2", type: "Epic Marine Chest", status: "locked", requirement: "Reach Level 5" },
    { id: "c3", type: "Cosmic Biosphere Chest", status: "locked", requirement: "Reach 10-Day Streak" }
  ]);
  const [openedChestResult, setOpenedChestResult] = useState<string | null>(null);
  const [chestOpeningId, setChestOpeningId] = useState<string | null>(null);

  // Passport stamps
  const [passportStamps, setPassportStamps] = useState([
    { id: "s1", name: "Earth Healer", emoji: "🌎", date: "Jul 2026", unlocked: true },
    { id: "s2", name: "Zero Waste Hero", emoji: "♻️", date: "Jul 2026", unlocked: true },
    { id: "s3", name: "Forest Pioneer", emoji: "🌳", date: "Locked", unlocked: false },
    { id: "s4", name: "Oceans Guard", emoji: "🌊", date: "Locked", unlocked: false }
  ]);

  // Modals UI
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Tree Plantation");
  
  const [showAddFriendsModal, setShowAddFriendsModal] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");

  // AI Chat Room state
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: "eco", text: "Hello! I am Eco, your sustainability copilot. Ask me how to salvage carbon offsets or join community drives! 🌍" }
  ]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Floating score visualizer
  const triggerPointsFloater = (amount: string, e?: React.MouseEvent) => {
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { x, y, amount, id }]);
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(f => f.id !== id));
    }, 1800);
  };

  // Sound and simulation triggers
  const handleCompleteMissionAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (missionProgress < 2) {
      audioEngine.playTick();
      const nextProgress = missionProgress + 1;
      setMissionProgress(nextProgress);
      triggerPointsFloater("+1 Progress", e);
      if (nextProgress === 2) {
        setTimeout(() => {
          audioEngine.playSuccessChime();
        }, 300);
      }
    }
  };

  const handleClaimMissionRewards = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (missionProgress === 2 && !missionClaimed) {
      setIsClaimingPoints(true);
      audioEngine.playSuccessChime();
      triggerPointsFloater("+250 XP", e);
      setTimeout(() => {
        triggerPointsFloater("+100 EcoPoints", e);
        setEcoPoints(prev => prev + 100);
        setXp(prev => {
          const nextXp = prev + 250;
          if (nextXp >= 1000) {
            setLevel(l => l + 1);
            triggerPointsFloater("LEVEL UP! 🌟");
            return nextXp - 1000;
          }
          return nextXp;
        });
        setMissionClaimed(true);
        setIsClaimingPoints(false);
      }, 600);
    }
  };

  // AI Companion Speeches
  const rotateCompanionMsg = () => {
    audioEngine.playTick();
    setCompanionMsgIndex(prev => (prev + 1) % companionMessages.length);
    setShowMascotTooltip(true);
  };

  // Camera scanner simulator
  const handleStartScan = () => {
    audioEngine.playTick();
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const presets = [
        { name: "PET 1 Recyclable Bottle", co2: "0.25 kg", points: 40, route: "Circular Economy Deposit Hub #04" },
        { name: "Organic Bread Sourdough Crumb", co2: "0.58 kg", points: 60, route: "Local Composting Biosphere" },
        { name: "Corrugated Cardboard Box", co2: "0.42 kg", points: 50, route: "Green Bio-Shredder Point #01" },
        { name: "Aluminum Beverage Container", co2: "0.85 kg", points: 80, route: "Local Automated Refund Machine" }
      ];
      setScanResult(presets[Math.floor(Math.random() * presets.length)]);
      setIsScanning(false);
      audioEngine.playSuccessChime();
    }, 1800);
  };

  const claimScanRewards = (e: React.MouseEvent) => {
    if (scanResult) {
      audioEngine.playSuccessChime();
      triggerPointsFloater(`+${scanResult.points} EcoPoints`, e);
      setEcoPoints(prev => prev + scanResult.points);
      setXp(prev => {
        const nextXp = prev + Math.floor(scanResult.points * 1.5);
        if (nextXp >= 1000) {
          setLevel(l => l + 1);
          return nextXp - 1000;
        }
        return nextXp;
      });
      setNotifications(prev => [
        { id: Date.now(), text: `Scanned ${scanResult.name}! Saved ${scanResult.co2} CO2 Offset.`, read: false, time: "Just now" },
        ...prev
      ]);
      setScanResult(null);
    }
  };

  // Food Rescue item claimer (live integration)
  const handleClaimFoodDonation = async (id: string, title: string, e: React.MouseEvent) => {
    audioEngine.playSuccessChime();
    try {
      await api.claimFoodDonation(id, "Claimed via EcoVerzz Dashboard.");
      triggerPointsFloater("+150 EcoPoints", e);
      setEcoPoints(prev => prev + 150);
      setXp(prev => {
        const nextXp = prev + 200;
        if (nextXp >= 1000) {
          setLevel(l => l + 1);
          return nextXp - 1000;
        }
        return nextXp;
      });
      if (missionProgress < 2) {
        setMissionProgress(p => p + 1);
      }
      setNotifications(prev => [
        { id: Date.now(), text: `Rescued ${title}! Claimed eco-balance certificate.`, read: false, time: "Just now" },
        ...prev
      ]);
      fetchLiveDonations();
    } catch (err: any) {
      alert("Claim failed: " + (err.detail || "Only NGO users are allowed to claim food donations. Please check your user role."));
    }
  };

  // Submit Food Donation
  const submitFoodDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonationTitle.trim() || !newDonationQty.trim() || !newDonationAddress.trim()) return;

    setLoading(true);
    try {
      const expirationDate = new Date(Date.now() + parseFloat(newDonationHours) * 3600 * 1000).toISOString();
      await api.createFoodDonation({
        title: newDonationTitle,
        description: newDonationDesc,
        food_type: newDonationType,
        quantity: newDonationQty,
        quality_status: newDonationQuality,
        expiry_time: expirationDate,
        pickup_address: newDonationAddress,
        latitude: 12.971598, // default coords
        longitude: 77.594562
      });
      audioEngine.playSuccessChime();
      triggerPointsFloater("Donation Listed! 🥗");
      setShowNewDonationModal(false);
      setNewDonationTitle("");
      setNewDonationDesc("");
      setNewDonationQty("");
      setNewDonationAddress("");
      fetchLiveDonations();
    } catch (err: any) {
      alert("Listing failed: " + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Waste Report (Multipart)
  const submitWasteReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle.trim() || !newReportLocation.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newReportTitle);
      formData.append("description", newReportDesc);
      formData.append("category", newReportCategory);
      formData.append("priority", newReportPriority);
      formData.append("location", newReportLocation);
      formData.append("latitude", "12.971598"); // default coords
      formData.append("longitude", "77.594562");
      if (newReportImage) {
        formData.append("image", newReportImage);
      }

      await api.createWasteReport(formData);
      audioEngine.playSuccessChime();
      triggerPointsFloater("Waste Logged! ♻️");
      setShowNewReportModal(false);
      setNewReportTitle("");
      setNewReportDesc("");
      setNewReportLocation("");
      setNewReportImage(null);
      fetchLiveReports();
    } catch (err: any) {
      alert("Failed to file report: " + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Comment on Waste Report
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedReport) return;

    try {
      const res = await api.createWasteReportComment(selectedReport.id, newComment);
      audioEngine.playSuccessChime();
      setSelectedReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...(prev.comments || []), res]
        };
      });
      setNewComment("");
      fetchLiveReports();
    } catch (err: any) {
      alert("Comment failed: " + JSON.stringify(err));
    }
  };

  // Submit Rating on completed cleanup
  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const res = await api.rateWasteReportCleanup(selectedReport.id, newRatingValue, newRatingFeedback);
      audioEngine.playSuccessChime();
      setSelectedReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rating: res
        };
      });
      setNewRatingFeedback("");
      fetchLiveReports();
    } catch (err: any) {
      alert("Rating failed: " + (err.detail || "You have already rated or are not the reporter."));
    }
  };

  // Complete cleanup (Volunteer/Municipality action)
  const submitCompleteCleanup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !cleanupAfterImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("after_image", cleanupAfterImage);
      formData.append("notes", cleanupNotes);

      const res = await api.completeWasteCleanup(selectedReport.id, formData);
      audioEngine.playSuccessChime();
      triggerPointsFloater("Cleanup complete!", undefined);
      setShowCompleteCleanupModal(false);
      setCleanupAfterImage(null);
      setCleanupNotes("");
      
      // Update local detailed popup
      setSelectedReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: "COMPLETED",
          after_image: res.after_image || null
        };
      });
      
      fetchLiveReports();
    } catch (err: any) {
      alert("Cleanup completion failed: " + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  // Delete Waste Report (Citizen/Staff action)
  const deleteWasteReport = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.deleteWasteReport(id);
      audioEngine.playTick();
      setSelectedReport(null);
      fetchLiveReports();
    } catch (err: any) {
      alert("Deletion failed: " + (err.detail || "You are not authorized to delete this report."));
    }
  };

  // Marketplace Buy
  const buyMarketItem = (itemId: string, price: number, name: string, e: React.MouseEvent) => {
    if (ecoPoints < price) {
      audioEngine.playTick();
      triggerPointsFloater("Insufficient EcoPoints! ❌", e);
      return;
    }
    audioEngine.playSuccessChime();
    setEcoPoints(prev => prev - price);
    setMarketItems(prev => prev.map(item => item.id === itemId ? { ...item, purchased: true, stock: item.stock - 1 } : item));
    triggerPointsFloater(`-${price} EcoPoints`, e);
    
    if (name.includes("Tree")) {
      setPassportStamps(prev => prev.map(s => s.id === "s3" ? { ...s, unlocked: true, date: "Jul 2026" } : s));
    }
    setNotifications(prev => [
      { id: Date.now(), text: `Exchanged ${name}! Ledger Stamp synced.`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  // Put item on exchange
  const submitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingName.trim()) return;
    audioEngine.playSuccessChime();
    const newL = {
      id: "ul-" + Date.now(),
      name: newListingName.trim(),
      reward: parseInt(newListingReward) || 50,
      status: "Active"
    };
    setUserListings(prev => [newL, ...prev]);
    setNewListingName("");
    triggerPointsFloater("Listing Posted! ♻️");
  };

  // Follow Sugggested Friend
  const handleFollowFriend = (friendName: string, e: React.MouseEvent) => {
    audioEngine.playTick();
    if (followingList.includes(friendName)) {
      setFollowingList(prev => prev.filter(f => f !== friendName));
    } else {
      audioEngine.playSuccessChime();
      setFollowingList(prev => [...prev, friendName]);
      triggerPointsFloater("Followed! 🌱", e);
    }
  };

  // Add Friend Request
  const handleAddFriend = (friendName: string, e: React.MouseEvent) => {
    audioEngine.playSuccessChime();
    triggerPointsFloater("Request Sent! 👥", e);
    setNotifications(prev => [
      { id: Date.now(), text: `Sent friend invitation to ${friendName}. Pending sync.`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  // Create customized social post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    audioEngine.playSuccessChime();
    const newPost = {
      id: "post-" + Date.now(),
      author: profile?.username || "You",
      avatar: "🌟",
      category: newPostCategory,
      content: newPostContent.trim(),
      likes: 0,
      hasLiked: false,
      commentsCount: 0,
      joined: false
    };
    setSocialPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setShowNewPostModal(false);
    setXp(p => p + 50);
    triggerPointsFloater("+50 XP Shared Impact!", undefined);
  };

  // Like Social Post
  const toggleLikePost = (postId: string, e: React.MouseEvent) => {
    audioEngine.playTick();
    setSocialPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const nextLiked = !post.hasLiked;
        if (nextLiked) triggerPointsFloater("+1 Like ❤️", e);
        return {
          ...post,
          hasLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Join drive or campaign
  const handleJoinCampaign = (postId: string, e: React.MouseEvent) => {
    audioEngine.playSuccessChime();
    setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, joined: !p.joined } : p));
    triggerPointsFloater("Joined Mission! 🌱", e);
  };

  // Chat window messages helper
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatPartner) return;
    audioEngine.playTick();
    const userMsg = { sender: "me", text: chatInput.trim(), time: "Just now" };
    setChatsData(prev => ({
      ...prev,
      [activeChatPartner]: [...(prev[activeChatPartner] || []), userMsg]
    }));
    setChatInput("");
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        "Elena G.": [
          "Incredible energy! 🌟 Your action offset coordinates are recorded.",
          "Perfect! Bring your recycling gloves and we'll unlock your Ocean Stamp.",
          "Let's sync up at the North swale coordinates on Saturday!"
        ],
        "Dave K.": [
          "Fabulous! Zero waste keeps the landfills breathing. CO2 diverted! 🍎",
          "There's fresh surplus bread ready to rescue near your location.",
          "Glad to sync with another active guardian."
        ],
        "EcoClub NGO": [
          "Pioneer Node synced. Your cumulative environmental ledger is green.",
          "Keep checking the weekly intelligence quiz to claim bonus chests!",
          "Terrific momentum! The biosphere is reacting positively."
        ]
      };
      const partnerReplies = responses[activeChatPartner] || ["Outstanding sustainable action! 🌱"];
      const reply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      setChatsData(prev => ({
        ...prev,
        [activeChatPartner]: [...(prev[activeChatPartner] || []), { sender: "them", text: reply, time: "Just now" }]
      }));
      audioEngine.playSuccessChime();
    }, 1200);
  };

  // AI Mascot Immersive Chat Room
  const handleSendAiChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;
    audioEngine.playTick();
    const userMsg = { sender: "user", text: aiChatInput.trim() };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiChatInput("");
    setIsAiTyping(true);
    setTimeout(() => {
      const answers = [
        "That is an extraordinary sustainability question! Keeping items in a circular exchange reduces regional carbon overhead by nearly 35%.",
        "Every single tree planted in our Madagascar reserve sequesters approximately 22kg of CO2 per year. It is a biological shield!",
        "Diverting organic waste from standard landfills prevents toxic methane gas discharge. You are feeding the soil, not the sky! 🌳",
        "Amazing momentum! Keep logging your daily tasks to claim the golden Eco Passport stamps."
      ];
      const reply = answers[Math.floor(Math.random() * answers.length)];
      setAiChatMessages(prev => [...prev, { sender: "eco", text: reply }]);
      setIsAiTyping(false);
      audioEngine.playSuccessChime();
    }, 1500);
  };

  // Chest vault claims
  const openChest = (chestId: string, e: React.MouseEvent) => {
    audioEngine.playTick();
    setChestOpeningId(chestId);
    setTimeout(() => {
      audioEngine.playSuccessChime();
      let res = "";
      if (chestId === "c1") {
        res = "🎁 Opened Daily Chest! Unlocked +80 EcoPoints, +100 XP, and a Gold seedling badge!";
        setEcoPoints(prev => prev + 80);
        setXp(prev => {
          const n = prev + 100;
          if (n >= 1000) { setLevel(l => l + 1); return n - 1000; }
          return n;
        });
        setChests(prev => prev.map(c => c.id === "c1" ? { ...c, status: "opened" } : c));
      }
      setOpenedChestResult(res);
      setChestOpeningId(null);
    }, 1500);
  };

  // Answer Quiz
  const answerQuiz = (index: number, e: React.MouseEvent) => {
    if (quizAnswered) return;
    setSelectedQuizOption(index);
    setQuizAnswered(true);
    if (index === quizQuestion.correctIndex) {
      audioEngine.playSuccessChime();
      triggerPointsFloater("+150 XP", e);
      triggerPointsFloater("+100 EcoPoints", e);
      setEcoPoints(p => p + 100);
      setXp(p => {
        const next = p + 150;
        if (next >= 1000) { setLevel(l => l + 1); return next - 1000; }
        return next;
      });
      setPassportStamps(prev => prev.map(s => s.id === "s2" ? { ...s, unlocked: true, date: "Jul 2026" } : s));
    } else {
      audioEngine.playTick();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050507] text-white flex flex-col md:flex-row relative font-sans overflow-x-hidden pb-20 md:pb-0">
      
      {/* Dynamic Floating Score Floaters */}
      <AnimatePresence>
        {floatingPoints.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, y: f.y - 30, x: f.x - 20, scale: 0.8 }}
            animate={{ opacity: 0, y: f.y - 150, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6 }}
            className="fixed pointer-events-none text-emerald-400 font-black text-sm md:text-base font-mono drop-shadow-[0_0_10px_#10b981] z-[9999]"
          >
            {f.amount}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* LEFT NAVIGATION COLUMN (SIDEBAR) - Collapsible/Expandable Spotify Inspired */}
      <aside 
        id="sidebar"
        className="hidden md:flex fixed left-0 top-0 h-screen bg-[#09090b]/90 backdrop-blur-2xl border-r border-white/5 z-40 flex-col justify-between py-6 transition-all duration-300 w-20 hover:w-64 group"
      >
        <div className="flex flex-col gap-8 w-full px-4">
          {/* Brand Logo & Mini Rotating Earth Globe */}
          <div className="flex items-center gap-3 pl-2 overflow-hidden select-none">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <span className="font-extrabold tracking-widest text-emerald-400 font-mono text-sm uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 truncate">
              EcoVerzz
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 w-full">
            {[
              { id: "ai_scan", label: "1. EcoScan AI Guide", icon: Camera },
              { id: "awareness", label: "2. EcoPulse Hub", icon: Zap },
              { id: "missions", label: "3. Eco Missions", icon: Target },
              { id: "home", label: "4. Impact Matrix", icon: BarChart2 },
              { id: "marketplace", label: "5. Circular Exchange", icon: ShoppingBag },
              { id: "food_rescue", label: "6. Food Rescue Network", icon: Heart },
              { id: "waste_reports", label: "7. Community Cleanup", icon: Users },
              { id: "settings", label: "8. Business & CSR Portal", icon: Building2 },
              { id: "recycle_connect", label: "9. Recycle Connect", icon: RefreshCw },
              { id: "passport", label: "10. User Profile & Identity", icon: User },
              { id: "telemetry", label: "11 & 12. Intel & GPS", icon: Activity },
              { id: "rewards", label: "13. Rewards & Recognition", icon: Award },
              { id: "eco_ai", label: "14. AI Insights Advisor", icon: Cpu },
              { id: "eco_social", label: "15. EcoLink Social Network", icon: Globe },
              { id: "ecoreport", label: "16. EcoReport Civic", icon: AlertTriangle },
            ].map(item => {
              const Icon = item.icon;
              const aliasMap: Record<string, string> = {
                recycle_connect: "ai_scan",
                ecoreport: "waste_reports",
                community_cleanup: "waste_reports",
                business_csr: "settings",
                user_profile: "passport",
                rewards_recognition: "rewards",
                ai_insights: "eco_ai",
                ecolink_social: "eco_social",
                ecoscan: "ai_scan",
                ecopulse: "awareness",
                ecomissions: "missions",
                impact_dashboard: "home",
                circular_marketplace: "marketplace",
              };
              const targetId = aliasMap[item.id] || item.id;
              const isActive = activeView === item.id || activeView === targetId;
              return (
                <button
                  key={item.id}
                  onClick={() => { audioEngine.playTick(); setActiveView(targetId); }}
                  className={`w-full py-3 px-3.5 rounded-xl flex items-center gap-4 transition-all relative overflow-hidden group/item cursor-pointer text-left ${
                    isActive 
                      ? "text-emerald-400 bg-emerald-500/5 font-semibold shadow-[inset_0_0_12px_rgba(52,211,153,0.06)] border border-emerald-500/10" 
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_#34d399]" : "group-hover/item:scale-110 transition-transform"}`} />
                  <span className="text-xs tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile details locked at bottom of sidebar */}
        <div className="w-full px-4 overflow-hidden border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 pl-1.5 py-1.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-black shrink-0">
              {profile?.username ? profile.username.substring(0, 2).toUpperCase() : "EV"}
            </div>
            <div className="text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
              <h5 className="text-xs font-black text-white leading-none">{profile?.username || "Pioneer"}</h5>
              <span className="text-[9px] text-gray-500 font-mono">Level {level} Guardian</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#09090b]/95 backdrop-blur-md border-t border-white/5 z-40 flex justify-around items-center px-4">
        {[
          { id: "home", icon: Home },
          { id: "telemetry", icon: Activity },
          { id: "ai_scan", icon: Camera },
          { id: "marketplace", icon: ShoppingBag },
          { id: "waste_reports", icon: Trash2 },
          { id: "passport", icon: Award },
          { id: "eco_ai", icon: MessageSquare }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { audioEngine.playTick(); setActiveView(item.id); }}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${isActive ? "text-emerald-400" : "text-gray-400"}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* MAIN CONTAINER LAYOUT */}
      <main className="flex-1 md:ml-20 group-hover/sidebar:md:ml-20 transition-all duration-300 flex justify-center w-full min-h-screen">
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-start justify-center gap-8 px-4 md:px-8 py-6">
          
          {/* CENTER COLUMN: Feed & Active Views */}
          <div className="w-full flex-1 min-w-0 space-y-6">
            
            {/* Top Stats Header */}
            <header className="flex flex-wrap justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-2xl font-mono">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-gray-400">Points:</span>
                  <span className="text-xs font-black text-white">{ecoPoints}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-2xl font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  <span className="text-xs text-gray-400">Streak:</span>
                  <span className="text-xs font-black text-white">{streak} days</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl font-mono text-emerald-400 text-xs font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Live</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 text-red-400 rounded-xl transition-all cursor-pointer"
                title="Disconnect Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </header>

            {/* Biosphere Impact Summary Matrix - Fills top horizontal space */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0b101c]/90 border border-emerald-500/20 p-3.5 rounded-2xl backdrop-blur-md flex items-center gap-3 hover:border-emerald-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                  🌿
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">CO2 Offset</span>
                  <span className="text-sm font-black text-white font-mono">2,840 kg</span>
                </div>
              </div>

              <div className="bg-[#0b101c]/90 border border-teal-500/20 p-3.5 rounded-2xl backdrop-blur-md flex items-center gap-3 hover:border-teal-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm shrink-0">
                  🌳
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Trees Planted</span>
                  <span className="text-sm font-black text-white font-mono">142 Trees</span>
                </div>
              </div>

              <div className="bg-[#0b101c]/90 border border-cyan-500/20 p-3.5 rounded-2xl backdrop-blur-md flex items-center gap-3 hover:border-cyan-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                  💧
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Water Saved</span>
                  <span className="text-sm font-black text-white font-mono">18,400 L</span>
                </div>
              </div>

              <div className="bg-[#0b101c]/90 border border-amber-500/20 p-3.5 rounded-2xl backdrop-blur-md flex items-center gap-3 hover:border-amber-400/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                  ♻️
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Waste Diverted</span>
                  <span className="text-sm font-black text-white font-mono">540 kg</span>
                </div>
              </div>
            </div>

            {/* Render conditional views */}
            <AnimatePresence mode="wait">
              
              {/* REAL-TIME USER AUTH & BROWSER TELEMETRY VIEW */}
              {activeView === "telemetry" && (
                <motion.div
                  key="telemetry-feed"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full space-y-6"
                >
                  <RealtimeUserBrowserInfo profile={profile} />
                </motion.div>
              )}

              {/* HOME VIEW: ECO SOCIAL NETWORK */}
              {activeView === "home" && (
                <motion.div
                  key="home-feed"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  
                  {/* Today's Mission Floating Sticky Card */}
                  <div className="sticky top-4 z-30 bg-[#09090b]/85 border border-white/10 p-4.5 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-black flex items-center gap-1">
                        <Sparkle className="w-3 h-3 animate-spin" /> TODAY'S FEATURED CONSERVATION
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Exp: 11h</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base font-black text-white">🥗 Rescue 2 Fresh Meals</h3>
                        <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed">
                          Divert carbon at source! Claim surplus food packages from local bakeries or organic cafes near you.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-gray-400 uppercase font-mono block">Carbon Offset</span>
                        <span className="text-emerald-400 font-bold font-mono text-xs">2.5kg CO2 Shield</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-white/5">
                      <div className="flex justify-between text-[11px] font-mono text-gray-400">
                        <span>Communal Progress</span>
                        <span>{missionProgress} / 2 complete</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-300" style={{ width: `${(missionProgress / 2) * 100}%` }} />
                      </div>

                      <div className="flex gap-2 mt-2">
                        {missionProgress < 2 ? (
                          <button 
                            onClick={handleCompleteMissionAction}
                            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            Rescue 1 Meal (Simulate)
                          </button>
                        ) : (
                          <button 
                            onClick={handleClaimMissionRewards}
                            disabled={missionClaimed || isClaimingPoints}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              missionClaimed 
                                ? "bg-white/5 border border-white/10 text-gray-500" 
                                : "bg-emerald-500 text-gray-950 hover:bg-emerald-400 font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                            }`}
                          >
                            {missionClaimed ? "Ledger Settled ✓" : "Claim +250 XP & +100 Coins"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Center Primary Action Bar */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex justify-between items-center gap-3">
                    <span className="text-xs text-gray-400">Inspiration & Action ledger</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { audioEngine.playTick(); setShowNewPostModal(true); }}
                        className="py-2 px-4 bg-emerald-500 text-gray-950 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-emerald-400 shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> New Post
                      </button>
                      <button 
                        onClick={() => { audioEngine.playTick(); setShowAddFriendsModal(true); }}
                        className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" /> Add Friends
                      </button>
                    </div>
                  </div>

                  {/* Eco Pulses (Stories) Slider */}
                  <div className="bg-white/[0.01] p-4.5 rounded-3xl border border-white/5">
                    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
                      {COMMUNITY_STORIES.map(story => (
                        <div 
                          key={story.id}
                          onClick={() => { audioEngine.playTick(); setActiveStory(story); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer select-none shrink-0"
                        >
                          <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 shadow-lg transition-transform hover:scale-105">
                            <div className="w-full h-full rounded-full bg-gray-950 border-2 border-gray-950 flex items-center justify-center text-2xl">
                              {story.imageEmoji}
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-300 truncate max-w-[65px] font-mono">{story.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Social Posts Feed */}
                  <div className="space-y-4">
                    {socialPosts.map(post => (
                      <article key={post.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl relative text-left">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg border border-white/10">
                              {post.avatar}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white block">{post.author}</h4>
                              <span className="text-[9px] text-emerald-400/80 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {post.category}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-500 font-mono">Verified Node</span>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed font-light">{post.content}</p>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                          <div className="flex gap-4 text-xs font-mono">
                            <button 
                              onClick={(e) => toggleLikePost(post.id, e)}
                              className={`flex items-center gap-1.5 cursor-pointer ${post.hasLiked ? "text-red-400" : "text-gray-400 hover:text-white"}`}
                            >
                              <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-current" : ""}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-white">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.commentsCount}</span>
                            </button>
                          </div>
                          <button 
                            onClick={(e) => handleJoinCampaign(post.id, e)}
                            className={`py-1.5 px-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                              post.joined 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            {post.joined ? "Joined!" : "Join Mission"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                </motion.div>
              )}

              {/* AI SCAN VIEW */}
              {activeView === "ai_scan" && (
                <motion.div
                  key="view-scan"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Camera className="w-5 h-5 text-teal-400 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Eco AI Scan Portal</h3>
                  </div>

                  <div className="bg-black/50 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden text-center">
                    {isScanning ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[bounce_2s_infinite]" />
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                        <span className="text-xs text-gray-300 font-mono uppercase tracking-wider">Analyzing molecular material structure...</span>
                      </div>
                    ) : scanResult ? (
                      <div className="w-full text-left space-y-3">
                        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <div>
                            <span className="text-[9px] text-emerald-400 uppercase font-mono block">Verified Item</span>
                            <h4 className="text-sm font-black text-white">{scanResult.name}</h4>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-gray-400 block font-mono text-[9px] uppercase">Carbon Saved</span>
                            <span className="text-white font-mono font-bold text-sm">{scanResult.co2}</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-gray-400 block font-mono text-[9px] uppercase">Offset Ledger</span>
                            <span className="text-emerald-400 font-mono font-bold text-sm">+{scanResult.points} Coins</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => claimScanRewards(e)}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all cursor-pointer shadow-lg mt-2"
                        >
                          Log Ledger & Claim Points
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-10 h-10 text-gray-500 mx-auto animate-pulse" />
                        <p className="text-xs text-gray-400 max-w-xs">
                          Trigger camera simulation to automatically identify chemical packaging codes and estimate carbon prevent offsets in real-time.
                        </p>
                        <button 
                          onClick={handleStartScan}
                          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase font-bold tracking-wider cursor-pointer"
                        >
                          Scan Material
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* CIRCULAR EXCHANGE */}
              {activeView === "marketplace" && (
                <motion.div
                  key="view-market"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Circular Exchange</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {marketItems.map(item => (
                      <div key={item.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-3">
                        <span className="text-2xl w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{item.image}</span>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Price: {item.price} Coins</span>
                          <button 
                            onClick={(e) => buyMarketItem(item.id, item.price, item.name, e)}
                            disabled={item.purchased}
                            className={`mt-2 py-1.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              item.purchased 
                                ? "bg-white/5 text-gray-500 border border-white/5" 
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {item.purchased ? "Claimed" : "Exchange"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Post listings form */}
                  <div className="bg-white/[0.01] p-4.5 rounded-2xl border border-white/5 mt-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-400" /> Put Recyclables on Ledger Exchange
                    </h4>
                    <form onSubmit={submitListing} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="e.g. Clean cardboard (10kg)"
                          value={newListingName}
                          onChange={(e) => setNewListingName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                        <select 
                          value={newListingReward}
                          onChange={(e) => setNewListingReward(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                        >
                          <option value="50">50 Coins Reward</option>
                          <option value="100">100 Coins Reward</option>
                          <option value="200">200 Coins Reward</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all">
                        Post Listing to Exchange
                      </button>
                    </form>
                  </div>

                  {/* Active Community Material Exchange Ledger */}
                  <div className="bg-white/[0.01] p-4.5 rounded-2xl border border-white/5 mt-4 text-left space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Active Communal Exchange Listings
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Supabase Synced</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userListings.map((l) => (
                        <div key={l.id} className="p-3 bg-black/40 border border-white/10 rounded-xl flex justify-between items-center">
                          <div>
                            <h5 className="text-xs font-bold text-white">{l.name}</h5>
                            <span className="text-[10px] text-emerald-400 font-mono block font-bold">+{l.reward} EcoPoints</span>
                          </div>
                          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-lg font-bold">
                            {l.status}
                          </span>
                        </div>
                      ))}
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex justify-between items-center">
                        <div>
                          <h5 className="text-xs font-bold text-white">PET Plastic Bottles (8kg)</h5>
                          <span className="text-[10px] text-emerald-400 font-mono block font-bold">+180 EcoPoints</span>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-lg font-bold">
                          Active
                        </span>
                      </div>
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex justify-between items-center">
                        <div>
                          <h5 className="text-xs font-bold text-white">Copper Wiring Scrap (2kg)</h5>
                          <span className="text-[10px] text-emerald-400 font-mono block font-bold">+250 EcoPoints</span>
                        </div>
                        <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono rounded-lg font-bold">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Material Lifecycle & Carbon Savings Analytics Grid */}
                  <div className="bg-[#0b101c]/90 border border-emerald-500/20 p-4.5 rounded-2xl text-left space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Circular Material Lifespan Impact
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                      <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-gray-400 uppercase block">Aluminum</span>
                        <span className="text-emerald-400 font-bold">95% Saved</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-gray-400 uppercase block">Glass Bottle</span>
                        <span className="text-teal-300 font-bold">100% Recyclable</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-gray-400 uppercase block">Cardboard</span>
                        <span className="text-amber-400 font-bold">4.2kg CO2 Off</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
                        <span className="text-[9px] text-gray-400 uppercase block">E-Waste</span>
                        <span className="text-purple-300 font-bold">Toxic Safeguard</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FOOD RESCUE VIEW */}
              {activeView === "food_rescue" && (
                <motion.div
                  key="view-food"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-black uppercase tracking-wider font-mono">Food Rescue Ledger</h3>
                    </div>
                    <button 
                      onClick={() => { audioEngine.playTick(); setShowNewDonationModal(true); }}
                      className="py-1.5 px-3 bg-emerald-500 text-gray-950 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + Post Donation
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-xs text-gray-500 font-mono">Syncing Food Ledger...</div>
                  ) : foodDonations.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-500 font-mono">No active food donations found. Be the first to donate!</div>
                  ) : (
                    <div className="space-y-3">
                      {foodDonations.map(donation => {
                        const isClaimed = donation.status !== "PENDING";
                        return (
                          <div key={donation.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">{donation.donor_username || "Pioneer Donor"}</span>
                                <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 font-mono">{donation.food_type}</span>
                                <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 font-mono">{donation.quality_status}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white">{donation.title} ({donation.quantity})</h4>
                              <p className="text-[11px] text-gray-400 font-light">{donation.description}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-500 font-mono">
                                <span>📍 {donation.pickup_address}</span>
                                <span className="text-amber-500/80">⏳ Exp: {new Date(donation.expiry_time).toLocaleString()}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => handleClaimFoodDonation(donation.id, donation.title, e)}
                              disabled={isClaimed}
                              className={`py-2 px-4 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                                isClaimed 
                                  ? "bg-white/5 text-gray-500 border border-white/5" 
                                  : "bg-emerald-500 text-gray-950 hover:bg-emerald-400"
                              }`}
                            >
                              {isClaimed ? `Claimed by ${donation.assigned_ngo_username || "NGO"}` : "Rescue Meal"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* WASTE REPORTS VIEW */}
              {activeView === "waste_reports" && (
                <motion.div
                  key="view-waste"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-teal-400" />
                      <h3 className="text-sm font-black uppercase tracking-wider font-mono">Waste Report Ledger</h3>
                    </div>
                    <button 
                      onClick={() => { audioEngine.playTick(); setShowNewReportModal(true); }}
                      className="py-1.5 px-3 bg-teal-500 text-gray-950 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + File Report
                    </button>
                  </div>

                  {/* Filters bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/[0.01] p-3 rounded-2xl border border-white/5">
                    <select
                      value={activeReportFilter.category}
                      onChange={(e) => setActiveReportFilter(prev => ({ ...prev, category: e.target.value }))}
                      className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="PLASTIC">Plastic</option>
                      <option value="PAPER">Paper</option>
                      <option value="METAL">Metal</option>
                      <option value="GLASS">Glass</option>
                      <option value="ORGANIC">Organic</option>
                      <option value="E_WASTE">E-Waste</option>
                      <option value="OTHER">Other</option>
                    </select>

                    <select
                      value={activeReportFilter.status}
                      onChange={(e) => setActiveReportFilter(prev => ({ ...prev, status: e.target.value }))}
                      className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="COLLECTED">Collected</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    <select
                      value={activeReportFilter.priority}
                      onChange={(e) => setActiveReportFilter(prev => ({ ...prev, priority: e.target.value }))}
                      className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
                    >
                      <option value="">All Priorities</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={activeReportFilter.search}
                      onChange={(e) => setActiveReportFilter(prev => ({ ...prev, search: e.target.value }))}
                      className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
                    />
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-xs text-gray-500 font-mono">Syncing Waste Ledger...</div>
                  ) : wasteReports.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-500 font-mono">No matching waste reports found.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wasteReports.map(report => {
                        const imageSrc = report.image 
                          ? (report.image.startsWith("http") ? report.image : `http://localhost:8000${report.image}`)
                          : null;
                        return (
                          <div 
                            key={report.id} 
                            onClick={() => { audioEngine.playTick(); setSelectedReport(report); }}
                            className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between text-left"
                          >
                            {imageSrc && (
                              <div className="h-32 w-full overflow-hidden relative">
                                <img src={imageSrc} alt={report.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] text-teal-400 font-mono">
                                  {report.category}
                                </div>
                              </div>
                            )}
                            <div className="p-3.5 space-y-1.5 flex-grow">
                              <h4 className="text-xs font-bold text-white line-clamp-1">{report.title}</h4>
                              <p className="text-[10px] text-gray-400 line-clamp-2 font-light">{report.description}</p>
                              <div className="flex justify-between items-center text-[8px] font-mono mt-1">
                                <span className={`px-2 py-0.5 rounded-full ${
                                  report.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                                  report.status === "ASSIGNED" ? "bg-blue-500/10 text-blue-400" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {report.status}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  report.priority === "CRITICAL" ? "bg-red-500/20 text-red-400 font-black" :
                                  report.priority === "HIGH" ? "bg-orange-500/15 text-orange-400" :
                                  "bg-gray-500/10 text-gray-400"
                                }`}>
                                  {report.priority}
                                </span>
                              </div>
                            </div>
                            <div className="px-3.5 py-2 border-t border-white/5 text-[9px] text-gray-500 font-mono truncate">
                              📍 {report.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ENVIRONMENTAL INTELLIGENCE & QUIZ */}
              {activeView === "awareness" && (
                <motion.div
                  key="view-intel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Environmental Intelligence</h3>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold">Carbon Prevented trend (weekly)</span>
                    <div className="h-28 w-full mt-3 flex items-end relative overflow-hidden border-b border-white/10">
                      <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <path d="M 0 80 Q 50 60 100 70 T 200 30 T 300 15" fill="none" stroke="#10b981" strokeWidth="3" />
                      </svg>
                      <div className="absolute inset-x-0 bottom-1 flex justify-between text-[8px] font-mono text-gray-500">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro quiz */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-mono font-bold block mb-2">Weekly Micro-Quiz Trivia</span>
                    <p className="text-xs font-bold text-white mb-3">{quizQuestion.q}</p>
                    <div className="space-y-2">
                      {quizQuestion.options.map((opt, idx) => {
                        const isCorrect = idx === quizQuestion.correctIndex;
                        const isSelected = selectedQuizOption === idx;
                        let btnBg = "bg-white/[0.02] border-white/5";
                        if (quizAnswered) {
                          if (isCorrect) btnBg = "bg-emerald-500/10 border-emerald-400/30 text-emerald-400 font-bold";
                          else if (isSelected) btnBg = "bg-red-500/10 border-red-500/20 text-red-400";
                          else btnBg = "bg-white/[0.01] border-white/5 opacity-55";
                        }
                        return (
                          <button 
                            key={idx}
                            onClick={(e) => answerQuiz(idx, e)}
                            disabled={quizAnswered}
                            className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnBg}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizAnswered && (
                      <p className="mt-3 bg-white/[0.03] p-3 rounded-xl border border-white/5 text-[10px] text-gray-300 leading-relaxed font-light">
                        <strong>💡 Explanation:</strong> {quizQuestion.explanation}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MISSIONS HUB */}
              {activeView === "missions" && (
                <motion.div
                  key="view-missions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Missions & Duty Hub</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: "Circular Economy Deposit", desc: "List 1 aluminum or scrap packaging container on the local exchange.", reward: "+120 Coins", done: userListings.length > 1 },
                      { title: "Ocean Guard Volunteer", desc: "RSVP to participate in Saturday creek plastics sweep.", reward: "+300 XP / Stamp Unlocked", done: passportStamps[3].unlocked },
                      { title: "Environmental Mastermind", desc: "Clear the weekly environmental quiz with a perfect ledger score.", reward: "+100 Coins / +150 XP", done: quizAnswered && selectedQuizOption === quizQuestion.correctIndex }
                    ].map((mis, idx) => (
                      <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            {mis.done ? "✓" : "⚡"} {mis.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1">{mis.desc}</p>
                          <span className="text-[9px] text-emerald-400 font-mono font-bold block mt-1.5">{mis.reward}</span>
                        </div>
                        {mis.done ? (
                          <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">Settled</span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase bg-white/5 text-gray-400 border border-white/5 px-2 py-1 rounded-lg">Active</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ECO COMMUNITY */}
              {activeView === "eco_social" && (
                <motion.div
                  key="view-community"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Eco Community Campaigns</h3>
                  </div>

                  <div className="bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20 p-5 rounded-2xl">
                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 block">Featured Global Campaign</span>
                    <h4 className="text-sm font-bold text-white mt-1">Beach & Creek Plastics Rescue sweep</h4>
                    <p className="text-xs text-gray-300 mt-1 font-light leading-relaxed">This Saturday, 09:00 AM @ North Harbour Coordinates. Verified +500 XP stamp for all participants.</p>
                    <button 
                      onClick={(e) => {
                        audioEngine.playSuccessChime();
                        triggerPointsFloater("RSVP Registered! 🎫", e);
                        setPassportStamps(prev => prev.map(s => s.id === "s4" ? { ...s, unlocked: true, date: "Jul 2026" } : s));
                      }}
                      className="mt-3.5 py-2 px-4 bg-emerald-500 text-gray-950 font-black text-[10px] uppercase tracking-wider rounded-xl hover:scale-105 transition-all cursor-pointer"
                    >
                      RSVP & Reserve Stamp
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ECO PASSPORT */}
              {activeView === "passport" && (
                <motion.div
                  key="view-passport"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Verified Eco Passport</h3>
                  </div>

                  <div className="bg-gradient-to-b from-[#1b1712] to-[#110e0a] border border-amber-500/20 p-5 rounded-2xl relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{profile?.username || "Iniya"}</h4>
                        <span className="text-[9px] text-amber-400 font-mono">EcoID: #EV-2026-9481</span>
                      </div>
                      <Shield className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] font-mono">
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-500 block uppercase text-[8px]">Carbon Offsets</span>
                        <span className="text-emerald-400 font-bold">185.4 kg CO2</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-500 block uppercase text-[8px]">Water Saved</span>
                        <span className="text-cyan-400 font-bold">1,204 Liters</span>
                      </div>
                    </div>

                    <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-mono font-bold block mb-2">Unlocked Gold Foil Stamps</span>
                    <div className="grid grid-cols-4 gap-2">
                      {passportStamps.map(st => (
                        <div 
                          key={st.id} 
                          className={`p-2 rounded-xl text-center border transition-all ${
                            st.unlocked ? "bg-[#3e2307]/20 border-amber-500/20 text-amber-200" : "bg-black/40 border-white/5 opacity-30 grayscale"
                          }`}
                        >
                          <span className="text-lg block">{st.emoji}</span>
                          <span className="text-[8px] font-bold block truncate mt-1">{st.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { audioEngine.playSuccessChime(); alert("Weekly high-fidelity certificate ledger downloaded! 📜"); }}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Download Printable Certificate
                  </button>
                </motion.div>
              )}

              {/* REWARDS VAULT */}
              {activeView === "rewards" && (
                <motion.div
                  key="view-rewards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Coins className="w-5 h-5 text-amber-400 animate-spin" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Rewards & Recognition Vault</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {chests.map(chest => (
                      <div key={chest.id} className="p-4 bg-[#09090b] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[135px]">
                        <div>
                          <span className="text-[8px] font-mono uppercase text-amber-400 block">{chest.status === "ready" ? "★ Collectible" : "🔒 Restricted"}</span>
                          <h4 className="text-xs font-bold text-white mt-1">{chest.type}</h4>
                          <p className="text-[9px] text-gray-400 mt-1">{chest.status === "ready" ? "Tap to claim payout" : chest.requirement}</p>
                        </div>
                        {chest.status === "ready" ? (
                          <button 
                            onClick={(e) => openChest(chest.id, e)}
                            disabled={chestOpeningId !== null}
                            className="w-full mt-2 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 rounded-xl text-[9px] font-black uppercase cursor-pointer"
                          >
                            {chestOpeningId === chest.id ? "Opening..." : "Claim Chest"}
                          </button>
                        ) : chest.status === "opened" ? (
                          <span className="text-[9px] font-mono text-center text-emerald-400 bg-emerald-500/5 py-1 rounded-xl block border border-emerald-500/10">Collected ✓</span>
                        ) : (
                          <span className="text-[9px] font-mono text-center text-gray-500 bg-white/5 py-1 rounded-xl block">Locked</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {openedChestResult && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex justify-between items-center">
                      <span>{openedChestResult}</span>
                      <button onClick={() => setOpenedChestResult(null)}><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* AWARENESS HUB */}
              {activeView === "awareness_hub" && (
                <motion.div
                  key="view-hub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Video className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Sustainability Awareness Hub</h3>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { title: "Circular Economy Bio-Shredder Guide", length: "4:15", rating: "★★★★★", desc: "How sorting aluminum and plastics on-chain reduces corporate extraction overhead." },
                      { title: "Methane and Compost Physics", length: "8:30", rating: "★★★★☆", desc: "Scientific breakdown of municipal composting versus toxic atmospheric landfills." },
                      { title: "Sourdough and Food Waste Prevention", length: "3:40", rating: "★★★★★", desc: "Practical tips to divert fresh surplus bakery supplies at zero cost." }
                    ].map((vid, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between gap-4">
                        <div className="text-left flex-1">
                          <h4 className="text-xs font-bold text-white">{vid.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{vid.desc}</p>
                          <div className="flex gap-4 text-[9px] text-gray-500 mt-2 font-mono">
                            <span>Length: {vid.length}</span>
                            <span>Rating: {vid.rating}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => { audioEngine.playSuccessChime(); triggerPointsFloater("+20 XP Learned! 📚"); }}
                          className="py-1.5 px-3.5 bg-emerald-500 text-gray-950 font-black rounded-xl text-[9px] uppercase hover:scale-105 transition-all self-center shrink-0 cursor-pointer"
                        >
                          Watch Video
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ECO AI IMMERSIVE CHAT */}
              {activeView === "eco_ai" && (
                <motion.div
                  key="view-ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl text-left flex flex-col h-[480px]"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-amber-400 animate-spin" />
                      <span className="text-xs font-black uppercase tracking-wider font-mono">ECO AI Companion Chat</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono">Active</span>
                  </div>

                  {/* Chat message viewport */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
                    {aiChatMessages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed font-light ${
                            m.sender === "user" 
                              ? "bg-emerald-500 text-gray-950 font-medium rounded-tr-none" 
                              : "bg-white/5 border border-white/5 text-gray-100 rounded-tl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/5 p-2 rounded-2xl text-[10px] text-gray-400 animate-pulse">
                          Eco is analyzing environmental logs...
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendAiChat} className="mt-3 flex gap-2 pt-3 border-t border-white/5">
                    <input 
                      type="text" 
                      placeholder="Ask Eco about carbon, recycling, composting..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                    <button type="submit" className="p-2.5 bg-amber-500 text-gray-950 rounded-xl hover:bg-amber-400 cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* SETTINGS */}
              {activeView === "settings" && (
                <motion.div
                  key="view-settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Settings className="w-5 h-5 text-gray-400 animate-spin" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">Profile & Node Settings</h3>
                  </div>

                  <div className="space-y-4 text-xs font-light">
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">Interactive Theme Audio Ticks</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Toggle sound effects on clicks and claims</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold">Enabled</span>
                    </div>

                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">Communal Coordinate Sync</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Allow other volunteers to locate nearby rescues</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold">Active</span>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button 
                        onClick={() => { audioEngine.playSuccessChime(); alert("Simulation resets cleared!"); }}
                        className="py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl text-xs uppercase cursor-pointer transition-all"
                      >
                        Reset Local Database
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* RIGHT COLUMN: Community Social sidebar */}
          <RightSidebar
            activeView={activeView}
            chatsData={chatsData}
            activeChatPartner={activeChatPartner}
            onSelectChatPartner={(name) => setActiveChatPartner(name)}
            notifications={notifications}
            onClearNotifications={() => setNotifications([])}
            followingList={followingList}
            onFollowFriend={handleFollowFriend}
            xp={xp}
          />

        </div>
      </main>

      {/* FLOATING ECO MASCOT COMPANION & TOOLTIP SPEECH BUBBLE */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3.5">
        <AnimatePresence>
          {showMascotTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#09090b] border border-white/10 p-3.5 rounded-2xl relative shadow-2xl max-w-xs text-left"
            >
              {/* Triangle speech pointer */}
              <div className="absolute right-6 bottom-[-6px] w-3 h-3 bg-[#09090b] border-r border-b border-white/10 rotate-45" />
              <button 
                onClick={() => setShowMascotTooltip(false)}
                className="absolute top-1 right-1 p-0.5 rounded-full text-gray-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-[11px] text-gray-100 font-light pr-3 leading-relaxed">
                "{companionMessages[companionMsgIndex]}"
              </p>
              <button 
                onClick={rotateCompanionMsg}
                className="mt-1 text-[8px] font-mono uppercase text-amber-400 font-black flex items-center gap-0.5 cursor-pointer"
              >
                Next <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot circular badge trigger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { audioEngine.playTick(); setActiveView("eco_ai"); }}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl border border-white/15 flex items-center justify-center text-white cursor-pointer shadow-[0_8px_32px_rgba(16,185,129,0.3)] animate-pulse relative"
          title="Click to talk to Eco!"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-gray-950 rounded-full" />
              <span className="w-1.5 h-1.5 bg-gray-950 rounded-full" />
            </div>
            <div className="w-2.5 h-1 bg-amber-400 rounded-b-full" />
            <span className="text-[8px] font-extrabold text-emerald-100 font-mono tracking-widest leading-none mt-0.5">ECO</span>
          </div>
        </motion.button>
      </div>

      {/* --- ALL OVERLAY MODALS AND DIALOGS --- */}
      <AnimatePresence>
        
        {/* STORY OVERLAY DIALOG */}
        {activeStory && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-sm rounded-3xl p-5 relative text-left shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-sm border border-white/10">{activeStory.imageEmoji}</div>
                  <div>
                    <span className="text-xs font-bold text-white block">{activeStory.author}</span>
                    <span className="text-[8px] text-gray-500 font-mono">{activeStory.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { audioEngine.playTick(); setActiveStory(null); }}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 min-h-[140px] flex flex-col justify-between">
                <p className="text-xs text-gray-300 leading-relaxed font-light">{activeStory.desc}</p>
                <div className="text-right text-emerald-400 font-mono font-bold text-[10px]">★ Active Champion Action</div>
              </div>

              <div className="mt-4 flex justify-between items-center border-b border-white/5 pb-3">
                <button 
                  onClick={(e) => {
                    audioEngine.playTick();
                    triggerPointsFloater("+1 Story Like ❤️", e);
                    setActiveStory(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                  }}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 cursor-pointer font-mono"
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  <span>{activeStory.likes} Hearts</span>
                </button>
                <span className="text-[9px] text-gray-500 font-mono">{activeStory.comments.length} comments verified</span>
              </div>

              <div className="mt-3.5 space-y-2">
                {activeStory.comments.map((comm, i) => (
                  <div key={i} className="bg-white/[0.01] border border-white/5 p-2 rounded-xl text-[10px] text-gray-300 leading-normal font-light">
                    {comm}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* NEW POST MODAL */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-left shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">Share Environmental Impact</h3>
                <button onClick={() => setShowNewPostModal(false)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Impact Category</label>
                  <select 
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Tree Plantation">Tree Plantation Drive 🌳</option>
                    <option value="Food Rescue">Surplus Food Rescue 🍱</option>
                    <option value="Cleanup Drive">Creek / Coast Plastic Sweep 🌊</option>
                    <option value="Zero Waste">Zero Waste Achievement ♻️</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Post Description</label>
                  <textarea 
                    placeholder="Describe your environmental action... e.g. Diverted 5kg cardboard from standard landfill!"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                >
                  Share to Community Feed
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD FRIENDS MODAL */}
        {showAddFriendsModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative text-left shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">Add Friends Coordinates</h3>
                <button onClick={() => setShowAddFriendsModal(false)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Search username, coords, or EcoID..."
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {[
                    { name: "Clara Vance", role: "Communal Composter", id: "#EV-411" },
                    { name: "Leo S.", role: "Scrap Metallurgist", id: "#EV-803" },
                    { name: "Elena G.", role: "Watershed Advocate", id: "#EV-092" }
                  ].filter(u => u.name.toLowerCase().includes(friendSearch.toLowerCase())).map((u, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{u.id} • {u.role}</span>
                      </div>
                      <button 
                        onClick={(e) => { handleAddFriend(u.name, e); }}
                        className="py-1 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg text-[10px] uppercase transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* INTERACTIVE MESSAGE BOX CORNER POPUP */}
        <EcoChatOverlay
          activeChatPartner={activeChatPartner}
          chatsData={chatsData}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onSendChat={handleSendChat}
          onClose={() => setActiveChatPartner(null)}
        />

        {/* WASTE REPORT DETAIL DIALOG */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-lg rounded-3xl p-6 relative text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500" />
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] text-teal-400 font-mono uppercase font-bold block">{selectedReport.category} REPORT</span>
                  <h3 className="text-sm font-black text-white">{selectedReport.title}</h3>
                </div>
                <button 
                  onClick={() => { audioEngine.playTick(); setSelectedReport(null); }}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Images comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedReport.image && (
                  <div className="space-y-1">
                    <span className="text-[8px] text-gray-500 font-mono uppercase block">Before Cleanup</span>
                    <img 
                      src={selectedReport.image.startsWith("http") ? selectedReport.image : `http://localhost:8000${selectedReport.image}`} 
                      alt="Before" 
                      className="w-full h-32 object-cover rounded-xl border border-white/5" 
                    />
                  </div>
                )}
                {selectedReport.after_image && (
                  <div className="space-y-1">
                    <span className="text-[8px] text-emerald-400 font-mono uppercase block">After Cleanup</span>
                    <img 
                      src={selectedReport.after_image.startsWith("http") ? selectedReport.after_image : `http://localhost:8000${selectedReport.after_image}`} 
                      alt="After" 
                      className="w-full h-32 object-cover rounded-xl border border-white/5" 
                    />
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 bg-white/[0.01] p-3 rounded-2xl border border-white/5 text-[11px]">
                <div>
                  <span className="text-gray-500 block font-mono text-[9px] uppercase">Reporter</span>
                  <span className="text-white font-medium">{selectedReport.user_username || "Citizen"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-mono text-[9px] uppercase">Location</span>
                  <span className="text-white font-medium">{selectedReport.location}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-mono text-[9px] uppercase">Status</span>
                  <span className="text-white font-medium">{selectedReport.status}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-mono text-[9px] uppercase">Priority</span>
                  <span className="text-white font-medium">{selectedReport.priority}</span>
                </div>
                {selectedReport.assigned_municipality_username && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block font-mono text-[9px] uppercase">Assigned Municipality</span>
                    <span className="text-teal-400 font-medium">{selectedReport.assigned_municipality_username}</span>
                  </div>
                )}
                {selectedReport.assigned_volunteer_username && (
                  <div className="col-span-2">
                    <span className="text-gray-500 block font-mono text-[9px] uppercase">Assigned Volunteer</span>
                    <span className="text-teal-400 font-medium">{selectedReport.assigned_volunteer_username}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {selectedReport.status === "ASSIGNED" && (
                  <button 
                    onClick={() => { audioEngine.playTick(); setShowCompleteCleanupModal(true); }}
                    className="flex-1 py-2 bg-emerald-500 text-gray-950 rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    Mark Cleaned
                  </button>
                )}
                {profile && selectedReport.user_username === profile.username && (
                  <button 
                    onClick={() => deleteWasteReport(selectedReport.id)}
                    className="py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    Delete Report
                  </button>
                )}
              </div>

              {/* Rating Section */}
              {selectedReport.status === "COMPLETED" && (
                <div className="bg-white/[0.01] p-3 rounded-2xl border border-white/5 text-[11px] space-y-2">
                  <span className="text-[9px] text-amber-400 font-mono uppercase font-bold block">Cleanup Rating</span>
                  {selectedReport.rating ? (
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        {"★".repeat(selectedReport.rating.rating)}
                        {"☆".repeat(5 - selectedReport.rating.rating)}
                      </div>
                      <p className="text-gray-300 font-light mt-1">{selectedReport.rating.feedback || "No feedback left."}</p>
                    </div>
                  ) : profile && selectedReport.user_username === profile.username ? (
                    <form onSubmit={submitRating} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Score:</span>
                        <select 
                          value={newRatingValue} 
                          onChange={(e) => setNewRatingValue(parseInt(e.target.value))}
                          className="bg-black border border-white/10 rounded-lg px-2 py-1 text-white"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Leave feedback on cleanup quality..."
                        value={newRatingFeedback}
                        onChange={(e) => setNewRatingFeedback(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <button type="submit" className="py-1 px-3 bg-amber-500 text-gray-950 rounded-lg text-[10px] font-bold uppercase">Submit Rating</button>
                    </form>
                  ) : (
                    <span className="text-gray-500 italic">Pending rating by citizen reporter.</span>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="text-[9px] text-teal-400 font-mono uppercase font-bold block">Comments ({selectedReport.comments?.length || 0})</span>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {selectedReport.comments?.map((comment: any) => (
                    <div key={comment.id} className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] text-gray-300">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-white">{comment.username}</strong>
                        <span className="text-gray-500 font-mono text-[8px]">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-light">{comment.content}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={submitComment} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  />
                  <button type="submit" className="py-2 px-4 bg-teal-500 text-gray-950 rounded-xl text-xs font-bold uppercase">Send</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* NEW FOOD DONATION MODAL */}
        {showNewDonationModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-left shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">Post Food Donation</h3>
                <button onClick={() => setShowNewDonationModal(false)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={submitFoodDonation} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Donation Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fresh Veggie Pasta Bowls"
                    value={newDonationTitle}
                    onChange={(e) => setNewDonationTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    placeholder="Describe ingredients or allergen information..."
                    value={newDonationDesc}
                    onChange={(e) => setNewDonationDesc(e.target.value)}
                    className="w-full h-16 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Food Type</label>
                    <select 
                      value={newDonationType}
                      onChange={(e) => setNewDonationType(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      <option value="COOKED">Cooked Meals</option>
                      <option value="PACKAGED">Packaged Food</option>
                      <option value="RAW_INGREDIENTS">Raw Ingredients</option>
                      <option value="FRUITS_VEG">Fruits & Vegetables</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Quantity</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 15 plates"
                      value={newDonationQty}
                      onChange={(e) => setNewDonationQty(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Quality Status</label>
                    <select 
                      value={newDonationQuality}
                      onChange={(e) => setNewDonationQuality(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="EXCELLENT">Excellent (Fresh)</option>
                      <option value="GOOD">Good (Safe)</option>
                      <option value="FAIR">Fair (Consume ASAP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Hours to Expiration</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newDonationHours}
                      onChange={(e) => setNewDonationHours(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Pickup Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 123 Eco Way, Green City"
                    value={newDonationAddress}
                    onChange={(e) => setNewDonationAddress(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                >
                  {loading ? "Posting..." : "Post Food Donation"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* NEW WASTE REPORT MODAL */}
        {showNewReportModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-left shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-teal-400">File Waste Report</h3>
                <button onClick={() => setShowNewReportModal(false)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={submitWasteReport} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Report Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Plastic dump near park entry"
                    value={newReportTitle}
                    onChange={(e) => setNewReportTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    placeholder="Describe details (e.g., amount of waste, accessibility)..."
                    value={newReportDesc}
                    onChange={(e) => setNewReportDesc(e.target.value)}
                    className="w-full h-16 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                    <select 
                      value={newReportCategory}
                      onChange={(e) => setNewReportCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                    >
                      <option value="PLASTIC">Plastic</option>
                      <option value="PAPER">Paper</option>
                      <option value="METAL">Metal</option>
                      <option value="GLASS">Glass</option>
                      <option value="ORGANIC">Organic</option>
                      <option value="E_WASTE">E-Waste</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Priority</label>
                    <select 
                      value={newReportPriority}
                      onChange={(e) => setNewReportPriority(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Location Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Corner of Oak and 4th Street"
                    value={newReportLocation}
                    onChange={(e) => setNewReportLocation(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Upload Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setNewReportImage(files[0]);
                      }
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                >
                  {loading ? "Filing..." : "Submit Waste Report"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* COMPLETE CLEANUP MODAL */}
        {showCompleteCleanupModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#09090b] border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-left shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">Complete Cleanup Verification</h3>
                <button onClick={() => setShowCompleteCleanupModal(false)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={submitCompleteCleanup} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Upload Cleanup Proof (Photo)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setCleanupAfterImage(files[0]);
                      }
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Cleanup Notes</label>
                  <textarea 
                    placeholder="Describe notes (e.g. all plastic bag collections sorted in recycle node)..."
                    value={cleanupNotes}
                    onChange={(e) => setCleanupNotes(e.target.value)}
                    className="w-full h-16 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                >
                  {loading ? "Completing..." : "Submit Proof & Verify"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
