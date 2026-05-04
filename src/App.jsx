import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  ArrowRightLeft,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  Settings,
  DollarSign,
  CreditCard,
  Briefcase,
  Save,
  Trash2,
  ChevronRight,
  LayoutDashboard,
  Landmark,
  Moon,
  Sun,
  RotateCcw,
  Utensils,
  Bus,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Plane,
  Coins,
  Pencil,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Heart,
  Banknote,
  Globe,
  Dumbbell,
  Users,
  History,
  Download,
  FileJson,
  ArrowLeft,
  LogOut,
  ChevronLeft,
} from "lucide-react";

// --- Firebase Imports (雲端資料庫與登入模組) ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// 填寫你的 Firebase 金鑰
const firebaseConfig = {
  apiKey: "AIzaSyBM1UWFWxo1Vn_YqZF7toH7ycloVswAw9M",
  authDomain: "fire-c50a5.firebaseapp.com",
  projectId: "fire-c50a5",
  storageBucket: "fire-c50a5.firebasestorage.app",
  messagingSenderId: "140911171658",
  appId: "1:140911171658:web:465ef18eed3b5f73c16eb3",
  measurementId: "G-DS58K34DSV",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ==========================================
// 1. Context 與常數
// ==========================================
const DataContext = createContext();
const UIContext = createContext();

const EXPENSE_CATEGORIES = [
  {
    id: "food",
    name: "飲食",
    icon: Utensils,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "transport",
    name: "交通",
    icon: Bus,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "shopping",
    name: "購物",
    icon: ShoppingBag,
    color: "text-pink-500",
    bg: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "fitness",
    name: "健身",
    icon: Dumbbell,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: "entertainment",
    name: "娛樂",
    icon: Film,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "ruirui",
    name: "芮芮",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
  {
    id: "social",
    name: "社交",
    icon: Users,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    id: "health",
    name: "醫療",
    icon: HeartPulse,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "travel",
    name: "旅遊",
    icon: Plane,
    color: "text-cyan-500",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    id: "loan",
    name: "還款",
    icon: Banknote,
    color: "text-slate-600",
    bg: "bg-slate-200 dark:bg-slate-700",
  },
  {
    id: "education",
    name: "學習",
    icon: GraduationCap,
    color: "text-indigo-500",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    id: "other",
    name: "其他",
    icon: MoreHorizontal,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
];

const INCOME_CATEGORIES = [
  {
    id: "salary",
    name: "薪資",
    icon: Briefcase,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "bonus",
    name: "獎金",
    icon: PlusCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    id: "investment",
    name: "投資回報",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "other_income",
    name: "其他收入",
    icon: MoreHorizontal,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
];

const ACCOUNT_TYPES = [
  { value: "bank", label: "銀行帳戶" },
  { value: "cash", label: "現金錢包" },
  { value: "credit", label: "信用卡" },
  { value: "loan", label: "信貸/貸款" },
  { value: "stock", label: "證券帳戶(現金)" },
  { value: "crypto", label: "加密貨幣交易所(U/Cash)" },
];

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
  "#64748b",
  "#0ea5e9",
  "#f97316",
];

const getCategoryDetails = (catId, type) => {
  const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return (
    list.find((c) => c.id === catId) || {
      icon: type === "income" ? PlusCircle : MinusCircle,
      color: "text-slate-500",
      bg: "bg-slate-100",
      name: "一般",
    }
  );
};

const DEFAULT_ACCOUNTS = [
  { id: "1", name: "台新", type: "bank", balance: 0, color: "#3b82f6" },
  { id: "2", name: "現實錢包", type: "cash", balance: 0, color: "#10b981" },
  { id: "3", name: "Bitfinex", type: "crypto", balance: 0, color: "#6366f1" },
  { id: "4", name: "永豐預備金", type: "bank", balance: 0, color: "#f59e0b" },
  { id: "5", name: "信用卡", type: "credit", balance: 0, color: "#ec4899" },
  { id: "6", name: "信用貸款", type: "loan", balance: 0, color: "#64748b" },
];
const DEFAULT_TRANSACTIONS = [];
const DEFAULT_INVESTMENTS = [];
const DEFAULT_SALARY_RULES = [
  { id: 1, name: "還款 (信貸)", type: "fixed", value: 0, targetAccountId: "6" },
  { id: 3, name: "生活費", type: "percent", value: 0, targetAccountId: "2" },
];

// --- 雲端雙向同步 Hook ---
const useCloudState = (key, defaultValue, user) => {
  const [value, setValue] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "wealthflow", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data()[key] !== undefined) {
        setValue(docSnap.data()[key]);
      } else if (!docSnap.exists() && !isLoaded) {
        setDoc(
          doc(db, "wealthflow", user.uid),
          { [key]: defaultValue },
          { merge: true }
        );
      }
      setIsLoaded(true);
    });
    return unsub;
  }, [user, key]);

  const setter = (newValue) => {
    const resolvedValue =
      typeof newValue === "function" ? newValue(value) : newValue;
    setValue(resolvedValue);
    if (user && isLoaded) {
      setDoc(
        doc(db, "wealthflow", user.uid),
        { [key]: resolvedValue },
        { merge: true }
      );
    }
  };

  return [value, setter, isLoaded];
};

