import { UserProps } from "../Public/PublicInterfaces"

// Owned User 
export interface OwnedUserProps {
    isSupport:            boolean;
    isInfrastructureUser: boolean;
    id:                   number;
    githubId:             number;
    githubToken:          string;
    facebookId:           string;
    facebookToken:        string;
    googleId:             string;
    googleToken:          string;
    slackId:              string;
    slackToken:           string;
    slackTeamId:          string;
    persistentToken:      string;
    avatarUrl:            string;
    avatarThumbnailUrl:   string;
    login:                string;
    name:                 string;
    location:             null;
    color:                string;
    description:          string;
    hasCoverImage:        boolean;
    coverColor:           string;
    thanksCount:          number;
    utcOffset:            number;
    featuredProjectId:    string;
    createdAt:            Date;
    updatedAt:            Date;
    twoFactorEnabled:     boolean;
    accountLocked:        boolean;
    loginAttempts:        number;
    passwordEnabled:      boolean;
    features:             Feature[];
}

export interface UpdateParams {
    name?:          string,
    login?:         string,
    description?:   string,
    avatarUrl?:     string,
    color?:         string,
    hasCoverImage?: boolean
}

// Owned Project

export interface OwnedProjectProps {
    id:                     string;
    inviteToken:            string;
    description:            string;
    domain:                 string;
    baseId:                 string;
    private:                boolean;
    createdAt:              Date;
    updatedAt:              Date;
    deletedAt:              Date;
    likesCount:             number;
    suspendedAt:            Date;
    suspendedReason:        string;
    lastAccess:             Date;
    avatarUpdatedAt:        Date;
    numEditorVisits:        number;
    numAppVisits:           number;
    visitsLastBackfilledAt: string;
    showAsGlitchTeam:       boolean;
    evicted:                boolean;
    isEmbedOnly:            boolean;
    remixChain:             string[];
    notSafeForKids:         boolean;
    firmlyDeleted:          null;
    archivedAt:             Date;
    teamsProjects:          any[];
    users:                  UserProps[];
    teams:                  any[];
    projectCnames:          any[];
}

export interface Feature {
    id:           number;
    userId:       number;
    projectId:    number;
    collectionId: number;
    teamId:       number;
    name:         string;
    data:         object;
    expiresAt:    Date;
    deletedAt:    Date;
    createdAt:    Date;
    updatedAt:    Date;
}

export interface ProjectPermission {
    userId:      number;
    projectId:   string;
    accessLevel: number;
    lastAccess:  Date;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface ProjectUpdate {
    domain: string,
    description: string,
    private: boolean
}

