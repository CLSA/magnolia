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
    $setting_manager = lib::create( 'business\setting_manager' );
    $mail_manager = lib::create( 'business\mail_manager' );

    $db_reqn = $this->get_reqn();
    $language = $db_reqn->get_language()->code;
    $db_notification_type = $this->get_notification_type();

    // fill in dynamic details in the message body
    $message = str_replace(
      array( '{{identifier}}', '{{title}}', '{{applicant_name}}' ),
      array( $db_reqn->identifier, $db_reqn->title, $db_reqn->applicant_name ),
      'en' == $language ? $db_notification_type->message_en : $db_notification_type->message_fr
    );

    $mail_manager->to( $this->email, $db_reqn->applicant_name );
    $mail_manager->set_title( 'en' == $language ? $db_notification_type->title_en : $db_notification_type->title_fr );
    $mail_manager->set_body( $message );

    // add cc and bcc recipients
    $select = lib::create( 'database\select' );
    $select->add_table_column( 'notification_type_email', 'email' );
    $select->add_table_column( 'notification_type_email', 'blind' );
    foreach( $db_notification_type->get_notification_type_email_list( $select ) as $email )
    {
      if( $email['blind'] ) $mail_manager->set_bcc( $email['email'] );
      else $mail_manager->set_cc( $email['email'] );
    }

    $this->sent = $setting_manager->get_setting( 'mail', 'enabled' ) && $mail_manager->send();
  }
}
