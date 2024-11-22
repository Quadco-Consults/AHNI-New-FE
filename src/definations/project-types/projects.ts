export interface ProjectsResultsData {
    id: string;
    created_datetime: "string";
    updated_datetime: string;
    project_id: string;
    title: string;
    goal: string;
    expected_results: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
    project_managers: { first_name: string; last_name: string }[];
    beneficiaries: string[];
    funding_sources: string[];

    // id: string;
    // project_beneficiaries: [
    //     {
    //         id: string;
    //         created_at: string;
    //         updated_at: string;
    //         name: string;
    //         description: string;
    //     }
    // ];
    // project_funding_source: [
    //     {
    //         id: string;
    //         created_at: string;
    //         updated_at: string;
    //         name: string;
    //         description: string;
    //     }
    // ];
    // project_objectives: [
    //     {
    //         id: string;
    //         title: string;
    //         serial_number: number;
    //         sub_objectives: [
    //             {
    //                 id: string;
    //                 title: string;
    //                 serial_number: number;
    //             }
    //         ];
    //     }
    // ];
    // project_partners: [
    //     {
    //         location: string;
    //         partners: [
    //             {
    //                 id: string;
    //                 created_at: string;
    //                 updated_at: string;
    //                 name: string;
    //                 address: string;
    //                 city: string;
    //                 state: string;
    //                 email: string;
    //                 phone: string;
    //                 website: string;
    //                 logo: string;
    //             }
    //         ];
    //     }
    // ];
    // documents: [
    //     {
    //         id: string;
    //         created_at: string;
    //         updated_at: string;
    //         title: string;
    //         document: string;
    //         project: string;
    //     }
    // ];
    // created_at: string;
    // updated_at: string;
    // project_id: string;
    // title: string;
    // goal: string;
    // expected_results: string;
    // start_date: string;
    // end_date: string;
    // budget: number;
    // status: string;
    // project_manager: string;
    // funding_source?: string[];
}

export interface ProjectsData {
    count: number;
    next: string;
    number_of_pages: number;
    previous: string;
    results: ProjectsResultsData[];
}

export interface ProjectsResponse {
    message: string;
    data: ProjectsResultsData;
}
