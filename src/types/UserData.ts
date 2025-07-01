export type UserData = {
  username: string;
  profile: {
    realName: string;
    websites: string[];
    countryName: string | null;
    company: string | null;
    school: string | null;
    aboutMe: string;
    reputation: number;
    ranking: number;
  };
  submitStats: {
    acSubmissionNum: {
      difficulty: "All" | "Easy" | "Medium" | "Hard";
      count: number;
      submissions: number;
    }[];
    totalSubmissionNum: {
      difficulty: "All" | "Easy" | "Medium" | "Hard";
      count: number;
      submissions: number;
    }[];
  };
};
