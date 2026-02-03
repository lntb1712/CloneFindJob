export const hasSkills = (skills: string[], job: string) => {
    return skills.some((skill) => job.toLowerCase().includes(skill));
};

export const formatDate = (date: Date, format: string = 'DD-MM-YYYY') => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year.toString());
};
