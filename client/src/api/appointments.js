import axiosInstance from "./axiosInstance";

export const getAppointments = async () => {
    try {
        const response = await axiosInstance.get('/appointment');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch appointments';
        throw message;
    }
}

export const getAppointmentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/appointment/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch appointment';
        throw message;
    }
}

export const createAppointment = async (appointmentData) => {
    try {
        const response = await axiosInstance.post('/appointment', appointmentData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create appointments';
        throw message;
    }
}

export const createAppointmentAdmin = async (appointmentData) => {
    try {
        const response = await axiosInstance.post('/appointment/admin', appointmentData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create appointment';
        throw message;
    }
}

export const updateAppointmentServices = async (id, serviceIds) => {
    try {
        const response = await axiosInstance.put(`/appointment/${id}/services`, { serviceIds });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update services';
        throw message;
    }
}

export const updateAppointmentStatus = async (id, { status }) => {
    try {
        const response = await axiosInstance.put(`/appointment/${id}`, {status});
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update appointments';
        throw message;
    }
}

export const deleteAppointment = async (id) => {
    try {
        const response = await axiosInstance.delete(`/appointment/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete appointments';
        throw message;
    }
}