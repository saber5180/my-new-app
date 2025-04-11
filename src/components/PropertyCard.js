import React from 'react';
import { FiHome, FiGrid } from 'react-icons/fi';
import { FaBuilding, FaLayerGroup } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const { 
    address, 
    city, 
    price, 
    pricePerSqm, 
    type, 
    surface, 
    rooms, 
    soldDate 
  } = property;

  return (
    <div className="bg-white rounded-xl shadow-lg border  p-4">
      {/* Property Details */}
      <div className="flex items-start justify-between ">
        <div>
          <h2 className="font-extrabold text-md text-gray-900">{address}</h2>
          <div className="flex items-center text-gray-500 text-sm mt-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_406_641)"><path d="M12 11.3333H11V12H12V11.3333Z" fill="black" fill-opacity="0.15"/>
          <path d="M9 6H8V6.66668H9V6Z" fill="black" fill-opacity="0.15"/>
          <path d="M12 8.66668H11V9.33336H12V8.66668Z" fill="black" fill-opacity="0.15"/>
          <path d="M9 8.66668H8V9.33336H9V8.66668Z" fill="black" fill-opacity="0.15"/>
          <path d="M12 14H11V14.6667H12V14Z" fill="black" fill-opacity="0.15"/>
          <path d="M9 3.33332H8V4H9V3.33332Z" fill="black" fill-opacity="0.15"/>
          <path d="M9 14H8V14.6667H9V14Z" fill="black" fill-opacity="0.15"/>
          <path d="M12 3.33332H11V4H12V3.33332Z" fill="black" fill-opacity="0.15"/>
          <path d="M9 11.3333H8V12H9V11.3333Z" fill="black" fill-opacity="0.15"/>
          <path d="M12 6H11V6.66668H12V6Z" fill="black" fill-opacity="0.15"/>
          <path d="M17.666 9.33332H16.666V10H17.666V9.33332Z" fill="black" fill-opacity="0.15"/>
          <path d="M17.666 14.6667H16.666V15.3334H17.666V14.6667Z" fill="black" fill-opacity="0.15"/>
          <path d="M17.666 12H16.666V12.6667H17.666V12Z" fill="black" fill-opacity="0.15"/>
          <path d="M3.33398 12H2.33398V12.6667H3.33398V12Z" fill="black" fill-opacity="0.15"/>
          <path d="M3.33398 9.33332H2.33398V10H3.33398V9.33332Z" fill="black" fill-opacity="0.15"/>
          <path d="M3.33398 14.6667H2.33398V15.3334H3.33398V14.6667Z" fill="black" fill-opacity="0.15"/>
          <path d="M3.33398 6.66668H2.33398V7.33336H3.33398V6.66668Z" fill="black" fill-opacity="0.15"/>
          <path d="M20 7V5.66668C20 5.46668 19.8667 5.33336 19.6667 5.33336H14.6667C14.4667 5.33336 14.3334 5.46668 14.3334 5.66668V7C14.3334 7.2 14.4667 7.33332 14.6667 7.33332V17.3333H14V2C14.2 2 14.3333 1.86668 14.3333 1.66668V0.33332C14.3333 0.13332 14.2 0 14 0H6C5.8 0 5.66668 0.13332 5.66668 0.33332V1.66664C5.66668 1.86664 5.8 1.99996 6 1.99996V17.3333H5.33332V4.66668C5.53332 4.66668 5.66664 4.53336 5.66664 4.33336V3C5.66664 2.8 5.53332 2.66668 5.33332 2.66668H0.33332C0.13332 2.66668 0 2.8 0 3V4.33332C0 4.53332 0.13332 4.66664 0.33332 4.66664V17.3333C0.13332 17.3333 0 17.4666 0 17.6666V19.6666C0 19.8667 0.13332 20 0.33332 20H19.6666C19.8666 20 20 19.8667 20 19.6667V17.6667C20 17.4667 19.8666 17.3334 19.6666 17.3334V7.33336C19.8667 7.33332 20 7.2 20 7ZM4 15.6667C4 15.8667 3.86668 16 3.66668 16H2C1.8 16 1.66668 15.8667 1.66668 15.6667V14.3334C1.66668 14.1334 1.8 14 2 14H3.66668C3.86668 14 4 14.1334 4 14.3334V15.6667ZM4 13C4 13.2 3.86668 13.3333 3.66668 13.3333H2C1.8 13.3333 1.66668 13.2 1.66668 13V11.6667C1.66668 11.4667 1.8 11.3334 2 11.3334H3.66668C3.86668 11.3334 4 11.4667 4 11.6667V13ZM4 10.3333C4 10.5333 3.86668 10.6666 3.66668 10.6666H2C1.8 10.6666 1.66668 10.5333 1.66668 10.3333V9C1.66668 8.8 1.8 8.66668 2 8.66668H3.66668C3.86668 8.66668 4 8.8 4 9V10.3333ZM4 7.66668C4 7.86668 3.86668 8 3.66668 8H2C1.8 8 1.66668 7.86668 1.66668 7.66668V6.33336C1.66668 6.13336 1.8 6.00004 2 6.00004H3.66668C3.86668 6.00004 4 6.13336 4 6.33336V7.66668ZM5 4H0.66668V3.33332H5V4ZM9.66668 15C9.66668 15.2 9.53336 15.3333 9.33336 15.3333H7.66668C7.46668 15.3333 7.33336 15.2 7.33336 15V13.6667C7.33336 13.4667 7.46668 13.3334 7.66668 13.3334H9.33336C9.53336 13.3334 9.66668 13.4667 9.66668 13.6667V15ZM9.66668 12.3333C9.66668 12.5333 9.53336 12.6666 9.33336 12.6666H7.66668C7.46668 12.6666 7.33336 12.5333 7.33336 12.3333V11C7.33336 10.8 7.46668 10.6667 7.66668 10.6667H9.33336C9.53336 10.6667 9.66668 10.8 9.66668 11V12.3333ZM9.66668 9.66668C9.66668 9.86668 9.53336 10 9.33336 10H7.66668C7.46668 10 7.33336 9.86668 7.33336 9.66668V8.33336C7.33336 8.13336 7.46668 8.00004 7.66668 8.00004H9.33336C9.53336 8.00004 9.66668 8.13336 9.66668 8.33336V9.66668ZM9.66668 7C9.66668 7.2 9.53336 7.33332 9.33336 7.33332H7.66668C7.46668 7.33332 7.33336 7.2 7.33336 7V5.66668C7.33336 5.46668 7.46668 5.33336 7.66668 5.33336H9.33336C9.53336 5.33336 9.66668 5.46668 9.66668 5.66668V7ZM9.66668 4.33332C9.66668 4.53332 9.53336 4.66664 9.33336 4.66664H7.66668C7.46668 4.66664 7.33336 4.53332 7.33336 4.33332V3C7.33336 2.8 7.46668 2.66668 7.66668 2.66668H9.33336C9.53336 2.66668 9.66668 2.8 9.66668 3V4.33332ZM12.6667 15C12.6667 15.2 12.5334 15.3333 12.3334 15.3333H10.6667C10.4667 15.3333 10.3334 15.2 10.3334 15V13.6667C10.3334 13.4667 10.4667 13.3334 10.6667 13.3334H12.3334C12.5334 13.3334 12.6667 13.4667 12.6667 13.6667V15ZM12.6667 12.3333C12.6667 12.5333 12.5334 12.6666 12.3334 12.6666H10.6667C10.4667 12.6666 10.3334 12.5333 10.3334 12.3333V11C10.3334 10.8 10.4667 10.6667 10.6667 10.6667H12.3334C12.5334 10.6667 12.6667 10.8 12.6667 11V12.3333ZM12.6667 9.66668C12.6667 9.86668 12.5334 10 12.3334 10H10.6667C10.4667 10 10.3334 9.86668 10.3334 9.66668V8.33336C10.3334 8.13336 10.4667 8.00004 10.6667 8.00004H12.3334C12.5334 8.00004 12.6667 8.13336 12.6667 8.33336V9.66668ZM12.6667 7C12.6667 7.2 12.5334 7.33332 12.3334 7.33332H10.6667C10.4667 7.33332 10.3334 7.2 10.3334 7V5.66668C10.3334 5.46668 10.4667 5.33336 10.6667 5.33336H12.3334C12.5334 5.33336 12.6667 5.46668 12.6667 5.66668V7ZM12.6667 4.33332C12.6667 4.53332 12.5334 4.66664 12.3334 4.66664H10.6667C10.4667 4.66664 10.3334 4.53332 10.3334 4.33332V3C10.3334 2.8 10.4667 2.66668 10.6667 2.66668H12.3334C12.5334 2.66668 12.6667 2.8 12.6667 3V4.33332ZM13.6667 1.33332H6.33332V0.66668H13.6666V1.33332H13.6667ZM18.3333 15.6667C18.3333 15.8667 18.2 16 18 16H16.3333C16.1333 16 16 15.8667 16 15.6667V14.3334C16 14.1334 16.1333 14 16.3333 14H18C18.2 14 18.3333 14.1334 18.3333 14.3334V15.6667ZM18.3333 13C18.3333 13.2 18.2 13.3333 18 13.3333H16.3333C16.1333 13.3333 16 13.2 16 13V11.6667C16 11.4667 16.1333 11.3334 16.3333 11.3334H18C18.2 11.3334 18.3333 11.4667 18.3333 11.6667V13ZM18.3333 10.3333C18.3333 10.5333 18.2 10.6666 18 10.6666H16.3333C16.1333 10.6666 16 10.5333 16 10.3333V9C16 8.8 16.1333 8.66668 16.3333 8.66668H18C18.2 8.66668 18.3333 8.8 18.3333 9V10.3333ZM19.3333 6.66668H15V6H19.3333V6.66668Z" fill="black" fill-opacity="0.15"/>
          </g>
          <defs>
          <clipPath id="clip0_406_641">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
            <span className='px-2'>{type}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-indigo-600">{price}</div>
          <div className="text-sm text-gray-500">{pricePerSqm}/m²</div>
        </div>
      </div>

      {/* Grid Layout for Features */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <div className="text-gray-400">Surface</div>
          <div className="flex items-center font-semibold">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <g clip-path="url(#clip0_406_633)">
          <path d="M16.8751 13.8387V6.16125C17.3015 6.0519 17.6913 5.83168 18.0051 5.52294C18.3189 5.2142 18.5454 4.82793 18.6616 4.40335C18.7778 3.97877 18.7796 3.531 18.6668 3.10549C18.5541 2.67999 18.3307 2.2919 18.0194 1.98063C17.7082 1.66937 17.3201 1.446 16.8946 1.33322C16.4691 1.22043 16.0213 1.22224 15.5967 1.33846C15.1721 1.45468 14.7859 1.68117 14.4771 1.99495C14.1684 2.30872 13.9482 2.6986 13.8388 3.125H6.16131C6.05197 2.6986 5.83174 2.30872 5.523 1.99495C5.21426 1.68117 4.82799 1.45468 4.40341 1.33846C3.97883 1.22224 3.53106 1.22043 3.10555 1.33322C2.68005 1.446 2.29196 1.66937 1.9807 1.98063C1.66943 2.2919 1.44606 2.67999 1.33328 3.10549C1.22049 3.531 1.2223 3.97877 1.33852 4.40335C1.45474 4.82793 1.68123 5.2142 1.99501 5.52294C2.30878 5.83168 2.69866 6.0519 3.12506 6.16125V13.8387C2.69866 13.9481 2.30878 14.1683 1.99501 14.4771C1.68123 14.7858 1.45474 15.1721 1.33852 15.5966C1.2223 16.0212 1.22049 16.469 1.33328 16.8945C1.44606 17.32 1.66943 17.7081 1.9807 18.0194C2.29196 18.3306 2.68005 18.554 3.10555 18.6668C3.53106 18.7796 3.97883 18.7778 4.40341 18.6615C4.82799 18.5453 5.21426 18.3188 5.523 18.0051C5.83174 17.6913 6.05197 17.3014 6.16131 16.875H13.8388C13.9482 17.3014 14.1684 17.6913 14.4771 18.0051C14.7859 18.3188 15.1721 18.5453 15.5967 18.6615C16.0213 18.7778 16.4691 18.7796 16.8946 18.6668C17.3201 18.554 17.7082 18.3306 18.0194 18.0194C18.3307 17.7081 18.5541 17.32 18.6668 16.8945C18.7796 16.469 18.7778 16.0212 18.6616 15.5966C18.5454 15.1721 18.3189 14.7858 18.0051 14.4771C17.6913 14.1683 17.3015 13.9481 16.8751 13.8387ZM16.2501 2.5C16.4973 2.5 16.739 2.57331 16.9445 2.71066C17.1501 2.84801 17.3103 3.04324 17.4049 3.27164C17.4995 3.50005 17.5243 3.75139 17.476 3.99386C17.4278 4.23634 17.3088 4.45907 17.1339 4.63388C16.9591 4.8087 16.7364 4.92775 16.4939 4.97598C16.2514 5.02421 16.0001 4.99946 15.7717 4.90485C15.5433 4.81024 15.3481 4.65002 15.2107 4.44446C15.0734 4.2389 15.0001 3.99723 15.0001 3.75C15.0004 3.4186 15.1323 3.10087 15.3666 2.86654C15.6009 2.6322 15.9187 2.50038 16.2501 2.5ZM2.50006 3.75C2.50006 3.50277 2.57337 3.2611 2.71072 3.05554C2.84807 2.84997 3.0433 2.68976 3.27171 2.59515C3.50011 2.50054 3.75145 2.47579 3.99392 2.52402C4.2364 2.57225 4.45913 2.6913 4.63394 2.86612C4.80876 3.04093 4.92781 3.26366 4.97604 3.50614C5.02427 3.74861 4.99952 3.99995 4.90491 4.22835C4.8103 4.45676 4.65008 4.65198 4.44452 4.78934C4.23896 4.92669 3.99729 5 3.75006 5C3.41864 4.99967 3.10089 4.86787 2.86654 4.63352C2.63219 4.39917 2.50039 4.08142 2.50006 3.75ZM3.75006 17.5C3.50283 17.5 3.26116 17.4267 3.0556 17.2893C2.85004 17.152 2.68982 16.9568 2.59521 16.7284C2.5006 16.4999 2.47585 16.2486 2.52408 16.0061C2.57231 15.7637 2.69136 15.5409 2.86618 15.3661C3.04099 15.1913 3.26372 15.0722 3.5062 15.024C3.74867 14.9758 4.00001 15.0005 4.22841 15.0951C4.45682 15.1898 4.65205 15.35 4.7894 15.5555C4.92675 15.7611 5.00006 16.0028 5.00006 16.25C4.99968 16.5814 4.86786 16.8991 4.63352 17.1335C4.39919 17.3678 4.08146 17.4996 3.75006 17.5ZM13.8388 15.625H6.16131C6.04937 15.1953 5.82483 14.8032 5.51084 14.4892C5.19684 14.1752 4.80477 13.9507 4.37506 13.8387V6.16125C4.80474 6.04925 5.19678 5.82469 5.51077 5.51071C5.82475 5.19672 6.04931 4.80468 6.16131 4.375H13.8388C13.9507 4.80471 14.1753 5.19678 14.4893 5.51078C14.8033 5.82477 15.1953 6.04931 15.6251 6.16125V13.8387C15.1953 13.9507 14.8032 14.1752 14.4892 14.4892C14.1752 14.8032 13.9507 15.1953 13.8388 15.625ZM16.2501 17.5C16.0028 17.5 15.7612 17.4267 15.5556 17.2893C15.35 17.152 15.1898 16.9568 15.0952 16.7284C15.0006 16.4999 14.9758 16.2486 15.0241 16.0061C15.0723 15.7637 15.1914 15.5409 15.3662 15.3661C15.541 15.1913 15.7637 15.0722 16.0062 15.024C16.2487 14.9758 16.5 15.0005 16.7284 15.0951C16.9568 15.1898 17.152 15.35 17.2894 15.5555C17.4268 15.7611 17.5001 16.0028 17.5001 16.25C17.4996 16.5814 17.3678 16.8991 17.1335 17.1334C16.8991 17.3677 16.5814 17.4996 16.2501 17.5Z" fill="black" fill-opacity="0.2"/>
          </g>
          <defs>
          <clipPath id="clip0_406_633">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>

            <span className='px-1'>{surface}</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400">Pièces</div>
          <div className="flex items-center font-semibold">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.28342 13.985H2.38895C1.07143 13.985 0 12.9132 0 11.596V3.23951C0 1.92198 1.07179 0.850555 2.38895 0.850555H14.6858C16.0034 0.850555 17.0748 1.92234 17.0748 3.23951V4.37291C17.0748 4.57064 16.9143 4.73113 16.7166 4.73113H5.31416C4.39175 4.73113 3.64164 5.48159 3.64164 6.40364V13.6267C3.64164 13.8248 3.48116 13.985 3.28342 13.985ZM2.38895 1.56699C1.46654 1.56699 0.716435 2.31746 0.716435 3.23951V11.596C0.716435 12.5184 1.4669 13.2685 2.38895 13.2685H2.9252V6.404C2.9252 5.08648 3.99699 4.01505 5.31416 4.01505H16.3584V3.23987C16.3584 2.31746 15.6075 1.56735 14.6858 1.56735L2.38895 1.56699Z" fill="black"/>
          <path d="M17.6116 17.1494H5.31473C3.99721 17.1494 2.92578 16.0777 2.92578 14.7605V6.404C2.92578 5.08647 3.99757 4.01505 5.31473 4.01505H17.6116C18.9291 4.01505 20.0006 5.08683 20.0006 6.404V14.7605C20.0006 16.0777 18.9288 17.1494 17.6116 17.1494ZM5.31473 4.73112C4.39232 4.73112 3.64222 5.48159 3.64222 6.40364V14.7601C3.64222 15.6825 4.39268 16.4327 5.31473 16.4327H17.6116C18.534 16.4327 19.2841 15.6822 19.2841 14.7601V6.404C19.2841 5.48159 18.5333 4.73148 17.6116 4.73148L5.31473 4.73112Z" fill="black"/>
          </svg>

            <span className='px-1'>{rooms}</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400">Vendu le</div>
          <div className="font-semibold">{soldDate}</div>
        </div>
      </div>

      
    </div>
  );
};

export default PropertyCard;
