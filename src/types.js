export const MembershipType = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  YEARLY: 'Yearly',
  DAY_PASS: 'Day Pass'
};

export const PaymentStatus = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue'
};

export const FitnessGoals = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Gain',
  'Endurance',
  'General Fitness',
  'Powerlifting'
];

export const ViewTypes = [
  'dashboard',
  'members',
  'trainers',
  'packages',
  'billing',
  'inventory',
  'attendance',
  'ai-coach',
  'member-detail'
];

export const MemberTemplate = {
  id: '',
  fullName: '',
  dob: '',
  age: 0,
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  healthConditions: [],
  membershipType: '',
  startDate: '',
  endDate: '',
  trainerId: '',
  paymentStatus: '',
  bmi: null,
  weight: null,
  height: null,
  photoUrl: '',
  goal: ''
};

export const TrainerTemplate = {
  id: '',
  name: '',
  specialization: [],
  phone: '',
  email: '',
  salary: 0,
  commission: 0,
  rating: 0,
  avatarUrl: '',
  role: 'Trainer'
};

export const PackageTemplate = {
  id: '',
  name: '',
  price: 0,
  duration: 0,
  features: [],
  category: ''
};

export const InvoiceTemplate = {
  id: '',
  memberId: '',
  memberName: '',
  amount: 0,
  date: '',
  status: '',
  items: []
};

export const InventoryItemTemplate = {
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  expiryDate: ''
};

export const AttendanceRecordTemplate = {
  id: '',
  memberId: '',
  memberName: '',
  checkIn: '',
  checkOut: '',
  date: ''
};
