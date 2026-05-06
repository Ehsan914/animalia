import axiosInstance from "./axiosInstance";

// CONTACT FUNCTIONS
export const getContact = async () => {
    try {
        const response = await axiosInstance.get('/contact');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch contact';
        throw message;
    }
}

export const updateContact = async (contactData) => {
    try {
        const response = await axiosInstance.put('/contact', contactData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update contact';
        throw message;
    }
}

// EMERGENCY CONTACT FUNCTIONS
export const getEmergencyContact = async () => {
    try {
        const response = await axiosInstance.get('/emergency');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch emergency contact';
        throw message;
    }
}

export const updateEmergencyContact = async (emergencyData) => {
    try {
        const response = await axiosInstance.put('/emergency', emergencyData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update emergency contact';
        throw message;
    }
}

// LOCATION FUNCTIONS
export const getLocation = async () => {
    try {
        const response = await axiosInstance.get('/location');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch location';
        throw message;
    }
}

export const updateLocation = async (locationData) => {
    try {
        const response = await axiosInstance.put('/location', locationData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update location';
        throw message;
    }
}

// FAQ FUNCTIONS
export const getFAQs = async (lang = 'en') => {
    try {
        const response = await axiosInstance.get('/faqs', { params: { lang } });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch FAQs';
        throw message;
    }
}

export const getAllFAQs = async () => {
    try {
        const response = await axiosInstance.get('/faqs/admin');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch FAQs';
        throw message;
    }
}

export const createFAQ = async (faqData) => {
    try {
        const response = await axiosInstance.post('/faqs', faqData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create FAQ';
        throw message;
    }
}

export const updateFAQ = async (id, faqData) => {
    try {
        const response = await axiosInstance.put(`/faqs/${id}`, faqData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update FAQ';
        throw message;
    }
}

export const deleteFAQ = async (id) => {
    try {
        const response = await axiosInstance.delete(`/faqs/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete FAQ';
        throw message;
    }
}

export const reorderFAQs = async (items) => {
    try {
        const response = await axiosInstance.put('/faqs/reorder', { items });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to reorder FAQs';
        throw message;
    }
}

// REVIEW FUNCTIONS
export const getReviews = async () => {
    try {
        const response = await axiosInstance.get('/reviews');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch reviews';
        throw message;
    }
}

export const createReview = async (reviewData) => {
    try {
        const response = await axiosInstance.post('/reviews', reviewData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create review';
        throw message;
    }
}

export const getAllReviews = async () => {
    try {
        const response = await axiosInstance.get('/reviews/admin');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch reviews';
        throw message;
    }
}

export const createReviewAdmin = async (reviewData) => {
    try {
        const response = await axiosInstance.post('/reviews/admin', reviewData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create review';
        throw message;
    }
}

export const updateReview = async (id, reviewData) => {
    try {
        const response = await axiosInstance.put(`/reviews/${id}`, reviewData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update review';
        throw message;
    }
}

export const deleteReview = async (id) => {
    try {
        const response = await axiosInstance.delete(`/reviews/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete review';
        throw message;
    }
}
