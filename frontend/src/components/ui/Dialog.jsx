import Modal from 'react-modal'
import { IoClose } from 'react-icons/io5'
import Button from './Button'

Modal.setAppElement('#root')

function Dialog({ isOpen, onClose, title, description, children, footer }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='dialog'
      overlayClassName='dialog-overlay'
      closeTimeoutMS={180}
      contentLabel={title}>
      <div className='dialog-header'>
        <h2 className='dialog-title'>{title}</h2>
        <Button
          variant='secondary'
          size='sm'
          icon={<IoClose />}
          onClick={onClose}
          aria-label='Close'
        />
      </div>
      {description && <p className='dialog-description'>{description}</p>}
      {children}
      {footer && <div className='dialog-footer'>{footer}</div>}
    </Modal>
  )
}

export default Dialog
