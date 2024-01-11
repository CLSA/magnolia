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
   * Adds an email address to the notification
   * @param string $email
   * @param string $name
   */
  public function add_email( $email, $name )
  {
    // make sure the notification recipient doesn't already exist
    $notification_email_class_name = lib::get_class_name( 'database\notification_email' );
    $db_notification_email = $notification_email_class_name::get_unique_record(
      array( 'notification_id', 'email' ),
      array( $this->id, $email )
    );

    if( is_null( $db_notification_email ) )
    {
      $db_notification_email = lib::create( 'database\notification_email' );
      $db_notification_email->notification_id = $this->id;
      $db_notification_email->email = $email;
      $db_notification_email->name = $name;
      $db_notification_email->save();
    }
  }

  /**
   * Sets up the notification to send to the owner, trainne and designate of a reqn
   * @param database\reqn $db_reqn
   */
  public function set_reqn( $db_reqn )
  {
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $db_designate_user = $db_reqn->get_designate_user();
    $this->reqn_id = $db_reqn->id;
    $this->datetime = util::get_datetime_object();
    $this->save();

    $this->add_email( $db_user->email, sprintf( '%s %s', $db_user->first_name, $db_user->last_name ) );

    if( !is_null( $db_trainee_user ) )
    {
      $this->add_email(
        $db_trainee_user->email,
        sprintf( '%s %s', $db_trainee_user->first_name, $db_trainee_user->last_name )
      );
    }

    if( !is_null( $db_designate_user ) )
    {
      $this->add_email(
        $db_designate_user->email,
        sprintf( '%s %s', $db_designate_user->first_name, $db_designate_user->last_name )
      );
    }
  }

  /**
   * Sends all emails associated with this notification
   */
  public function mail()
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    $mail_manager = lib::create( 'business\mail_manager' );

    $db_reqn = $this->get_reqn();
    $db_language = $db_reqn->get_language();
    $db_notification_type = $this->get_notification_type();

    $select = lib::create( 'database\select' );
    $select->add_column( 'email' );
    $select->add_column( 'name' );
    foreach( $this->get_notification_email_list() as $email ) $mail_manager->to( $email['email'], $email['name'] );

    // fill in dynamic details in the message's subject and body
    $column = sprintf( 'title_%s', $db_language->code );
    $mail_manager->set_subject(
      $this->compile(
        $db_notification_type->$column,
        $db_language
      )
    );

    $column = sprintf( 'message_%s', $db_language->code );
    $mail_manager->set_body(
      $this->compile(
        $db_notification_type->$column,
        $db_language
      )
    );

    // add cc and bcc recipients
    $select = lib::create( 'database\select' );
    $select->add_table_column( 'notification_type_email', 'email' );
    $select->add_table_column( 'notification_type_email', 'blind' );
    foreach( $db_notification_type->get_notification_type_email_list( $select ) as $email )
    {
      if( $email['blind'] ) $mail_manager->set_bcc( $email['email'] );
      else $mail_manager->set_cc( $email['email'] );
    }

    $this->sent = $setting_manager->get_setting( 'mail', 'enabled' ) && !$db_reqn->disable_notification && $mail_manager->send();
    $this->save();
  }

  /**
   * Sends an email notification to the admin_email (from general settings)
   */
  public static function mail_admin( $subject, $message )
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    $email = $setting_manager->get_setting( 'general', 'admin_email' );
    if( !is_null( $email ) )
    {
      $mail_manager = lib::create( 'business\mail_manager' );
      $mail_manager->to( $email, 'Magnolia Administration' );
      $mail_manager->set_subject( $subject );
      $mail_manager->set_body( $message );
      $mail_manager->send();
    }
  }

  /**
   * Fills in dynamic text
   */
  private function compile( $string, $db_language )
  {
    $db_reqn = $this->get_reqn();
    $db_reqn_version = $db_reqn->get_current_reqn_version();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $trainee_name = is_null( $db_trainee_user )
                  ? ''
                  : sprintf( '%s %s', $db_trainee_user->first_name, $db_trainee_user->last_name );

    // fill in dynamic details in the message subject
    $string = preg_replace(
      // remove all trainee text if no trainee, otherwise just remove the if/endif syntax
      is_null( $db_reqn->trainee_user_id ) ?
        '/{{if_trainee}}.*?{{endif_trainee}}/' :
        array( '/{{if_trainee}}/', '/{{endif_trainee}}/' ),
      '',
      // search/replace dynamic text
      str_replace(
        array(
          '{{reqn_type}}',
          '{{identifier}}',
          '{{title}}',
          '{{applicant_name}}',
          '{{trainee_name}}'
        ),
        array(
          $db_reqn->get_reqn_type()->name,
          $db_reqn->identifier,
          $db_reqn_version->title,
          sprintf( '%s %s', $db_user->first_name, $db_user->last_name ),
          $trainee_name
        ),
        $string
      )
    );

    // fill in dynamic dates (eg: {{TODAY}}, {{TODAY-6W}}, {{TODAY+1Y}})
    $matches = [];
    preg_match_all( '/{{TODAY([+-][0-9]+[YMDW])?}}/', $string, $matches );
    foreach( $matches[0] as $index => $match )
    {
      $today = util::get_datetime_object();

      // add/subtract the interval if one is provided
      $interval = $matches[1][$index];
      if( 0 < strlen( $interval ) )
      {
        // get the +/- char, then replace it with P (need by DateInterval)
        $subtract = '-' == $interval[0];
        $interval[0] = 'P';
        if( $subtract ) $today->sub( new \DateInterval( $interval ) );
        else $today->add( new \DateInterval( $interval ) );
      }

      $string = str_replace(
        $match,
        util::convert_datetime_language(
          $today->format( 'en' == $db_language->code ? 'F j, Y' : 'j F Y' ),
          $db_language
        ),
        $string
      );
    }

    return $string;
  }
}
