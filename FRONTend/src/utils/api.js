import dataset from '../data/dataset.json';

const STORAGE_KEY = 'courtsphere_db';
const DATA_VERSION_KEY = 'courtsphere_db_version';
const CURRENT_VERSION = '1.4'; // Increment this to force update

export const initializeData = () => {
    const savedVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (!localStorage.getItem(STORAGE_KEY) || savedVersion !== CURRENT_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
        console.log('Dataset updated to version', CURRENT_VERSION);
    }
};

export const getData = () => {
    initializeData();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : dataset;
};

export const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getCases = () => {
    const data = getData();
    return data.cases || [];
};

export const getPayments = () => {
    const data = getData();
    return data.payments || [];
};

export const getEvidence = () => {
    const data = getData();
    return data.evidence || [];
};

export const getCaseSummaries = () => {
    const data = getData();
    return data.caseSummaries || [];
};

export const getUsers = () => {
    const data = getData();
    return data.users || [];
};

export const addCase = (newCase) => {
    const data = getData();
    data.cases.push(newCase);
    saveData(data);
    return newCase;
};

export const updateCase = (updatedCase) => {
    const data = getData();
    const index = data.cases.findIndex(c => c.caseId === updatedCase.caseId);
    if (index !== -1) {
        data.cases[index] = updatedCase;
        saveData(data);
        return true;
    }
    return false;
};

export const addPayment = (payment) => {
    const data = getData();
    data.payments.push(payment);
    saveData(data);
};

export const updatePaymentStatus = (paymentId, status) => {
    const data = getData();
    const index = data.payments.findIndex(p => p.paymentId === paymentId);
    if (index !== -1) {
        data.payments[index].status = status;
        saveData(data);
        return true;
    }
    return false;
};


export const getUserName = (userId) => {
    if (!userId || userId === 'Pending' || userId === 'N/A' || userId === 'Unknown') return userId;
    const data = getData();
    const user = data.users.find(u => u.id === userId);
    return user ? user.name : userId;
};

export const requestDefenseLawyer = (caseId, lawyerId) => {
    const data = getData();
    const index = data.cases.findIndex(c => c.caseId === caseId);
    if (index !== -1) {
        data.cases[index].requestedDefenseLawyer = lawyerId;
        saveData(data);
        return true;
    }
    return false;
};

export const approveDefenseLawyer = (caseId, lawyerId) => {
    const data = getData();
    const index = data.cases.findIndex(c => c.caseId === caseId);
    if (index !== -1) {
        if (data.cases[index].requestedDefenseLawyer === lawyerId) {
            data.cases[index].defenseLawyer = lawyerId;
            data.cases[index].requestedDefenseLawyer = null;
            data.cases[index].status = 'Ongoing'; // Or keep as is? Let's assume acceptance implies moving to Ongoing or staying Open but assigned.
            saveData(data);
            return true;
        }
    }
    return false;
};
