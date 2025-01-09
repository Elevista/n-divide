interface LinkObject {
  webUrl?: string; // 웹 URL
  mobileWebUrl?: string; // 모바일 웹 URL
  androidExecutionParams?: string; // Android 앱 실행 시 전달할 파라미터
  iosExecutionParams?: string; // iOS 앱 실행 시 전달할 파라미터
}

interface ButtonObject {
  title: string; // 버튼 문구
  link: LinkObject; // 바로가기 URL
}

interface ContentObject {
  title: string; // 제목
  imageUrl: string; // 이미지 URL
  link: LinkObject; // 바로가기 URL
  imageWidth?: number; // 이미지 너비 (단위: Pixel)
  imageHeight?: number; // 이미지 높이 (단위: Pixel)
  description?: string; // 설명
}

interface ItemObject {
  item: string; // 아이템 이름
  itemOp: string; // 아이템 가격
}

interface ItemContentObject {
  profileText?: string; // 프로필 텍스트
  profileImageUrl?: string; // 프로필 이미지 URL
  titleImageText?: string; // 이미지 아이템 제목
  titleImageUrl?: string; // 이미지 아이템 이미지 URL
  titleImageCategory?: string; // 이미지 아이템 카테고리
  items?: ItemObject[]; // 아이템 정보 (최대: 5개)
  sum?: string; // 요약 정보
  sumOp?: string; // 합산 가격
}

interface SocialObject {
  likeCount?: number; // 좋아요 수
  commentCount?: number; // 댓글 수
  sharedCount?: number; // 공유 수
  viewCount?: number; // 조회 수
  subscriberCount?: number; // 구독 수
}

export interface DefaultFeedSettings {
  objectType: 'feed'; // 메시지 템플릿 타입, feed로 고정
  content: ContentObject; // 메시지 콘텐츠
  itemContent?: ItemContentObject; // 아이템 콘텐츠
  social?: SocialObject; // 소셜 정보
  buttonTitle?: string; // 버튼 문구
  buttons?: ButtonObject[]; // 메시지 하단 버튼
  installTalk?: boolean; // 카카오톡 미설치 시, 설치 페이지 이동 여부
  serverCallbackArgs?: object | string; // 카카오톡 공유 전송 성공 알림에 포함할 키와 값
}

type Kakao = {
  init: (apiKey: string) => void
  Share: {
    sendDefault: (settings: DefaultFeedSettings) => void
  }
}
const src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'
const apiKey = 'dec4d21bfb17a9eecf68eda0e54d408c'
const integrity = 'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka'
export const loadKakaoSdk = () => new Promise<Kakao>((resolve, reject) => {
  const getKakao = () => (window as any).Kakao as Kakao | undefined
  if (getKakao()) return resolve(getKakao()!)
  const script: HTMLScriptElement = document.querySelector(`script[src="${src}"]`) ?? (() => {
    const script = assignIn(document.createElement('script'), { src, integrity, crossOrigin: 'anonymous' })
    script.onload = () => getKakao()!.init(apiKey)
    return document.head.appendChild(script)
  })()
  const onload = () => {
    script.removeEventListener('load', onload)
    resolve(getKakao()!)
  }
  const onerror = (e: ErrorEvent) => {
    script.removeEventListener('error', onerror)
    reject(e.error)
  }
  script.addEventListener('load', onload)
  script.addEventListener('error', onerror)
})
