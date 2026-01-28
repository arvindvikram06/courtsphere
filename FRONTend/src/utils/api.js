import dataset from '../data/dataset.json';

const STORAGE_KEY = 'courtsphere_db';

export const initializeData = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
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

