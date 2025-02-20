import React from 'react';
// import TeamPage from './TeamPage'; 

interface Person {
    name: string;
    position: string;
    image: string; 
}

const teamMembers: Person[] = [
    { name: "Catie Manning ('25)", position: "Co-President", image: "https://static.wixstatic.com/media/6daba1_abb11f7431074db6989f26bf7bd5fd4f~mv2.jpeg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.jpeg" },
    { name: "Luc Azar-Tanguay ('25)", position: "Co-President", image: "https://static.wixstatic.com/media/a6e117_494efaac787d4174a7e7070abfb37983~mv2.jpeg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.jpeg" },
    { name: "Robbie Carr ('25)", position: "Director of Research & Polling", image: "https://static.wixstatic.com/media/6daba1_33b642640da441b4bf4955f254a0f37e~mv2.png/v1/fill/w_560,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.png" },
    { name: "Logan Rabe ('26)", position: "Director of Web Design", image: "https://static.wixstatic.com/media/65ab4b_e64a288e584f40dfbc8a18d4f9df7886~mv2.png/v1/fill/w_560,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.png" },
    { name: "Griffin Steele ('25)", position: "Director of News", image: "https://static.wixstatic.com/media/6daba1_72c00abee9e148718a992868f9734d2a~mv2.jpg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.jpg" },
    { name: "Will Tolmie ('26)", position: "Co-Director of Social Media & Marketing", image: "https://static.wixstatic.com/media/65ab4b_924082930f1e4f0c91073a0a35083c81~mv2.jpeg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bop%20logo.jpeg" },
];

export default function Team() {
    return <div>
            <h2>Team</h2>
            <div className="grid grid-cols-3 gap-4 gap-y-12">
                {teamMembers.map((person, index) => (
                    <div key={index} className="p-4 text-center">
                        <img src={person.image} alt={person.name} className="w-24 h-24 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold">{person.name}</h3>
                        <p className="text-gray-600">{person.position}</p>
                    </div>
                ))}
            </div>
        </div>;
}