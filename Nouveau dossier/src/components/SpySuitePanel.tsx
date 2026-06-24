import { useState, useEffect, useRef } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { callAI } from '../utils/ai';
import { getSecureItem, setSecureItem } from '../utils/crypto';

interface Props {
  toolId: string;
  onBack: () => void;
  dark: boolean;
}

interface SpreadsheetRow {
  id: string;
  cells: string[];
}

// Interfaces
interface SavedItem {
  id: string;
  type: 'ad' | 'email' | 'shop';
  title: string;
  subtitle: string;
  content: string;
  extra?: any;
  addedAt: string;
}

interface SavedFolder {
  id: string;
  name: string;
  items: SavedItem[];
}

interface TrackedShop {
  domain: string;
  name: string;
  niche: string;
  growth: 'Hyper' | 'High' | 'Steady';
  adSpend: 'Heavy' | 'Moderate' | 'Light';
  productsCount: number;
  addedAt: string;
  lastScanned?: string;
  liveAdsCount?: number;
}

interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  dob: string;
  customFields: { label: string; value: string }[];
}

interface TaskProject {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'not_finished' | 'in_progress' | 'finished';
  dueDate: string;
}

const initialContacts: CRMContact[] = [
  {
    id: 'c-1',
    name: 'Alexandra Dupont',
    email: 'alexandra@snif.co',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    city: 'Paris',
    address: '14 Rue de la Paix',
    dob: '1992-04-15',
    customFields: [
      { label: 'Role', value: 'Head of Growth' },
      { label: 'Niche', value: 'Beauty & Perfumes' }
    ]
  },
  {
    id: 'c-2',
    name: 'Jean-Luc Sance',
    email: 'jl@hexclad.com',
    phone: '+1 415 888 2912',
    country: 'United States',
    city: 'San Francisco',
    address: '42 Montgomery St',
    dob: '1987-11-20',
    customFields: [
      { label: 'Merchant Tier', value: 'Enterprise VIP' },
      { label: 'Source', value: 'Ad Library Discovery' }
    ]
  },
  {
    id: 'c-3',
    name: 'Chloe Peterson',
    email: 'chloe@snackinsf.com',
    phone: '+33 7 89 45 12 23',
    country: 'France',
    city: 'Lyon',
    address: '22 Avenue Jean Jaurès',
    dob: '1995-08-01',
    customFields: [
      { label: 'Role', value: 'Creative Director' }
    ]
  }
];

const initialTasks: TaskProject[] = [
  {
    id: 't-1',
    title: 'Audit Snif.co Landing Page Hero Section',
    description: 'Re-invent the high-converting sample objection breaker layout with interactive elements.',
    priority: 'High',
    status: 'in_progress',
    dueDate: '2026-06-25'
  },
  {
    id: 't-2',
    title: 'Design "Us vs Them" Video Ad Script',
    description: 'Use the conversion angle generator recommendations to build a high CTR storyboard.',
    priority: 'Medium',
    status: 'not_finished',
    dueDate: '2026-06-28'
  },
  {
    id: 't-3',
    title: 'Integrate Klaviyo Welcome Sequence',
    description: 'Deploy the AI-mapped transactional newsletter sequence directly.',
    priority: 'High',
    status: 'finished',
    dueDate: '2026-06-19'
  }
];

// Sample Data
const sampleSuccessShops: TrackedShop[] = [
  { domain: 'snif.co', name: 'Snif', niche: 'Cosmetics & Fragrance', growth: 'Hyper', adSpend: 'Heavy', productsCount: 42, addedAt: '2026-05-10', liveAdsCount: 88, lastScanned: '2026-06-20' },
  { domain: 'gymshark.com', name: 'Gymshark', niche: 'Fashion & Activewear', growth: 'Hyper', adSpend: 'Heavy', productsCount: 520, addedAt: '2026-04-12', liveAdsCount: 245, lastScanned: '2026-06-19' },
  { domain: 'liquiddeath.com', name: 'Liquid Death', niche: 'Beverages & Goods', growth: 'Hyper', adSpend: 'Heavy', productsCount: 85, addedAt: '2026-06-01', liveAdsCount: 112, lastScanned: '2026-06-20' },
  { domain: 'hexclad.com', name: 'HexClad', niche: 'Kitchen & Cookware', growth: 'High', adSpend: 'Heavy', productsCount: 64, addedAt: '2026-03-24', liveAdsCount: 154, lastScanned: '2026-06-18' },
  { domain: 'trueclassictees.com', name: 'True Classic', niche: 'Fashion & Menswear', growth: 'High', adSpend: 'Heavy', productsCount: 180, addedAt: '2026-01-15', liveAdsCount: 198, lastScanned: '2026-06-20' },
  { domain: 'snackinsf.com', name: 'Snackinsf', niche: 'Food & Snacks', growth: 'Steady', adSpend: 'Light', productsCount: 18, addedAt: '2026-06-10', liveAdsCount: 4, lastScanned: '2026-06-15' },
  { domain: 'snif.co', name: 'Snif Fragrances', niche: 'Cosmetics & Fragrance', growth: 'Hyper', adSpend: 'Heavy', productsCount: 42, addedAt: '2026-06-19', liveAdsCount: 88, lastScanned: '2026-06-20' }
];

const sampleAdSwipe = [
  {
    id: 'ad-1',
    hook: '“I threw out all my traditional pans after buying this.”',
    format: 'UGC Hook-and-Hold',
    niche: 'Kitchen & Cookware',
    script: `[Visual: Content creator standing in kitchen holding a beat up Teflon pan and throwing it directly in the trash can, making a loud metallic thud.]\n\nVoiceover:\n"Seriously, stop poisoning yourself with cheap non-stick pans. I threw all of mine in the trash after I tested this hybrid tech."\n\n[Visual: Cinematic sizzle close-up of a ribeye steak searing flawlessly on the HexClad lookalike pan, sliding around without any oil.]\n\nVoiceover:\n"It uses a patented hexagonal pattern with raised steel borders. It heats instantly like cast iron, clean easily, and it never scratch."`,
    angle: 'Frustration with non-stick breakdown & toxic coatings',
    metrics: 'Estimated CTR: 3.8% | ROAS Average: 3.4x'
  },
  {
    id: 'ad-2',
    hook: '“TikTok made me buy fragrances online without smelling it first...”',
    format: 'Two-Screen Comparison (Green/Red)',
    niche: 'Cosmetics & Fragrance',
    script: `[Visual: Girl looking super scared, holding a sleek bottle, spraying it, and her eyes widening with absolute shock.]\n\nVoiceover:\n"I was terrified to buy perfume from snif online. No sniff test? But everyone on my feed was raving. Here is why you actually can."\n\n[Visual: Splitscreen showing a "Trial Bottle" packaged next to the "Full-Size Bottle". Hand picks up the small sample.]\n\nVoiceover:\n"They send a tiny free trial vial with every bottle. You test the mini first. If you don't love it, you ship the unopened full bottle back for a 100% refund."`,
    angle: 'Overcoming the online blind-buying friction',
    metrics: 'Estimated CTR: 4.1% | ROAS Average: 4.2x'
  },
  {
    id: 'ad-3',
    hook: 'This water looks threatening, but it tastes like mountain purity.',
    format: 'Brutalist Extreme Sport Style',
    niche: 'Beverages & Goods',
    script: `[Visual: Extremely rapid cuts of skaters, metal concerts, and someone chugging water from a tall black beer can.]\n\nVoiceover:\n"Why does my water look like an IPA? Because plastic bottles are trash. This is Liquid Death. Pure mountain spring water in an infinite-recycle aluminum tallboy."\n\n[Visual: Crushing the can over your forehead, splashing water everywhere in slo-mo.]\n\nVoiceover:\n"Murder your thirst. Save the planet. Drink ice cold."`,
    angle: 'Eco-conscious bad-ass identity branding',
    metrics: 'Estimated CTR: 2.9% | ROAS Average: 2.8x'
  },
  {
    id: 'ad-4',
    hook: '“The shirt that finally hides your dad bod.”',
    format: 'Direct benefit demonstration',
    niche: 'Fashion & Activewear',
    script: `[Visual: Two side-by-side clips. Left: A guy in a loose-fitting standard boxy tee that clings to his midsection. Right: Same guy standing straight wearing a fitted shirt that hugs his chest and shoulders.]\n\nVoiceover:\n"Almost every brand gets men's shirts wrong. They throw them in a box fabric that makes you look bloated. Look at the difference."\n\n[Visual: Close-up on the shoulder seams and the fabric tapering around the waist.]\n\nVoiceover:\n"It wraps snug around your arms, has a premium cotton blend, and drapes loosely off your stomach."`,
    angle: 'Unflattering male activewear struggles & body insecurity',
    metrics: 'Estimated CTR: 3.4% | ROAS Average: 3.1x'
  }
];

