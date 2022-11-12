import { AllUploadSuccessValidator } from './validators'
import { uiContext, useI18n } from '@fast-crud/fast-crud'
export default function () {
  const { t } = useI18n()
  const ui = uiContext.get()
  return {
    'image-uploader': {
      form: {
        component: {
          name: 'fs-file-uploader',
          listType: ui.upload.typeImageCard,
          accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg',
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t('fs.extends.fileUploader.hasUploading'),
          },
        ],
      },
      column: {
        component: {
          name: 'fs-images-format',
          style: 'width:30px',
          previewTeleported: true,
        },
      },
      viewForm: {
        component: { height: 100, width: 100 },
      },
    },
    'avatar-uploader': {
      form: {
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t('fs.extends.fileUploader.hasUploading'),
          },
        ],
        component: {
          name: 'fs-file-uploader',
          limit: 1,
          listType: ui.upload.typeImageCard,
          accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif,.webp,.svg',
        },
      },
      column: {
        align: 'center',
        component: {
          name: 'fs-images-format',
          style: 'width:30px',
          previewTeleported: true,
        },
      },
      viewForm: {
        component: { height: 100, width: 100 },
      },
      valueResolve({ row, key }) {
        const value = row[key]
        if (value != null && value instanceof Array) {
          if (value.length >= 0) {
            row[key] = value[0].url
          } else {
            row[key] = null
          }
        }
      },
    },
    'file-uploader': {
      form: {
        component: {
          name: 'fs-file-uploader',
          listType: 'text',
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t('fs.extends.fileUploader.hasUploading'),
          },
        ],
      },
      column: {
        component: { name: 'fs-files-format' },
      },
    },
    'cropper-uploader': {
      form: {
        component: {
          name: 'fs-cropper-uploader',
          accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif,.svg,.webp',
          cropper: { viewMode: 1 },
        },
        [ui.formItem.rules]: [
          {
            validator: AllUploadSuccessValidator(),
            message: t('fs.extends.fileUploader.hasUploading'),
          },
        ],
      },
      column: {
        align: 'center',
        component: {
          name: 'fs-images-format',
          style: 'width:30px',
          previewTeleported: true,
        },
      },
      viewForm: {
        component: { height: 100, width: 100 },
      },
    },
  }
}
