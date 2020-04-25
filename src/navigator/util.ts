const TEAM_PATH_REGEXP = /(?:https?:\/\/hackmd.io)?\/team\/([^\/\?]+).*/;
const TEAM_HEADER_SELECTORS = [
    'a.navbar-brand',
    'a.ui-next-sidenav-workspace-link'
];

/**
 * 헤더 엘리먼트들의 링크 속성 및 location.pathname의 문자열을 파싱하여 팀 이름을 가져온다.
 */
export function getCurrentTeamName(): string {
    const uris = TEAM_HEADER_SELECTORS.map(selector => {
        const header = document.querySelector(selector);
        return header?.getAttribute('href');
    }).filter(value => value);
    let uri = location.pathname;

    if (uris.length) {
        uri = uris[0];
    }

    return parseTeamURI(uri) || '';
}

/**
 * 주소에서 팀 이름을 가져옴
 * @param uri 주소
 */
export function parseTeamURI(uri: string): string | undefined {
    return (TEAM_PATH_REGEXP.exec(uri) || [])[1];
}