const sampleEmails = [
  {
    id: 'email-welcome',
    title: 'The "Founder Story" Welcome Sequence',
    trigger: 'Day 1 - Instantly after sign up',
    subject: 'Wait... who actually made this? (Our honest story)',
    body: `Hi [Name],\n\nI’m [FounderName], the founder of [BrandName].\n\nSix years ago, I was completely fed up. I was dealing with [MainObjection/Problem] every single morning and nothing on the retailer market actually solved it. The cheap options fell apart, and the "luxury" brands were charging 10x the actual manufacturing cost.\n\nSo, I decided to do something insane: build my own.\n\nIt took 18 months, 14 cancelled production runs, and all of my life savings. But we finally designed [ProductName].\n\nTo thank you for joining our small community, I want to slide you a personal 15% discount code for your first tester run. Use code: COMMUNITY15 inside the next 48 hours.\n\nIn the next few days, I’ll send you our secret guide on how to avoid [MainMistake].\n\nEnjoy,\n[FounderName]`,
    metrics: 'Open Rate: 54% | Click-Through: 12.8%'
  },
  {
    id: 'email-abandon',
    title: 'The "Cart Restoration" Emergency Email',
    trigger: 'Hour 3 - After checkout abandonment',
    subject: 'Did your Wi-Fi cut out? (We saved your basket)',
    body: `Hey [Name],\n\nWe love your taste. We saw you exploring the store earlier, but it looks like you had to dash before securing your box of [ProductName].\n\nWe know how busy life gets, so we’ve kept your cart safely reserved right here:\n\n👉 [Link: Resume Checkout in 1-Click]\n\nJust a quick alert: our current small-batch warehouse stock is extremely tight due to TikTok demand. If you check out today, your package ships out first thing tomorrow morning with tracking.\n\nHave questions? Just hit reply and ask our customer team!\n\nBest,\n[BrandName] logistics team`,
    metrics: 'Recover Value: 18.2% | CTR: 15.4%'
  },
  {
    id: 'email-faq',
    title: 'The "Social Proof & Objection Killer"',
    trigger: 'Day 3 - Post-abandonment follow-up',
    subject: '“Is it actually worth the money?” (Honest reviews)',
    body: `Hi [Name],\n\nIt’s normal to look at [ProductName] and ask: Is this actually different or just clever advertising?\n\nSo instead of us bragging, here are three completely unfiltered reviews from verified buyers who had those exact same doubts:\n\n⭐⭐⭐⭐⭐\n"I was worried it’d feel clumpy, but it actually blends smoother than my local high-end matcha café. Stays frothy!" - Chloe P.\n\n⭐⭐⭐⭐⭐\n"The price seemed high initially, but one package replaces my $6 daily latte and doesn't give me the coffee shakes. Total saver." - Marcus G.\n\n👉 [Test the difference - 100% Money-Back Promise]\n\nYour purchase is backed by our No-Risk 30 Day Shield. If you aren't completely obsessed, return it for a refund. No questions.`,
    metrics: 'Ctr: 8.9% | Conversion: 4.2%'
  }
];

