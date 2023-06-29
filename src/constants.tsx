import { IMessage } from "./Components/Chat"
import { IBot } from "./Hooks/useChatbots";
import { TUserData } from "./Hooks/useUserData";
import { TMetadata } from "./Components/AssistantSettings";

export const ENV = process.env.NODE_ENV;
export const PUBKEY = process.env.REACT_APP_PUBKEY || '' as string;
export const SUPA_CLIENT = process.env.REACT_APP_SUPABASE_CLIENT || '' as string;
export const ANONKEY = process.env.REACT_APP_ANONKEY;

export const HOST_OPTIONS = {
  production: 'https://api.autodocai.com',
  development: 'http://127.0.0.1:5000',
  test: 'http://127.0.0.1:5000'
}

export const HOST = HOST_OPTIONS[ENV]
export const VERSION = 'V0.0.1'
export const MODEL_MAP = new Map<string, string>([
  ['gpt3', 'GPT-3.5-Turbo'],
  ['gpt4', 'GPT4']
])
export const GPT3ID = 'gpt3'
export const GPT4ID = 'gpt4'
export const PRO_VERSION = 'pro'

const default_chatbot = {
  id: 'default1',
  name: '(default)',
  description: '',
  created_at: '2023-03-08',
  // Tuserdata as sources
  sources: [] as Array<TUserData>,
  model_id: 'gpt3',
  system_message: 'You are a helpful assistant designed to answer questions about a given content.',
  temperature: 0.25,
  metadata: {} as TMetadata,
}

export const INITIAL_VALUES = {
  tabContext: { text: '', url: '', title: '' },
  question: '',
  messages: [] as Array<IMessage>,
  conversationId: '',
  curConversationId: '',
  userMessage: '',
  default_chatbot: default_chatbot as IBot,
  userData: [] as Array<TUserData>,
}

export const DEFAULT_SYSTEM_MESSAGE = {
  id: 0,
  role: 'system',
  content: 'You are a helpful assistant designed to answer questions about a given content.',
}

export const FREE_GROUP = 'free'
export const MAX_FILE_SIZE = 10000000;

export interface IPlan {
  name: string;
  price: string | null;
  maxMessages: number;
  maxBots: number;
  features: string[];
  desc: string;
  button: boolean;
  func: () => void;
}

export const plans: Record<string, IPlan> = {

  'free': {
    name: 'Free trial',
    price: null,
    maxMessages: 1000,
    maxBots: 100,
    features: ['Any document format', 'Data extraction', 'Latest AI models', 'Gets better over time (~2 updates per day)', 'No credit card required'],
    desc: 'Enjoy 100 free pages of processing during your two week trial.',
    func: () => { },
    button: false
  },
  'pricing': {
    name: 'Pricing',
    price: null,
    maxMessages: 2000,
    maxBots: 1000,
    features: ['Everything in the free trial', 'Save with annual billing', 'Access to API'],
    desc: 'Streamline your workflow with unlimited processing and access to our API.',
    button: true,
    func: () => { window.open('https://buy.stripe.com/9AQ8yw82w8EkexG6ox', '_blank') }
  }
}

