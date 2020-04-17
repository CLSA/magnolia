<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user\applicant;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Extends parent class
 */
class post extends \cenozo\service\post
{
  /**
   * Overrides parent method
   */
  protected function validate()
  {
    $applicant_class_name = lib::get_class_name( 'database\applicant' );

    parent::validate();

    if( 300 > $this->get_status()->get_code() )
    {
      // add this user as the supervisor in the applicant's record
      $post_object = $this->get_file_as_object();
      $db_applicant = $applicant_class_name::get_unique_record( 'user_id', $post_object->user_id );
      $db_user = $this->get_parent_record();
      if( $db_user->id == $db_applicant->user_id )
      {
        $this->set_data( 'You cannot make a user be a trainee of themselves.' );
        $this->get_status()->set_code( 306 );
      }
      else if( !is_null( $db_user->get_applicant()->supervisor_user_id ) )
      {
        $this->set_data( 'This user cannot have a trainee since they have a supervisor.' );
        $this->get_status()->set_code( 306 );
      }
    }
  }

  /**
   * Overrides parent method
   */
  protected function execute()
  {
    $applicant_class_name = lib::get_class_name( 'database\applicant' );

    // add this user as the supervisor in the applicant's record
    $post_object = $this->get_file_as_object();
    $db_applicant = $applicant_class_name::get_unique_record( 'user_id', $post_object->user_id );
    $db_user = $this->get_parent_record();

    $db_applicant->supervisor_user_id = $db_user->id;
    $db_applicant->save();
  }
}