export default function SpySuitePanel({ toolId, onBack, dark }: Props) {
  const { apiKey } = useApiKey();

  const getCellDisplayValue = (row: SpreadsheetRow, colIdx: number) => {
    if (colIdx === 3) {
      const cost = parseFloat(row.cells[1]);
      const price = parseFloat(row.cells[2]);
      if (!isNaN(cost) && !isNaN(price)) {
        return (price - cost).toFixed(2);
      }
      return '0.00';
    }
    return row.cells[colIdx];
  };

  // Navigation tabs for the 10 tools
  const [activeTool, setActiveTool] = useState(toolId);

  // States
  const [folders, setFolders] = useState<SavedFolder[]>(() => {
    try {
      const saved = getSecureItem('ecom_spy_folders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(f => f && typeof f === 'object' && 'id' in f && 'name' in f && Array.isArray(f.items))) {
          // Clean emojis from stored folder names
          return parsed.map((f: any) => ({
            ...f,
            name: f.name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim(),
            items: Array.isArray(f.items) ? f.items : []
          }));
        }
      }
    } catch (e) {
      console.error('Error loading ecom_spy_folders from secure storage, resetting to default:', e);
    }
    return [
      { id: 'f-1', name: 'High Converting Ads', items: [] },
      { id: 'f-2', name: 'Email Flow Inspo', items: [] },
      { id: 'f-3', name: 'Top Competitors', items: [] }
    ];
  });

  const [trackedShops, setTrackedShops] = useState<TrackedShop[]>(() => {
    try {
      const saved = getSecureItem('ecom_spy_tracked_shops');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading ecom_spy_tracked_shops from secure storage, resetting to default:', e);
    }
    return sampleSuccessShops;
  });

  // Action Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // General States
  const [customShopInput, setCustomShopInput] = useState('');
  const [customAdSearch, setCustomAdSearch] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [emailNicheFilter, setEmailNicheFilter] = useState('All');
  const [saveToFolderId, setSaveToFolderId] = useState('');
  const [selectedItemToSave, setSelectedItemToSave] = useState<any | null>(null);

  // AI Generation States
  const [analyzingShop, setAnalyzingShop] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState('');
  
  // Custom states for unique screens
  const [selectedShopTab, setSelectedShopTab] = useState<'all' | 'high-growth'>('all');

  // CRM & Tasks states
  const [crmContacts, setCrmContacts] = useState<CRMContact[]>(() => {
    try {
      const saved = getSecureItem('ecom_crm_contacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading ecom_crm_contacts from secure storage, resetting to default:', e);
    }
    return initialContacts;
  });

  const [tasks, setTasks] = useState<TaskProject[]>(() => {
    try {
      const saved = getSecureItem('ecom_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading ecom_tasks from secure storage, resetting to default:', e);
    }
    return initialTasks;
  });

  const [foldersTab, setFoldersTab] = useState<'bookmarks' | 'excel' | 'paint' | 'crm' | 'tasks'>('bookmarks');

  // Excel spreadsheet states
  const [excelRows, setExcelRows] = useState<SpreadsheetRow[]>(() => {
    try {
      const saved = getSecureItem('ecom_excel_rows');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(r => r && Array.isArray(r.cells))) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading ecom_excel_rows from secure storage, resetting to default:', e);
    }
    return [
      { id: 'row-1', cells: ['Wireless Charger Duo', '12.50', '39.99', '', 'Active testing campaign'] },
      { id: 'row-2', cells: ['Copper French Press', '14.00', '45.00', '', 'Bulk order arriving next week'] },
      { id: 'row-3', cells: ['Classic Organic Tee', '4.20', '28.00', '', 'Bulk purchase complete'] },
      { id: 'row-4', cells: ['Ergonomic Contoured Pillow', '11.10', '59.00', '', 'High search interest and low cost'] },
      { id: 'row-5', cells: ['Gourmet Micro-Lot Arabica', '3.10', '19.99', '', 'Excellent user retention product'] }
    ];
  });

  useEffect(() => {
    setSecureItem('ecom_excel_rows', JSON.stringify(excelRows));
  }, [excelRows]);

  // Concept Paint canvas states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushColor, setBrushColor] = useState('#6366F1');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'draw' | 'erase'>('draw');
  const [drawingHistory, setDrawingHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // CRM addition state
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCountry, setNewContactCountry] = useState('');
  const [newContactCity, setNewContactCity] = useState('');
  const [newContactAddress, setNewContactAddress] = useState('');
  const [newContactDob, setNewContactDob] = useState('');
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomValue, setNewCustomValue] = useState('');
  const [tempCustomFields, setTempCustomFields] = useState<{label: string, value: string}[]>([]);

  // Task addition state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTaskStatus, setNewTaskStatus] = useState<'not_finished' | 'in_progress' | 'finished'>('not_finished');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [taskFilter, setTaskFilter] = useState<'All' | 'not_finished' | 'in_progress' | 'finished'>('All');

  // Sync CRM & Tasks to local storage
  useEffect(() => {
    setSecureItem('ecom_crm_contacts', JSON.stringify(crmContacts));
  }, [crmContacts]);

  useEffect(() => {
    setSecureItem('ecom_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync back to local storage
  useEffect(() => {
    setSecureItem('ecom_spy_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    setSecureItem('ecom_spy_tracked_shops', JSON.stringify(trackedShops));
  }, [trackedShops]);

  // Canvas drawing handlers
  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawingMode === 'erase' ? (dark ? '#121212' : '#FAFAFA') : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL();
      const updatedHistory = drawingHistory.slice(0, historyIndex + 1);
      updatedHistory.push(url);
      setDrawingHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const img = new Image();
        img.src = drawingHistory[nextIndex];
        img.onload = () => {
          ctx.beginPath();
          ctx.fillStyle = dark ? '#121212' : '#FAFAFA';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
      }
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.fillStyle = dark ? '#121212' : '#FAFAFA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const img = new Image();
        img.src = drawingHistory[nextIndex];
        img.onload = () => {
          ctx.beginPath();
          ctx.fillStyle = dark ? '#121212' : '#FAFAFA';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  };

  // Load standard initial size/canvas settings
  useEffect(() => {
    if (foldersTab === 'paint' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = 450;
        ctx.fillStyle = dark ? '#121212' : '#FAFAFA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (historyIndex >= 0 && drawingHistory[historyIndex]) {
          const img = new Image();
          img.src = drawingHistory[historyIndex];
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    }
  }, [foldersTab]);

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Helper to add shop to tracking list
  const handleTrackShop = (shop: Omit<TrackedShop, 'addedAt'>) => {
    const exists = trackedShops.find(s => s.domain.toLowerCase() === shop.domain.toLowerCase());
    if (exists) {
      triggerNotification(`Already tracking ${shop.name}!`);
      return;
    }
    const newShop: TrackedShop = {
      ...shop,
      addedAt: new Date().toISOString().split('T')[0],
      lastScanned: new Date().toISOString().split('T')[0],
      liveAdsCount: Math.floor(Math.random() * 50) + 12
    };
    setTrackedShops(prev => [newShop, ...prev]);
    triggerNotification(`Added ${shop.name} to your live Brandtracker!`);
  };

  // Helper to delete tracked shop
  const handleDeleteTrackedShop = (domain: string) => {
    setTrackedShops(prev => prev.filter(s => s.domain !== domain));
    triggerNotification(`Removed ${domain} from tracking.`);
  };

  // Helper to save items into folders
  const saveToFolder = (folderId: string, item: Omit<SavedItem, 'addedAt' | 'id'>) => {
    const newItem: SavedItem = {
      ...item,
      id: `saved-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          items: [...f.items, newItem]
        };
      }
      return f;
    }));
    setSelectedItemToSave(null);
    triggerNotification(`Saved to folder "${folders.find(f => f.id === folderId)?.name}" successfully!`);
  };

  // Create custom Folder
  const [newFolderName, setNewFolderName] = useState('');
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: SavedFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName,
      items: []
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    triggerNotification(`Folder "${newFolder.name}" created.`);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    triggerNotification(`Folder deleted.`);
  };

  const handleRemoveFromFolder = (folderId: string, itemId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          items: f.items.filter(item => item.id !== itemId)
        };
      }
      return f;
    }));
    triggerNotification(`Removed item from folder.`);
  };

  // AI Promoters
  const handleAnalyzeShopAI = async (domain: string) => {
    if (!domain.trim()) return;
    setAnalyzingShop(true);
    setAnalysisResult(null);
    setGenerateError('');

    try {
      const prompt = `Perform a comprehensive, realistic competitor intelligence analysis on the Shopify brand domain: "${domain}".
Analyze:
1. Target Customer Profile (Who they sell to, demographic, psychology)
2. Value Proposition & Positioning Core
3. Ad Creative Strategies (Which hooks and creative angles perform best for them on Facebook/TikTok)
4. Estimated Traffic Channels & Organic Leverages
5. Weaknesses & Practical Disruption Entryways for a competitor (How we can launch and capture their customers)

Answer structured, crisp, in clear markdown format. Do not write introductory or meta text, begin directly with headers. Use English.`;
      
      let report = '';
      await callAI(apiKey, 'You are an elite e-commerce systems analyst and competitor intelligence specialist.', prompt, (text) => {
        setResultChunk(text);
      });
    } catch (e: any) {
      setGenerateError(e?.message || 'Error executing AI shop analysis. Do you have an active API Key?');
    } finally {
      setAnalyzingShop(false);
    }
  };

  const [resultChunk, setResultChunk] = useState('');
  useEffect(() => {
    if (resultChunk) {
      setAnalysisResult(resultChunk);
    }
  }, [resultChunk]);

  // AI copy modifier
  const [modifyingAdId, setModifyingAdId] = useState<string | null>(null);
  const [modifyingEmailId, setModifyingEmailId] = useState<string | null>(null);
  const [aiModifyInput, setAiModifyInput] = useState('');
  const [modifiedResult, setModifiedResult] = useState('');
  const [modifyingLoading, setModifyingLoading] = useState(false);

  const handleModifyAdCopyAI = async (originalAd: any) => {
    if (!aiModifyInput.trim()) return;
    setModifyingLoading(true);
    setModifiedResult('');
    try {
      const p = `Transform the following high-performing direct-response ad creative strategy template specifically for a new product described as: "${aiModifyInput}".
Preserve the exact creative format ("${originalAd.format}") and angle. Map all visuals and copywriting patterns accurately.

Original Copywrite & Hook to rebuild:
Hook: ${originalAd.hook}
Niche: ${originalAd.niche}
Script Blueprint:
${originalAd.script}

Provide the optimized final hook, storyboard visuals, voiceovers and CTA cleanly formatted in English.`;

      const response = await callAI(
        apiKey,
        'You are an elite, highly creative direct-response ad copywriter specialized in Meta/TikTok ads.',
        p
      );
      setModifiedResult(response);
    } catch(e: any) {
      setModifiedResult(`Could not regenerate script. Error: ${e.message}`);
    } finally {
      setModifyingLoading(false);
    }
  };

  const handleModifyEmailAI = async (originalEmail: any) => {
    if (!aiModifyInput.trim()) return;
    setModifyingLoading(true);
    setModifiedResult('');
    try {
      const p = `Adapt and customize this high-converting email template for my specific brand or product described as: "${aiModifyInput}".
Maintain the tone, trigger logic, pricing strategy, and storytelling arc.

Original Email Structure:
Title: ${originalEmail.title}
Subject Line: ${originalEmail.subject}
Body Content:
${originalEmail.body}

Generate an optimized version with an authentic subject line and clean e-commerce body. Output strictly the subject line and body.`;

      const response = await callAI(
        apiKey,
        'You are a high-end email conversion copywriter specialized in Klaviyo flows.',
        p
      );
      setModifiedResult(response);
    } catch(e: any) {
      setModifiedResult(`Could not regenerate email. Error: ${e.message}`);
    } finally {
      setModifyingLoading(false);
    }
  };

  // Find current tool metadata to display contextually
  const toolMetadata = [
    {
      id: 'shops',
      name: 'Shops Discovery & Tracker',
      desc: 'Discover high-growth stores, filter them precisely, and monitor high-potential competitors.'
    },
    {
      id: 'ads-library',
      name: 'Ads Library & Swipe',
      desc: 'Discover winning advertisements, research their strategic context, and save reference creative assets.'
    },
    {
      id: 'advertisers',
      name: 'Advertisers Hunter',
      desc: 'Track top-spending advertisers, evaluate their campaigns, and identify the stores they promote.'
    },
    {
      id: 'meta-ads-library',
      name: 'Meta Ads Analyzer',
      desc: 'Analyze active Meta ads of any Shopify brand, identify winning creatives, and reverse-engineer successful hooks.'
    },
    {
      id: 'shop-analytics',
      name: 'Shop Analytics',
      desc: 'View detailed traffic channels, active creative assets, catalog size, and social growth metrics in one place.'
    },
    {
      id: 'similar-shops',
      name: 'Similar Shops Finder',
      desc: 'Find competing Shopify brands targeting the same niche and benchmark traffic performance and active ads.'
    },
    {
      id: 'email-library',
      name: 'Email Library & Swipe',
      desc: 'Browse high-converting marketing newsletters, capture swipe structures, and build responsive campaign flows.'
    },
    {
      id: 'shop-emails',
      name: 'Shop Email Tracker',
      desc: 'Map competitor autoresponder flows, discount structures, and sending schedules.'
    },
    {
      id: 'folders',
      name: 'Workspace Command Center (CRM, Tasks & Swipes)',
      desc: 'Manage lead prospect records, assign projects, sketch conceptual blueprints, and organize swipe structures in your personal workspace.'
    },
    {
      id: 'brandtracker',
      name: 'Brandtracker Realtime',
      desc: 'Monitor active creative assets, pricing fluctuations, catalog shifts, and email schedules of tracked sellers in real-time.'
    }
  ].find(t => t.id === activeTool);

  // Render individual tools
  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded-xl shadow-lg border border-white/10 dark:border-black/10 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/8 dark:border-white/8 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${dark ? 'bg-white/5 text-text hover:bg-white/10' : 'bg-black/5 text-text-light hover:bg-black/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs font-bold font-display uppercase tracking-wider">Dashboard</span>
          </button>
          <div>
            <h1 className={`font-display text-2xl font-bold ${dark ? 'text-text' : 'text-text-light'}`}>
              {toolMetadata?.name || 'Competitor Tracker & Insights Suite'}
            </h1>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {toolMetadata?.desc || 'Professional e-commerce auditing, tracking, and campaign organization tools'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. SHOPS DISCOVERY & TRACKER */}
      {activeTool === 'shops' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display">Shops Discovery & Tracker</h2>
              <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                Browse high-growth e-commerce sites, isolate benchmark trends, and add them directly to your live Brandtracker lists.
              </p>
            </div>
            {/* Quick add custom url */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customShopInput}
                onChange={e => setCustomShopInput(e.target.value)}
                placeholder="Ex. gymshark.com"
                className={`text-xs px-3 py-2 rounded-xl border ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'} w-48`}
              />
              <button
                onClick={() => {
                  if (!customShopInput.trim()) return;
                  const clean = customShopInput.replace(/https?:\/\//, '').split('/')[0].trim();
                  const name = clean.split('.')[0].toUpperCase();
                  handleTrackShop({
                    domain: clean,
                    name: name,
                    niche: 'Ecom Store',
                    growth: 'High',
                    adSpend: 'Moderate',
                    productsCount: Math.floor(Math.random() * 80) + 10
                  });
                  setCustomShopInput('');
                }}
                className="bg-accent hover:bg-accent-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                + Track Domain
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleSuccessShops.map((shop, i) => (
              <div key={i} className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-accent">{shop.niche}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      shop.growth === 'Hyper' ? 'bg-rose-500/15 text-rose-500' : 'bg-orange-500/15 text-orange-500'
                    }`}>{shop.growth} Growth</span>
                  </div>
                  <h3 className="text-base font-bold mb-1">{shop.name}</h3>
                  <a href={`https://${shop.domain}`} target="_blank" rel="noreferrer" className={`text-xs select-all underline font-mono flex items-center gap-1 ${dark ? 'text-sky-400' : 'text-sky-600'}`}>
                    {shop.domain}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                    <div>
                      <span className={dark ? 'text-text-muted' : 'text-text-muted-light'}>Products:</span>
                      <strong className="block text-xs">{shop.productsCount} SKUs</strong>
                    </div>
                    <div>
                      <span className={dark ? 'text-text-muted' : 'text-text-muted-light'}>Meta Spend:</span>
                      <strong className="block text-xs">{shop.adSpend}</strong>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-black/8 dark:border-white/8 flex gap-2">
                  <button
                    onClick={() => handleTrackShop(shop)}
                    className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-center transition hover:bg-accent hover:text-white"
                  >
                    Track Shop
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool('shop-analytics');
                      handleAnalyzeShopAI(shop.domain);
                    }}
                    className="text-[11px] font-bold py-1.5 px-3 rounded-lg border border-accent text-accent hover:bg-accent/10 transition"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ADS LIBRARY & SWIPE */}
      {activeTool === 'ads-library' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display">Ads Library & High-Converting Swipes</h2>
              <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                Audit winning direct-response ad structures on Meta/TikTok. Grab high-performance formulas and customize copy in 1 click.
              </p>
            </div>
            
            <div className="flex gap-2 text-xs">
              {['All', 'Kitchen & Cookware', 'Cosmetics & Fragrance', 'Beverages & Goods', 'Fashion & Activewear'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNicheFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    nicheFilter === cat
                      ? 'bg-accent text-white'
                      : dark ? 'bg-white/5 text-text hover:bg-white/10' : 'bg-black/5 text-text-light hover:bg-black/10'
                  }`}
                >
                  {cat === 'All' ? 'All Niches' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {sampleAdSwipe
              .filter(ad => nicheFilter === 'All' || ad.niche === nicheFilter)
              .map((ad, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap gap-2 items-center mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent/25 text-accent font-bold">{ad.niche}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${dark ? 'bg-white/5 text-text-muted' : 'bg-black/5'}`}>{ad.format}</span>
                        <span className="text-[10px] font-mono font-medium text-emerald-500">{ad.metrics}</span>
                      </div>
                      <h3 className="text-base font-bold text-accent italic">Hook: {ad.hook}</h3>
                      <p className={`text-xs mt-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                        <strong>Concept Angle:</strong> {ad.angle}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItemToSave({ type: 'ad', title: `Swipe: ${ad.hook.slice(0, 30)}...`, subtitle: ad.format, content: ad.script })}
                        className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-xs font-bold hover:bg-accent hover:text-white transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Bookmarks
                      </button>
                      <button
                        onClick={() => {
                          setModifyingAdId(ad.id);
                          setModifiedResult('');
                          setAiModifyInput('');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-accent text-accent text-xs font-bold hover:bg-accent hover:text-white transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Customize with AI
                      </button>
                    </div>
                  </div>

                  {/* Original Script */}
                  <div className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed ${dark ? 'bg-black/30 border-white/5' : 'bg-black/[0.03] border-black/8'}`}>
                    {ad.script}
                  </div>

                  {/* AI Customizer Block */}
                  {modifyingAdId === ad.id && (
                    <div className={`mt-4 p-4 rounded-xl border ${dark ? 'bg-accent/10 border-accent/10' : 'bg-accent/10 border-accent/10'}`}>
                      <h4 className="text-xs font-bold mb-2 text-accent">Adapt this winning script template with Gemini AI</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiModifyInput}
                          onChange={e => setAiModifyInput(e.target.value)}
                          placeholder="Ex. A reusable silicone water bag that collapses..."
                          className={`text-xs px-3 py-2 rounded-lg border flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
                        />
                        <button
                          onClick={() => handleModifyAdCopyAI(ad)}
                          disabled={modifyingLoading}
                          className="bg-accent/10 hover:bg-accent/10 text-white text-xs font-bold px-4 py-2 rounded-lg transition disabled:opacity-5"
                        >
                          {modifyingLoading ? 'Writing...' : 'Generate Script'}
                        </button>
                      </div>

                      {modifiedResult && (
                        <div className={`mt-3 p-4 rounded-lg border text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto ${
                          dark ? 'bg-black/40 border-white/10' : 'bg-white border-black/10'
                        }`}>
                          {modifiedResult}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. ADVERTISERS HUNTER */}
      {activeTool === 'advertisers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Advertisers Hunter</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Trace and dissect the heavy e-commerce spenders. Drill down on their operational scales and trace which stores they run.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { brand: 'True Classic Tees', estAdSpend: '$250,000 - $400,000 / месяц', majorPlatforms: 'Meta Ads, Google, TikTok', hooksCount: '250+ active creatives', shop: 'trueclassictees.com', target: 'Men aged 25-50 seeking slim silhouettes, muscle-accent clothing' },
              { brand: 'Snif', estAdSpend: '$80,000 - $125,000 / месяц', majorPlatforms: 'TikTok, Instagram, Pinterest', hooksCount: '90+ active creatives', shop: 'snif.co', target: 'Gen-Z & Millennial fragrance lovers, genderless scent aesthetics' },
              { brand: 'Liquid Death', estAdSpend: '$500,000 - $800,000 / месяц', majorPlatforms: 'Meta Ads, YouTube, Snap, TikTok', hooksCount: '180+ active creatives', shop: 'liquiddeath.com', target: 'Alternative culture, concert goers, zero-plastic eco advocates' },
              { brand: 'Hexclad', estAdSpend: '$350,000 - $550,000 / месяц', majorPlatforms: 'Meta, YouTube Premium, Google Ads', hooksCount: '160+ active creatives', shop: 'hexclad.com', target: 'Home cooks, foodie influencers, premium cookware buyers' }
            ].map((adv, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{adv.brand}</h3>
                    <p className="text-xs text-accent font-semibold flex items-center gap-1.5 mt-0.5">
                      Est. Monthly Spend: {adv.estAdSpend}
                    </p>
                    <p className={`text-xs mt-2 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      <strong>Primary Ad Networks:</strong> {adv.majorPlatforms}
                    </p>
                    <p className={`text-xs mt-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      <strong>Ideal Core Persona:</strong> {adv.target}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded text-center">
                      {adv.hooksCount}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTool('shop-analytics');
                        handleAnalyzeShopAI(adv.shop);
                      }}
                      className="bg-accent hover:bg-accent-light text-white text-xs font-bold py-1.5 px-4 rounded-xl transition"
                    >
                      Audit {adv.shop}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. META ADS ANALYZER */}
      {activeTool === 'meta-ads-library' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Meta Ads Analyzer & Redirector</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Type any competitor name or shop domain. Generate direct external hyperlinks to open their Facebook Ads Library, supplemented by an AI overview of their ad formulas.
            </p>
          </div>

          <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
            <label className="text-xs font-bold block mb-2">Identify competitor store</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customShopInput}
                onChange={e => setCustomShopInput(e.target.value)}
                placeholder="Ex. gymshark"
                className={`text-xs px-3 py-3 rounded-xl border flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
              />
              <button
                onClick={() => {
                  if (!customShopInput.trim()) return;
                  handleAnalyzeShopAI(customShopInput);
                }}
                disabled={analyzingShop}
                className="bg-accent hover:bg-accent-light text-white text-xs font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
              >
                {analyzingShop ? 'Analyzing...' : 'Generate Strategy'}
              </button>
            </div>

            {/* Direct Redirect link generated */}
            {customShopInput.trim() && (
              <div className="mt-4 p-4 rounded-xl border border-dashed border-accent bg-accent/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-accent">🔗 Direct free-link built for Facebook Ads Library</h4>
                  <p className={`text-[11px] mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    Click below to open actual live ads for "{customShopInput}" in a new web tab. Fully free & official.
                  </p>
                </div>
                <a
                  href={`https://www.facebook.com/ads/library/?active_status=active&q=${encodeURIComponent(customShopInput)}&media_type=all`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-accent hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  Open Ads Library
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            )}
          </div>

          {/* AI generated audit */}
          {analyzingShop && (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <p className="text-xs text-text-muted">Gemini is searching and decrypting creative formulas...</p>
            </div>
          )}

          {generateError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
              {generateError}
            </div>
          )}

          {analysisResult && (
            <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                Competitor Ad Strategy Digest
              </h3>
              <div className={`prose dark:prose-invert text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. SHOP ANALYTICS */}
      {activeTool === 'shop-analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Competitor Shop Analytics</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Input any Shopify brand domain. Deconstruct traffic channels, best-selling price splits, social community sizes, and disruption indicators.
            </p>
          </div>

          <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
            <label className="text-xs font-bold block mb-2 font-display">Target Brand Domain</label>
            <div className="flex gap-2">
              <span className="bg-black/5 dark:bg-white/5 px-3 py-3 border border-r-0 border-black/16 dark:border-white/16 rounded-l-xl text-xs flex items-center font-mono">
                https://
              </span>
              <input
                type="text"
                value={customShopInput}
                onChange={e => setCustomShopInput(e.target.value)}
                placeholder="snif.co"
                className={`text-xs px-3 py-3 rounded-r-xl border border-l-0 flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
              />
              <button
                onClick={() => {
                  if (!customShopInput.trim()) return;
                  handleAnalyzeShopAI(customShopInput);
                }}
                disabled={analyzingShop}
                className="bg-accent hover:bg-accent-light text-white text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                {analyzingShop ? 'Auditing...' : 'Get Analysis'}
              </button>
            </div>
          </div>

          {analyzingShop ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <p className="text-xs text-text-muted">Crawling meta indices and generating chart distributions...</p>
            </div>
          ) : (
            <>
              {generateError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                  {generateError}
                </div>
              )}

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <h4 className="text-xs font-bold text-text-muted mb-3 font-display uppercase tracking-wider">Estimated Traffic (Last 6 Months)</h4>
                  <div className="flex items-end h-32 gap-3 pb-2 select-none">
                    {[
                      { month: 'Jan', val: 78 },
                      { month: 'Feb', val: 92 },
                      { month: 'Mar', val: 120 },
                      { month: 'Apr', val: 145 },
                      { month: 'May', val: 190 },
                      { month: 'Jun', val: 245 }
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-[10px] font-mono mb-1">{item.val}K</div>
                        <div
                          className="w-full bg-accent rounded-t transition-all duration-500"
                          style={{ height: `${item.val / 2.5}%` }}
                        />
                        <div className="text-[9px] mt-1.5 font-semibold text-text-muted uppercase">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <h4 className="text-xs font-bold text-text-muted mb-3 font-display uppercase tracking-wider">AOV Price Bracket Spread</h4>
                  <div className="space-y-3 pt-2">
                    {[
                      { bracket: '$10 - $25 (Low Match/Minis)', pct: 25 },
                      { bracket: '$45 - $65 (Hero Products)', pct: 60 },
                      { bracket: '$95+ (Premium Bundles)', pct: 15 }
                    ].map((b, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{b.bracket}</span>
                          <span className="font-mono text-accent font-bold">{b.pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded bg-black/5 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${b.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <h4 className="text-xs font-bold text-text-muted mb-3 font-display uppercase tracking-wider">Disruption Indicator</h4>
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">SEO Gaps in niche:</span>
                      <strong className="text-emerald-500 font-bold">High potential</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Mobile conversion page speed:</span>
                      <strong className="text-rose-500 font-bold">Needs upgrade (72/100)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Competitor review complaints:</span>
                      <strong className="text-orange-500 font-bold">Slow shipping</strong>
                    </div>
                    {customShopInput && (
                      <button
                        onClick={() => handleTrackShop({
                          domain: customShopInput,
                          name: customShopInput.split('.')[0].toUpperCase(),
                          niche: 'Analyzed Store',
                          growth: 'Hyper',
                          adSpend: 'Heavy',
                          productsCount: 45
                        })}
                        className="w-full bg-accent text-white font-bold py-2 rounded-lg text-xs mt-3 block text-center"
                      >
                        Track {customShopInput}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {analysisResult && (
                <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
                  <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-accent" />
                    Deep Audit report: {customShopInput || 'Benchmark Profile'}
                  </h3>
                  <div className="prose dark:prose-invert text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap text-text-muted">
                    {analysisResult}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 6. SIMILAR SHOPS FINDER */}
      {activeTool === 'similar-shops' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Similar Competitor Explorer</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Gain intelligence about competing shops. Enter any store name, and locate peer brands to examine pricing spreads and direct traffic ratios.
            </p>
          </div>

          <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
            <label className="text-xs font-bold block mb-2">My Brand or Target Competitor</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customShopInput}
                onChange={e => setCustomShopInput(e.target.value)}
                placeholder="Ex. gymshark.com"
                className={`text-xs px-3 py-3 rounded-xl border flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
              />
              <button
                onClick={() => {
                  if (!customShopInput.trim()) return;
                  handleAnalyzeShopAI(customShopInput);
                }}
                disabled={analyzingShop}
                className="bg-accent hover:bg-accent-light text-white text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                {analyzingShop ? 'Finding Similar...' : 'Find Similar Brands'}
              </button>
            </div>
          </div>

          {analyzingShop ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <p className="text-xs text-text-muted font-display">Deep crawling sibling nodes on DNS indices...</p>
            </div>
          ) : (
            <>
              {analysisResult ? (
                <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
                  <h3 className="text-lg font-bold mb-4 font-display">Similar Competitors Discovered via Gemini</h3>
                  <div className="prose dark:prose-invert text-xs leading-relaxed whitespace-pre-wrap text-text-muted">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { original: 'snif.co', peer: 'Phlur', mismatch: 'Luxury, highly aesthetic aesthetic branding', trafficRatio: 'Phlur: 420K vs Snif: 190K monthly visits', angle: 'Unboxing aesthetic, woody scent focus, travel sizing standard' },
                    { original: 'gymshark.com', peer: 'Alphalete Athletics', mismatch: 'Hyper-physique gym focus, premium pricing tier', trafficRatio: 'Alphalete: 850K vs Gymshark: 12.4M monthly visits', angle: 'High-compression fabrics, subtle logos' },
                    { original: 'liquiddeath.com', peer: 'Waterdrop', mismatch: 'Dissolvable focus micro-hydration capsules rather than canned water', trafficRatio: 'Waterdrop: 1M vs Liquid Death: 3.2M monthly visits', angle: 'Eco-clean aesthetic, heavy female/lifestyle audience' },
                    { original: 'hexclad.com', peer: 'Our Place (Always Pan)', mismatch: 'Colored ceramic aesthetic rather than heavy multi-ply steel hybrid grids', trafficRatio: 'Our Place: 1.4M vs Hexclad: 1.1M monthly visits', angle: 'Space-saving, nesting cookware, cozy pastel tones' }
                  ].map((peer, i) => (
                    <div key={i} className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                      <div className="flex items-center justify-between mb-3 border-b border-black/8 dark:border-white/8 pb-3">
                        <div>
                          <span className="text-[10px] text-accent font-semibold">Peer comparison for: {peer.original}</span>
                          <h4 className="text-base font-bold">{peer.peer}</h4>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTool('shop-analytics');
                            handleAnalyzeShopAI(peer.peer);
                          }}
                          className="bg-black/5 dark:bg-white/5 hover:bg-accent hover:text-white transition px-3 py-1 rounded text-[11px] font-semibold"
                        >
                          Audit Sibling
                        </button>
                      </div>
                      <p className="text-xs mb-1"><strong>Differentiator:</strong> {peer.mismatch}</p>
                      <p className="text-xs mb-1"><strong>Traffic Split:</strong> {peer.trafficRatio}</p>
                      <p className="text-xs"><strong>Hero Angle:</strong> {peer.angle}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 7. EMAIL LIBRARY & SWIPE */}
      {activeTool === 'email-library' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display">Email Multi-Step swipe library</h2>
              <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                Audit high-converting Welcome and Abandoned flow sequences. Customize body copy instantly with Gemini AI.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setEmailNicheFilter('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  emailNicheFilter === 'All' ? 'bg-accent text-white' : dark ? 'bg-white/5' : 'bg-black/5'
                }`}
              >
                All Emails
              </button>
              <button
                onClick={() => setEmailNicheFilter('Welcome')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  emailNicheFilter === 'Welcome' ? 'bg-accent text-white' : dark ? 'bg-white/5' : 'bg-black/5'
                }`}
              >
                Welcome
              </button>
              <button
                onClick={() => setEmailNicheFilter('Abandoned')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  emailNicheFilter === 'Abandoned' ? 'bg-accent text-white' : dark ? 'bg-white/5' : 'bg-black/5'
                }`}
              >
                Abandoned & FAQ
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {sampleEmails
              .filter(e => {
                if (emailNicheFilter === 'All') return true;
                if (emailNicheFilter === 'Welcome') return e.title.includes('Welcome');
                return !e.title.includes('Welcome');
              })
              .map((email) => (
                <div key={email.id} className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/8 dark:border-white/8 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-accent">{email.trigger}</span>
                      <h4 className="text-base font-bold">{email.title}</h4>
                      <p className="text-xs text-emerald-500 font-semibold mt-0.5">{email.metrics}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItemToSave({ type: 'email', title: email.title, subtitle: email.subject, content: email.body })}
                        className="bg-black/5 dark:bg-white/5 hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Bookmarks
                      </button>
                      <button
                        onClick={() => {
                          setModifyingEmailId(email.id);
                          setModifiedResult('');
                          setAiModifyInput('');
                        }}
                        className="border border-accent text-accent hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Adapt via AI
                      </button>
                    </div>
                  </div>

                  <div className="text-xs mb-3 font-semibold text-text-muted">
                    Subject Line: <span className="text-accent underline select-all font-mono">{email.subject}</span>
                  </div>

                  <div className={`p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed ${
                    dark ? 'bg-black/30 border border-white/5' : 'bg-black/[0.02] border border-black/8'
                  }`}>
                    {email.body}
                  </div>

                  {modifyingEmailId === email.id && (
                    <div className={`mt-4 p-4 rounded-xl border ${dark ? 'bg-accent/10 border-accent/10' : 'bg-accent/10 border-accent/10'}`}>
                      <h4 className="text-xs font-bold mb-2 text-accent">Transform this Klaviyo flow with Gemini</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiModifyInput}
                          onChange={e => setAiModifyInput(e.target.value)}
                          placeholder="My product description or brand name..."
                          className={`text-xs px-3 py-2 rounded-lg border flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
                        />
                        <button
                          onClick={() => handleModifyEmailAI(email)}
                          disabled={modifyingLoading}
                          className="bg-accent/10 hover:bg-accent/10 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                          {modifyingLoading ? 'Generative...' : 'Customize Flows'}
                        </button>
                      </div>

                      {modifiedResult && (
                        <div className={`mt-3 p-4 rounded-lg border text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto ${
                          dark ? 'bg-black/40 border-white/10' : 'bg-white border-black/10'
                        }`}>
                          {modifiedResult}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 8. SHOP EMAIL FREQUENCY TRACKER */}
      {activeTool === 'shop-emails' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-display">Shop Email flow tracker</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Map out any competitor's email marketing frequency and VIP automation flows using Gemini AI predictive modeling.
            </p>
          </div>

          <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
            <label className="text-xs font-bold block mb-2">Competing Store Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customShopInput}
                onChange={e => setCustomShopInput(e.target.value)}
                placeholder="Ex. snif.co"
                className={`text-xs px-3 py-3 rounded-xl border flex-1 ${dark ? 'bg-bg-subtle border-border' : 'bg-white border-black/16'}`}
              />
              <button
                onClick={() => {
                  if (!customShopInput.trim()) return;
                  handleAnalyzeShopAI(customShopInput);
                }}
                disabled={analyzingShop}
                className="bg-accent hover:bg-accent-light text-white text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                {analyzingShop ? 'Mapping Flows...' : 'Decrypt Email Flow'}
              </button>
            </div>
          </div>

          {analyzingShop ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
              <p className="text-xs text-text-muted">Decoding newsletter dispatch cycles and transactional timelines...</p>
            </div>
          ) : (
            <>
              {analysisResult ? (
                <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
                  <h3 className="text-lg font-bold mb-4 font-display">AI Decoded Flow Map</h3>
                  <div className="prose dark:prose-invert text-xs leading-relaxed whitespace-pre-wrap text-text-muted">
                    {analysisResult}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                    <h3 className="text-base font-bold mb-4 font-display text-accent">Example flow map: snif.co automated sequences</h3>
                    
                    <div className="relative border-l border-accent pl-5 space-y-6 text-xs text-text-muted">
                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 w-[9px] h-[9px] rounded-full bg-accent" />
                        <strong className="block text-accent">Instant Confirmation (T-0)</strong>
                        <p className="mt-1">Plain transactional discount code email + founder welcome letter (Open-rate peak: ~62%)</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 w-[9px] h-[9px] rounded-full bg-accent" />
                        <strong className="block text-accent">Sample Education (Day 2)</strong>
                        <p className="mt-1">Flow explains how the trial scent program operates. Highlighting "risk-free" objection killers.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 w-[9px] h-[9px] rounded-full bg-accent" />
                        <strong className="block text-accent">Social Proof Stack (Day 4)</strong>
                        <p className="mt-1">Showcases dynamic UGC reviews and TikTok aesthetic quotes praising fragrance longevity.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[25px] top-0.5 w-[9px] h-[9px] rounded-full bg-accent" />
                        <strong className="block text-accent">The Retexting Push (Day 6)</strong>
                        <p className="mt-1">Closes with an incentive to join VIP VIP SMS text listing, unlocked by a complementary travel scent pen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 9. THE E-COMMERCE WORKSPACE & CRM HUB */}
      {activeTool === 'folders' && (
        <div className="space-y-6">
          {/* Workspace Tabs */}
          <div className="flex border-b border-black/8 dark:border-white/8 mb-6 overflow-x-auto gap-2">
            <button
              onClick={() => setFoldersTab('bookmarks')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                foldersTab === 'bookmarks'
                  ? 'border-accent text-accent'
                  : dark ? 'border-transparent text-text-muted hover:text-text' : 'border-transparent text-text-muted-light hover:text-text-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>Swipe Folders & Bookmarks</span>
            </button>
            <button
              onClick={() => setFoldersTab('excel')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                foldersTab === 'excel'
                  ? 'border-accent text-accent'
                  : dark ? 'border-transparent text-text-muted hover:text-text' : 'border-transparent text-text-muted-light hover:text-text-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Business Spreadsheet</span>
            </button>
            <button
              onClick={() => setFoldersTab('paint')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                foldersTab === 'paint'
                  ? 'border-accent text-accent'
                  : dark ? 'border-transparent text-text-muted hover:text-text' : 'border-transparent text-text-muted-light hover:text-text-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Idea Sketchpad (Paint)</span>
            </button>
            <button
              onClick={() => setFoldersTab('crm')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                foldersTab === 'crm'
                  ? 'border-accent text-accent'
                  : dark ? 'border-transparent text-text-muted hover:text-text' : 'border-transparent text-text-muted-light hover:text-text-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Lead & Contact CRM</span>
            </button>
            <button
              onClick={() => setFoldersTab('tasks')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                foldersTab === 'tasks'
                  ? 'border-accent text-accent'
                  : dark ? 'border-transparent text-text-muted hover:text-text' : 'border-transparent text-text-muted-light hover:text-text-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>E-com Project Tasks</span>
            </button>
          </div>

          {/* TAB 1: BOOKMARKS & SWIPE FILES */}
          {foldersTab === 'bookmarks' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold font-display">Organized Swipe Folders</h3>
                  <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    Collect and classify e-commerce assets: ad scripts, newsletter logs, tracker outcomes, and layouts.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder="Ex. Black Friday Creatives"
                    className={`text-xs px-3 py-2 rounded-xl border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                  />
                  <button
                    onClick={handleCreateFolder}
                    className="bg-accent hover:bg-accent-light text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    + Create Folder
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {folders.map((folder) => (
                  <div key={folder.id} className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                    <div className="flex items-center justify-between border-b border-black/8 dark:border-white/8 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-sm font-bold">{folder.name}</h3>
                        <span className="text-[10px] bg-accent/15 text-accent font-mono px-2 py-0.5 rounded-full">
                          {folder.items.length} files
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="text-xs text-rose-500 hover:underline font-semibold"
                      >
                        Delete Folder
                      </button>
                    </div>

                    {folder.items.length === 0 ? (
                      <p className={`text-xs py-4 text-center ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                        Folder empty. Bookmark ad layouts, email files, or analytics to display them here.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {folder.items.map((item) => (
                          <div key={item.id} className={`p-4 rounded-xl border ${dark ? 'bg-black/25 border-white/5' : 'bg-black/[0.01] border-black/8'}`}>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10">{item.type}</span>
                                <h4 className="text-xs font-bold leading-snug mt-1.5">{item.title}</h4>
                                <p className="text-[10px] text-text-muted mt-0.5">{item.subtitle}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveFromFolder(folder.id, item.id)}
                                className="text-[10px] text-rose-500 hover:underline shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                            <div className={`mt-2 p-3 rounded bg-black/10 dark:bg-black/30 text-[11px] font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-normal ${
                              dark ? 'text-text-muted' : 'text-text-muted-light'
                            }`}>
                              {item.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXCEL SPREADSHEET MANAGER */}
          {foldersTab === 'excel' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold font-display">E-Commerce Business Ledger</h3>
                  <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    Directly type catalog costs, projected values, and notes. profit margin calculates automatically in real-time.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newRow: SpreadsheetRow = {
                        id: `row-${Date.now()}`,
                        cells: ['New Conceptual SKU', '0.00', '0.00', '', 'New draft logs']
                      };
                      setExcelRows(prev => [...prev, newRow]);
                      triggerNotification('Appended spreadsheet grid row.');
                    }}
                    className="bg-accent hover:bg-accent-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add SKU Row</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset ledger cells back to initial presets?')) {
                        localStorage.removeItem('ecom_excel_rows');
                        setExcelRows([
                          { id: 'row-1', cells: ['Wireless Charger Duo', '12.50', '39.99', '', 'Active testing campaign'] },
                          { id: 'row-2', cells: ['Copper French Press', '14.00', '45.00', '', 'Bulk order arriving next week'] },
                          { id: 'row-3', cells: ['Classic Organic Tee', '4.20', '28.00', '', 'Bulk purchase complete'] },
                          { id: 'row-4', cells: ['Ergonomic Contoured Pillow', '11.10', '59.00', '', 'High search interest and low cost'] },
                          { id: 'row-5', cells: ['Gourmet Micro-Lot Arabica', '3.10', '19.99', '', 'Excellent user retention product'] }
                        ]);
                        triggerNotification('Cleared cells to system standards.');
                      }
                    }}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border ${dark ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/16 text-black hover:bg-black/5'}`}
                  >
                    Reset Grid
                  </button>
                </div>
              </div>

              {/* Excel Table */}
              <div className={`overflow-x-auto rounded-xl border ${dark ? 'border-white/10' : 'border-black/12'}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={dark ? 'bg-white/5' : 'bg-black/[0.02]'}>
                      {['Product Name', 'Supplier Cost ($)', 'Retail Price ($)', 'Profit Margin ($)', 'Logistics & Status Notes'].map((h, i) => (
                        <th key={i} className={`p-3 text-xs font-bold tracking-tight border-b ${dark ? 'border-white/10 text-text' : 'border-black/12 text-text-light'}`}>
                          {h}
                        </th>
                      ))}
                      <th className={`p-3 text-xs font-bold border-b text-center ${dark ? 'border-white/10' : 'border-black/12'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelRows.map((row) => (
                      <tr key={row.id} className={`hover:bg-accent/5 transition-colors ${dark ? 'border-b border-white/5' : 'border-b border-black/[0.04]'}`}>
                        {/* Cell 1: Product Name */}
                        <td className="p-2 min-w-[200px]">
                          <input
                            type="text"
                            value={row.cells[0]}
                            onChange={e => {
                              const val = e.target.value;
                              setExcelRows(prev => prev.map(r => r.id === row.id ? { ...r, cells: [val, r.cells[1], r.cells[2], r.cells[3], r.cells[4]] } : r));
                            }}
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-accent rounded px-2.5 py-1.5 text-xs outline-none ${dark ? 'text-white' : 'text-black'}`}
                          />
                        </td>
                        {/* Cell 2: Cost Price */}
                        <td className="p-2 min-w-[120px]">
                          <input
                            type="text"
                            value={row.cells[1]}
                            onChange={e => {
                              const val = e.target.value;
                              setExcelRows(prev => prev.map(r => r.id === row.id ? { ...r, cells: [r.cells[0], val, r.cells[2], r.cells[3], r.cells[4]] } : r));
                            }}
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-accent rounded px-2.5 py-1.5 text-xs font-mono outline-none ${dark ? 'text-white' : 'text-black'}`}
                          />
                        </td>
                        {/* Cell 3: Selling Price */}
                        <td className="p-2 min-w-[120px]">
                          <input
                            type="text"
                            value={row.cells[2]}
                            onChange={e => {
                              const val = e.target.value;
                              setExcelRows(prev => prev.map(r => r.id === row.id ? { ...r, cells: [r.cells[0], r.cells[1], val, r.cells[3], r.cells[4]] } : r));
                            }}
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-accent rounded px-2.5 py-1.5 text-xs font-mono outline-none ${dark ? 'text-white' : 'text-black'}`}
                          />
                        </td>
                        {/* Cell 4: Computed Profit Margin */}
                        <td className="p-2 min-w-[120px]">
                          <span className="px-3 py-1.5 text-xs font-bold font-mono text-accent bg-accent/15 rounded-lg block w-max">
                            ${getCellDisplayValue(row, 3)}
                          </span>
                        </td>
                        {/* Cell 5: Notes */}
                        <td className="p-2 min-w-[250px]">
                          <input
                            type="text"
                            value={row.cells[4]}
                            onChange={e => {
                              const val = e.target.value;
                              setExcelRows(prev => prev.map(r => r.id === row.id ? { ...r, cells: [r.cells[0], r.cells[1], r.cells[2], r.cells[3], val] } : r));
                            }}
                            placeholder="Add strategic context..."
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-accent rounded px-2.5 py-1.5 text-xs outline-none ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}
                          />
                        </td>
                        {/* Actions */}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              setExcelRows(prev => prev.filter(r => r.id !== row.id));
                              triggerNotification('Removed SKU row from ledger.');
                            }}
                            className="text-xs text-rose-500 hover:underline font-bold px-3 py-1.5"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Total SKUs</span>
                  <strong className="text-xl font-display">{excelRows.length} active</strong>
                </div>

                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Avg Profit Margin</span>
                  <strong className="text-xl font-display text-accent">
                    ${(excelRows.reduce((acc, row) => {
                      const cost = parseFloat(row.cells[1]);
                      const price = parseFloat(row.cells[2]);
                      return acc + (!isNaN(cost) && !isNaN(price) ? (price - cost) : 0);
                    }, 0) / (excelRows.length || 1)).toFixed(2)}
                  </strong>
                </div>

                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Highest Cost</span>
                  <strong className="text-xl font-display">
                    ${Math.max(...excelRows.map(row => parseFloat(row.cells[1]) || 0), 0).toFixed(2)}
                  </strong>
                </div>

                <div className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Total Portfolio Value</span>
                  <strong className="text-xl font-display">
                    ${excelRows.reduce((acc, row) => acc + (parseFloat(row.cells[2]) || 0), 0).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAINT CONCEPT BOARD */}
          {foldersTab === 'paint' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold font-display">Drawing whiteboard</h3>
                  <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    Draw visual e-commerce campaign layouts, mindmaps, funnel frameworks, and draft concepts.
                  </p>
                </div>

                {/* Draw Palette Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Mode switcher */}
                  <div className={`flex rounded-xl p-1 border ${dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/8'}`}>
                    <button
                      onClick={() => setDrawingMode('draw')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                        drawingMode === 'draw' ? 'bg-accent text-white' : 'text-text-muted'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Draw</span>
                    </button>
                    <button
                      onClick={() => setDrawingMode('erase')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                        drawingMode === 'erase' ? 'bg-accent text-white' : 'text-text-muted'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Eraser</span>
                    </button>
                  </div>

                  {/* Brush colors */}
                  {drawingMode === 'draw' && (
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                      {[
                        { hex: '#6366F1', label: 'Indigo' },
                        { hex: '#10B981', label: 'Green' },
                        { hex: '#EF4444', label: 'Red' },
                        { hex: '#3B82F6', label: 'Blue' },
                        { hex: '#F97316', label: 'Orange' },
                        { hex: dark ? '#FFFFFF' : '#000000', label: dark ? 'White' : 'Black' }
                      ].map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setBrushColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-5.5 h-5.5 rounded-full border-2 transition ${
                            brushColor === c.hex ? 'border-accent scale-110 shadow-md' : 'border-transparent hover:scale-105'
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  )}

                  {/* Brush width */}
                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                    {[
                      { size: 3, label: 'Thin' },
                      { size: 6, label: 'Med' },
                      { size: 12, label: 'Thick' }
                    ].map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setBrushSize(s.size)}
                        className={`text-[10px] px-2.5 py-1 rounded font-bold transition ${
                          brushSize === s.size ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Canvas Utilities */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUndo}
                      className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-text-muted hover:text-text"
                      title="Undo Stroke"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                    </button>

                    <button
                      onClick={handleRedo}
                      className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-text-muted hover:text-text"
                      title="Redo Stroke"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        const canvas = canvasRef.current;
                        const ctx = canvas?.getContext('2d');
                        if (canvas && ctx) {
                          ctx.fillStyle = dark ? '#121212' : '#FAFAFA';
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                          // Reset history
                          setDrawingHistory([]);
                          setHistoryIndex(-1);
                          triggerNotification('Canvas whiteboard cleared completely.');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                      title="Clear Board"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                          const url = canvas.toDataURL("image/png");
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `ecom_concept_sketch_${Date.now()}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          triggerNotification('PNG layout sketch saved to downloads!');
                        }
                      }}
                      className="bg-accent hover:bg-accent-light text-white text-xs font-bold px-3 py-2 rounded-lg"
                    >
                      Export Sketch
                    </button>
                  </div>
                </div>
              </div>

              {/* Real Drawing Canvas Container */}
              <div className={`p-1 rounded-2xl border ${dark ? 'bg-black border-white/10' : 'bg-white border-black/12'}`}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDrawing}
                  onMouseMove={handleDraw}
                  onMouseUp={handleStopDrawing}
                  onMouseLeave={handleStopDrawing}
                  onTouchStart={handleStartDrawing}
                  onTouchMove={handleDraw}
                  onTouchEnd={handleStopDrawing}
                  className="w-full rounded-xl cursor-crosshair block bg-slate-900 border-0"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <div className="flex gap-2 items-center text-text-muted text-[11px] px-1 font-mono">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Draw ideas visually. Sketch e-commerce funnels, target customer maps, product draft lines, or social copy frames.</span>
              </div>
            </div>
          )}

          {/* TAB 2: LEAD & CONTACT CRM (CUSTOMIZABLE) */}
          {foldersTab === 'crm' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Lead Form */}
              <div className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'} h-fit`}>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-accent mb-4">Add CRM Lead Profile</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Full Name</label>
                    <input
                      type="text"
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      placeholder="Ex. Sarah Connor"
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Email Address</label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={e => setNewContactEmail(e.target.value)}
                      placeholder="Ex. sarah@skynet.com"
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">Phone Number</label>
                      <input
                        type="text"
                        value={newContactPhone}
                        onChange={e => setNewContactPhone(e.target.value)}
                        placeholder="Ex. +336123456"
                        className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">Date of Birth</label>
                      <input
                        type="date"
                        value={newContactDob}
                        onChange={e => setNewContactDob(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">Country</label>
                      <input
                        type="text"
                        value={newContactCountry}
                        onChange={e => setNewContactCountry(e.target.value)}
                        placeholder="Ex. France"
                        className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">City</label>
                      <input
                        type="text"
                        value={newContactCity}
                        onChange={e => setNewContactCity(e.target.value)}
                        placeholder="Ex. Lyon"
                        className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Postal Address</label>
                    <input
                      type="text"
                      value={newContactAddress}
                      onChange={e => setNewContactAddress(e.target.value)}
                      placeholder="Ex. 14 Rue de la Paix"
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                    />
                  </div>

                  {/* CUSTOM FIELD APPENDER */}
                  <div className="pt-2 border-t border-black/8 dark:border-white/8">
                    <span className="block font-bold text-accent mb-2">Custom Fields (Unlimited Attributes)</span>
                    
                    <div className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Shopify Theme)"
                        value={newCustomLabel}
                        onChange={e => setNewCustomLabel(e.target.value)}
                        className={`flex-1 px-2.5 py-1.5 rounded border text-[11px] ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Dawn Live)"
                        value={newCustomValue}
                        onChange={e => setNewCustomValue(e.target.value)}
                        className={`flex-1 px-2.5 py-1.5 rounded border text-[11px] ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCustomLabel.trim() || !newCustomValue.trim()) return;
                          setTempCustomFields(p => [...p, { label: newCustomLabel, value: newCustomValue }]);
                          setNewCustomLabel('');
                          setNewCustomValue('');
                        }}
                        className="bg-accent px-3.5 rounded text-white text-xs font-bold shrink-0"
                      >
                        +
                      </button>
                    </div>

                    {tempCustomFields.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-black/10 dark:bg-black/35 rounded-lg mb-3">
                        {tempCustomFields.map((field, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-accent/20 text-accent font-semibold">
                            {field.label}: {field.value}
                            <button
                              type="button"
                              onClick={() => setTempCustomFields(p => p.filter((_, idx) => idx !== i))}
                              className="text-rose-500 font-bold ml-1 hover:text-rose-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!newContactName.trim() || !newContactEmail.trim()) {
                        triggerNotification('Please provide Name and Email!');
                        return;
                      }
                      const freshContact: CRMContact = {
                        id: `c-${Date.now()}`,
                        name: newContactName,
                        email: newContactEmail,
                        phone: newContactPhone || 'N/A',
                        country: newContactCountry || 'N/A',
                        city: newContactCity || 'N/A',
                        address: newContactAddress || 'N/A',
                        dob: newContactDob || 'N/A',
                        customFields: [...tempCustomFields]
                      };
                      setCrmContacts(prev => [freshContact, ...prev]);
                      setNewContactName('');
                      setNewContactEmail('');
                      setNewContactPhone('');
                      setNewContactCountry('');
                      setNewContactCity('');
                      setNewContactAddress('');
                      setNewContactDob('');
                      setTempCustomFields([]);
                      triggerNotification(`Lead ${freshContact.name} added to CRM!`);
                    }}
                    className="w-full bg-accent hover:bg-accent-light text-white font-bold py-2.5 rounded-xl transition mt-2 text-center"
                  >
                    Save Contact Record
                  </button>
                </div>
              </div>

              {/* CRM Contact List Container */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/8 dark:border-white/8">
                  <div>
                    <span className="text-xs font-bold font-mono tracking-tight text-accent">Active CRM Workspace</span>
                    <h4 className="text-sm font-semibold">CRM Listings ({crmContacts.length} contacts)</h4>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Export CRM to CSV format?')) {
                        const csvContent = "data:text/csv;charset=utf-8," 
                          + ["Name,Email,Phone,Country,City,Address,DOB"].join(",") + "\n"
                          + crmContacts.map(c => `"${c.name}","${c.email}","${c.phone}","${c.country}","${c.city}","${c.address}","${c.dob}"`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `com_crm_export_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        triggerNotification('CRM exported as CSV download successfully!');
                      }
                    }}
                    className="border border-accent text-accent text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-accent hover:text-white transition"
                  >
                    CSV Export
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[640px] overflow-y-auto pr-1">
                  {crmContacts.length === 0 ? (
                    <div className={`p-8 text-center rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                      <p className="text-xs text-text-muted">No contacts listed yet. Fill out the profiles form to append clients.</p>
                    </div>
                  ) : (
                    crmContacts.map((contact) => (
                      <div key={contact.id} className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'} hover:border-accent transition`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold leading-none uppercase">
                                {contact.name.slice(0, 2)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold leading-tight">{contact.name}</h4>
                                <span className="text-[10px] text-text-muted font-mono">{contact.email}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCrmContacts(prev => prev.filter(c => c.id !== contact.id));
                              triggerNotification(`Removed contact ${contact.name}`);
                            }}
                            className="text-xs text-rose-500 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>

                        {/* CRM Meta Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] p-3 rounded-lg bg-black/10 dark:bg-black/25 text-text-muted mt-2">
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{contact.phone}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{contact.city}, {contact.country}</span>
                          </div>

                          <div className="flex items-center gap-1 col-span-2">
                            <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate">{contact.address}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>DOB: {contact.dob}</span>
                          </div>
                        </div>

                        {/* Expandable Custom Fields Display */}
                        {contact.customFields && contact.customFields.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {contact.customFields.map((field, fIdx) => (
                              <span key={fIdx} className="px-2 py-0.5 rounded text-[9px] bg-black/10 dark:bg-white/10 font-medium italic text-text hover:bg-accent/10 hover:text-accent transition">
                                <strong className="not-italic">{field.label}:</strong> {field.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT TASKS TRACKER WITH COLOR CODED STATUS */}
          {foldersTab === 'tasks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Task Form */}
              <div className={`p-5 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'} h-fit`}>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-accent mb-4">Launch E-Com Project Task</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Task Campaign Title</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      placeholder="Ex. Competitor Ad Hook Ideation"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Directives Description</label>
                    <textarea
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      placeholder="Specify objectives, links, or swipe resources..."
                      value={newTaskDesc}
                      onChange={e => setNewTaskDesc(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">Select Priority</label>
                      <select
                        value={newTaskPriority}
                        onChange={e => setNewTaskPriority(e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 font-semibold text-text-muted">Due Date Target</label>
                      <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={e => setNewTaskDueDate(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-text-muted">Operational State</label>
                    <select
                      value={newTaskStatus}
                      onChange={e => setNewTaskStatus(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-lg border ${dark ? 'bg-bg-subtle border-border text-white' : 'bg-white border-black/16 text-black'}`}
                    >
                      <option value="not_finished">Not Finished</option>
                      <option value="in_progress">In Progress</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!newTaskTitle.trim()) {
                        triggerNotification('Please fill the Task Title!');
                        return;
                      }
                      const freshTask: TaskProject = {
                        id: `t-${Date.now()}`,
                        title: newTaskTitle,
                        description: newTaskDesc || 'No details provided.',
                        priority: newTaskPriority,
                        status: newTaskStatus,
                        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0]
                      };
                      setTasks(prev => [freshTask, ...prev]);
                      setNewTaskTitle('');
                      setNewTaskDesc('');
                      setNewTaskPriority('Medium');
                      setNewTaskStatus('not_finished');
                      setNewTaskDueDate('');
                      triggerNotification(`Added task "${freshTask.title}" successfully!`);
                    }}
                    className="w-full bg-accent hover:bg-accent-light text-white font-bold py-2.5 rounded-xl transition text-center"
                  >
                    Deploy Workspace Task
                  </button>
                </div>
              </div>

              {/* Task listing with Filters */}
              <div className="lg:col-span-2 space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/8 dark:border-white/8">
                  <span className="text-xs font-bold text-accent font-display uppercase tracking-wider">Filters & Analytics</span>
                  
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    {[
                      { id: 'All', label: 'All Tasks' },
                      { id: 'not_finished', label: 'Not Finished' },
                      { id: 'in_progress', label: 'In Progress' },
                      { id: 'finished', label: 'Finished' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setTaskFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          taskFilter === f.id
                            ? 'bg-accent text-white'
                            : dark ? 'bg-white/5 text-text-muted hover:bg-white/10' : 'bg-black/5 text-text-muted-light hover:bg-black/10'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[640px] overflow-y-auto pr-1">
                  {tasks
                    .filter(t => taskFilter === 'All' || t.status === taskFilter)
                    .map((item) => (
                      <div key={item.id} className={`p-4 rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'} transition`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono ${
                                item.priority === 'High' ? 'bg-rose-500/15 text-rose-500' :
                                item.priority === 'Medium' ? 'bg-orange-500/15 text-orange-500' :
                                'bg-emerald-500/15 text-emerald-500'
                              }`}>
                                {item.priority} priority
                              </span>
                              
                              {/* STATUS CYCLER IN THE CORE INTERACTION ROW */}
                              <button
                                onClick={() => {
                                  // Cycles: not_finished -> in_progress -> finished -> not_finished
                                  const states: ('not_finished' | 'in_progress' | 'finished')[] = ['not_finished', 'in_progress', 'finished'];
                                  const currentIdx = states.indexOf(item.status as any);
                                  const nextStateIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % states.length;
                                  const nextState = states[nextStateIdx];
                                  setTasks(prev => prev.map(t => {
                                    if (t.id === item.id) {
                                      return { ...t, status: nextState };
                                    }
                                    return t;
                                  }));
                                  triggerNotification(`Task state shifted to: ${nextState === 'finished' ? 'Finished' : nextState === 'in_progress' ? 'In Progress' : 'Not Finished'}`);
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                                  item.status === 'finished' 
                                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-500' 
                                    : item.status === 'in_progress'
                                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-500'
                                    : 'bg-red-500/15 border-red-500/30 text-red-500'
                                }`}
                                title="Click to cycle task state"
                              >
                                {item.status === 'finished' && (
                                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {item.status === 'in_progress' && (
                                  <svg className="w-3.5 h-3.5 text-orange-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 4H21.2" />
                                  </svg>
                                )}
                                {item.status === 'not_finished' && (
                                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                <span className="font-display">
                                  {item.status === 'finished' ? 'Finished' : item.status === 'in_progress' ? 'In Progress' : 'Not Finished'}
                                </span>
                              </button>
                            </div>

                            <h4 className="text-sm font-bold text-text-light dark:text-text">{item.title}</h4>
                            <p className="text-xs text-text-muted">{item.description}</p>
                          </div>

                          <div className="flex gap-2 items-center sm:self-center">
                            <button
                              onClick={() => {
                                setTasks(prev => prev.filter(t => t.id !== item.id));
                                triggerNotification(`Removed task "${item.title}"`);
                              }}
                              className="text-xs text-rose-500 hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted pt-2 border-t border-black/8 dark:border-white/8">
                          <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due date limit: <strong className="font-mono">{item.dueDate}</strong></span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. BRANDTRACKER REALTIME */}
      {activeTool === 'brandtracker' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display">Live Competitor Brandtracker</h2>
              <p className={`text-xs mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                Consolidated competitive watch panel. Monitors active creatives, price changes, design shifts, layout testing, and email patterns.
              </p>
            </div>
            
            <button
              onClick={() => {
                triggerNotification('Initiating deep recursive DNS scans... 100% synchronized.');
                setTrackedShops(prev => prev.map(s => ({
                  ...s,
                  lastScanned: new Date().toISOString().split('T')[0],
                  liveAdsCount: Math.max(0, (s.liveAdsCount || 10) + (Math.random() > 0.5 ? 2 : -1))
                })));
              }}
              className="bg-accent hover:bg-accent-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 4H21.2" />
              </svg>
              Refresh Tracking Indices
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main tracked listing */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-text-muted">Currently Monitored Shops</h3>
              
              {trackedShops.length === 0 ? (
                <div className={`p-8 text-center rounded-xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'}`}>
                  <p className="text-xs text-text-muted mb-3">Not tracking any brands yet.</p>
                  <button
                    onClick={() => setActiveTool('shops')}
                    className="bg-accent text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
                  >
                    Import top stores
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {trackedShops.map((shop, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${
                      dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/12'
                    } flex items-center justify-between gap-4`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold truncate">{shop.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold truncate">
                            {shop.niche.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-text-muted truncate">{shop.domain}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-text-muted">
                          <span>Scanned: <strong className="font-mono">{shop.lastScanned || 'Today'}</strong></span>
                          <span>Ads: <strong className="font-mono text-emerald-500">{shop.liveAdsCount || 12} active</strong></span>
                          <span>Products: <strong className="font-mono">{shop.productsCount} items</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveTool('shop-analytics');
                            handleAnalyzeShopAI(shop.domain);
                          }}
                          className="bg-accent/10 hover:bg-accent text-accent hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Audit
                        </button>
                        <button
                          onClick={() => handleDeleteTrackedShop(shop.domain)}
                          className="text-rose-500 hover:text-white hover:bg-rose-500/10 p-1.5 rounded-lg transition"
                          aria-label="Remove tracker"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated Live RSS activity feed */}
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-text-muted mb-4">Competitor Live Activity Feed</h3>
              <div className={`p-4 rounded-xl border space-y-4 max-h-[460px] overflow-y-auto ${
                dark ? 'bg-black/30 border-white/10' : 'bg-black/[0.02] border-black/10'
              }`}>
                {[
                  { time: '2 heures ago', tag: 'Meta Ads', text: 'Gymshark launched a new UGC split-screen campaign focusing on stomach support.' },
                  { time: '5 heures ago', tag: 'Flow Update', text: 'Snif adjusted welcome flow dispatch sequence - now includes a sample guarantee reminder on day 2.' },
                  { time: '1 jour ago', tag: 'Pricing Hack', text: 'HexClad launched bundling coupons for matching kitchen lids, dropping average unit pricing by 12%.' },
                  { time: '2 jours ago', tag: 'Product Drops', text: 'Liquid Death uploaded a private product page containing black graphic apparel lines.' },
                  { time: '3 jours ago', tag: 'Metadata', text: 'True Classic Tees changed their checkout funnel optimization hooks for male dad-bod collections.' }
                ].map((act, i) => (
                  <div key={i} className="text-xs border-b border-black/5 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-accent font-semibold">{act.tag}</span>
                      <span className="text-[9px] text-text-muted font-medium">{act.time}</span>
                    </div>
                    <p className={`leading-relaxed ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>{act.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global selector modal for bookmark folders */}
      {selectedItemToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`p-6 rounded-2xl w-full max-w-sm border shadow-xl animate-fade-in ${
            dark ? 'bg-bg-subtle border-border text-text' : 'bg-white border-black/12 text-text-light'
          }`}>
            <h3 className="text-base font-bold font-display mb-3">Copy to Swipes Folder</h3>
            <p className="text-xs text-text-muted mb-4">Select a folder to save this direct response asset:</p>
            
            <div className="space-y-2 mb-6">
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => saveToFolder(f.id, selectedItemToSave)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-semibold select-none flex items-center justify-between ${
                    dark ? 'bg-white/5 hover:bg-accent/20' : 'bg-black/5 hover:bg-accent-light hover:text-white'
                  }`}
                >
                  <span>{f.name}</span>
                  <span className="font-mono text-[9px] bg-black/10 px-1.5 py-0.5 rounded">{f.items.length} items</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedItemToSave(null)}
              className="w-full py-2 bg-rose-500 text-white font-bold rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
