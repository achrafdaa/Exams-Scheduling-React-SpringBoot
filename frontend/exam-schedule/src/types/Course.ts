// export interface Sponsor {
//     sponsorId?: number,
//     sponsorName: string,
//     sponsorContact?: string | null,
//     sponsorProfil?: string | null,
// }
//
// export interface Organizer {
//     organizerId?: number,
//     organizerName: string,
//     organizerContact?: string | null,
//     organizerProfil?: string | null,
// }

export interface Course {
    courseId?: number,
    titre: string,
    typeElement: string,
    nbrStudents: string,
    grade: string,
    professor: string
}

export interface TypeElement {
    titre: string,
}