export const Icons = {
  arrow_down: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 712 240 472l43-43 197 197 197-197 43 43-240 240Z" /></svg>
  ),
  arrow_up: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m283 699-43-43 240-240 240 240-43 43-197-197-197 197Z" /></svg>
  ),
  arrow_right: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m480 896-42-43 247-247H160v-60h525L438 299l42-43 320 320-320 320Z" /></svg>
  ),
  arrow_back: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 896 160 576l320-320 42 42-248 248h526v60H274l248 248-42 42Z" /></svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M378 810 154 586l43-43 181 181 384-384 43 43-427 427Z" /></svg>
  ),
  post_add: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h394v60H180v600h600V482h60v394q0 24-18 42t-42 18H180Zm141-157v-60h319v60H321Zm0-127v-60h319v60H321Zm0-127v-60h319v60H321Zm371-73v-88h-88v-60h88v-88h60v88h88v60h-88v88h-60Z" /></svg>
  ),
  reset: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 896q-133 0-226.5-93.5T160 576q0-133 93.5-226.5T480 256q85 0 149 34.5T740 385V256h60v254H546v-60h168q-38-60-97-97t-137-37q-109 0-184.5 75.5T220 576q0 109 75.5 184.5T480 836q83 0 152-47.5T728 663h62q-29 105-115 169t-195 64Z" /></svg>
  ),
  language: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 976q-84 0-157-31.5T196 859q-54-54-85-127.5T80 574q0-84 31-156.5T196 291q54-54 127-84.5T480 176q84 0 157 30.5T764 291q54 54 85 126.5T880 574q0 84-31 157.5T764 859q-54 54-127 85.5T480 976Zm0-58q35-36 58.5-82.5T577 725H384q14 60 37.5 108t58.5 85Zm-85-12q-25-38-43-82t-30-99H172q38 71 88 111.5T395 906Zm171-1q72-23 129.5-69T788 725H639q-13 54-30.5 98T566 905ZM152 665h159q-3-27-3.5-48.5T307 574q0-25 1-44.5t4-43.5H152q-7 24-9.5 43t-2.5 45q0 26 2.5 46.5T152 665Zm221 0h215q4-31 5-50.5t1-40.5q0-20-1-38.5t-5-49.5H373q-4 31-5 49.5t-1 38.5q0 21 1 40.5t5 50.5Zm275 0h160q7-24 9.5-44.5T820 574q0-26-2.5-45t-9.5-43H649q3 35 4 53.5t1 34.5q0 22-1.5 41.5T648 665Zm-10-239h150q-33-69-90.5-115T565 246q25 37 42.5 80T638 426Zm-254 0h194q-11-53-37-102.5T480 236q-32 27-54 71t-42 119Zm-212 0h151q11-54 28-96.5t43-82.5q-75 19-131 64t-91 115Z" /></svg>
  ),
  description: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M319 806h322v-60H319v60Zm0-170h322v-60H319v60Zm-99 340q-24 0-42-18t-18-42V236q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554V236H220v680h520V422H551ZM220 236v186-186 680-680Z" /></svg>
  ),
  headphones: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M328 936H180q-24 0-42-18t-18-42V576q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480 216q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840 576v300q0 24-18 42t-42 18H632V640h148v-64q0-125.357-87.321-212.679Q605.357 276 480 276t-212.679 87.321Q180 450.643 180 576v64h148v296Zm-60-236h-88v176h88V700Zm424 0v176h88V700h-88Zm0 0h88-88Zm-424 0h-88 88Z" /></svg>
  ),
  edit_note: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 936v-71l216-216 71 71-216 216h-71ZM120 726v-60h300v60H120Zm690-49-71-71 29-29q8-8 21-8t21 8l29 29q8 8 8 21t-8 21l-29 29ZM120 561v-60h470v60H120Zm0-165v-60h470v60H120Z" /></svg>
  ),
  support: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm-121-80 63-150q-38-13-67.5-41.5T310 635l-150 60q31 71 82 123t117 78Zm-50-378q16-41 45-70t67-42l-60-150q-75 31-127 83.5T160 458l149 60Zm171 178q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm121 200q69-28 120-79.5T800 697l-150-62q-15 42-44.5 70.5T538 746l63 150Zm49-379 150-62q-28-68-79.5-119.5T601 256l-61 150q38 13 66 41.5t44 69.5Z" /></svg>
  ),
  upload: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M220 896q-24 0-42-18t-18-42V693h60v143h520V693h60v143q0 24-18 42t-42 18H220Zm230-153V372L330 492l-43-43 193-193 193 193-43 43-120-120v371h-60Z" /></svg>
  ),
  person: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 563.076q-57.749 0-95.22-37.471t-37.471-95.22q0-58.134 37.471-95.413 37.471-37.278 95.22-37.278t95.22 37.278q37.471 37.279 37.471 95.413 0 57.749-37.471 95.22T480 563.076Zm-299.999 305.23v-75.922q0-32.23 17.077-56.153 17.077-23.923 44.385-36.769 63.153-28.077 121.768-42.308 58.615-14.23 116.769-14.23t116.461 14.538q58.308 14.538 121.461 42 27.923 12.846 45 36.769t17.077 56.153v75.922H180.001Z" /></svg>
  ),
  video: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h520q24 0 42 18t18 42v215l160-160v410L720 621v215q0 24-18 42t-42 18H140Zm0-60h520V316H140v520Zm0 0V316v520Z" /></svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" /></svg>
  ),
  check_circle: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m421 758 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" /></svg>
  ),
  forum: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M80 740V218q0-14 13-28t27-14h519q15 0 28 13.5t13 28.5v356q0 14-13 28t-28 14H240L106 750q-7 7-16.5 3.5T80 740Zm60-504v320-320Zm141 580q-14 0-27.5-14T240 774v-98h500V336h100q14 0 27 14t13 29v560q0 10-9.5 13.5T854 949L721 816H281Zm339-580H140v320h480V236Z" /></svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" /></svg>
  ),
  share: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M220 1016q-24 0-42-18t-18-42V447q0-24 18-42t42-18h169v60H220v509h520V447H569v-60h171q24 0 42 18t18 42v509q0 24-18 42t-42 18H220Zm229-307V252l-88 88-43-43 161-161 161 161-43 43-88-88v457h-60Z" /></svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M479.982-280q14.018 0 23.518-9.482 9.5-9.483 9.5-23.5 0-14.018-9.482-23.518-9.483-9.5-23.5-9.5-14.018 0-23.518 9.482-9.5 9.483-9.5 23.5 0 14.018 9.482 23.518 9.483 9.5 23.5 9.5ZM453-433h60v-253h-60v253Zm27.266 353q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z" /></svg>
  ),
  heart_filled: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" /></svg>
  ),
  school: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M479-120 189-279v-240L40-600l439-240 441 240v317h-60v-282l-91 46v240L479-120Zm0-308 315-172-315-169-313 169 313 172Zm0 240 230-127v-168L479-360 249-485v170l230 127Zm1-240Zm-1 74Zm0 0Z" /></svg>
  ),
  external_link: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h279v60H180v600h600v-279h60v279q0 24-18 42t-42 18H180Zm202-219-42-43 398-398H519v-60h321v321h-60v-218L382-339Z" /></svg>
  ),
  navigate_next: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m375-240-43-43 198-198-198-198 43-43 241 241-241 241Z" /></svg>
  ),
  sms: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M306-523q17 0 28.5-11.5T346-563q0-17-11.5-28.5T306-603q-17 0-28.5 11.5T266-563q0 17 11.5 28.5T306-523Zm177 0q17 0 28.5-11.5T523-563q0-17-11.5-28.5T483-603q-17 0-28.5 11.5T443-563q0 17 11.5 28.5T483-523Zm170 0q17 0 28.5-11.5T693-563q0-17-11.5-28.5T653-603q-17 0-28.5 11.5T613-563q0 17 11.5 28.5T653-523ZM80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z" /></svg>
  ),
  help: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>
  ),
  send: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z" /></svg>
  ),
  bolt: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm153-395Z" /></svg>
  ),
  time: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M360-860v-60h240v60H360Zm90 447h60v-230h-60v230Zm30 332q-74 0-139.5-28.5T226-187q-49-49-77.5-114.5T120-441q0-74 28.5-139.5T226-695q49-49 114.5-77.5T480-801q67 0 126 22.5T711-716l51-51 42 42-51 51q36 40 61.5 97T840-441q0 74-28.5 139.5T734-187q-49 49-114.5 77.5T480-81Zm0-60q125 0 212.5-87.5T780-441q0-125-87.5-212.5T480-741q-125 0-212.5 87.5T180-441q0 125 87.5 212.5T480-141Zm0-299Z" /></svg>
  ),
  add: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z" /></svg>
  ),
  delete: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" /></svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" /></svg>
  ),
  dock_to_right: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-120q-24.75 0-42.375-17.625T120-180v-600q0-24.75 17.625-42.375T180-840h600q24.75 0 42.375 17.625T840-780v600q0 24.75-17.625 42.375T780-120H180Zm147-60v-600H180v600h147Zm60 0h393v-600H387v600Zm-60 0H180h147Z" /></svg>
  ),
  open_in_full: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M120-120v-300h60v198l558-558H540v-60h300v300h-60v-198L222-180h198v60H120Z" /></svg>
  ),
  download: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Zm260-153L287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193Z" /></svg>
  ),
  file_open: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h340l240 240v270h-60v-230H520v-220H220v680h410v60H220Zm658 1L750-207v125h-60v-228h228v60H792l128 128-42 43Zm-658-61v-680 680Z" /></svg>
  ),
  filter: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z" /></svg>
  ),
  summarize: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M309-621q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm0 171q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm0 171q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h462l198 198v462q0 24-18 42t-42 18H180Zm0-60h600v-428.571H609V-780H180v600Zm0-600v171.429V-780v600-600Z" /></svg>
  ),
  content_paste: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-120q-26 0-43-17t-17-43v-600q0-26 17-43t43-17h202q7-35 34.5-57.5T480-920q36 0 63.5 22.5T578-840h202q26 0 43 17t17 43v600q0 26-17 43t-43 17H180Zm0-60h600v-600h-60v90H240v-90h-60v600Zm300-600q17 0 28.5-11.5T520-820q0-17-11.5-28.5T480-860q-17 0-28.5 11.5T440-820q0 17 11.5 28.5T480-780Z" /></svg>
  ),
  quick_reference_all: (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-820v293-3 390-680 186-186Zm99 400h185q11-17 24-32t29-28H279v60Zm0 170h156q-3-15-4.5-30t-.5-30H279v60ZM180-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v154q-14-7-29-12t-31-8v-107H511v-186H180v680h315q20 21 44.5 36T593-80H180Zm480-110q47 0 78.5-31.5T770-300q0-47-31.5-78.5T660-410q-47 0-78.5 31.5T550-300q0 47 31.5 78.5T660-190ZM864-54 756.837-161Q736-147 711.5-138.5 687-130 660-130q-70.833 0-120.417-49.618Q490-229.235 490-300.118 490-371 539.618-420.5q49.617-49.5 120.5-49.5Q731-470 780.5-420.417 830-370.833 830-300q0 27-8.5 51.5T799-203.163L906-96l-42 42Z" /></svg>
  )
}