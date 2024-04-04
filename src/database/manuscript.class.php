<?php
/**
 * manuscript.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * manuscript: record
 */
class manuscript extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new manuscript
    $is_new = is_null( $this->id );

    parent::save();

    if( $is_new )
    {
      $this->create_version();
      $this->proceed_to_next_manuscript_stage();
    }
  }

  /**
   * Creates a new version of the manuscript
   * 
   * If no version exists then the first (empty) version will be created.  Otherwise the current version
   * will be copied exactly into a new version
   * 
   * @param database\manuscript_version $db_clone_manuscript_version Which manuscript_version to copy (default is this manuscript's current)
   */
  public function create_version( $db_clone_manuscript_version = NULL )
  {
    // first get the current manuscript version to determine the next version number
    $db_current_manuscript_version = $this->get_current_manuscript_version();
    $version = is_null( $db_current_manuscript_version ) ? 1 : $db_current_manuscript_version->version + 1;

    // now set the clone version (use the current if none is provided)
    if( is_null( $db_clone_manuscript_version ) ) $db_clone_manuscript_version = $db_current_manuscript_version;

    // create the new record and copy the clone record (if it exists)
    $db_manuscript_version = lib::create( 'database\manuscript_version' );
    if( !is_null( $db_current_manuscript_version ) ) $db_manuscript_version->copy( $db_clone_manuscript_version );

    // define some of the column values insetad of using the clone
    $db_manuscript_version->manuscript_id = $this->id;
    $db_manuscript_version->version = $version;
    $db_manuscript_version->datetime = util::get_datetime_object();
    $db_manuscript_version->save();
  }

  /**
   * Returns the manuscript's calculated recommendation based on all reviews
   * 
   * @return string ("Satisfactory" or "Not Satisfactory")
   * @access public
   */
  public function get_recommendation()
  {
    $select = lib::create( 'database\select' );
    $select->add_table_column( 'manuscript_recommendation_type', 'name' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->join(
      'manuscript_recommendation_type',
      'manuscript_review.manuscript_recommendation_type_id',
      'manuscript_recommendation_type.id'
    );
    
    $recommendation = NULL;
    foreach( $this->get_manuscript_review_list( $select, $modifier ) as $row )
    {
      $recommendation = $row;
      // if any review is not satisfactory then so is the manuscript
      if( 'Not Satisfactory' == $recommendation ) break;
    }

    return $recommendation;
  }

  /**
   * Returns the manuscripts current stage
   * @return database\manuscript_stage
   * @access public
   */
  public function get_current_manuscript_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query manuscript with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'manuscript_stage' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'manuscript_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $manuscript_stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $manuscript_stage_id ? lib::create( 'database\manuscript_stage', $manuscript_stage_id ) : NULL;
  }

  /**
   * Returns the manuscript's current stage type
   * @return database\manuscript_stage_type
   * @access public
   */
  public function get_current_manuscript_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query manuscript with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'manuscript_stage' );
    $select->add_column( 'manuscript_stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'manuscript_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $manuscript_stage_type_id = static::db()->get_one( sprintf(
      '%s %s',
      $select->get_sql(),
      $modifier->get_sql()
    ) );
    return (
      $manuscript_stage_type_id ?
      lib::create( 'database\manuscript_stage_type', $manuscript_stage_type_id ) :
      NULL
    );
  }

  /**
   * Returns the manuscript's next stage type (NULL if there is no valid next stage type)
   * @return database\manuscript_stage_type
   * @access public
   */
  public function get_next_manuscript_stage_type()
  {
    $manuscript_stage_type_class_name = lib::get_class_name( 'database\manuscript_stage_type' );

    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query manuscript with no primary key.' );
      return NULL;
    }

    $db_current_stage_type = $this->get_current_manuscript_stage_type();
    $db_next_stage_type = NULL;
    if( is_null( $db_current_stage_type ) )
    {
      // no current stage means the next stage is the first stage
      $db_next_stage_type = $manuscript_stage_type_class_name::get_unique_record( 'rank', 1 );
    }
    else
    {
      $stage_type_list = $db_current_stage_type->get_next_possible_manuscript_stage_type_object_list();

      if( 1 == count( $stage_type_list ) )
      {
        $db_next_stage_type = current( $stage_type_list );
      }
      else
      {
        $find_stage_type_name = NULL;

        if( 'Decision Made' == $db_current_stage_type->name )
        {
          $recommendation = $this->get_recommendation();
          if( !is_null( $recommendation ) )
          {
            // NOTE: when approved check if revisions have been suggested
            $find_stage_type_name = 'Satisfactory' == $recommendation
                                  ? $this->suggested_revisions ? 'Suggested Revisions' : 'Complete'
                                  : 'Not Approved';
          }
        }

        // now find the approrpiate stage type
        if( !is_null( $find_stage_type_name ) )
        {
          foreach( $stage_type_list as $db_stage_type )
          {
            if( $find_stage_type_name == $db_stage_type->name )
            {
              $db_next_stage_type = $db_stage_type;
              break;
            }
          }
        }
      }
    }

    return $db_next_stage_type;
  }

  /**
   * Reverses the current stage, returning to the previous one
   * @access public
   */
  public function reverse_to_last_manuscript_stage()
  {
    $identifier = $this->get_reqn()->identifier;

    // get the previous stage
    $stage_mod = lib::create( 'database\modifier' );
    $stage_mod->where( 'manuscript_stage.datetime', '!=', NULL );
    $stage_mod->order_desc( 'manuscript_stage.datetime' );
    $stage_mod->limit( 1 );
    $stage_list = $this->get_manuscript_stage_object_list( $stage_mod );
    if( 0 == count( $stage_list ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Tried to reverse manuscript %s for %s to previous stage but no appropriate stage found.',
          $this->title,
          $identifier
        ),
        __METHOD__
      );
    }
    $db_last_stage = current( $stage_list );

    // if deferred then we need to un-defer
    if( 'deferred' == $this->state )
    {
      $this->state = NULL;
      $this->save();
    }

    $db_current_stage->delete();
    $db_last_stage->datetime = NULL;
    $db_last_stage->save();
  }

  /**
   * Proceeds to the manuscript to the next stage
   * 
   * The next stage is based on the current stage as well as the manuscript's reviews
   * @param mixed $stage_type The next stage (a manuscript_stage_type record, rank or name or NULL will automatically pick the next stage)
   * @access public
   */
  public function proceed_to_next_manuscript_stage( $stage_type = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to manuscript with no primary key.' );
      return;
    }

    $user_class_name = lib::get_class_name( 'database\user' );
    $notification_class_name = lib::get_class_name( 'database\notification' );
    $manuscript_review_class_name = lib::get_class_name( 'database\manuscript_review' );
    $manuscript_stage_type_class_name = lib::get_class_name( 'database\manuscript_stage_type' );
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $setting_manager = lib::create( 'business\setting_manager' );
    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_application = $session->get_application();
    $db_current_stage = $this->get_current_manuscript_stage();
    $db_current_stage_type = is_null( $db_current_stage ) ? NULL : $db_current_stage->get_manuscript_stage_type();
    $db_manuscript_version = $this->get_current_manuscript_version();

    $db_reqn = $this->get_reqn();
    $db_next_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      $db_next_stage_type = $this->get_next_manuscript_stage_type();

      if( is_null( $db_next_stage_type ) )
        throw lib::create( 'exception\runtime',
          'Unable to proceed to next stage since there is currently no valid stage type available.', __METHOD__ );
    }
    else if( is_object( $stage_type ) )
    {
      if( is_a( $stage_type, lib::get_class_name( 'database\manuscript_stage_type' ) ) )
        $db_next_stage_type = $stage_type;
    }
    else if( is_integer( $stage_type ) || ( is_string( $stage_type ) && util::string_matches_int( $stage_type ) ) )
    {
      $db_next_stage_type = $manuscript_stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_next_stage_type = $manuscript_stage_type_class_name::get_unique_record( 'name', $stage_type );
    }

    if( is_null( $db_next_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    // make sure the stage type is appropriate
    if( is_null( $db_current_stage_type ) )
    {
      // we can only add the first stage when the manuscript currently has no stages
      if( 1 != $db_next_stage_type->rank )
      {
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but manuscript has no existing stage.', $db_next_stage_type->name ),
          __METHOD__
        );
      }
    }
    else
    {
      $result = $db_current_stage->check_if_complete();
      if( true !== $result ) throw lib::create( 'exception\notice', $result, __METHOD__ );
    }

    if( !is_null( $db_current_stage ) )
    {
      // save the user who completed the current stage
      $db_current_stage->user_id = $db_user->id;
      $db_current_stage->datetime = util::get_datetime_object();
      $db_current_stage->save();

      $db_notification_type = $db_current_stage_type->get_notification_type();

      if( is_null( $db_notification_type ) )
      {
        $db_notification = lib::create( 'database\manuscript_notification' );
        $db_notification->notification_type_id = $db_notification_type->id;
        $db_notification->set_manuscript( $this ); // this saves the record
        $db_notification->mail();
      }
      else
      {
        $db_manuscript_user = $db_reqn->get_user();
        $subject = sprintf( '%s complete', $db_current_stage_type->name );
        $notification_class_name::mail_admin(
          sprintf(
            'Requisition %s manuscript %s: %s',
            $db_reqn->identifier,
            $this->title,
            $subject
          ),
          sprintf(
            "The following manuscript has moved from \"%s\" to \"%s\":\n".
            "\n".
            "Identifier: %s\n".
            "Applicant: %s %s\n".
            "Manuscript Title: %s\n",
            $db_current_stage_type->name,
            $db_next_stage_type->name,
            $db_reqn->identifier,
            $db_manuscript_user->first_name, $db_manuscript_user->last_name,
            $db_manuscript_version->title
          )
        );
      }
    }

    // create the new stage
    $db_next_stage = lib::create( 'database\manuscript_stage' );
    $db_next_stage->manuscript_id = $this->id;
    $db_next_stage->manuscript_stage_type_id = $db_next_stage_type->id;
    $db_next_stage->save();

    if( 'Admin Review' == $db_next_stage_type->name )
    {
      // ...and mark the version datetime
      $db_manuscript_version->datetime = util::get_datetime_object();
      $db_manuscript_version->save();
    }
    // if we're recommending a revision then automatically defer the manuscript
    else if( 'Suggested Revisions' == $db_next_stage_type->name )
    {
      $this->state = 'deferred';
      $this->save();

      // create a new manuscript version
      $this->create_version();

      // do not send a notification since there is one already sent after leaving the Decision Made stage
    }

    // manage any reviews associated with the current stage
    if( !is_null( $db_current_stage_type ) )
    {
      foreach( $db_current_stage_type->get_manuscript_review_object_list( $this ) as $db_review )
      {
        // update the current stage's review's reviewer with the current user if it isn't already set
        if( is_null( $db_review->user_id ) )
        {
          $db_review->user_id = $db_user->id;
          $db_review->save();
        }
      }
    }
  }

  /**
   * Returns this manuscript's latest manuscript_version record
   * 
   * @access public
   */
  public function get_current_manuscript_version()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query manuscript with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'manuscript_current_manuscript_version' );
    $select->add_column( 'manuscript_version_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'manuscript_id', '=', $this->id );

    $manuscript_version_id = static::db()->get_one(
      sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() )
    );
    return $manuscript_version_id ? lib::create( 'database\manuscript_version', $manuscript_version_id ) : NULL;
  }

  /**
   * Generates a text file listing this manuscript's reviews
   * 
   * @access public
   */
  public function generate_reviews_file()
  {
    $db_reqn = $this->get_reqn();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $db_manuscript_version = $this->get_current_manuscript_version();

    $text = sprintf(
      "Requisition: %s\n".
      "Manuscript Title: %s\n".
      "Applicant: %s\n".
      "%s\n", // trainee only added if one exists
      $this->identifier,
      $db_manuscript_version->title,
      sprintf( '%s %s', $db_user->first_name, $db_user->last_name ),
      is_null( $db_trainee_user ) ?  '' : sprintf(
        "Trainee: %s %s\n",
        $db_trainee_user->first_name,
        $db_trainee_user->last_name
      )
    );

    $review_sel = lib::create( 'database\select' );
    $review_sel->add_table_column( 'user', 'first_name' );
    $review_sel->add_table_column( 'user', 'last_name' );
    $review_sel->add_column( 'DATE( manuscript_review.datetime )', 'date', false );
    $review_sel->add_table_column( 'manuscript_review_type', 'name', 'type' );
    $review_sel->add_table_column( 'manuscript_recommendation_type', 'name', 'recommendation' );
    $review_sel->add_column( 'note' );

    $review_mod = lib::create( 'database\modifier' );
    $review_mod->left_join( 'user', 'manuscript_review.user_id', 'user.id' );
    $review_mod->join(
      'manuscript_review_type',
      'manuscript_review.review_type_id',
      'manuscript_review_type.id'
    );
    $review_mod->join(
      'manuscript_recommendation_type',
      'manuscript_review.recommendation_type_id',
      'manuscript_recommendation_type.id'
    );
    $review_mod->order( 'manuscript_review.datetime' );
    $review_mod->order( 'manuscript_stage_type_id' );

    foreach( $this->get_manuscript_review_list( $review_sel, $review_mod ) as $review )
    {
      $text .= sprintf(
        "\n\nType: %s\n".
        "Reviewer: %s\n".
        "Created On: %s\n".
        "Recommendation: %s\n".
        "Notes:\n".
        "%s\n",
        $review['type'],
        str_replace( '.', 'no', $review['amendment'] ),
        is_null( $review['first_name'] ) ? '(none)' : $review['first_name'].' '.$review['last_name'],
        $review['date'],
        is_null( $review['recommendation'] ) ? '(none)' : $review['recommendation'],
        is_null( $review['note'] ) ? '(none)' : $review['note']
      );
    }

    // convert for Windows
    $text = util::convert_charset( str_replace( "\n", "\r\n", $text ) );

    $filename = sprintf( '%s/manuscript_reviews_%d.txt', TEMP_PATH, $this->id );
    if( false === file_put_contents( $filename, $text, LOCK_EX ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate reviews text file "%s" for requisition %s manuscript %s',
          $filename,
          $db_reqn->identifier,
          $this->title
        ),
        __METHOD__
      );
    }
  }

  /**
   * Sends deferred reminder notifications
   */
  public static function send_deferred_reminder_notifications()
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $weeks = $setting_manager->get_setting( 'general', 'deferred_reminder' );

    $total = 0;

    $db_notification_type =
      $notification_type_class_name::get_unique_record( 'name', 'Deferred Manuscript Reminder (second)' );

    $modifier = lib::create( 'database\modifier' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'manuscript.id', '=', 'manuscript_notification.manuscript_id', false );
    $join_mod->where( 'manuscript_notification.notification_type_id', '=', $db_notification_type->id );
    $join_mod->where( 'TIMESTAMPDIFF( DAY, UTC_TIMESTAMP(), manuscript_notification.datetime )', '=', 0 );
    $modifier->join_modifier( 'manuscript_notification', $join_mod, 'left' );
    $modifier->where( 'TIMESTAMPDIFF( DAY, state_date, UTC_TIMESTAMP() )', '=', 2*7*$weeks );
    $modifier->where( 'manuscript_notification.id', '=', NULL );

    $manuscript_list = static::select_objects( $modifier );

    foreach( $manuscript_list as $db_manuscript )
    {
      $db_notification = lib::create( 'database\manuscript_notification' );
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->set_manuscript( $db_manuscript ); // this saves the record
      $db_notification->mail();
    }

    $total += count( $manuscript_list );

    $db_notification_type =
      $notification_type_class_name::get_unique_record( 'name', 'Deferred Manuscript Reminder (first)' );

    $modifier = lib::create( 'database\modifier' );
    $join_mod = lib::create( 'database\modifier' );
    $join_mod->where( 'manuscript.id', '=', 'manuscript_notification.manuscript_id', false );
    $join_mod->where( 'manuscript_notification.notification_type_id', '=', $db_notification_type->id );
    $join_mod->where( 'TIMESTAMPDIFF( DAY, UTC_TIMESTAMP(), manuscript_notification.datetime )', '=', 0 );
    $modifier->join_modifier( 'manuscript_notification', $join_mod, 'left' );
    $modifier->where( 'TIMESTAMPDIFF( DAY, state_date, UTC_TIMESTAMP() )', '=', 7*$weeks );
    $modifier->where( 'manuscript_notification.id', '=', NULL );

    $manuscript_list = static::select_objects( $modifier );

    foreach( $manuscript_list as $db_manuscript )
    {
      $db_notification = lib::create( 'database\notification' );
      $db_notification->notification_type_id = $db_notification_type->id;
      $db_notification->set_manuscript( $db_manuscript ); // this saves the record
      $db_notification->mail();
    }

    $total += count( $manuscript_list );

    return $total;
  }

  /**
   * Marks all notices viewed by the given user
   * @param string $type One of primary, trainee or designate
   */
  public function mark_manuscript_notices_as_read( $type = 'primary' )
  {
    // get the notice list
    $notice_sel = lib::create( 'database\select' );
    $notice_sel->add_column( 'id' );
    $notice_id_list = array();
    foreach( $this->get_manuscript_notice_list( $notice_sel ) as $notice ) $notice_id_list[] = $notice['id'];

    if( 0 < count( $notice_id_list ) )
    {
      $db_reqn = $this->get_reqn();
      $db_user = NULL;
      if( 'primary' == $type ) $db_user = $db_reqn->get_user();
      else if( 'trainee' == $type ) $db_user = $db_reqn->get_trainee_user();
      else if( 'designate' == $type ) $db_user = $db_reqn->get_designate_user();

      if( !is_null( $db_user ) ) $db_user->add_notice( $notice_id_list );
    }
  }
}
