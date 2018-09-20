<?php
/**
 * notification.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * notification: record
 */
class notification extends \cenozo\database\record
{
  /**
   * Extend parent method
   */
  public function save()
  {
    // mail the notification if this is a new record
    if( is_null( $this->id ) ) $this->mail();

    parent::save();
  }

  /**
   * Sends all emails associated with this notification
   */
  protected function mail()
  {
    $db_reqn = $this->get_reqn();
    $language = $db_reqn->get_language()->code;
    $db_notification_type = $this->get_notification_type();

    $mail_manager = lib::create( 'business\mail_manager' );
    $mail_manager->to( $this->email, $db_reqn->applicant_name );
    $mail_manager->set_title( 'en' == $language ? $db_notification_type->title_en : $db_notification_type->title_fr );
    $mail_manager->set_body( 'en' == $language ? $db_notification_type->message_en : $db_notification_type->message_fr );

    // add cc and bcc recipients
    $select = lib::create( 'database\select' );
    $select->add_table_column( 'notification_type_email', 'email' );
    $select->add_table_column( 'notification_type_email', 'blind' );
    foreach( $db_notification_type->get_notification_type_email_list( $select ) as $email )
    {
      if( $email['blind'] ) $mail_manager->set_bcc( $email['email'] );
      else $mail_manager->set_cc( $email['email'] );
    }

    $this->sent = $mail_manager->send();
  }
}