// --- 共用 UI 元件 ---
const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${className}`}
  >
    {children}
  </div>
);
const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
  disabled,
}) => {
  const variants = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:bg-blue-700",
    secondary:
      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200",
    danger:
      "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50 hover:bg-red-100",
    outline:
      "border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-transparent",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-95 touch-manipulation ${
        variants[variant]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {" "}
      {Icon && <Icon size={18} />} {children}{" "}
    </button>
  );
};
const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="mb-4">
    {" "}
    {label && (
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
    )}{" "}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
    />{" "}
  </div>
);
const Select = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    {" "}
    {label && (
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
    )}{" "}
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
    >
      {" "}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}{" "}
    </select>{" "}
  </div>
);

// ==========================================
// 2. 視窗 (Modals)
// ==========================================
const TransactionModal = () => {
  const {
    showTransModal,
    setShowTransModal,
    transType,
    transCategory,
    setTransCategory,
    transAmount,
    setTransAmount,
    transTitle,
    setTransTitle,
    transFrom,
    setTransFrom,
    transTo,
    setTransTo,
    transDate,
    setTransDate,
    editingTransaction,
  } = useContext(UIContext);
  const { accounts, handleAddTransaction, handleDeleteTransaction } =
    useContext(DataContext);

  useEffect(() => {
    if (transType === "transfer") {
      const validToAccounts = accounts.filter((a) => a.id !== transFrom);
      const isCurrentToValid = validToAccounts.some((a) => a.id === transTo);
      if ((!transTo || !isCurrentToValid) && validToAccounts.length > 0) {
        setTransTo(validToAccounts[0].id);
      }
    }
  }, [transFrom, transType, accounts, transTo, setTransTo]);

  if (!showTransModal) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {editingTransaction
              ? "編輯交易紀錄"
              : transType === "expense"
              ? "新增支出"
              : transType === "income"
              ? "新增收入"
              : "帳戶轉帳"}
          </h3>
          <button
            onClick={() => setShowTransModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="金額"
                type="number"
                value={transAmount}
                onChange={(e) => setTransAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="w-1/3">
              <Input
                label="日期"
                type="date"
                value={transDate}
                onChange={(e) => setTransDate(e.target.value)}
              />
            </div>
          </div>
          {transType !== "transfer" && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                選擇類別
              </label>
              <div className="grid grid-cols-4 gap-3">
                {(transType === "income"
                  ? INCOME_CATEGORIES
                  : EXPENSE_CATEGORIES
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTransCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                      transCategory === cat.id
                        ? "bg-blue-50 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500"
                        : "bg-slate-50 border-transparent dark:bg-slate-800"
                    }`}
                  >
                    <div className={`${cat.color} mb-1`}>
                      <cat.icon size={24} />
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        transCategory === cat.id
                          ? "text-blue-600 dark:text-white"
                          : "text-slate-500"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2">
            <Input
              label="備註 / 細項 (選填)"
              value={transTitle}
              onChange={(e) => setTransTitle(e.target.value)}
              placeholder={
                transType === "expense" ? "例如: 麥當勞" : "例如: 獎金"
              }
            />
            {transType === "expense" && (
              <Select
                label="扣款帳戶"
                value={transFrom}
                onChange={(e) => setTransFrom(e.target.value)}
                options={accounts.map((a) => ({
                  value: a.id,
                  label: `${a.name} ($${(
                    Number(a.balance) || 0
                  ).toLocaleString()})`,
                }))}
              />
            )}
            {transType === "income" && (
              <Select
                label="存入帳戶"
                value={transTo}
                onChange={(e) => setTransTo(e.target.value)}
                options={accounts.map((a) => ({ value: a.id, label: a.name }))}
              />
            )}
            {transType === "transfer" && (
              <>
                <Select
                  label="從 (轉出)"
                  value={transFrom}
                  onChange={(e) => setTransFrom(e.target.value)}
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: `${a.name} ($${(
                      Number(a.balance) || 0
                    ).toLocaleString()})`,
                  }))}
                />
                <Select
                  label="到 (轉入)"
                  value={transTo}
                  onChange={(e) => setTransTo(e.target.value)}
                  options={accounts
                    .filter((a) => a.id !== transFrom)
                    .map((a) => ({ value: a.id, label: a.name }))}
                />
              </>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            {editingTransaction && (
              <Button
                onClick={() => {
                  handleDeleteTransaction(editingTransaction.id);
                  setShowTransModal(false);
                }}
                variant="danger"
                className="px-4"
              >
                <Trash2 size={20} />
              </Button>
            )}
            <Button
              onClick={handleAddTransaction}
              className="flex-1 py-4 text-lg"
            >
              {editingTransaction
                ? "儲存修改"
                : `確認${
                    transType === "expense"
                      ? "支出"
                      : transType === "income"
                      ? "入帳"
                      : "轉帳"
                  }`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountModal = () => {
  const {
    showAccountModal,
    setShowAccountModal,
    editingAccount,
    accName,
    setAccName,
    accType,
    setAccType,
    accBalance,
    setAccBalance,
    accColor,
    setAccColor,
  } = useContext(UIContext);
  const { handleSaveAccount, handleDeleteAccount } = useContext(DataContext);
  if (!showAccountModal) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          {editingAccount ? "編輯帳戶" : "新增帳戶"}
        </h3>
        <div className="space-y-4">
          <Input
            label="帳戶名稱"
            value={accName}
            onChange={(e) => setAccName(e.target.value)}
            placeholder="例如: 台新、Bitfinex"
          />
          <Select
            label="帳戶類型"
            value={accType}
            onChange={(e) => setAccType(e.target.value)}
            options={ACCOUNT_TYPES}
          />
          <Input
            label="目前餘額"
            type="number"
            value={accBalance}
            onChange={(e) => setAccBalance(e.target.value)}
            placeholder="0"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              標籤顏色
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    accColor === c
                      ? "border-slate-600 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            {editingAccount && (
              <Button
                onClick={handleDeleteAccount}
                variant="danger"
                className="px-3"
              >
                <Trash2 size={20} />
              </Button>
            )}
            <Button onClick={handleSaveAccount} className="flex-1">
              儲存
            </Button>
          </div>
          <button
            onClick={() => setShowAccountModal(false)}
            className="w-full text-center text-sm text-slate-500 py-2"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = () => {
  const { showSettings, setShowSettings, isDarkMode, setIsDarkMode } =
    useContext(UIContext);
  const {
    defaultExpenseAccId,
    setDefaultExpenseAccId,
    accounts,
    exchangeRate,
    setExchangeRate,
    user,
    handleExportData,
    handleImportData,
  } = useContext(DataContext);
  const fileInputRef = useRef(null);

  if (!showSettings) return null;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        handleImportData(data);
        alert("資料匯入成功！雲端同步中...");
        setShowSettings(false);
      } catch (err) {
        alert("檔案格式錯誤");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-xs rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          設定
        </h3>
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-green-600 dark:text-green-400 uppercase">
              <Globe size={12} /> 美金匯率設定 (USD/TWD)
            </div>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-center font-bold"
              placeholder="32.0"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase">
              <FileJson size={12} /> 資料備份與還原
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportData}
                className="flex-1 py-2 text-xs h-auto bg-slate-200 text-slate-700 hover:bg-slate-300 border-none"
              >
                <Download size={12} className="mr-1" /> 下載 JSON
              </Button>
              <Button
                onClick={() => fileInputRef.current.click()}
                className="flex-1 py-2 text-xs h-auto bg-slate-200 text-slate-700 hover:bg-slate-300 border-none"
              >
                <FileJson size={12} className="mr-1" /> 匯入備份
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                style={{ display: "none" }}
                accept=".json"
              />
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon size={20} className="text-purple-400" />
              ) : (
                <Sun size={20} className="text-orange-400" />
              )}
              <span className="text-slate-700 dark:text-slate-200">
                深色模式
              </span>
            </div>
          </button>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              預設扣款帳戶
            </label>
            <select
              value={
                typeof defaultExpenseAccId === "string"
                  ? defaultExpenseAccId
                  : ""
              }
              onChange={(e) => setDefaultExpenseAccId(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
            <div className="text-xs text-slate-500 mb-2 text-center">
              目前登入: {user?.email}
            </div>
            <button
              onClick={() => {
                signOut(auth);
                setShowSettings(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 font-bold"
            >
              <LogOut size={16} />
              <span>登出帳號</span>
            </button>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowSettings(false)}
        >
          關閉
        </Button>
      </div>
    </div>
  );
};

const TradeModal = () => {
  const {
    showTradeModal,
    setShowTradeModal,
    tradeType,
    tradeSymbol,
    setTradeSymbol,
    tradeName,
    setTradeName,
    tradeQuantity,
    setTradeQuantity,
    tradePrice,
    setTradePrice,
    tradeAccount,
    setTradeAccount,
    tradeAssetType,
    setTradeAssetType,
    tradeDate,
    setTradeDate,
    isHistorical,
    setIsHistorical,
    tradeCurrency,
    setTradeCurrency,
  } = useContext(UIContext);
  const { investments, accounts, handleTrade, exchangeRate } =
    useContext(DataContext);

  if (!showTradeModal) return null;
  const numericPrice = parseFloat(tradePrice) || 0;
  const numericQty = parseFloat(tradeQuantity) || 0;
  const rate = tradeCurrency === "USD" ? parseFloat(exchangeRate) || 1 : 1;
  const estimatedCost = Math.round(numericPrice * numericQty * rate);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          {tradeType === "buy" ? "買入資產" : "賣出資產"}
        </h3>
        <div className="space-y-4">
          {tradeType === "buy" ? (
            <>
              <Input
                label="標的代號"
                value={tradeSymbol}
                onChange={(e) => setTradeSymbol(e.target.value)}
                placeholder="例: AAPL, BTC, 2330"
              />
              <Input
                label="標的名稱"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="例: Apple, Bitcoin, 台積電"
              />
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTradeAssetType("stock")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                    tradeAssetType === "stock"
                      ? "bg-blue-50 border-blue-500 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  股票
                </button>
                <button
                  onClick={() => setTradeAssetType("crypto")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                    tradeAssetType === "crypto"
                      ? "bg-purple-50 border-purple-500 text-purple-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  加密貨幣
                </button>
              </div>
            </>
          ) : (
            <Select
              label="選擇持倉"
              value={tradeSymbol}
              onChange={(e) => {
                const inv = investments.find(
                  (i) => i.symbol === e.target.value
                );
                setTradeSymbol(e.target.value);
                if (inv) {
                  setTradeName(inv.name);
                  setTradeAssetType(inv.type);
                  setTradeCurrency(inv.currency || "TWD");
                }
              }}
              options={[
                { value: "", label: "請選擇" },
                ...investments.map((i) => ({ value: i.symbol, label: i.name })),
              ]}
            />
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="交易日期"
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mb-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setTradeCurrency("TWD")}
              className={`flex-1 py-1.5 text-xs rounded-md transition-all font-bold ${
                tradeCurrency === "TWD"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              台幣 (TWD)
            </button>
            <button
              onClick={() => setTradeCurrency("USD")}
              className={`flex-1 py-1.5 text-xs rounded-md transition-all font-bold ${
                tradeCurrency === "USD"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              美金 (USD)
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label={`單價 (${tradeCurrency})`}
                type="number"
                value={tradePrice}
                onChange={(e) => setTradePrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <Input
                label="數量"
                type="number"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {tradeType === "buy" && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <input
                type="checkbox"
                id="historical-check"
                checked={isHistorical}
                onChange={(e) => setIsHistorical(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="historical-check"
                className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none"
              >
                補登舊紀錄 (不扣除帳戶餘額)
              </label>
            </div>
          )}
          {!isHistorical && (
            <>
              <Select
                label="扣款/入帳帳戶 (台幣)"
                value={tradeAccount}
                onChange={(e) => setTradeAccount(e.target.value)}
                options={accounts.map((a) => ({
                  value: a.id,
                  label: `${a.name} ($${(
                    Number(a.balance) || 0
                  ).toLocaleString()})`,
                }))}
              />
              {tradeCurrency === "USD" && (
                <div className="text-right text-xs text-slate-500 mb-2">
                  匯率: {exchangeRate} | 預計金額:{" "}
                  <span className="font-bold text-slate-800 dark:text-white">
                    NT$ {estimatedCost.toLocaleString()}
                  </span>
                </div>
              )}
            </>
          )}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => setShowTradeModal(false)}
              variant="secondary"
              className="flex-1"
            >
              取消
            </Button>
            <Button onClick={handleTrade} className="flex-1">
              確認交易
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditInvestmentModal = () => {
  const {
    showEditInvModal,
    setShowEditInvModal,
    editingInv,
    editInvSymbol,
    setEditInvSymbol,
    editInvName,
    setEditInvName,
    editInvQty,
    setEditInvQty,
    editInvPrice,
    setEditInvPrice,
    editInvCurrency,
    setEditInvCurrency,
    editInvType,
    setEditInvType,
  } = useContext(UIContext);
  const { handleSaveEditInv, handleDeleteInv } = useContext(DataContext);

  if (!showEditInvModal || !editingInv) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          校正庫存資料
        </h3>
        <p className="text-[10px] text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
          此功能僅用於手動校正庫存(例如配股、輸入錯誤)，修改後不會連動或扣除現金帳戶餘額。
        </p>

        <div className="space-y-4">
          <Input
            label="標的代號"
            value={editInvSymbol}
            onChange={(e) => setEditInvSymbol(e.target.value)}
          />
          <Input
            label="標的名稱"
            value={editInvName}
            onChange={(e) => setEditInvName(e.target.value)}
          />

          <div className="flex gap-2 mb-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setEditInvCurrency("TWD")}
              className={`flex-1 py-1.5 text-xs rounded-md transition-all font-bold ${
                editInvCurrency === "TWD"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              台幣 (TWD)
            </button>
            <button
              onClick={() => setEditInvCurrency("USD")}
              className={`flex-1 py-1.5 text-xs rounded-md transition-all font-bold ${
                editInvCurrency === "USD"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              美金 (USD)
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="總數量"
                type="number"
                value={editInvQty}
                onChange={(e) => setEditInvQty(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                label={`持有均價`}
                type="number"
                value={editInvPrice}
                onChange={(e) => setEditInvPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button onClick={handleDeleteInv} variant="danger" className="px-4">
              <Trash2 size={20} />
            </Button>
            <Button onClick={handleSaveEditInv} className="flex-1">
              儲存校正
            </Button>
          </div>
          <button
            onClick={() => setShowEditInvModal(false)}
            className="w-full text-center text-sm text-slate-500 py-2"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

// 🌟 最先進穩定的架構：直接串接 Binance 與 台灣證交所 官方開放 API
const PriceUpdateModal = () => {
  const {
    showPriceModal,
    setShowPriceModal,
    priceUpdates,
    setPriceUpdates,
    isFetchingPrice,
    setIsFetchingPrice,
  } = useContext(UIContext);
  const { investments, handleUpdatePrices, exchangeRate } =
    useContext(DataContext);

  if (!showPriceModal) return null;

  const handleAutoFetch = async () => {
    setIsFetchingPrice(true);
    let successCount = 0;
    let failedSymbols = [];
    const newUpdates = { ...priceUpdates };

    try {
      // 1. 加密貨幣：直接呼叫 Binance (幣安) 官方 API，極度穩定零阻擋
      const cryptos = investments.filter((inv) => inv.type === "crypto");
      if (cryptos.length > 0) {
        try {
          // 幣安的 Ticker 介面回傳全球報價，且不擋前端 CORS
          const res = await fetch(
            "https://api.binance.com/api/v3/ticker/price"
          );
          const data = await res.json();
          cryptos.forEach((inv) => {
            // 容錯處理：自動過濾使用者輸入的 "-", "/", 或 "USD" 以符合幣安格式 (例如 BTC-USD -> BTCUSDT)
            const cleanSym = inv.symbol.toUpperCase().replace(/[^A-Z]/g, "");
            const targetSym = cleanSym.includes("USD")
              ? cleanSym.replace("USD", "USDT")
              : cleanSym + "USDT";

            const match = data.find((d) => d.symbol === targetSym);
            if (match) {
              newUpdates[inv.id] = parseFloat(match.price);
              successCount++;
            } else {
              failedSymbols.push(inv.symbol);
            }
          });
        } catch (e) {
          console.error("Binance 抓取失敗", e);
          cryptos.forEach((c) => failedSymbols.push(c.symbol));
        }
      }

      // 2. 台灣股市：直接呼叫 台灣證券交易所 (TWSE) 官方 OpenAPI
      const twStocks = investments.filter(
        (inv) => inv.type === "stock" && /^\d{4}$/.test(inv.symbol.trim())
      );
      if (twStocks.length > 0) {
        try {
          // 這是政府證交所的公開資料庫，拿每日收盤價，完全開放不擋連線
          const res = await fetch(
            "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"
          );
          const data = await res.json();
          twStocks.forEach((inv) => {
            const match = data.find((d) => d.Code === inv.symbol.trim());
            if (match && match.ClosingPrice) {
              // 證交所的數字可能有逗號，需過濾
              newUpdates[inv.id] = parseFloat(
                match.ClosingPrice.replace(/,/g, "")
              );
              successCount++;
            } else {
              failedSymbols.push(inv.symbol);
            }
          });
        } catch (e) {
          console.error("證交所 OpenAPI 抓取失敗", e);
          twStocks.forEach((c) => failedSymbols.push(c.symbol));
        }
      }

      // 3. 美股/其他 ETF：暫時保留雙重代理，作為最後手段
      const otherStocks = investments.filter(
        (inv) => inv.type === "stock" && !/^\d{4}$/.test(inv.symbol.trim())
      );
      if (otherStocks.length > 0) {
        const symbolsToFetch = otherStocks
          .map((inv) => {
            let sym = inv.symbol.toUpperCase().trim();
            if (sym.includes(".TW")) sym = sym; // 如果原本就帶有後綴就不動
            return sym;
          })
          .join(",");

        const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsToFetch}`;
        const proxy1 = `https://api.allorigins.win/get?url=${encodeURIComponent(
          targetUrl
        )}`;

        try {
          const res = await fetch(proxy1);
          const raw = await res.json();
          const parsed = JSON.parse(raw.contents);
          const quotes = parsed.quoteResponse.result;

          otherStocks.forEach((inv) => {
            let sym = inv.symbol.toUpperCase().trim();
            const quote = quotes.find((q) => q.symbol === sym);
            if (quote && quote.regularMarketPrice) {
              newUpdates[inv.id] =
                Math.round(quote.regularMarketPrice * 100) / 100;
              successCount++;
            } else {
              failedSymbols.push(inv.symbol);
            }
          });
        } catch (e) {
          console.error("美股代理抓取失敗", e);
          otherStocks.forEach((c) => failedSymbols.push(c.symbol));
        }
      }

      setPriceUpdates(newUpdates);

      // 結果回報
      if (failedSymbols.length === 0 && successCount > 0) {
        alert(`✅ 成功抓取所有 (${successCount} 筆) 最新報價！`);
      } else if (successCount > 0) {
        alert(
          `✅ 成功抓取 ${successCount} 筆報價。\n\n⚠️ 以下標的抓取失敗 (可能是美股代理被擋)：\n${failedSymbols.join(
            ", "
          )}`
        );
      } else {
        alert(`❌ 所有報價皆抓取失敗！請檢查代號或網路連線。`);
      }
    } catch (err) {
      alert("系統發生未預期錯誤，請稍後再試。");
    }
    setIsFetchingPrice(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            更新現價
          </h3>
          <button
            onClick={handleAutoFetch}
            disabled={isFetchingPrice}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={isFetchingPrice ? "animate-spin" : ""}
            />
            {isFetchingPrice ? "官方連線中..." : "自動抓取"}
          </button>
        </div>
        <div className="text-xs text-slate-500 mb-2 text-right">
          目前匯率: 1 USD = {exchangeRate} TWD
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {investments.map((inv) => (
            <div key={inv.id} className="flex items-center gap-3">
              <div className="w-20">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {inv.symbol}
                </div>
                <div className="text-[10px] text-slate-400">
                  {inv.currency === "USD" ? "美金" : "台幣"}
                </div>
              </div>
              <input
                type="number"
                placeholder={inv.currentPrice}
                value={
                  priceUpdates[inv.id] !== undefined
                    ? priceUpdates[inv.id]
                    : inv.currentPrice
                }
                onChange={(e) =>
                  setPriceUpdates({ ...priceUpdates, [inv.id]: e.target.value })
                }
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-right"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setShowPriceModal(false)}
            variant="secondary"
            className="flex-1"
          >
            取消
          </Button>
          <Button onClick={handleUpdatePrices} className="flex-1">
            確認更新
          </Button>
        </div>
      </div>
    </div>
  );
};

const SalaryRuleModal = () => {
  const {
    showRuleModal,
    setShowRuleModal,
    editingRule,
    ruleName,
    setRuleName,
    ruleType,
    setRuleType,
    ruleValue,
    setRuleValue,
    ruleTarget,
    setRuleTarget,
  } = useContext(UIContext);
  const { handleSaveRule, handleDeleteRule, accounts } =
    useContext(DataContext);
  if (!showRuleModal) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          {editingRule ? "編輯分配規則" : "新增分配規則"}
        </h3>
        <div className="space-y-4">
          <Input
            label="規則名稱"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="例如: 房租"
          />
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              分配方式
            </label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setRuleType("percent")}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  ruleType === "percent"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                百分比 (%)
              </button>
              <button
                onClick={() => setRuleType("fixed")}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  ruleType === "fixed"
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                固定金額 ($)
              </button>
            </div>
            <Input
              label={ruleType === "percent" ? "分配比例 (%)" : "固定金額 ($)"}
              type="number"
              value={ruleValue}
              onChange={(e) => setRuleValue(e.target.value)}
              placeholder={ruleType === "percent" ? "20" : "3000"}
            />
          </div>
          <Select
            label="轉入目標帳戶"
            value={ruleTarget}
            onChange={(e) => setRuleTarget(e.target.value)}
            options={accounts.map((a) => ({ value: a.id, label: a.name }))}
          />
          <div className="flex gap-3 pt-2">
            {editingRule && (
              <Button
                onClick={handleDeleteRule}
                variant="danger"
                className="px-3"
              >
                <Trash2 size={20} />
              </Button>
            )}
            <Button onClick={handleSaveRule} className="flex-1">
              儲存
            </Button>
          </div>
          <button
            onClick={() => setShowRuleModal(false)}
            className="w-full text-center text-sm text-slate-500 py-2"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

const InvestmentHistoryModal = () => {
  const { showInvHistoryModal, setShowInvHistoryModal, viewingInv } =
    useContext(UIContext);
  const { transactions } = useContext(DataContext);
  if (!showInvHistoryModal || !viewingInv) return null;
  const history = transactions.filter(
    (t) =>
      t.category === "investment" &&
      ((t.investmentDetails &&
        t.investmentDetails.symbol === viewingInv.symbol) ||
        t.title.includes(viewingInv.name) ||
        t.title.includes(viewingInv.symbol))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History size={20} className="text-blue-500" />
            {viewingInv.name} 交易紀錄
          </h3>
          <button
            onClick={() => setShowInvHistoryModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              尚無詳細交易紀錄
            </div>
          ) : (
            history.map((t) => {
              const isBuy = t.type === "expense";
              const details = t.investmentDetails || {};
              return (
                <div
                  key={t.id}
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          isBuy
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isBuy ? "買入" : "賣出"}
                      </span>
                      <span className="text-xs text-slate-500">{t.date}</span>
                    </div>
                    {details.price ? (
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        {Number(details.quantity).toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}{" "}
                        單位 @ ${Number(details.price).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        早期紀錄 (無詳細單價)
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">
                      ${(t.amount || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      總金額(台幣)
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. 視圖 (Views)
// ==========================================
const Dashboard = () => {
  const {
    totalNetWorth,
    totalInvestmentValue,
    pieData,
    transactions,
    cashAssets,
    lendingAssets,
    displayDebt,
  } = useContext(DataContext);
  const { openTransactionModal, setActiveTab } = useContext(UIContext);

  const safeNetWorth = (totalNetWorth || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const safeCash = (cashAssets || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const safeInvest = (totalInvestmentValue || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const safeLend = (lendingAssets || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const safeDebt = Math.abs(displayDebt || 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-slate-400 text-sm font-medium mb-1">
            總資產淨值 (約當台幣)
          </div>
          <div className="text-4xl font-bold tracking-tight mb-4">
            ${safeNetWorth}
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 mb-4 border-t border-slate-700 pt-3">
            <div>
              <div className="mb-1">現金資產</div>
              <div className="text-base font-bold text-white">${safeCash}</div>
            </div>
            <div>
              <div className="mb-1">投資市值</div>
              <div className="text-base font-bold text-white">
                ${safeInvest}
              </div>
            </div>
            <div>
              <div className="mb-1">放貸資產</div>
              <div className="text-base font-bold text-blue-300">
                ${safeLend}
              </div>
            </div>
            <div>
              <div className="mb-1">其他負債 (信貸等)</div>
              <div className="text-base font-bold text-red-400">
                -{safeDebt === "0" ? "0" : safeDebt}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => openTransactionModal("income")}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
            >
              <PlusCircle size={16} /> 入帳
            </button>
            <button
              onClick={() => openTransactionModal("expense")}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
            >
              <MinusCircle size={16} /> 支出
            </button>
            <button
              onClick={() => openTransactionModal("transfer")}
              className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex items-center justify-center gap-1 text-sm shadow-lg shadow-blue-900/50"
            >
              <ArrowRightLeft size={16} /> 轉帳
            </button>
          </div>
        </div>
      </div>
      <Card className="p-5">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">
          總體資產分佈
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-bold text-slate-800 dark:text-white">近期交易</h3>
          <button
            onClick={() => setActiveTab("history")}
            className="text-xs text-blue-500 font-medium hover:text-blue-600"
          >
            查看全部
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t) => {
            let catDetails =
              t.category === "investment"
                ? {
                    icon: TrendingUp,
                    bg: "bg-purple-100 text-purple-600",
                    color: "text-purple-600",
                  }
                : t.category === "loan"
                ? {
                    icon: Banknote,
                    bg: "bg-slate-200 text-slate-600",
                    color: "text-slate-600",
                  }
                : getCategoryDetails(t.category, t.type);
            if (t.type === "transfer")
              catDetails = {
                icon: ArrowRightLeft,
                bg: "bg-blue-100 text-blue-600",
                color: "text-blue-600",
              };
            const IconComp = catDetails.icon || PlusCircle;
            return (
              <Card
                key={t.id}
                onClick={() => openTransactionModal(t)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${catDetails.bg} ${catDetails.color}`}
                  >
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {t.type === "transfer"
                        ? "內部轉帳"
                        : catDetails.name || t.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.date} • {t.title}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    t.type === "income"
                      ? "text-green-600"
                      : t.type === "expense"
                      ? "text-red-600"
                      : "text-slate-800 dark:text-white"
                  }`}
                >
                  {t.type === "expense"
                    ? "-"
                    : t.type === "transfer"
                    ? ""
                    : "+"}
                  ${(t.amount || 0).toLocaleString()}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AssetsView = () => {
  const { accounts } = useContext(DataContext);
  const { openAccountModal } = useContext(UIContext);
  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          資金帳戶 (現金)
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-2">點擊卡片即可編輯名稱或餘額</p>
      {accounts.map((acc) => (
        <div key={acc.id} onClick={() => openAccountModal(acc)}>
          <Card className="p-5 flex items-center justify-between group cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1.5 h-full"
              style={{ backgroundColor: acc.color }}
            ></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {acc.type === "bank" && <Landmark size={24} />}{" "}
                {acc.type === "cash" && <Wallet size={24} />}{" "}
                {acc.type === "crypto" && <Coins size={24} />}{" "}
                {acc.type === "stock" && <TrendingUp size={24} />}{" "}
                {acc.type === "credit" && <CreditCard size={24} />}{" "}
                {acc.type === "loan" && <Banknote size={24} />}
              </div>
              <div>
                <div className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  {acc.name}{" "}
                  <Pencil
                    size={12}
                    className="text-slate-300 opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  {ACCOUNT_TYPES.find((t) => t.value === acc.type)?.label ||
                    acc.type}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`font-bold text-xl ${
                  acc.balance < 0
                    ? "text-red-500"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                ${(acc.balance || 0).toLocaleString()}
              </div>
              {acc.balance < 0 && (
                <div className="text-xs text-red-400">負債/待繳</div>
              )}
            </div>
          </Card>
        </div>
      ))}
      <Button
        onClick={() => openAccountModal()}
        variant="outline"
        className="w-full border-dashed border-2 py-4 text-slate-400"
      >
        + 新增帳戶
      </Button>
    </div>
  );
};

const InvestmentView = () => {
  const { investments, totalInvestmentValue, exchangeRate } =
    useContext(DataContext);
  const { setShowPriceModal, openTradeModal, openInvHistory, openEditInv } =
    useContext(UIContext);
  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            投資持倉
          </h2>
          <p className="text-xs text-slate-500">
            庫存價值 (約當): NT$
            {(totalInvestmentValue || 0).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <Button
          onClick={() => setShowPriceModal(true)}
          variant="secondary"
          className="py-2 text-xs"
        >
          <RefreshCw size={14} /> 更新市價
        </Button>
      </div>
      <div className="space-y-3">
        {investments.map((inv) => {
          const isUSD = inv.currency === "USD";
          const rate = isUSD ? parseFloat(exchangeRate) || 1 : 1;
          const marketValueTWD = inv.quantity * inv.currentPrice * rate;
          const costBasisTWD = inv.quantity * inv.avgPrice * rate;
          const profitTWD = marketValueTWD - costBasisTWD;
          const profitPercent =
            costBasisTWD > 0
              ? ((profitTWD / costBasisTWD) * 100).toFixed(2)
              : 0;
          return (
            <Card key={inv.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      inv.symbol.includes("TW")
                        ? "bg-orange-500"
                        : "bg-indigo-500"
                    }`}
                  >
                    {inv.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {inv.name}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {inv.symbol}{" "}
                      <span className="ml-1 text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded">
                        {inv.currency || "TWD"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">
                    NT$
                    {marketValueTWD.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      profitTWD >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profitTWD >= 0 ? "+" : ""}
                    {profitTWD.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    ({profitPercent}%)
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg mb-3">
                <div>
                  <span className="block mb-0.5">持倉</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {Number(inv.quantity).toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })}
                  </span>
                </div>
                <div>
                  <span className="block mb-0.5">均價(原幣)</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    ${inv.avgPrice.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block mb-0.5">現價(原幣)</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    ${inv.currentPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => openInvHistory(inv)}
                  variant="outline"
                  className="flex-1 py-1.5 h-auto text-xs text-slate-500 border-dashed hover:text-blue-500 hover:border-blue-500"
                >
                  <History size={12} className="mr-1" /> 歷史紀錄
                </Button>
                <Button
                  onClick={() => openEditInv(inv)}
                  variant="outline"
                  className="flex-1 py-1.5 h-auto text-xs text-slate-500 border-dashed hover:text-orange-500 hover:border-orange-500"
                >
                  <Pencil size={12} className="mr-1" /> 編輯庫存
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => openTradeModal("buy")}
          className="flex-1"
          icon={ArrowUpRight}
        >
          買入資產
        </Button>
        <Button
          onClick={() => openTradeModal("sell")}
          variant="secondary"
          className="flex-1"
          icon={ArrowDownLeft}
        >
          賣出資產
        </Button>
      </div>
    </div>
  );
};

const SalaryTool = () => {
  const { salaryRules, accounts, executeSalaryAllocation } =
    useContext(DataContext);
  const { openRuleModal } = useContext(UIContext);
  const [salaryInput, setSalaryInput] = useState("");
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          薪水分配器
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          一鍵將薪資自動分配至各個帳戶與基金。
        </p>
      </div>
      <Card className="p-6 border-blue-200 dark:border-blue-900 shadow-blue-100 dark:shadow-none">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          本月薪資收入
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
            $
          </span>
          <input
            type="number"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            className="w-full pl-8 pr-4 py-4 text-2xl font-bold rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            placeholder="0"
          />
        </div>
      </Card>
      {salaryInput && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-slate-800 dark:text-white px-1">
            分配預覽
          </h3>
          {salaryRules.map((rule) => {
            const amt =
              rule.type === "fixed"
                ? rule.value
                : Math.floor(salaryInput * (rule.value / 100));
            return (
              <div
                key={rule.id}
                className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      rule.type === "fixed"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {rule.type === "fixed" ? "$" : "%"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {rule.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      轉入:{" "}
                      {accounts.find((a) => a.id === rule.targetAccountId)
                        ?.name || "未知帳戶"}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-slate-800 dark:text-white">
                  ${amt.toLocaleString()}
                </div>
              </div>
            );
          })}
          <Button
            onClick={() => {
              executeSalaryAllocation(salaryInput);
              setSalaryInput("");
            }}
            className="w-full mt-4 py-4 text-lg shadow-xl shadow-blue-200 dark:shadow-none"
          >
            確認並執行分配
          </Button>
        </div>
      )}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white">
            分配規則設定
          </h3>
          <Button
            onClick={() => openRuleModal()}
            variant="outline"
            className="text-xs py-1 px-3 h-auto"
          >
            新增規則
          </Button>
        </div>
        <div className="space-y-2">
          {salaryRules.map((rule) => (
            <div
              key={rule.id}
              onClick={() => openRuleModal(rule)}
              className="text-sm text-slate-600 dark:text-slate-400 flex justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
            >
              <div className="flex gap-2 items-center">
                <span>{rule.name}</span>
                <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                  {accounts.find((a) => a.id === rule.targetAccountId)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">
                  {rule.type === "fixed" ? `$${rule.value}` : `${rule.value}%`}
                </span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoryView = () => {
  const { transactions } = useContext(DataContext);
  const { setActiveTab, openTransactionModal } = useContext(UIContext);
  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [transactions]);
  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          className="p-2 h-auto"
          onClick={() => setActiveTab("dashboard")}
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          歷史交易紀錄
        </h2>
      </div>
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center text-slate-500 py-10">目前沒有交易紀錄</div>
      ) : (
        Object.keys(groupedTransactions)
          .sort((a, b) => b.localeCompare(a))
          .map((monthKey) => (
            <div key={monthKey} className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mt-4">
                {monthKey}
              </h3>
              {groupedTransactions[monthKey].map((t) => {
                let catDetails =
                  t.category === "investment"
                    ? {
                        icon: TrendingUp,
                        bg: "bg-purple-100 text-purple-600",
                        color: "text-purple-600",
                      }
                    : t.category === "loan"
                    ? {
                        icon: Banknote,
                        bg: "bg-slate-200 text-slate-600",
                        color: "text-slate-600",
                      }
                    : getCategoryDetails(t.category, t.type);
                if (t.type === "transfer")
                  catDetails = {
                    icon: ArrowRightLeft,
                    bg: "bg-blue-100 text-blue-600",
                    color: "text-blue-600",
                  };
                const IconComp = catDetails.icon || PlusCircle;
                return (
                  <Card
                    key={t.id}
                    onClick={() => openTransactionModal(t)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${catDetails.bg} ${catDetails.color}`}
                      >
                        <IconComp size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {t.type === "transfer"
                            ? "內部轉帳"
                            : catDetails.name || t.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {t.date} • {t.title}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        t.type === "income"
                          ? "text-green-600"
                          : t.type === "expense"
                          ? "text-red-600"
                          : "text-slate-800 dark:text-white"
                      }`}
                    >
                      {t.type === "expense"
                        ? "-"
                        : t.type === "transfer"
                        ? ""
                        : "+"}
                      ${(t.amount || 0).toLocaleString()}
                    </div>
                  </Card>
                );
              })}
            </div>
          ))
      )}
    </div>
  );
};

const ReportView = () => {
  const { transactions } = useContext(DataContext);
  const [currentMonthStr, setCurrentMonthStr] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handlePrevMonth = () => {
    const d = new Date(`${currentMonthStr}-01`);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonthStr(d.toISOString().slice(0, 7));
  };
  const handleNextMonth = () => {
    const d = new Date(`${currentMonthStr}-01`);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonthStr(d.toISOString().slice(0, 7));
  };

  const { monthlyIncome, monthlyExpense, expensePieData, sortedExpenses } =
    useMemo(() => {
      const monthlyTrans = transactions.filter((t) =>
        t.date.startsWith(currentMonthStr)
      );
      let inc = 0,
        exp = 0;
      const catSum = {};

      monthlyTrans.forEach((t) => {
        if (t.type === "income" && t.category !== "investment") inc += t.amount;
        if (t.type === "expense" && t.category !== "investment") {
          exp += t.amount;
          catSum[t.category] = (catSum[t.category] || 0) + t.amount;
        }
      });

      const pieData = Object.entries(catSum)
        .map(([catId, amount]) => {
          const catDetail = EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
            name: "其他",
          };
          return {
            name: catDetail.name,
            value: amount,
            id: catId,
            icon: catDetail.icon,
          };
        })
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length],
        }));

      return {
        monthlyIncome: inc,
        monthlyExpense: exp,
        expensePieData: pieData,
        sortedExpenses: pieData,
      };
    }, [transactions, currentMonthStr]);

  const netFlow = monthlyIncome - monthlyExpense;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          財務報表
        </h2>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-100 dark:border-slate-700">
          <button
            onClick={handlePrevMonth}
            className="p-1 text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold w-16 text-center">
            {currentMonthStr.replace("-", " / ")}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 text-slate-500 hover:text-slate-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
          <div className="text-xs text-slate-500 mb-1">總收入 (不含投資)</div>
          <div className="text-xl font-bold text-green-600">
            ${monthlyIncome.toLocaleString()}
          </div>
        </Card>
        <Card className="p-4 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
          <div className="text-xs text-slate-500 mb-1">總支出 (不含投資)</div>
          <div className="text-xl font-bold text-red-500">
            ${monthlyExpense.toLocaleString()}
          </div>
        </Card>
        <Card className="col-span-2 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              本月結餘淨流入
            </div>
            <div
              className={`text-2xl font-black ${
                netFlow >= 0 ? "text-slate-800 dark:text-white" : "text-red-500"
              }`}
            >
              {netFlow >= 0 ? "+" : ""}
              {netFlow.toLocaleString()}
            </div>
          </div>
        </Card>
      </div>

      {monthlyExpense > 0 ? (
        <Card className="p-5">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">
            各項支出佔比
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {sortedExpenses.map((item) => {
              const percent = ((item.value / monthlyExpense) * 100).toFixed(1);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 w-10 text-right">
                      {percent}%
                    </span>
                    <span className="font-bold w-16 text-right">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="text-center py-10 text-slate-400 text-sm">
          本月尚無任何生活支出紀錄
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. 主程式 (核心邏輯與畫面組裝)
// ==========================================
const MainApp = ({ user }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("asset_manager_theme") || "false");
    } catch {
      return false;
    }
  });

  const [showTransModal, setShowTransModal] = useState(false);
  const [transType, setTransType] = useState("expense");
  const [transCategory, setTransCategory] = useState("");
  const [transAmount, setTransAmount] = useState("");
  const [transTitle, setTransTitle] = useState("");
  const [transFrom, setTransFrom] = useState("");
  const [transTo, setTransTo] = useState("");
  const [transDate, setTransDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accName, setAccName] = useState("");
  const [accType, setAccType] = useState("bank");
  const [accBalance, setAccBalance] = useState("");
  const [accColor, setAccColor] = useState(COLORS[0]);

  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState("buy");
  const [tradeSymbol, setTradeSymbol] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [tradeQuantity, setTradeQuantity] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const [tradeAccount, setTradeAccount] = useState("");
  const [tradeAssetType, setTradeAssetType] = useState("stock");
  const [tradeDate, setTradeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isHistorical, setIsHistorical] = useState(false);
  const [tradeCurrency, setTradeCurrency] = useState("TWD");

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("percent");
  const [ruleValue, setRuleValue] = useState("");
  const [ruleTarget, setRuleTarget] = useState("");

  const [showInvHistoryModal, setShowInvHistoryModal] = useState(false);
  const [viewingInv, setViewingInv] = useState(null);

  const [showEditInvModal, setShowEditInvModal] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [editInvSymbol, setEditInvSymbol] = useState("");
  const [editInvName, setEditInvName] = useState("");
  const [editInvQty, setEditInvQty] = useState("");
  const [editInvPrice, setEditInvPrice] = useState("");
  const [editInvCurrency, setEditInvCurrency] = useState("TWD");
  const [editInvType, setEditInvType] = useState("stock");

  const [accounts, setAccounts, accLoaded] = useCloudState(
    "accounts",
    DEFAULT_ACCOUNTS,
    user
  );
  const [transactions, setTransactions, transLoaded] = useCloudState(
    "transactions",
    DEFAULT_TRANSACTIONS,
    user
  );
  const [investments, setInvestments, invLoaded] = useCloudState(
    "investments",
    DEFAULT_INVESTMENTS,
    user
  );
  const [salaryRules, setSalaryRules, ruleLoaded] = useCloudState(
    "salaryRules",
    DEFAULT_SALARY_RULES,
    user
  );
  const [exchangeRate, setExchangeRate, exLoaded] = useCloudState(
    "exchangeRate",
    32,
    user
  );
  const [defaultExpenseAccId, setDefaultExpenseAccId, defAccLoaded] =
    useCloudState("defaultExpenseAccId", "5", user);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("asset_manager_theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const allLoaded =
    accLoaded &&
    transLoaded &&
    invLoaded &&
    ruleLoaded &&
    exLoaded &&
    defAccLoaded;

  const handleExportData = () => {
    const data = {
      accounts,
      transactions,
      investments,
      salaryRules,
      exchangeRate,
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wealthflow-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
  };

  const handleImportData = (data) => {
    if (data.accounts) setAccounts(data.accounts);
    if (data.transactions) setTransactions(data.transactions);
    if (data.investments) setInvestments(data.investments);
    if (data.salaryRules) setSalaryRules(data.salaryRules);
    if (data.exchangeRate) setExchangeRate(data.exchangeRate);
  };

  const handleAddTransaction = () => {
    const amt = parseFloat(transAmount);
    if (!amt || isNaN(amt)) return;
    let cat =
      transCategory ||
      (transType === "expense"
        ? "food"
        : transType === "income"
        ? "other_income"
        : "transfer");
    if (transType === "transfer" && (!transTo || transFrom === transTo)) {
      alert("請選擇有效的轉入帳戶，且不能與轉出帳戶相同。");
      return;
    }

    setAccounts((prev) => {
      let updatedAccs = [...prev];
      if (editingTransaction) {
        updatedAccs = updatedAccs.map((a) => {
          let bal = Number(a.balance);
          if (
            editingTransaction.type === "expense" &&
            a.id === editingTransaction.from
          )
            bal += editingTransaction.amount;
          if (
            editingTransaction.type === "income" &&
            a.id === editingTransaction.to
          )
            bal -= editingTransaction.amount;
          if (editingTransaction.type === "transfer") {
            if (a.id === editingTransaction.from)
              bal += editingTransaction.amount;
            if (a.id === editingTransaction.to)
              bal -= editingTransaction.amount;
          }
          return { ...a, balance: bal };
        });
      }
      updatedAccs = updatedAccs.map((a) => {
        let bal = Number(a.balance);
        if (transType === "expense" && a.id === transFrom) bal -= amt;
        if (transType === "income" && a.id === transTo) bal += amt;
        if (transType === "transfer") {
          if (a.id === transFrom) bal -= amt;
          if (a.id === transTo) bal += amt;
        }
        return { ...a, balance: bal };
      });
      return updatedAccs;
    });

    const newTrans = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      date: transDate,
      type: transType,
      category: cat,
      amount: amt,
      title: transTitle,
      from: transFrom,
      to: transTo,
    };

    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTransaction.id ? newTrans : t))
      );
    } else {
      setTransactions((prev) => [newTrans, ...prev]);
    }

    setShowTransModal(false);
    setTransAmount("");
    setTransTitle("");
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    if (!window.confirm("確定刪除這筆交易？帳戶餘額將自動退回。")) return;
    const trans = transactions.find((t) => t.id === id);
    if (!trans) return;

    setAccounts((prev) =>
      prev.map((a) => {
        let bal = Number(a.balance);
        if (trans.type === "expense" && a.id === trans.from)
          bal += trans.amount;
        if (trans.type === "income" && a.id === trans.to) bal -= trans.amount;
        if (trans.type === "transfer") {
          if (a.id === trans.from) bal += trans.amount;
          if (a.id === trans.to) bal -= trans.amount;
        }
        return { ...a, balance: bal };
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTrade = () => {
    const price = parseFloat(tradePrice);
    const qty = parseFloat(tradeQuantity);
    if (!price || !qty) {
      alert("請輸入有效的價格和數量");
      return;
    }
    if (!isHistorical && !tradeAccount) {
      alert("請選擇扣款/入帳帳戶");
      return;
    }
    const rate = tradeCurrency === "USD" ? parseFloat(exchangeRate) || 1 : 1;
    const totalCostTWD = Math.round(price * qty * rate);

    if (tradeType === "buy" && !isHistorical) {
      const acc = accounts.find((a) => a.id === tradeAccount);
      if (!acc || Number(acc.balance) < totalCostTWD) {
        alert(`餘額不足 (預估 NT$${totalCostTWD})`);
        return;
      }
    }
    if (!isHistorical) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === tradeAccount
            ? {
                ...a,
                balance:
                  tradeType === "buy"
                    ? Number(a.balance) - totalCostTWD
                    : Number(a.balance) + totalCostTWD,
              }
            : a
        )
      );
    }

    setInvestments((prev) => {
      let newInvs = [...prev];
      const idx = newInvs.findIndex((i) => i.symbol === tradeSymbol);
      if (idx >= 0) {
        const inv = newInvs[idx];
        if (tradeType === "buy") {
          const newQty = inv.quantity + qty;
          newInvs[idx] = {
            ...inv,
            quantity: newQty,
            avgPrice: (inv.quantity * inv.avgPrice + price * qty) / newQty,
            currentPrice: price,
            currency: tradeCurrency,
          };
        } else {
          const newQty = inv.quantity - qty;
          if (newQty <= 0) newInvs.splice(idx, 1);
          else newInvs[idx] = { ...inv, quantity: newQty, currentPrice: price };
        }
      } else if (tradeType === "buy") {
        newInvs.push({
          id: Date.now(),
          symbol: tradeSymbol,
          name: tradeName,
          type: tradeAssetType,
          quantity: qty,
          avgPrice: price,
          currentPrice: price,
          currency: tradeCurrency,
        });
      }
      return newInvs;
    });
    setTransactions((prev) => [
      {
        id: Date.now(),
        date: tradeDate,
        type: tradeType === "buy" ? "expense" : "income",
        category: "investment",
        amount: totalCostTWD,
        title: `${tradeType === "buy" ? "買入" : "賣出"} ${tradeName} ${
          isHistorical ? "(補登)" : ""
        }`,
        from: tradeType === "buy" && !isHistorical ? tradeAccount : null,
        to: tradeType === "sell" && !isHistorical ? tradeAccount : null,
        investmentDetails: {
          symbol: tradeSymbol,
          price: price,
          quantity: qty,
          currency: tradeCurrency,
        },
      },
      ...prev,
    ]);
    setShowTradeModal(false);
    setTradeSymbol("");
    setTradeName("");
    setTradeQuantity("");
    setTradePrice("");
    setTradeAccount(accounts[0]?.id || "");
    setTradeDate(new Date().toISOString().split("T")[0]);
    setIsHistorical(false);
  };

  const handleUpdatePrices = () => {
    setInvestments((prev) =>
      prev.map((i) =>
        priceUpdates[i.id]
          ? { ...i, currentPrice: parseFloat(priceUpdates[i.id]) }
          : i
      )
    );
    setShowPriceModal(false);
    setPriceUpdates({});
  };

  const handleSaveEditInv = () => {
    setInvestments((prev) =>
      prev.map((i) =>
        i.id === editingInv.id
          ? {
              ...i,
              symbol: editInvSymbol,
              name: editInvName,
              quantity: parseFloat(editInvQty) || 0,
              avgPrice: parseFloat(editInvPrice) || 0,
              currency: editInvCurrency,
              type: editInvType,
            }
          : i
      )
    );
    setShowEditInvModal(false);
  };

  const handleDeleteInv = () => {
    if (
      window.confirm(
        "確定要刪除這個持倉紀錄嗎？\n(注意：此操作為直接刪除資料，不會將任何款項退回現金帳戶)"
      )
    ) {
      setInvestments((prev) => prev.filter((i) => i.id !== editingInv.id));
      setShowEditInvModal(false);
    }
  };

  const handleSaveAccount = () => {
    const bal = parseFloat(accBalance) || 0;
    if (editingAccount)
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingAccount.id
            ? {
                ...a,
                name: accName,
                type: accType,
                balance: bal,
                color: accColor,
              }
            : a
        )
      );
    else
      setAccounts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: accName,
          type: accType,
          balance: bal,
          color: accColor,
        },
      ]);
    setShowAccountModal(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("確定刪除?"))
      setAccounts((prev) => prev.filter((a) => a.id !== editingAccount.id));
    setShowAccountModal(false);
  };

  const handleSaveRule = () => {
    const val = parseFloat(ruleValue);
    if (editingRule)
      setSalaryRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                name: ruleName,
                type: ruleType,
                value: val,
                targetAccountId: ruleTarget,
              }
            : r
        )
      );
    else
      setSalaryRules((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: ruleName,
          type: ruleType,
          value: val,
          targetAccountId: ruleTarget,
        },
      ]);
    setShowRuleModal(false);
  };
  const handleDeleteRule = () => {
    if (window.confirm("確定刪除?"))
      setSalaryRules((prev) => prev.filter((r) => r.id !== editingRule.id));
    setShowRuleModal(false);
  };

  const executeSalaryAllocation = (total) => {
    const salary = parseFloat(total);
    if (!salary) return;
    const newTrans = [];
    let updatedAccs = [...accounts];
    const mainBankId = "1";
    if (!updatedAccs.find((a) => a.id === mainBankId)) {
      alert("請確認有薪資帳戶(ID:1)");
      return;
    }
    updatedAccs = updatedAccs.map((a) =>
      a.id === mainBankId ? { ...a, balance: Number(a.balance) + salary } : a
    );
    newTrans.push({
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: "income",
      category: "salary",
      amount: salary,
      title: "薪資入帳",
      from: null,
      to: mainBankId,
    });
    salaryRules.forEach((r, idx) => {
      if (
        !updatedAccs.find((a) => a.id === r.targetAccountId) ||
        r.targetAccountId === mainBankId
      )
        return;
      const amt =
        r.type === "fixed" ? r.value : Math.floor(salary * (r.value / 100));
      if (amt > 0) {
        newTrans.push({
          id: Date.now() + idx + 1,
          date: new Date().toISOString().split("T")[0],
          type: "transfer",
          category: "transfer",
          amount: amt,
          title: `薪資分配: ${r.name}`,
          from: mainBankId,
          to: r.targetAccountId,
        });
        updatedAccs = updatedAccs.map((a) => {
          const currentBal = Number(a.balance);
          if (a.id === mainBankId) return { ...a, balance: currentBal - amt };
          if (a.id === r.targetAccountId)
            return { ...a, balance: currentBal + amt };
          return a;
        });
      }
    });
    setTransactions((prev) => [...newTrans.reverse(), ...prev]);
    setAccounts(updatedAccs);
    alert("分配完成");
  };

  const derivedData = useMemo(() => {
    if (!allLoaded)
      return {
        totalAccountBalance: 0,
        totalInvestmentValue: 0,
        totalNetWorth: 0,
        pieData: [],
        cashAssets: 0,
        lendingAssets: 0,
        displayDebt: 0,
      };

    let cashAssets = 0;
    let lendingAssets = 0;
    let displayDebt = 0;
    let totalAccountBalance = 0;

    accounts.forEach((acc) => {
      const bal = Number(acc.balance) || 0;
      totalAccountBalance += bal;
      const name = acc.name.toLowerCase();

      if (name.includes("bitfinex") || name.includes("放貸")) {
        lendingAssets += bal;
      } else if (
        name.includes("台新") ||
        name.includes("現實") ||
        name.includes("信用卡") ||
        name.includes("永豐")
      ) {
        cashAssets += bal;
      } else if (bal < 0) {
        displayDebt += bal;
      }
    });

    const totalInvestmentValue = investments.reduce((sum, inv) => {
      const isUSD = inv.currency === "USD";
      const rate = isUSD ? parseFloat(exchangeRate) || 1 : 1;
      return (
        sum +
        (Number(inv.quantity) || 0) * (Number(inv.currentPrice) || 0) * rate
      );
    }, 0);

    let cryptoTotal = 0,
      usStockTotal = 0,
      twStockTotal = 0;
    investments.forEach((inv) => {
      const rate = inv.currency === "USD" ? parseFloat(exchangeRate) || 1 : 1;
      const value =
        (Number(inv.quantity) || 0) * (Number(inv.currentPrice) || 0) * rate;
      if (inv.type === "crypto") cryptoTotal += value;
      else if (inv.type === "stock") {
        if (inv.currency === "USD") usStockTotal += value;
        else twStockTotal += value;
      }
    });
    const invPieData = [];
    if (cryptoTotal > 0)
      invPieData.push({
        name: "加密貨幣",
        value: cryptoTotal,
        color: "#8b5cf6",
      });
    if (usStockTotal > 0)
      invPieData.push({ name: "美股", value: usStockTotal, color: "#0ea5e9" });
    if (twStockTotal > 0)
      invPieData.push({ name: "台股", value: twStockTotal, color: "#f97316" });

    const pieData = [
      ...accounts
        .filter((a) => Number(a.balance) > 0)
        .map((a) => ({
          name: a.name,
          value: Number(a.balance),
          color: a.color,
        })),
      ...invPieData,
    ].sort((a, b) => b.value - a.value);

    return {
      totalAccountBalance,
      totalInvestmentValue,
      totalNetWorth: totalAccountBalance + totalInvestmentValue,
      pieData,
      cashAssets,
      lendingAssets,
      displayDebt,
    };
  }, [accounts, investments, exchangeRate, allLoaded]);

  const openTransactionModal = (typeOrTrans) => {
    if (typeof typeOrTrans === "object") {
      setEditingTransaction(typeOrTrans);
      setTransType(typeOrTrans.type);
      setTransCategory(typeOrTrans.category);
      setTransAmount(typeOrTrans.amount.toString());
      setTransTitle(typeOrTrans.title);
      setTransDate(typeOrTrans.date);
      setTransFrom(typeOrTrans.from || "");
      setTransTo(typeOrTrans.to || "");
    } else {
      setEditingTransaction(null);
      setTransType(typeOrTrans);
      setTransCategory("");
      setTransAmount("");
      setTransTitle("");
      setTransDate(new Date().toISOString().split("T")[0]);
      if (typeOrTrans === "expense") {
        setTransCategory("food");
        setTransFrom(defaultExpenseAccId || accounts[0]?.id || "");
      }
      if (typeOrTrans === "income") {
        setTransCategory("salary");
        setTransTo(accounts[0]?.id || "");
      }
      if (typeOrTrans === "transfer") {
        setTransFrom(accounts[0]?.id || "");
        setTransTo(accounts[1]?.id || "");
      }
    }
    setShowTransModal(true);
  };

  const openAccountModal = (acc = null) => {
    setEditingAccount(acc);
    setAccName(acc ? acc.name : "");
    setAccType(acc ? acc.type : "bank");
    setAccBalance(acc ? acc.balance : "");
    setAccColor(acc ? acc.color : COLORS[0]);
    setShowAccountModal(true);
  };
  const openTradeModal = (type) => {
    setTradeType(type);
    setTradeSymbol("");
    setTradeName("");
    setTradeQuantity("");
    setTradePrice("");
    setTradeAccount(accounts[0]?.id || "");
    setTradeDate(new Date().toISOString().split("T")[0]);
    setShowTradeModal(true);
  };
  const openRuleModal = (rule = null) => {
    setEditingRule(rule);
    setRuleName(rule ? rule.name : "");
    setRuleType(rule ? rule.type || "percent" : "percent");
    setRuleValue(rule ? rule.value : "");
    setRuleTarget(rule ? rule.targetAccountId : accounts[0]?.id || "");
    setShowRuleModal(true);
  };
  const openInvHistory = (inv) => {
    setViewingInv(inv);
    setShowInvHistoryModal(true);
  };

  const openEditInv = (inv) => {
    setEditingInv(inv);
    setEditInvSymbol(inv.symbol);
    setEditInvName(inv.name);
    setEditInvQty(inv.quantity.toString());
    setEditInvPrice(inv.avgPrice.toString());
    setEditInvCurrency(inv.currency || "TWD");
    setEditInvType(inv.type || "stock");
    setShowEditInvModal(true);
  };

  const dataStore = useMemo(
    () => ({
      ...derivedData,
      accounts,
      setAccounts,
      transactions,
      setTransactions,
      investments,
      setInvestments,
      salaryRules,
      setSalaryRules,
      defaultExpenseAccId,
      setDefaultExpenseAccId,
      exchangeRate,
      setExchangeRate,
      handleAddTransaction,
      handleDeleteTransaction,
      handleTrade,
      handleUpdatePrices,
      handleSaveAccount,
      handleDeleteAccount,
      handleSaveRule,
      handleDeleteRule,
      executeSalaryAllocation,
      user,
      handleExportData,
      handleImportData,
      handleSaveEditInv,
      handleDeleteInv,
    }),
    [
      derivedData,
      accounts,
      transactions,
      investments,
      salaryRules,
      defaultExpenseAccId,
      exchangeRate,
      user,
      transAmount,
      transType,
      transCategory,
      transTitle,
      transFrom,
      transTo,
      transDate,
      editingTransaction,
      tradePrice,
      tradeQuantity,
      tradeType,
      tradeAccount,
      tradeSymbol,
      tradeName,
      tradeAssetType,
      tradeDate,
      tradeCurrency,
      isHistorical,
      accName,
      accType,
      accBalance,
      accColor,
      editingAccount,
      ruleName,
      ruleType,
      ruleValue,
      ruleTarget,
      editingRule,
      priceUpdates,
      editingInv,
      editInvSymbol,
      editInvName,
      editInvQty,
      editInvPrice,
      editInvCurrency,
      editInvType,
    ]
  );

  const uiStore = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      showSettings,
      setShowSettings,
      isDarkMode,
      setIsDarkMode,
      showTransModal,
      setShowTransModal,
      transType,
      setTransType,
      transCategory,
      setTransCategory,
      transAmount,
      setTransAmount,
      transTitle,
      setTransTitle,
      transFrom,
      setTransFrom,
      transTo,
      setTransTo,
      transDate,
      setTransDate,
      editingTransaction,
      setEditingTransaction,
      showAccountModal,
      setShowAccountModal,
      editingAccount,
      setEditingAccount,
      accName,
      setAccName,
      accType,
      setAccType,
      accBalance,
      setAccBalance,
      accColor,
      setAccColor,
      showTradeModal,
      setShowTradeModal,
      tradeType,
      setTradeType,
      tradeSymbol,
      setTradeSymbol,
      tradeName,
      setTradeName,
      tradeQuantity,
      setTradeQuantity,
      tradePrice,
      setTradePrice,
      tradeAccount,
      setTradeAccount,
      tradeAssetType,
      setTradeAssetType,
      tradeDate,
      setTradeDate,
      isHistorical,
      setIsHistorical,
      tradeCurrency,
      setTradeCurrency,
      showPriceModal,
      setShowPriceModal,
      priceUpdates,
      setPriceUpdates,
      isFetchingPrice,
      setIsFetchingPrice,
      showRuleModal,
      setShowRuleModal,
      editingRule,
      setEditingRule,
      ruleName,
      setRuleName,
      ruleType,
      setRuleType,
      ruleValue,
      setRuleValue,
      ruleTarget,
      setRuleTarget,
      showInvHistoryModal,
      setShowInvHistoryModal,
      viewingInv,
      setViewingInv,
      showEditInvModal,
      setShowEditInvModal,
      editingInv,
      setEditingInv,
      editInvSymbol,
      setEditInvSymbol,
      editInvName,
      setEditInvName,
      editInvQty,
      setEditInvQty,
      editInvPrice,
      setEditInvPrice,
      editInvCurrency,
      setEditInvCurrency,
      editInvType,
      setEditInvType,
      openTransactionModal,
      openAccountModal,
      openTradeModal,
      openRuleModal,
      openInvHistory,
      openEditInv,
    }),
    [
      activeTab,
      showSettings,
      isDarkMode,
      showTransModal,
      transType,
      transCategory,
      transAmount,
      transTitle,
      transFrom,
      transTo,
      transDate,
      editingTransaction,
      showAccountModal,
      editingAccount,
      accName,
      accType,
      accBalance,
      accColor,
      showTradeModal,
      tradeType,
      tradeSymbol,
      tradeName,
      tradeQuantity,
      tradePrice,
      tradeAccount,
      tradeAssetType,
      tradeDate,
      isHistorical,
      tradeCurrency,
      showPriceModal,
      priceUpdates,
      isFetchingPrice,
      showRuleModal,
      editingRule,
      ruleName,
      ruleType,
      ruleValue,
      ruleTarget,
      showInvHistoryModal,
      viewingInv,
      showEditInvModal,
      editingInv,
      editInvSymbol,
      editInvName,
      editInvQty,
      editInvPrice,
      editInvCurrency,
      editInvType,
    ]
  );

  if (!allLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold">
        同步雲端資料中...
      </div>
    );
  }

  return (
    <DataContext.Provider value={dataStore}>
      <UIContext.Provider value={uiStore}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
          <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <DollarSign size={20} strokeWidth={3} />
              </div>
              WealthFlow
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            >
              <Settings
                size={20}
                className="text-slate-600 dark:text-slate-400"
              />
            </button>
          </header>

          <main className="pt-24 px-4 sm:max-w-md sm:mx-auto min-h-screen">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "assets" && <AssetsView />}
            {activeTab === "investments" && <InvestmentView />}
            {activeTab === "salary" && <SalaryTool />}
            {activeTab === "history" && <HistoryView />}
            {activeTab === "report" && <ReportView />}
          </main>

          <TransactionModal />
          <AccountModal />
          <TradeModal />
          <PriceUpdateModal />
          <SalaryRuleModal />
          <SettingsModal />
          <InvestmentHistoryModal />
          <EditInvestmentModal />

          <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 pb-6 sm:pb-3 z-40 flex justify-between items-center sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 sm:rounded-t-3xl sm:shadow-2xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === "dashboard"
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutDashboard
                size={24}
                strokeWidth={activeTab === "dashboard" ? 2.5 : 2}
              />
              <span className="text-[10px] font-bold">總覽</span>
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === "assets"
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Wallet
                size={24}
                strokeWidth={activeTab === "assets" ? 2.5 : 2}
              />
              <span className="text-[10px] font-bold">帳戶</span>
            </button>
            <div className="relative -top-6">
              <button
                onClick={() => setActiveTab("salary")}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95 ${
                  activeTab === "salary"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                <Briefcase size={24} />
              </button>
            </div>
            <button
              onClick={() => setActiveTab("investments")}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === "investments"
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <TrendingUp
                size={24}
                strokeWidth={activeTab === "investments" ? 2.5 : 2}
              />
              <span className="text-[10px] font-bold">投資</span>
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === "report"
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Save size={24} strokeWidth={activeTab === "report" ? 2.5 : 2} />
              <span className="text-[10px] font-bold">報表</span>
            </button>
          </nav>
        </div>
      </UIContext.Provider>
    </DataContext.Provider>
  );
};

export default function AssetManagerApp() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert("登入失敗，請重試");
      console.error(error);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold">
        連線中...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <DollarSign size={32} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">
            WealthFlow
          </h1>
          <p className="text-sm text-slate-500 mb-8">專屬雲端資產管家</p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-white py-3.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm active:scale-95"
          >
            <Globe size={18} />
            使用 Google 帳號登入
          </button>
        </div>
      </div>
    );
  }

  return <MainApp user={user} />;
}
